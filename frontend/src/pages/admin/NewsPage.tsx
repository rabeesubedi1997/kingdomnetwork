import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getNews, getNewsItem, createNews, updateNews, deleteNews } from '@/lib/admin-api'
import { motion } from 'framer-motion'
import { Edit2, Trash2, Plus, Search, Eye } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { MediaPicker } from '@/components/admin/MediaPicker'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

const statusOptions = [
  { value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' },
  { value: 'scheduled', label: 'Scheduled' }, { value: 'archived', label: 'Archived' },
]

const statusColors: Record<string, string> = {
  draft: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  published: 'bg-green-500/10 text-green-400 border-green-500/20',
  scheduled: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  archived: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

interface MediaItem { id: number; url: string; name: string }

export const NewsPage: React.FC = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1); const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', status: 'draft', featured_image_url: '' })

  const { data, isLoading } = useQuery({ queryKey: ['admin', 'news', page, search], queryFn: () => getNews({ page, per_page: 15, search: search || undefined }) })

  const createMutation = useMutation({ mutationFn: createNews, onSuccess: () => { toast.success('Created'); queryClient.invalidateQueries({ queryKey: ['admin', 'news'] }); setEditingId(-1); resetForm() }, onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed') })
  const updateMutation = useMutation({ mutationFn: ({ id, data }: any) => updateNews(id, data), onSuccess: () => { toast.success('Updated'); queryClient.invalidateQueries({ queryKey: ['admin', 'news'] }); setEditingId(null); resetForm() }, onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed') })
  const deleteMutation = useMutation({ mutationFn: deleteNews, onSuccess: () => { toast.success('Deleted'); queryClient.invalidateQueries({ queryKey: ['admin', 'news'] }); setDeleteId(null) } })

  const resetForm = () => setForm({ title: '', slug: '', excerpt: '', content: '', status: 'draft', featured_image_url: '' })

  const openEdit = async (id: number) => {
    setEditingId(id)
    try { const r = await getNewsItem(id); const p = r.data || r; setForm({ title: p.title || '', slug: p.slug || '', excerpt: p.excerpt || '', content: p.content || '', status: p.status || 'draft', featured_image_url: p.featured_image_url || '' }) }
    catch { toast.error('Failed to load') }
  }

  const handleSubmit = () => {
    if (editingId && editingId > 0) updateMutation.mutate({ id: editingId, data: form })
    else createMutation.mutate(form as any)
  }

  const items = data?.data || []

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-white">News</h1><p className="text-sm mt-1" style={{ color: '#94a3b8' }}>Manage news & articles</p></div>
        <Button onClick={() => { setEditingId(-1); resetForm() }} style={{ background: '#09333f' }}><Plus size={16} className="mr-1.5" /> Add News</Button>
      </div>

      {editingId !== null && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border" style={{ background: '#111820', borderColor: '#1e3040' }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: '#1e3040' }}><h2 className="font-semibold text-white">{editingId === -1 ? 'Create News' : 'Edit News'}</h2></div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Title *</label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Slug</label><Input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Status</label><Select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} options={statusOptions} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
            </div>
            <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Excerpt</label><Textarea value={form.excerpt} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))} rows={2} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
            <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Content</label><Textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={6} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
            <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Featured Image</label>
              <div className="flex items-start gap-3">
                {form.featured_image_url && <img src={form.featured_image_url} className="w-20 h-14 object-cover rounded-lg border" style={{ borderColor: '#1e3040' }} />}
                <Button size="sm" variant="outline" onClick={() => setPickerOpen(true)} style={{ borderColor: '#1e3040', color: '#cbd5e1' }}>{form.featured_image_url ? 'Change' : 'Select Image'}</Button>
                {form.featured_image_url && <Button size="sm" variant="ghost" onClick={() => setForm(p => ({ ...p, featured_image_url: '' }))} className="text-red-400">Remove</Button>}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: '#1e3040' }}>
              <Button variant="ghost" onClick={() => { setEditingId(null); resetForm() }} className="text-gray-400">Cancel</Button>
              <Button onClick={handleSubmit} loading={createMutation.isPending || updateMutation.isPending} style={{ background: '#09333f' }}>{editingId === -1 ? 'Create' : 'Update'}</Button>
            </div>
          </div>
        </motion.div>
      )}

      {!editingId && (
        <div className="rounded-xl border overflow-hidden" style={{ background: '#111820', borderColor: '#1e3040' }}>
          <div className="p-4 border-b" style={{ borderColor: '#1e3040' }}>
            <div className="relative max-w-xs"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748b' }} /><Input placeholder="Search news..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9', paddingLeft: '2.25rem' }} /></div>
          </div>
          <table className="w-full text-sm">
            <thead><tr style={{ background: '#0a0f14' }}><th className="text-left px-4 py-3 font-medium" style={{ color: '#94a3b8' }}>Title</th><th className="text-left px-4 py-3 font-medium" style={{ color: '#94a3b8' }}>Status</th><th className="text-right px-4 py-3 font-medium w-32" style={{ color: '#94a3b8' }}>Actions</th></tr></thead>
            <tbody>
              {isLoading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t" style={{ borderColor: '#1e3040' }}><td colSpan={3} className="px-4 py-3"><div className="h-4 rounded w-full animate-pulse" style={{ background: '#1c2a38' }} /></td></tr>
              )) : items.map((p: any) => (
                <tr key={p.id} className="border-t" style={{ borderColor: '#1e3040' }}>
                  <td className="px-4 py-3"><p className="font-medium text-white">{p.title}</p><p className="text-xs" style={{ color: '#64748b' }}>/{p.slug}</p></td>
                  <td className="px-4 py-3"><span className={cn('px-2.5 py-1 rounded-full text-xs font-medium border', statusColors[p.status] || '')}>{p.status}</span></td>
                  <td className="px-4 py-3 text-right"><div className="flex items-center gap-1 justify-end">
                    <button onClick={() => openEdit(p.id)} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white"><Edit2 size={15} /></button>
                    <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400"><Trash2 size={15} /></button>
                  </div></td>
                </tr>
              ))}
              {items.length === 0 && !isLoading && <tr><td colSpan={3} className="px-4 py-12 text-center" style={{ color: '#64748b' }}>No news found</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={(m: MediaItem) => { setForm(p => ({ ...p, featured_image_url: m.url })); setPickerOpen(false) }} />
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteMutation.mutate(deleteId!)} isLoading={deleteMutation.isPending} />
    </div>
  )
}
