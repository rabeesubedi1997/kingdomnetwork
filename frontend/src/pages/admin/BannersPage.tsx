import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBanners, getBanner, createBanner, updateBanner, deleteBanner, reorderBanners } from '@/lib/admin-api'
import { motion } from 'framer-motion'
import { Edit2, Trash2, Plus, GripVertical, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { MediaPicker } from '@/components/admin/MediaPicker'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface MediaItem { id: number; url: string; name: string; is_image: boolean }

export const BannersPage: React.FC = () => {
  const qc = useQueryClient()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [localItems, setLocalItems] = useState<any[]>([])
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)
  const [form, setForm] = useState({ title: '', subtitle: '', link_url: '', link_text: '', image_url: '', bg_color: '#09333f', sort_order: '0', is_active: true })

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'banners'],
    queryFn: async () => {
      const res = await getBanners()
      const banners = Array.isArray(res) ? res : res.data || []
      setLocalItems(banners)
      return banners
    },
  })

  const banners = localItems

  const createMut = useMutation({ mutationFn: createBanner, onSuccess: () => { toast.success('Created'); qc.invalidateQueries({ queryKey: ['admin', 'banners'] }); setEditingId(-1); resetForm() }, onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed') })
  const updateMut = useMutation({ mutationFn: ({ id, data }: any) => updateBanner(id, data), onSuccess: () => { toast.success('Updated'); qc.invalidateQueries({ queryKey: ['admin', 'banners'] }); setEditingId(null); resetForm() }, onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed') })
  const deleteMut = useMutation({ mutationFn: deleteBanner, onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries({ queryKey: ['admin', 'banners'] }); setDeleteId(null) } })
  const reorderMut = useMutation({ mutationFn: reorderBanners, onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'banners'] }) })

  const resetForm = () => setForm({ title: '', subtitle: '', link_url: '', link_text: '', image_url: '', bg_color: '#09333f', sort_order: '0', is_active: true })

  const openEdit = async (id: number) => {
    setEditingId(id)
    try { const r = await getBanner(id); const b = r.data || r; setForm({ title: b.title || '', subtitle: b.subtitle || '', link_url: b.link_url || '', link_text: b.link_text || '', image_url: b.image_url || '', bg_color: b.bg_color || '#09333f', sort_order: String(b.sort_order || '0'), is_active: b.is_active !== false }) }
    catch { toast.error('Failed to load') }
  }

  const handleSubmit = () => {
    const payload = { ...form, sort_order: parseInt(form.sort_order) || 0 }
    if (editingId && editingId > 0) updateMut.mutate({ id: editingId, data: payload })
    else createMut.mutate(payload)
  }

  const handleDragStart = (idx: number) => setDragIdx(idx)
  const handleDragOver = (e: React.DragEvent, idx: number) => { e.preventDefault(); setDragOverIdx(idx) }
  const handleDrop = () => {
    if (dragIdx === null || dragOverIdx === null || dragIdx === dragOverIdx) { setDragIdx(null); setDragOverIdx(null); return }
    const newItems = [...localItems]
    const [removed] = newItems.splice(dragIdx, 1)
    newItems.splice(dragOverIdx, 0, removed)
    setLocalItems(newItems)
    setDragIdx(null)
    setDragOverIdx(null)
    const bannerData = newItems.map((item, i) => ({ id: item.id, sort_order: i + 1 }))
    reorderMut.mutate(bannerData)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-white">Banner Slider</h1><p className="text-sm mt-1" style={{ color: '#94a3b8' }}>Manage hero slider banners for the homepage</p></div>
        <Button onClick={() => { setEditingId(-1); resetForm() }} style={{ background: '#09333f' }}><Plus size={16} className="mr-1.5" /> Add Banner</Button>
      </div>

      {editingId !== null && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border" style={{ background: '#111820', borderColor: '#1e3040' }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: '#1e3040' }}><h2 className="font-semibold text-white">{editingId === -1 ? 'Create Banner' : 'Edit Banner'}</h2></div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Title</label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Subtitle</label><Input value={form.subtitle} onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Link URL</label><Input value={form.link_url} onChange={e => setForm(p => ({ ...p, link_url: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Link Text</label><Input value={form.link_text} onChange={e => setForm(p => ({ ...p, link_text: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Background Color</label><div className="flex gap-2"><Input type="color" value={form.bg_color} onChange={e => setForm(p => ({ ...p, bg_color: e.target.value }))} className="w-10 h-10 p-0.5" style={{ background: '#1c2a38', borderColor: '#1e3040' }} /><Input value={form.bg_color} onChange={e => setForm(p => ({ ...p, bg_color: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Sort Order</label><Input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
            </div>
            <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Banner Image</label>
              <div className="flex items-start gap-3">
                {form.image_url && <img src={form.image_url} className="w-32 h-18 object-cover rounded-lg border" style={{ borderColor: '#1e3040' }} />}
                <div className="space-y-1">
                  <Button size="sm" variant="outline" onClick={() => setPickerOpen(true)} style={{ borderColor: '#1e3040', color: '#cbd5e1' }}>{form.image_url ? 'Change' : 'Select Image'}</Button>
                  {form.image_url && <Button size="sm" variant="ghost" onClick={() => setForm(p => ({ ...p, image_url: '' }))} className="text-red-400 block">Remove</Button>}
                </div>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} className="w-4 h-4 rounded" style={{ accentColor: '#ffcd57' }} /><span className="text-sm" style={{ color: '#cbd5e1' }}>Active</span></label>
            <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: '#1e3040' }}>
              <Button variant="ghost" onClick={() => { setEditingId(null); resetForm() }} className="text-gray-400">Cancel</Button>
              <Button onClick={handleSubmit} loading={createMut.isPending || updateMut.isPending} style={{ background: '#09333f' }}>{editingId === -1 ? 'Create' : 'Update'}</Button>
            </div>
          </div>
        </motion.div>
      )}

      {!editingId && (
        <div className="space-y-3">
          {isLoading ? Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border animate-pulse h-24" style={{ background: '#111820', borderColor: '#1e3040' }} />
          )) : banners.length === 0 ? (
            <div className="text-center py-12 rounded-xl border" style={{ background: '#111820', borderColor: '#1e3040', color: '#64748b' }}>
              <ImageIcon size={48} className="mx-auto mb-3 opacity-30" />
              <p>No banners yet. Add your first banner!</p>
            </div>
          ) : banners.map((banner: any, idx: number) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={handleDrop}
              onDragEnd={() => { setDragIdx(null); setDragOverIdx(null) }}
              className={cn(
                'rounded-xl border overflow-hidden group',
                dragOverIdx === idx && dragIdx !== idx && 'pt-10',
                dragIdx === idx && 'opacity-40'
              )}
              style={{ background: '#111820', borderColor: '#1e3040' }}
            >
              <div className="flex items-center gap-4 p-4">
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-40 cursor-grab active:cursor-grabbing transition-opacity">
                  <GripVertical size={18} className="text-gray-500" />
                </div>
                <div className="w-32 h-18 rounded-lg overflow-hidden flex-shrink-0" style={{ background: banner.bg_color || '#09333f' }}>
                  {banner.image_url ? <img src={banner.image_url} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-white/40 text-xs">No Image</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white">{banner.title || 'Untitled'}</h3>
                  {banner.subtitle && <p className="text-sm" style={{ color: '#94a3b8' }}>{banner.subtitle}</p>}
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn('px-2 py-0.5 rounded text-[11px] font-medium', banner.is_active ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-500')}>{banner.is_active ? 'Active' : 'Inactive'}</span>
                    <span className="text-xs" style={{ color: '#64748b' }}>Order: {banner.sort_order || 0}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(banner.id)} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white"><Edit2 size={15} /></button>
                  <button onClick={() => setDeleteId(banner.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400"><Trash2 size={15} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={(m: MediaItem) => { setForm(p => ({ ...p, image_url: m.url })); setPickerOpen(false) }} />
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteMut.mutate(deleteId!)} isLoading={deleteMut.isPending} />
    </div>
  )
}
