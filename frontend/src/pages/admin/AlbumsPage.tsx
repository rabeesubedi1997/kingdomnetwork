import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAlbums, getAlbum, createAlbum, updateAlbum, deleteAlbum } from '@/lib/admin-api'
import { motion } from 'framer-motion'
import { Edit2, Trash2, Plus, Search, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { MediaPicker } from '@/components/admin/MediaPicker'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { toast } from 'react-hot-toast'

const catOptions = [
  { value: 'behind_the_scenes', label: 'Behind the Scenes' }, { value: 'posters', label: 'Posters' },
  { value: 'stills', label: 'Stills' }, { value: 'events', label: 'Events' },
  { value: 'concept_art', label: 'Concept Art' }, { value: 'marketing', label: 'Marketing' },
]

interface MediaItem { id: number; url: string; name: string }

export const AlbumsPage: React.FC = () => {
  const qc = useQueryClient(); const [page, setPage] = useState(1); const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null); const [deleteId, setDeleteId] = useState<number | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [form, setForm] = useState({ title: '', slug: '', description: '', category: 'stills', cover_url: '' })

  const { data, isLoading } = useQuery({ queryKey: ['admin', 'albums', page, search], queryFn: () => getAlbums({ page, per_page: 15, search: search || undefined }) })
  const createMut = useMutation({ mutationFn: createAlbum, onSuccess: () => { toast.success('Created'); qc.invalidateQueries({ queryKey: ['admin', 'albums'] }); setEditingId(-1); resetForm() }, onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed') })
  const updateMut = useMutation({ mutationFn: ({ id, data }: any) => updateAlbum(id, data), onSuccess: () => { toast.success('Updated'); qc.invalidateQueries({ queryKey: ['admin', 'albums'] }); setEditingId(null); resetForm() }, onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed') })
  const deleteMut = useMutation({ mutationFn: deleteAlbum, onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries({ queryKey: ['admin', 'albums'] }); setDeleteId(null) } })

  const resetForm = () => setForm({ title: '', slug: '', description: '', category: 'stills', cover_url: '' })

  const openEdit = async (id: number) => {
    setEditingId(id)
    try { const r = await getAlbum(id); const a = r.data || r; setForm({ title: a.title || '', slug: a.slug || '', description: a.description || '', category: a.category || 'stills', cover_url: a.cover_url || '' }) }
    catch { toast.error('Failed to load') }
  }

  const handleSubmit = () => {
    if (editingId && editingId > 0) updateMut.mutate({ id: editingId, data: form })
    else createMut.mutate(form as any)
  }

  const items = data?.data || []

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-white">Gallery Albums</h1><p className="text-sm mt-1" style={{ color: '#94a3b8' }}>Manage photo albums</p></div>
        <Button onClick={() => { setEditingId(-1); resetForm() }} style={{ background: '#09333f' }}><Plus size={16} className="mr-1.5" /> Add Album</Button>
      </div>

      {editingId !== null && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border" style={{ background: '#111820', borderColor: '#1e3040' }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: '#1e3040' }}><h2 className="font-semibold text-white">{editingId === -1 ? 'Create Album' : 'Edit Album'}</h2></div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Title *</label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Slug</label><Input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Category</label><Select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} options={catOptions} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
            </div>
            <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Description</label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
            <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Cover Image</label>
              <div className="flex items-start gap-3">
                {form.cover_url && <img src={form.cover_url} className="w-20 h-14 object-cover rounded-lg border" style={{ borderColor: '#1e3040' }} />}
                <Button size="sm" variant="outline" onClick={() => setPickerOpen(true)} style={{ borderColor: '#1e3040', color: '#cbd5e1' }}>{form.cover_url ? 'Change' : 'Select Cover'}</Button>
                {form.cover_url && <Button size="sm" variant="ghost" onClick={() => setForm(p => ({ ...p, cover_url: '' }))} className="text-red-400">Remove</Button>}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: '#1e3040' }}>
              <Button variant="ghost" onClick={() => { setEditingId(null); resetForm() }} className="text-gray-400">Cancel</Button>
              <Button onClick={handleSubmit} loading={createMut.isPending || updateMut.isPending} style={{ background: '#09333f' }}>{editingId === -1 ? 'Create' : 'Update'}</Button>
            </div>
          </div>
        </motion.div>
      )}

      {!editingId && (
        <>
          <div className="relative max-w-xs"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748b' }} /><Input placeholder="Search albums..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9', paddingLeft: '2.25rem' }} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border animate-pulse overflow-hidden" style={{ background: '#111820', borderColor: '#1e3040' }}>
                <div className="aspect-video" style={{ background: '#1c2a38' }} />
                <div className="p-4"><div className="h-4 rounded w-2/3" style={{ background: '#1c2a38' }} /><div className="h-3 rounded w-1/3 mt-2" style={{ background: '#1c2a38' }} /></div>
              </div>
            )) : items.map((a: any) => (
              <motion.div key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border overflow-hidden group" style={{ background: '#111820', borderColor: '#1e3040' }}>
                <div className="aspect-video relative" style={{ background: '#0a0f14' }}>
                  {a.cover_url ? <img src={a.cover_url} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full"><ImageIcon size={40} style={{ color: '#1e3040' }} /></div>}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button onClick={() => openEdit(a.id)} className="p-2 rounded-lg bg-white/10 backdrop-blur hover:bg-white/20 text-white"><Edit2 size={16} /></button>
                    <button onClick={() => setDeleteId(a.id)} className="p-2 rounded-lg bg-white/10 backdrop-blur hover:bg-red-500/20 text-red-400"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="p-4"><h3 className="font-semibold text-white">{a.title}</h3><p className="text-xs mt-0.5 capitalize" style={{ color: '#64748b' }}>{a.category?.replace(/_/g, ' ')}</p></div>
              </motion.div>
            ))}
            {items.length === 0 && !isLoading && <div className="col-span-full text-center py-12" style={{ color: '#64748b' }}>No albums found</div>}
          </div>
        </>
      )}

      <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={(m: MediaItem) => { setForm(p => ({ ...p, cover_url: m.url })); setPickerOpen(false) }} />
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteMut.mutate(deleteId!)} isLoading={deleteMut.isPending} />
    </div>
  )
}
