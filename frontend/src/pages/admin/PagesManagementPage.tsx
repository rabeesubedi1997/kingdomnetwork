import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPages, createPage, updatePage, deletePage } from '@/lib/admin-api'
import { toast } from 'react-hot-toast'
import { Plus, Edit3, Trash2, X, FileText, Eye, EyeOff, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Page {
  id: number
  slug: string
  title: string
  content: string | null
  meta_title: string | null
  meta_description: string | null
  meta_image_id: number | null
  schema_type: string | null
  is_active: boolean
  published_at: string | null
  created_at: string
}

type PageForm = Partial<Omit<Page, 'id' | 'created_at'>>

const emptyForm: PageForm = {
  title: '', slug: '', content: '', meta_title: '', meta_description: '',
  meta_image_id: null, schema_type: '', is_active: true, published_at: null,
}

export const PagesManagementPage: React.FC = () => {
  const queryClient = useQueryClient()
  const [editingPage, setEditingPage] = useState<Page | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState<PageForm>(emptyForm)

  const { data: pages, isLoading } = useQuery({
    queryKey: ['admin', 'pages'],
    queryFn: getPages,
  })

  const createMut = useMutation({
    mutationFn: createPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pages'] })
      setShowCreate(false)
      setForm(emptyForm)
      toast.success('Page created')
    },
    onError: () => toast.error('Failed to create page'),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => updatePage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pages'] })
      setEditingPage(null)
      toast.success('Page updated')
    },
    onError: () => toast.error('Failed to update page'),
  })

  const deleteMut = useMutation({
    mutationFn: deletePage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pages'] })
      toast.success('Page deleted')
    },
    onError: () => toast.error('Failed to delete page'),
  })

  const handleSave = () => {
    if (editingPage) {
      updateMut.mutate({ id: editingPage.id, data: form })
    } else {
      createMut.mutate(form)
    }
  }

  const openEdit = (page: Page) => {
    setEditingPage(page)
    setForm({
      title: page.title, slug: page.slug, content: page.content,
      meta_title: page.meta_title, meta_description: page.meta_description,
      meta_image_id: page.meta_image_id, schema_type: page.schema_type,
      is_active: page.is_active, published_at: page.published_at,
    })
  }

  const closeForm = () => {
    setEditingPage(null)
    setShowCreate(false)
    setForm(emptyForm)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Page Management</h1>
          <p className="text-brand-muted mt-0.5">Create and manage dynamic pages</p>
        </div>
        <button onClick={() => { setShowCreate(true); setEditingPage(null); setForm(emptyForm) }} className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/80 text-white rounded-lg transition-colors text-sm font-medium">
          <Plus size={16} /> New Page
        </button>
      </div>

      {(showCreate || editingPage) && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-brand-dark border border-brand-surface rounded-xl p-5">
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
            <label className="block text-xs text-brand-muted mb-1.5">Content (HTML)</label>
            <textarea value={form.content || ''} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={10} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-brand-primary" placeholder="<h1>Hello World</h1>" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <label className="flex items-center gap-2 text-sm text-brand-muted">
              <input type="checkbox" checked={form.is_active ?? true} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} className="rounded bg-[#1c2a38] border-brand-border" />
              Active
            </label>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/80 text-white rounded-lg text-sm">
              {editingPage ? 'Update' : 'Create'}
            </button>
            <button onClick={closeForm} className="px-4 py-2 bg-brand-surface hover:bg-brand-surface/80 text-brand-muted rounded-lg text-sm">Cancel</button>
          </div>
        </motion.div>
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
                  <button onClick={() => openEdit(page)} className="p-1.5 text-brand-muted hover:text-white hover:bg-brand-surface rounded-lg transition-colors">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => { if (confirm('Delete this page?')) deleteMut.mutate(page.id) }} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
