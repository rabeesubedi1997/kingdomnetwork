import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getMenus, getMenuItems, createMenu, updateMenu, deleteMenu,
  createMenuItem, updateMenuItem, deleteMenuItem, reorderMenuItems,
  getPages,
} from '@/lib/admin-api'
import { toast } from 'react-hot-toast'
import { Plus, Edit3, Trash2, GripVertical, X, Check, Menu, ChevronDown, Globe, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MenuItem {
  id: number
  menu_id: number
  parent_id: number | null
  label: string
  url: string | null
  target: '_self' | '_blank'
  module: string | null
  sort_order: number
  is_active: boolean
  children?: MenuItem[]
}

interface Menu {
  id: number
  name: string
  location: string
  is_active: boolean
  items?: MenuItem[]
}

export const MenuManagementPage: React.FC = () => {
  const queryClient = useQueryClient()
  const [selectedMenu, setSelectedMenu] = useState<number | null>(null)
  const [showCreateMenu, setShowCreateMenu] = useState(false)
  const [showCreateItem, setShowCreateItem] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [menuForm, setMenuForm] = useState({ name: '', location: '', is_active: true })
  const [itemForm, setItemForm] = useState<Record<string, unknown>>({
    label: '', url: '', target: '_self', module: '', is_active: true, parent_id: null, linkType: 'url',
  })
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)

  const { data: menus, isLoading: menusLoading } = useQuery({
    queryKey: ['admin', 'menus'],
    queryFn: getMenus,
  })

  const { data: items, isLoading: itemsLoading } = useQuery({
    queryKey: ['admin', 'menu-items', selectedMenu],
    queryFn: () => getMenuItems(selectedMenu!),
    enabled: !!selectedMenu,
  })

  const { data: pagesData } = useQuery({
    queryKey: ['admin', 'pages'],
    queryFn: getPages,
  })

  const pages = Array.isArray(pagesData) ? pagesData : pagesData?.data || []

  useEffect(() => {
    if (menus && Array.isArray(menus) && menus.length > 0 && !selectedMenu) {
      setSelectedMenu(menus[0].id)
    }
  }, [menus, selectedMenu])

  const currentMenu = Array.isArray(menus) ? menus.find((m: Menu) => m.id === selectedMenu) : null

  const createMenuMut = useMutation({
    mutationFn: createMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'menus'] })
      setShowCreateMenu(false)
      setMenuForm({ name: '', location: '', is_active: true })
      toast.success('Menu created')
    },
    onError: () => toast.error('Failed to create menu'),
  })

  const updateMenuMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => updateMenu(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'menus'] }),
  })

  const deleteMenuMut = useMutation({
    mutationFn: deleteMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'menus'] })
      setSelectedMenu(null)
      toast.success('Menu deleted')
    },
  })

  const createItemMut = useMutation({
    mutationFn: createMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'menu-items', selectedMenu] })
      setShowCreateItem(false)
      setItemForm({ label: '', url: '', target: '_self', module: '', is_active: true, parent_id: null })
      toast.success('Menu item created')
    },
  })

  const updateItemMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => updateMenuItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'menu-items', selectedMenu] })
      setEditingItem(null)
      toast.success('Menu item updated')
    },
  })

  const deleteItemMut = useMutation({
    mutationFn: deleteMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'menu-items', selectedMenu] })
      toast.success('Menu item deleted')
    },
  })

  const reorderMut = useMutation({
    mutationFn: reorderMenuItems,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'menu-items', selectedMenu] }),
  })

  const handleDragStart = (idx: number) => setDragIdx(idx)
  const handleDragOver = (e: React.DragEvent, idx: number) => { e.preventDefault(); setDragOverIdx(idx) }
  const handleDrop = () => {
    if (dragIdx === null || dragOverIdx === null || !items || !Array.isArray(items)) return
    const newItems = [...items] as MenuItem[]
    const [removed] = newItems.splice(dragIdx, 1)
    newItems.splice(dragOverIdx, 0, removed)
    const reorderData = newItems.map((item, i) => ({ id: item.id, sort_order: i + 1 }))
    reorderMut.mutate(reorderData)
    setDragIdx(null)
    setDragOverIdx(null)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Menu Management</h1>
          <p className="text-brand-muted mt-0.5">Manage navigation menus and their items</p>
        </div>
        <button onClick={() => setShowCreateMenu(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/80 text-white rounded-lg transition-colors text-sm font-medium">
          <Plus size={16} /> New Menu
        </button>
      </div>

      {showCreateMenu && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-brand-dark border border-brand-surface rounded-xl p-5">
          <h3 className="text-white font-medium mb-4">Create New Menu</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs text-brand-muted mb-1.5">Name</label>
              <input type="text" value={menuForm.name} onChange={e => setMenuForm(p => ({ ...p, name: e.target.value }))} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-primary" placeholder="Main Navigation" />
            </div>
            <div>
              <label className="block text-xs text-brand-muted mb-1.5">Location</label>
              <input type="text" value={menuForm.location} onChange={e => setMenuForm(p => ({ ...p, location: e.target.value }))} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-primary" placeholder="main, footer, footer-legal" />
            </div>
            <div>
              <label className="block text-xs text-brand-muted mb-1.5">Active</label>
              <select value={menuForm.is_active ? '1' : '0'} onChange={e => setMenuForm(p => ({ ...p, is_active: e.target.value === '1' }))} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-primary">
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => createMenuMut.mutate(menuForm)} className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/80 text-white rounded-lg text-sm">Create</button>
            <button onClick={() => setShowCreateMenu(false)} className="px-4 py-2 bg-brand-surface hover:bg-brand-surface/80 text-brand-muted rounded-lg text-sm">Cancel</button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="lg:col-span-1">
          <div className="bg-brand-dark border border-brand-surface rounded-xl overflow-hidden">
            <div className="p-3 border-b border-brand-surface">
              <h3 className="text-white text-sm font-medium">Menus</h3>
            </div>
            <div className="divide-y divide-brand-surface">
              {Array.isArray(menus) && menus.map((menu: Menu) => (
                <div key={menu.id}>
                  <button
                    onClick={() => setSelectedMenu(menu.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors text-sm',
                      selectedMenu === menu.id ? 'bg-brand-primary/10 text-white' : 'text-brand-muted hover:text-white hover:bg-brand-surface/50'
                    )}
                  >
                    <Menu size={16} className="flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">{menu.name}</p>
                      <p className="text-xs text-brand-muted truncate">{menu.location}</p>
                    </div>
                    {!menu.is_active && <EyeOff size={14} className="text-brand-muted" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {selectedMenu && (
            <div className="bg-brand-dark border border-brand-surface rounded-xl">
              <div className="p-4 border-b border-brand-surface flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium flex items-center gap-2">
                    {currentMenu?.name}
                    <button
                      onClick={() => updateMenuMut.mutate({ id: selectedMenu, data: { is_active: !currentMenu?.is_active } })}
                      className={cn('px-2 py-0.5 rounded text-xs font-medium transition-colors', currentMenu?.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400')}
                    >
                      {currentMenu?.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </h3>
                  <p className="text-xs text-brand-muted mt-0.5">Location: {currentMenu?.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowCreateItem(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary hover:bg-brand-primary/80 text-white rounded-lg text-xs transition-colors">
                    <Plus size={14} /> Add Item
                  </button>
                  <button onClick={() => { if (confirm('Delete this menu and all its items?')) deleteMenuMut.mutate(selectedMenu) }} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {showCreateItem && (
                <div className="p-4 border-b border-brand-surface bg-brand-surface/30">
                  <h4 className="text-white text-sm font-medium mb-3">New Menu Item</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs text-brand-muted mb-1">Label</label>
                      <input type="text" value={itemForm.label as string || ''} onChange={e => setItemForm(p => ({ ...p, label: e.target.value }))} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-primary" placeholder="Home" />
                    </div>
                    <div>
                      <label className="block text-xs text-brand-muted mb-1">Link Type</label>
                      <select value={itemForm.linkType as string || 'url'} onChange={e => { const lt = e.target.value; setItemForm(p => ({ ...p, linkType: lt, url: lt === 'page' ? '' : p.url })) }} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-primary">
                        <option value="url">Custom URL</option>
                        <option value="page">Page</option>
                      </select>
                    </div>
                    {itemForm.linkType === 'url' ? (
                      <div>
                        <label className="block text-xs text-brand-muted mb-1">URL</label>
                        <input type="text" value={itemForm.url as string || ''} onChange={e => setItemForm(p => ({ ...p, url: e.target.value }))} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-primary" placeholder="/films" />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs text-brand-muted mb-1">Select Page</label>
                        <select value={(itemForm.url as string || '').replace('/page/', '')} onChange={e => { const slug = e.target.value; const page = pages.find((p: any) => p.slug === slug); setItemForm(p => ({ ...p, url: slug ? '/page/' + slug : '', label: p.label || page?.title || slug })) }} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-primary">
                          <option value="">-- Select a page --</option>
                          {pages.map((p: any) => <option key={p.id} value={p.slug}>{p.title}</option>)}
                        </select>
                      </div>
                    )}
                    <div>
                      <label className="block text-xs text-brand-muted mb-1">Module (optional)</label>
                      <input type="text" value={itemForm.module as string || ''} onChange={e => setItemForm(p => ({ ...p, module: e.target.value }))} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-primary" placeholder="films, news, core" />
                    </div>
                    <div>
                      <label className="block text-xs text-brand-muted mb-1">Target</label>
                      <select value={itemForm.target as string || '_self'} onChange={e => setItemForm(p => ({ ...p, target: e.target.value as '_self' | '_blank' }))} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-primary">
                        <option value="_self">Same Tab</option>
                        <option value="_blank">New Tab</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => createItemMut.mutate({ ...itemForm, menu_id: selectedMenu! })} className="px-3 py-1.5 bg-brand-primary hover:bg-brand-primary/80 text-white rounded-lg text-xs">Create Item</button>
                    <button onClick={() => setShowCreateItem(false)} className="px-3 py-1.5 bg-brand-surface hover:bg-brand-surface/80 text-brand-muted rounded-lg text-xs">Cancel</button>
                  </div>
                </div>
              )}

              <div className="p-2">
                {itemsLoading ? (
                  <div className="text-center py-8 text-brand-muted text-sm">Loading items...</div>
                ) : !Array.isArray(items) || items.length === 0 ? (
                  <div className="text-center py-8 text-brand-muted text-sm">No menu items yet. Click "Add Item" to create one.</div>
                ) : (
                  <div className="space-y-1">
                    {(items as MenuItem[]).map((item, idx) => (
                      <div key={item.id}>
                        <div
                          draggable
                          onDragStart={() => handleDragStart(idx)}
                          onDragOver={(e) => handleDragOver(e, idx)}
                          onDrop={handleDrop}
                          onDragEnd={() => { setDragIdx(null); setDragOverIdx(null) }}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group',
                            dragIdx === idx ? 'opacity-50 bg-brand-surface' : '',
                            dragOverIdx === idx && dragIdx !== idx ? 'pt-8 border-t-2 border-brand-primary' : 'hover:bg-brand-surface/50'
                          )}
                        >
                          <div className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-40 transition-opacity">
                            <GripVertical size={16} className="text-gray-500" />
                          </div>
                          <div className="flex-1 min-w-0 flex items-center gap-2">
                            <span className={cn('font-medium text-sm', item.is_active ? 'text-white' : 'text-brand-muted line-through')}>{item.label}</span>
                            {item.url && <span className="text-xs text-brand-muted truncate">{item.url}</span>}
                            {item.module && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(9,51,63,0.3)', color: '#4a9ea0' }}>{item.module}</span>}
                            <span className={cn('w-1.5 h-1.5 rounded-full', item.is_active ? 'bg-green-500' : 'bg-red-500')} />
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setEditingItem(item)} className="p-1.5 text-brand-muted hover:text-white hover:bg-brand-surface rounded-lg transition-colors">
                              <Edit3 size={14} />
                            </button>
                            <button onClick={() => deleteItemMut.mutate(item.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {editingItem && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setEditingItem(null)}>
          <div className="bg-brand-dark border border-brand-surface rounded-xl p-5 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Edit Menu Item</h3>
              <button onClick={() => setEditingItem(null)} className="p-1 text-brand-muted hover:text-white"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs text-brand-muted mb-1">Label</label>
                <input type="text" value={editingItem.label} onChange={e => setEditingItem(p => { if (!p) return p; return { ...p, label: e.target.value } })} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-primary" />
              </div>
              <div>
                <label className="block text-xs text-brand-muted mb-1">Link Type</label>
                <select value={editingItem.url && editingItem.url.startsWith('/page/') ? 'page' : 'url'} onChange={e => {
                  const lt = e.target.value
                  setEditingItem(p => { if (!p) return p; return { ...p, url: lt === 'page' ? '/page/' : (lt === 'url' && p.url?.startsWith('/page/') ? '' : p.url || '') } })
                }} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-primary">
                  <option value="url">Custom URL</option>
                  <option value="page">Page</option>
                </select>
              </div>
              {editingItem.url && editingItem.url.startsWith('/page/') ? (
                <div>
                  <label className="block text-xs text-brand-muted mb-1">Select Page</label>
                  <select value={(editingItem.url || '').replace('/page/', '')} onChange={e => { const slug = e.target.value; const page = pages.find((p: any) => p.slug === slug); setEditingItem(p => { if (!p) return p; return { ...p, url: slug ? '/page/' + slug : '', label: p.label || page?.title || slug } }) }} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-primary">
                    <option value="">-- Select a page --</option>
                    {pages.map((p: any) => <option key={p.id} value={p.slug}>{p.title}</option>)}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs text-brand-muted mb-1">URL</label>
                  <input type="text" value={editingItem.url || ''} onChange={e => setEditingItem(p => { if (!p) return p; return { ...p, url: e.target.value } })} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-primary" placeholder="/films" />
                </div>
              )}
              <div>
                <label className="block text-xs text-brand-muted mb-1">Module</label>
                <input type="text" value={editingItem.module || ''} onChange={e => setEditingItem(p => { if (!p) return p; return { ...p, module: e.target.value } })} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-primary" />
              </div>
              <div>
                <label className="block text-xs text-brand-muted mb-1">Target</label>
                <select value={editingItem.target} onChange={e => setEditingItem(p => { if (!p) return p; return { ...p, target: e.target.value as '_self' | '_blank' } })} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-primary">
                  <option value="_self">Same Tab</option>
                  <option value="_blank">New Tab</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <label className="flex items-center gap-2 text-sm text-brand-muted">
                <input type="checkbox" checked={editingItem.is_active} onChange={e => setEditingItem(p => { if (!p) return p; return { ...p, is_active: e.target.checked } })} className="rounded bg-[#1c2a38] border-brand-border" />
                Active
              </label>
            </div>
            <div className="flex gap-2">
              <button onClick={() => updateItemMut.mutate({ id: editingItem.id, data: editingItem as unknown as Record<string, unknown> })} className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/80 text-white rounded-lg text-sm">Save</button>
              <button onClick={() => setEditingItem(null)} className="px-4 py-2 bg-brand-surface hover:bg-brand-surface/80 text-brand-muted rounded-lg text-sm">Cancel</button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
