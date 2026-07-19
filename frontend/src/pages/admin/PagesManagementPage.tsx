import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPages, createPage, updatePage, deletePage, getPageSections, createPageSection, updatePageSection, deletePageSection, reorderPageSections } from '@/lib/admin-api'
import { toast } from 'react-hot-toast'
import { Plus, Edit3, Trash2, X, FileText, Eye, EyeOff, Calendar, GripVertical, Layers, Image, Film, Newspaper, Users, UserCircle, Trophy, Mail, Briefcase, TrendingUp, Code, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'

interface Page {
  id: number; slug: string; title: string; content: string | null
  meta_title: string | null; meta_description: string | null
  meta_image_id: number | null; schema_type: string | null
  is_active: boolean; published_at: string | null; created_at: string
}

interface PageSection {
  id: number; page_id: number; section_type: string
  title: string | null; config: Record<string, any> | null
  sort_order: number; is_active: boolean
}

type PageForm = Partial<Omit<Page, 'id' | 'created_at'>>

const emptyForm: PageForm = {
  title: '', slug: '', content: '', meta_title: '', meta_description: '',
  meta_image_id: null, schema_type: '', is_active: true, published_at: null,
}

const sectionTypes: Record<string, { label: string; module: string; icon: any; fields?: { key: string; label: string; type: string }[] }> = {
  hero_banner: { label: 'Hero Banner', module: 'core', icon: Image, fields: [{ key: 'count', label: 'Number of banners', type: 'number' }] },
  film_grid: { label: 'Film Grid', module: 'films', icon: Film, fields: [{ key: 'status', label: 'Filter by status', type: 'text' }, { key: 'limit', label: 'Max items', type: 'number' }] },
  featured_film: { label: 'Featured Film', module: 'films', icon: Film, fields: [{ key: 'slug', label: 'Film slug', type: 'text' }] },
  film_status_tabs: { label: 'Film Status Tabs', module: 'films', icon: Film },
  news_feed: { label: 'News Feed', module: 'news', icon: Newspaper, fields: [{ key: 'limit', label: 'Max items', type: 'number' }, { key: 'category', label: 'Category slug', type: 'text' }] },
  featured_news: { label: 'Featured News', module: 'news', icon: Newspaper, fields: [{ key: 'limit', label: 'Max items', type: 'number' }] },
  gallery_albums: { label: 'Gallery Albums', module: 'gallery', icon: Image, fields: [{ key: 'limit', label: 'Max items', type: 'number' }] },
  team_grid: { label: 'Team Grid', module: 'core', icon: Users },
  people_grid: { label: 'People Grid', module: 'people', icon: UserCircle, fields: [{ key: 'limit', label: 'Max items', type: 'number' }] },
  awards_display: { label: 'Awards Display', module: 'awards', icon: Trophy },
  contact_form: { label: 'Contact Form', module: 'core', icon: Mail },
  newsletter_signup: { label: 'Newsletter Signup', module: 'newsletter', icon: Mail },
  stats_counters: { label: 'Stats Counters', module: 'core', icon: TrendingUp },
  custom_html: { label: 'Custom HTML', module: 'core', icon: Code, fields: [{ key: 'html', label: 'HTML Content', type: 'textarea' }] },
  about_preview: { label: 'About Preview', module: 'core', icon: FileText },
  careers_list: { label: 'Careers List', module: 'careers', icon: Briefcase },
  testimonials_carousel: { label: 'Testimonials Carousel', module: 'core', icon: MessageSquare },
  partners_showcase: { label: 'Partners Showcase', module: 'core', icon: Briefcase },
}

export const PagesManagementPage: React.FC = () => {
  const queryClient = useQueryClient()
  const [editingPage, setEditingPage] = useState<Page | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState<PageForm>(emptyForm)
  const [activeTab, setActiveTab] = useState<'details' | 'sections'>('details')
  const [sections, setSections] = useState<PageSection[]>([])
  const [sectionsLoaded, setSectionsLoaded] = useState(false)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)
  const [showAddSection, setShowAddSection] = useState(false)
  const [newSectionType, setNewSectionType] = useState('')
  const [newSectionTitle, setNewSectionTitle] = useState('')
  const [editingSection, setEditingSection] = useState<PageSection | null>(null)
  const [sectionConfig, setSectionConfig] = useState<Record<string, any>>({})

  const { data: pages, isLoading } = useQuery({
    queryKey: ['admin', 'pages'],
    queryFn: getPages,
  })

  const createMut = useMutation({
    mutationFn: createPage,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'pages'] }); setShowCreate(false); setForm(emptyForm); toast.success('Page created') },
    onError: () => toast.error('Failed to create page'),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => updatePage(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'pages'] }); setEditingPage(null); toast.success('Page updated') },
    onError: () => toast.error('Failed to update page'),
  })

  const deleteMut = useMutation({
    mutationFn: deletePage,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'pages'] }); toast.success('Page deleted') },
    onError: () => toast.error('Failed to delete page'),
  })

  const sectionsQuery = useQuery({
    queryKey: ['admin', 'page-sections', editingPage?.id],
    queryFn: () => getPageSections(editingPage!.id),
    enabled: !!editingPage && activeTab === 'sections',
  })

  const createSectionMut = useMutation({
    mutationFn: ({ pageId, data }: { pageId: number; data: Record<string, unknown> }) => createPageSection(pageId, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'page-sections', editingPage?.id] }); setShowAddSection(false); setNewSectionType(''); setNewSectionTitle(''); toast.success('Section added') },
    onError: () => toast.error('Failed to add section'),
  })

  const updateSectionMut = useMutation({
    mutationFn: ({ pageId, sectionId, data }: { pageId: number; sectionId: number; data: Record<string, unknown> }) => updatePageSection(pageId, sectionId, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'page-sections', editingPage?.id] }); setEditingSection(null); toast.success('Section updated') },
    onError: () => toast.error('Failed to update section'),
  })

  const deleteSectionMut = useMutation({
    mutationFn: ({ pageId, sectionId }: { pageId: number; sectionId: number }) => deletePageSection(pageId, sectionId),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'page-sections', editingPage?.id] }); toast.success('Section deleted') },
    onError: () => toast.error('Failed to delete section'),
  })

  const reorderSectionsMut = useMutation({
    mutationFn: ({ pageId, sections }: { pageId: number; sections: { id: number; sort_order: number }[] }) => reorderPageSections(pageId, sections),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'page-sections', editingPage?.id] }),
  })

  useEffect(() => {
    if (sectionsQuery.data) {
      const data = Array.isArray(sectionsQuery.data) ? sectionsQuery.data : sectionsQuery.data.data || []
      setSections(data.sort((a: any, b: any) => a.sort_order - b.sort_order))
      setSectionsLoaded(true)
    }
  }, [sectionsQuery.data])

  const handleSave = () => {
    if (editingPage) {
      updateMut.mutate({ id: editingPage.id, data: form })
    } else {
      createMut.mutate(form)
    }
  }

  const openEdit = (page: Page) => {
    setEditingPage(page)
    setActiveTab('details')
    setForm({
      title: page.title, slug: page.slug, content: page.content,
      meta_title: page.meta_title, meta_description: page.meta_description,
      meta_image_id: page.meta_image_id, schema_type: page.schema_type,
      is_active: page.is_active, published_at: page.published_at,
    })
    setSectionsLoaded(false)
  }

  const closeForm = () => {
    setEditingPage(null)
    setShowCreate(false)
    setForm(emptyForm)
    setActiveTab('details')
    setShowAddSection(false)
    setEditingSection(null)
  }

  const handleDragStart = (idx: number) => setDragIdx(idx)
  const handleDragOver = (e: React.DragEvent, idx: number) => { e.preventDefault(); setDragOverIdx(idx) }
  const handleDrop = () => {
    if (dragIdx === null || dragOverIdx === null || dragIdx === dragOverIdx || !editingPage) { setDragIdx(null); setDragOverIdx(null); return }
    const newItems = [...sections]
    const [removed] = newItems.splice(dragIdx, 1)
    newItems.splice(dragOverIdx, 0, removed)
    setSections(newItems)
    setDragIdx(null)
    setDragOverIdx(null)
    const sectionData = newItems.map((s, i) => ({ id: s.id, sort_order: i + 1 }))
    reorderSectionsMut.mutate({ pageId: editingPage.id, sections: sectionData })
  }

  const addSection = () => {
    if (!editingPage || !newSectionType) return
    createSectionMut.mutate({
      pageId: editingPage.id,
      data: { section_type: newSectionType, title: newSectionTitle || undefined, config: {}, is_active: true },
    })
  }

  const openEditSection = (section: PageSection) => {
    setEditingSection(section)
    setSectionConfig(section.config || {})
  }

  const saveSectionConfig = () => {
    if (!editingPage || !editingSection) return
    updateSectionMut.mutate({
      pageId: editingPage.id,
      sectionId: editingSection.id,
      data: { config: sectionConfig, title: editingSection.title },
    })
  }

  const availableSectionTypes = Object.entries(sectionTypes).filter(([, v]) => !v.module || true)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Page Management</h1>
          <p className="text-brand-muted mt-0.5">Create pages and assign module sections</p>
        </div>
        <button onClick={() => { setShowCreate(true); setEditingPage(null); setForm(emptyForm); setActiveTab('details') }} className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/80 text-white rounded-lg transition-colors text-sm font-medium">
          <Plus size={16} /> New Page
        </button>
      </div>

      {(showCreate || editingPage) && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-brand-dark border border-brand-surface rounded-xl overflow-hidden">
          <div className="flex border-b border-brand-surface">
            <button onClick={() => setActiveTab('details')} className={cn('px-5 py-3 text-sm font-medium border-b-2 transition-colors', activeTab === 'details' ? 'border-brand-primary text-white' : 'border-transparent text-brand-muted hover:text-white')}>Page Details</button>
            {editingPage && (
              <button onClick={() => setActiveTab('sections')} className={cn('px-5 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5', activeTab === 'sections' ? 'border-brand-primary text-white' : 'border-transparent text-brand-muted hover:text-white')}>
                <Layers size={14} /> Sections {sections.length > 0 && <span className="text-xs bg-brand-primary/20 text-brand-primary px-1.5 py-0.5 rounded">{sections.length}</span>}
              </button>
            )}
          </div>

          {activeTab === 'details' ? (
            <div className="p-5">
              <h3 className="text-white font-medium mb-4">{editingPage ? 'Edit Page' : 'Create New Page'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-brand-muted mb-1.5">Title</label>
                  <input type="text" value={form.title} onChange={e => { setForm(p => ({ ...p, title: e.target.value })); if (!editingPage && !form.slug) setForm(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') })) }} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-primary" placeholder="Page title" />
                </div>
                <div>
                  <label className="block text-xs text-brand-muted mb-1.5">Slug</label>
                  <input type="text" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-primary" placeholder="page-slug" />
                </div>
                <div>
                  <label className="block text-xs text-brand-muted mb-1.5">Schema Type</label>
                  <input type="text" value={form.schema_type || ''} onChange={e => setForm(p => ({ ...p, schema_type: e.target.value }))} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-primary" placeholder="WebPage, AboutPage, etc." />
                </div>
                <div>
                  <label className="block text-xs text-brand-muted mb-1.5">Published At</label>
                  <input type="datetime-local" value={form.published_at ? form.published_at.slice(0, 16) : ''} onChange={e => setForm(p => ({ ...p, published_at: e.target.value || null }))} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-primary" />
                </div>
                <div>
                  <label className="block text-xs text-brand-muted mb-1.5">Meta Title</label>
                  <input type="text" value={form.meta_title || ''} onChange={e => setForm(p => ({ ...p, meta_title: e.target.value }))} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-primary" placeholder="SEO title" />
                </div>
                <div>
                  <label className="block text-xs text-brand-muted mb-1.5">Meta Description</label>
                  <input type="text" value={form.meta_description || ''} onChange={e => setForm(p => ({ ...p, meta_description: e.target.value }))} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-primary" placeholder="SEO description" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs text-brand-muted mb-1.5">Content (HTML) - used when no sections defined</label>
                <textarea value={form.content || ''} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={8} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-brand-primary" placeholder="<h1>Hello World</h1>" />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <label className="flex items-center gap-2 text-sm text-brand-muted">
                  <input type="checkbox" checked={form.is_active ?? true} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} className="rounded bg-[#1c2a38] border-brand-border" />
                  Active
                </label>
              </div>
              <div className="flex gap-2">
                <button onClick={handleSave} className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/80 text-white rounded-lg text-sm">{editingPage ? 'Update' : 'Create'}</button>
                <button onClick={closeForm} className="px-4 py-2 bg-brand-surface hover:bg-brand-surface/80 text-brand-muted rounded-lg text-sm">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Page Sections</h3>
                <button onClick={() => setShowAddSection(!showAddSection)} className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary/20 text-brand-primary hover:bg-brand-primary/30 rounded-lg text-xs font-medium transition-colors">
                  <Plus size={14} /> Add Section
                </button>
              </div>

              {showAddSection && (
                <div className="mb-4 p-4 bg-[#1c2a38] border border-brand-border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div className="md:col-span-2">
                      <label className="block text-xs text-brand-muted mb-1">Section Type</label>
                      <select value={newSectionType} onChange={e => setNewSectionType(e.target.value)} className="w-full bg-[#0a0f14] border border-brand-border rounded-lg px-3 py-2 text-white text-sm">
                        <option value="">Select a section type...</option>
                        {availableSectionTypes.map(([key, val]) => {
                          const Icon = val.icon
                          return <option key={key} value={key}>{Icon && <Icon size={14} />} {val.label} ({val.module})</option>
                        })}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-brand-muted mb-1">Title (optional)</label>
                      <input type="text" value={newSectionTitle} onChange={e => setNewSectionTitle(e.target.value)} className="w-full bg-[#0a0f14] border border-brand-border rounded-lg px-3 py-2 text-white text-sm" placeholder="Section title" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={addSection} disabled={!newSectionType} loading={createSectionMut.isPending} style={{ background: '#09333f' }}>Add Section</Button>
                    <Button size="sm" variant="ghost" onClick={() => { setShowAddSection(false); setNewSectionType(''); setNewSectionTitle('') }}>Cancel</Button>
                  </div>
                </div>
              )}

              {sections.length === 0 ? (
                <div className="text-center py-8 text-brand-muted text-sm border border-dashed border-brand-border rounded-lg">
                  <Layers size={32} className="mx-auto mb-2 opacity-30" />
                  <p>No sections yet. Add sections to build a modular page layout.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {sections.map((section, idx) => {
                    const st = sectionTypes[section.section_type]
                    const Icon = st?.icon || Layers
                    return (
                      <div key={section.id} draggable onDragStart={() => handleDragStart(idx)} onDragOver={(e) => handleDragOver(e, idx)} onDrop={handleDrop} onDragEnd={() => { setDragIdx(null); setDragOverIdx(null) }}
                        className={cn('flex items-center gap-3 p-3 rounded-lg border transition-all', dragIdx === idx ? 'opacity-50 border-brand-primary' : dragOverIdx === idx && dragIdx !== idx ? 'border-t-2 border-t-brand-primary' : 'border-brand-surface', section.is_active ? 'bg-[#1c2a38]' : 'bg-[#1c2a38]/50 opacity-60')}>
                        <div className="cursor-grab text-brand-muted hover:text-white"><GripVertical size={16} /></div>
                        <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center"><Icon size={16} className="text-brand-primary" /></div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white truncate">{section.title || st?.label || section.section_type}</div>
                          <div className="text-xs text-brand-muted">{section.section_type} · {st?.module || 'core'} module</div>
                        </div>
                        <span className={cn('text-[10px] px-1.5 py-0.5 rounded font-medium', section.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400')}>{section.is_active ? 'On' : 'Off'}</span>
                        <button onClick={() => openEditSection(section)} className="p-1.5 text-brand-muted hover:text-white hover:bg-brand-surface rounded-lg transition-colors"><Edit3 size={14} /></button>
                        <button onClick={() => deleteSectionMut.mutate({ pageId: editingPage!.id, sectionId: section.id })} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={14} /></button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {editingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setEditingSection(null)}>
          <div className="bg-[#111820] border border-[#1e3040] rounded-xl w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Edit Section</h2>
              <button onClick={() => setEditingSection(null)} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Title</label>
                <Input value={editingSection.title || ''} onChange={e => setEditingSection({ ...editingSection, title: e.target.value })}
                  style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Active</label>
                <label className="flex items-center gap-2 text-sm text-brand-muted">
                  <input type="checkbox" checked={editingSection.is_active} onChange={e => {
                    setEditingSection({ ...editingSection, is_active: e.target.checked })
                    updateSectionMut.mutate({ pageId: editingPage!.id, sectionId: editingSection.id, data: { is_active: e.target.checked } })
                  }} className="rounded" />
                  Enabled
                </label>
              </div>
              {sectionTypes[editingSection.section_type]?.fields?.map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>{field.label}</label>
                  {field.type === 'textarea' ? (
                    <Textarea value={sectionConfig[field.key] || ''} onChange={e => setSectionConfig({ ...sectionConfig, [field.key]: e.target.value })} rows={4}
                      style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} />
                  ) : (
                    <Input type={field.type || 'text'} value={sectionConfig[field.key] || ''} onChange={e => setSectionConfig({ ...sectionConfig, [field.key]: e.target.value })}
                      style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#1e3040]">
              <Button variant="ghost" onClick={() => setEditingSection(null)}>Cancel</Button>
              <Button onClick={saveSectionConfig} loading={updateSectionMut.isPending} style={{ background: '#09333f' }}>Save</Button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-brand-dark border border-brand-surface rounded-xl overflow-hidden">
        <div className="divide-y divide-brand-surface">
          {isLoading ? (
            <div className="text-center py-12 text-brand-muted text-sm">Loading pages...</div>
          ) : !Array.isArray(pages) || pages.length === 0 ? (
            <div className="text-center py-12 text-brand-muted text-sm">No pages yet. Create your first page.</div>
          ) : (
            (pages as Page[]).map((page) => (
              <div key={page.id} className="flex items-center gap-4 px-5 py-4 hover:bg-brand-surface/30 transition-colors group">
                <FileText size={20} className="text-brand-muted flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-sm truncate">{page.title}</span>
                    <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-medium', page.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400')}>
                      {page.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {page.schema_type && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-brand-primary/20 text-brand-primary">{page.schema_type}</span>
                    )}
                  </div>
                  <p className="text-xs text-brand-muted mt-0.5">/{page.slug}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(page)} className="p-1.5 text-brand-muted hover:text-white hover:bg-brand-surface rounded-lg transition-colors" title="Edit"><Edit3 size={14} /></button>
                  <button onClick={() => { if (confirm('Delete this page?')) deleteMut.mutate(page.id) }} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete"><Trash2 size={14} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}


