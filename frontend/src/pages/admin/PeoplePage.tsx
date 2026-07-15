import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPeople, getPerson, createPerson, updatePerson, deletePerson } from '@/lib/admin-api'
import { motion } from 'framer-motion'
import { Edit2, Trash2, Plus, Search, UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { MediaPicker } from '@/components/admin/MediaPicker'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { toast } from 'react-hot-toast'

interface MediaItem { id: number; url: string; name: string }

export const PeoplePage: React.FC = () => {
  const qc = useQueryClient(); const [page, setPage] = useState(1); const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null); const [deleteId, setDeleteId] = useState<number | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '', bio: '', birth_date: '', birth_place: '', imdb_url: '', photo_url: '', is_active: true })

  const { data, isLoading } = useQuery({ queryKey: ['admin', 'people', page, search], queryFn: () => getPeople({ page, per_page: 15, search: search || undefined }) })
  const createMut = useMutation({ mutationFn: createPerson, onSuccess: () => { toast.success('Created'); qc.invalidateQueries({ queryKey: ['admin', 'people'] }); setEditingId(-1); resetForm() }, onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed') })
  const updateMut = useMutation({ mutationFn: ({ id, data }: any) => updatePerson(id, data), onSuccess: () => { toast.success('Updated'); qc.invalidateQueries({ queryKey: ['admin', 'people'] }); setEditingId(null); resetForm() }, onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed') })
  const deleteMut = useMutation({ mutationFn: deletePerson, onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries({ queryKey: ['admin', 'people'] }); setDeleteId(null) } })

  const resetForm = () => setForm({ name: '', slug: '', bio: '', birth_date: '', birth_place: '', imdb_url: '', photo_url: '', is_active: true })

  const openEdit = async (id: number) => {
    setEditingId(id)
    try { const r = await getPerson(id); const p = r.data || r; setForm({ name: p.name || '', slug: p.slug || '', bio: p.bio || '', birth_date: p.birth_date || '', birth_place: p.birth_place || '', imdb_url: p.imdb_url || '', photo_url: p.photo_url || '', is_active: p.is_active !== false }) }
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
        <div><h1 className="text-xl font-bold text-white">People</h1><p className="text-sm mt-1" style={{ color: '#94a3b8' }}>Manage actors, directors, crew</p></div>
        <Button onClick={() => { setEditingId(-1); resetForm() }} style={{ background: '#09333f' }}><Plus size={16} className="mr-1.5" /> Add Person</Button>
      </div>

      {editingId !== null && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border" style={{ background: '#111820', borderColor: '#1e3040' }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: '#1e3040' }}><h2 className="font-semibold text-white">{editingId === -1 ? 'Add Person' : 'Edit Person'}</h2></div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Name *</label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Slug</label><Input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Birth Date</label><Input type="date" value={form.birth_date} onChange={e => setForm(p => ({ ...p, birth_date: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Birth Place</label><Input value={form.birth_place} onChange={e => setForm(p => ({ ...p, birth_place: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>IMDb URL</label><Input value={form.imdb_url} onChange={e => setForm(p => ({ ...p, imdb_url: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
            </div>
            <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Bio</label><Textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={3} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
            <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Photo</label>
              <div className="flex items-start gap-3">
                {form.photo_url && <img src={form.photo_url} className="w-16 h-16 rounded-full object-cover border" style={{ borderColor: '#1e3040' }} />}
                <Button size="sm" variant="outline" onClick={() => setPickerOpen(true)} style={{ borderColor: '#1e3040', color: '#cbd5e1' }}>{form.photo_url ? 'Change' : 'Select Photo'}</Button>
                {form.photo_url && <Button size="sm" variant="ghost" onClick={() => setForm(p => ({ ...p, photo_url: '' }))} className="text-red-400">Remove</Button>}
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
        <div className="rounded-xl border overflow-hidden" style={{ background: '#111820', borderColor: '#1e3040' }}>
          <div className="p-4 border-b" style={{ borderColor: '#1e3040' }}>
            <div className="relative max-w-xs"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748b' }} /><Input placeholder="Search people..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9', paddingLeft: '2.25rem' }} /></div>
          </div>
          <table className="w-full text-sm">
            <thead><tr style={{ background: '#0a0f14' }}><th className="text-left px-4 py-3 font-medium" style={{ color: '#94a3b8' }}>Name</th><th className="text-left px-4 py-3 font-medium" style={{ color: '#94a3b8' }}>Birth</th><th className="text-right px-4 py-3 font-medium w-32" style={{ color: '#94a3b8' }}>Actions</th></tr></thead>
            <tbody>
              {isLoading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t" style={{ borderColor: '#1e3040' }}><td colSpan={3} className="px-4 py-3"><div className="h-4 rounded w-full animate-pulse" style={{ background: '#1c2a38' }} /></td></tr>
              )) : items.map((p: any) => (
                <tr key={p.id} className="border-t" style={{ borderColor: '#1e3040' }}>
                  <td className="px-4 py-3"><div className="flex items-center gap-2">{p.photo_url && <img src={p.photo_url} className="w-8 h-8 rounded-full object-cover" />}<span className="font-medium text-white">{p.name}</span></div></td>
                  <td className="px-4 py-3" style={{ color: '#94a3b8' }}>{p.birth_place || p.birth_date || '-'}</td>
                  <td className="px-4 py-3 text-right"><div className="flex items-center gap-1 justify-end">
                    <button onClick={() => openEdit(p.id)} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white"><Edit2 size={15} /></button>
                    <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400"><Trash2 size={15} /></button>
                  </div></td>
                </tr>
              ))}
              {items.length === 0 && !isLoading && <tr><td colSpan={3} className="px-4 py-12 text-center" style={{ color: '#64748b' }}>No people found</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={(m: MediaItem) => { setForm(p => ({ ...p, photo_url: m.url })); setPickerOpen(false) }} />
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteMut.mutate(deleteId!)} isLoading={deleteMut.isPending} />
    </div>
  )
}
