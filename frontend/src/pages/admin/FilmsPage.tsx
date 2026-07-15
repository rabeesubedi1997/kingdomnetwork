import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFilms, createFilm, updateFilm, deleteFilm, getFilm } from '@/lib/admin-api'
import { motion } from 'framer-motion'
import { Edit2, Trash2, Plus, Search, Film as FilmIcon, Star, Calendar, Clock, Eye } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { MediaPicker } from '@/components/admin/MediaPicker'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

const statusOptions = [
  { value: 'released', label: 'Released' }, { value: 'post_production', label: 'Post Production' },
  { value: 'pre_production', label: 'Pre Production' }, { value: 'development', label: 'Development' },
  { value: 'announced', label: 'Announced' }, { value: 'cancelled', label: 'Cancelled' },
]

const statusColors: Record<string, string> = {
  released: 'bg-green-500/10 text-green-400 border-green-500/20',
  post_production: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  pre_production: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  development: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  announced: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
}

interface MediaItem { id: number; url: string; name: string; is_image: boolean }

export const FilmsPage: React.FC = () => {
  const qc = useQueryClient(); const [page, setPage] = useState(1); const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null); const [deleteId, setDeleteId] = useState<number | null>(null)
  const [pickerFor, setPickerFor] = useState<'poster' | 'banner' | null>(null)
  const [form, setForm] = useState<any>({ title: '', slug: '', status: 'development', tagline: '', synopsis: '', short_description: '', release_date: '', runtime_minutes: '', rating: '', language: 'Nepali', country: 'Nepal', trailer_url: '', is_featured: false, poster_url: '', banner_url: '', published_at: new Date().toISOString().slice(0, 16) })

  const { data, isLoading } = useQuery({ queryKey: ['admin', 'films', page, search], queryFn: () => getFilms({ page, per_page: 15, search: search || undefined }) })

  const createMut = useMutation({ mutationFn: createFilm, onSuccess: () => { toast.success('Film created'); qc.invalidateQueries({ queryKey: ['admin', 'films'] }); setEditingId(-1); resetForm() }, onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed') })
  const updateMut = useMutation({ mutationFn: ({ id, data }: any) => updateFilm(id, data), onSuccess: () => { toast.success('Updated'); qc.invalidateQueries({ queryKey: ['admin', 'films'] }); setEditingId(null); resetForm() }, onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed') })
  const deleteMut = useMutation({ mutationFn: deleteFilm, onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries({ queryKey: ['admin', 'films'] }); setDeleteId(null) } })

  const resetForm = () => setForm({ title: '', slug: '', status: 'development', tagline: '', synopsis: '', short_description: '', release_date: '', runtime_minutes: '', rating: '', language: 'Nepali', country: 'Nepal', trailer_url: '', is_featured: false, poster_url: '', banner_url: '', published_at: new Date().toISOString().slice(0, 16) })

  const openEdit = async (id: number) => {
    setEditingId(id)
    try { const r = await getFilm(id); const f = r.data || r; setForm({ title: f.title || '', slug: f.slug || '', status: f.status || 'development', tagline: f.tagline || '', synopsis: f.synopsis || '', short_description: f.short_description || '', release_date: f.release_date || '', runtime_minutes: String(f.runtime_minutes || ''), rating: f.rating || '', language: f.language || 'Nepali', country: f.country || 'Nepal', trailer_url: f.trailer_url || '', is_featured: f.is_featured || false, poster_url: f.poster_url || '', banner_url: f.banner_url || '', published_at: f.published_at ? f.published_at.slice(0, 16) : new Date().toISOString().slice(0, 16) }) }
    catch { toast.error('Failed to load') }
  }

  const handleSubmit = () => {
    const payload = { ...form, runtime_minutes: form.runtime_minutes ? parseInt(form.runtime_minutes) : null }
    if (editingId && editingId > 0) updateMut.mutate({ id: editingId, data: payload })
    else createMut.mutate(payload)
  }

  const handleMediaSelect = (m: MediaItem) => { setForm((p: any) => ({ ...p, [pickerFor === 'poster' ? 'poster_url' : 'banner_url']: m.url })); setPickerFor(null) }

  const films = data?.data || []
  const isEditing = editingId !== null

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-white">Films</h1><p className="text-sm mt-1" style={{ color: '#94a3b8' }}>Manage your film catalog</p></div>
        <Button onClick={() => { setEditingId(-1); resetForm() }} style={{ background: '#09333f' }}><Plus size={16} className="mr-1.5" /> Add Film</Button>
      </div>

      {isEditing && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border" style={{ background: '#111820', borderColor: '#1e3040' }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: '#1e3040' }}>
            <h2 className="font-semibold text-white">{editingId === -1 ? 'Create Film' : 'Edit Film'}</h2>
          </div>
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Title *</label><Input value={form.title} onChange={e => setForm((p: any) => ({ ...p, title: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Slug</label><Input value={form.slug} onChange={e => setForm((p: any) => ({ ...p, slug: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Status</label><Select value={form.status} onChange={e => setForm((p: any) => ({ ...p, status: e.target.value }))} options={statusOptions} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Release Date</label><Input type="date" value={form.release_date} onChange={e => setForm((p: any) => ({ ...p, release_date: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Runtime (min)</label><Input type="number" value={form.runtime_minutes} onChange={e => setForm((p: any) => ({ ...p, runtime_minutes: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Rating</label><Input value={form.rating} onChange={e => setForm((p: any) => ({ ...p, rating: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Language</label><Input value={form.language} onChange={e => setForm((p: any) => ({ ...p, language: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Country</label><Input value={form.country} onChange={e => setForm((p: any) => ({ ...p, country: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Trailer URL</label><Input value={form.trailer_url} onChange={e => setForm((p: any) => ({ ...p, trailer_url: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
            </div>
            <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Tagline</label><Input value={form.tagline} onChange={e => setForm((p: any) => ({ ...p, tagline: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
            <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Short Description</label><Textarea value={form.short_description} onChange={e => setForm((p: any) => ({ ...p, short_description: e.target.value }))} rows={2} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
            <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Synopsis</label><Textarea value={form.synopsis} onChange={e => setForm((p: any) => ({ ...p, synopsis: e.target.value }))} rows={4} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Poster</label>
                <div className="flex items-start gap-3">{form.poster_url && <img src={form.poster_url} className="w-16 h-22 object-cover rounded-lg border" style={{ borderColor: '#1e3040' }} />}
                  <div className="space-y-1"><Button size="sm" variant="outline" onClick={() => setPickerFor('poster')} style={{ borderColor: '#1e3040', color: '#cbd5e1' }}>{form.poster_url ? 'Change' : 'Select'}</Button>{form.poster_url && <Button size="sm" variant="ghost" onClick={() => setForm((p: any) => ({ ...p, poster_url: '' }))} className="text-red-400 block">Remove</Button>}</div>
                </div>
              </div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Banner</label>
                <div className="flex items-start gap-3">{form.banner_url && <img src={form.banner_url} className="w-24 h-14 object-cover rounded-lg border" style={{ borderColor: '#1e3040' }} />}
                  <div className="space-y-1"><Button size="sm" variant="outline" onClick={() => setPickerFor('banner')} style={{ borderColor: '#1e3040', color: '#cbd5e1' }}>{form.banner_url ? 'Change' : 'Select'}</Button>{form.banner_url && <Button size="sm" variant="ghost" onClick={() => setForm((p: any) => ({ ...p, banner_url: '' }))} className="text-red-400 block">Remove</Button>}</div>
                </div>
              </div>
              <div><label className="flex items-center gap-2 mt-6 cursor-pointer">
                <input type="checkbox" checked={form.is_featured} onChange={e => setForm((p: any) => ({ ...p, is_featured: e.target.checked }))} className="w-4 h-4 rounded" style={{ accentColor: '#ffcd57' }} />
                <span className="text-sm font-medium" style={{ color: '#cbd5e1' }}>Featured Film</span></label>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: '#1e3040' }}>
              <Button variant="ghost" onClick={() => { setEditingId(null); resetForm() }} className="text-gray-400">Cancel</Button>
              <Button onClick={handleSubmit} loading={createMut.isPending || updateMut.isPending} style={{ background: '#09333f' }}>{editingId === -1 ? 'Create Film' : 'Update Film'}</Button>
            </div>
          </div>
        </motion.div>
      )}

      {!isEditing && (
        <div className="rounded-xl border overflow-hidden" style={{ background: '#111820', borderColor: '#1e3040' }}>
          <div className="p-4 border-b" style={{ borderColor: '#1e3040' }}>
            <div className="relative max-w-xs"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748b' }} /><Input placeholder="Search films..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9', paddingLeft: '2.25rem' }} /></div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr style={{ background: '#0a0f14' }}><th className="text-left px-4 py-3 font-medium" style={{ color: '#94a3b8' }}>Film</th><th className="text-left px-4 py-3 font-medium" style={{ color: '#94a3b8' }}>Status</th><th className="text-left px-4 py-3 font-medium" style={{ color: '#94a3b8' }}>Year</th><th className="text-left px-4 py-3 font-medium" style={{ color: '#94a3b8' }}>Rating</th><th className="text-right px-4 py-3 font-medium w-32" style={{ color: '#94a3b8' }}>Actions</th></tr></thead>
              <tbody>
                {isLoading ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: '#1e3040' }}><td colSpan={5} className="px-4 py-3"><div className="h-4 rounded w-full animate-pulse" style={{ background: '#1c2a38' }} /></td></tr>
                )) : films.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-12 text-center" style={{ color: '#64748b' }}>No films found</td></tr>
                ) : films.map((film: any) => (
                  <motion.tr key={film.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t" style={{ borderColor: '#1e3040' }}>
                    <td className="px-4 py-3"><div className="flex items-center gap-3">{film.poster_url && <img src={film.poster_url} className="w-8 h-11 object-cover rounded" />}<div><p className="font-medium text-white">{film.title}</p><p className="text-xs" style={{ color: '#64748b' }}>/{film.slug}</p></div></div></td>
                    <td className="px-4 py-3"><span className={cn('px-2.5 py-1 rounded-full text-xs font-medium border', statusColors[film.status] || '')}>{statusOptions.find(s => s.value === film.status)?.label || film.status}</span></td>
                    <td className="px-4 py-3" style={{ color: '#94a3b8' }}>{film.release_date ? new Date(film.release_date).getFullYear() : '-'}</td>
                    <td className="px-4 py-3" style={{ color: '#94a3b8' }}>{film.rating || '-'}</td>
                    <td className="px-4 py-3 text-right"><div className="flex items-center gap-1 justify-end">
                      <button onClick={() => openEdit(film.id)} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white"><Edit2 size={15} /></button>
                      <button onClick={() => setDeleteId(film.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400"><Trash2 size={15} /></button>
                    </div></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {data?.last_page > 1 && (
            <div className="px-4 py-3 border-t flex items-center justify-between text-sm" style={{ borderColor: '#1e3040', color: '#64748b' }}>
              <span>Page {data.current_page} of {data.last_page}</span>
              <div className="flex gap-1">
                <button disabled={data.current_page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded border disabled:opacity-30 hover:bg-white/5" style={{ borderColor: '#1e3040' }}>Prev</button>
                <button disabled={data.current_page >= data.last_page} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded border disabled:opacity-30 hover:bg-white/5" style={{ borderColor: '#1e3040' }}>Next</button>
              </div>
            </div>
          )}
        </div>
      )}

      <MediaPicker open={pickerFor !== null} onClose={() => setPickerFor(null)} onSelect={handleMediaSelect} />
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteMut.mutate(deleteId!)} isLoading={deleteMut.isPending} />
    </div>
  )
}
