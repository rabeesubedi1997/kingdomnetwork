import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getGenres, getGenre, createGenre, updateGenre, deleteGenre } from '@/lib/admin-api'
import { motion } from 'framer-motion'
import { Edit2, Trash2, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { toast } from 'react-hot-toast'

export const GenresPage: React.FC = () => {
  const qc = useQueryClient(); const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null); const [deleteId, setDeleteId] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', slug: '', description: '', color: '#6366f1' })

  const { data, isLoading } = useQuery({ queryKey: ['admin', 'genres', search], queryFn: () => getGenres({ search: search || undefined, per_page: 100 }) })
  const createMut = useMutation({ mutationFn: createGenre, onSuccess: () => { toast.success('Created'); qc.invalidateQueries({ queryKey: ['admin', 'genres'] }); setEditingId(-1); resetForm() }, onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed') })
  const updateMut = useMutation({ mutationFn: ({ id, data }: any) => updateGenre(id, data), onSuccess: () => { toast.success('Updated'); qc.invalidateQueries({ queryKey: ['admin', 'genres'] }); setEditingId(null); resetForm() }, onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed') })
  const deleteMut = useMutation({ mutationFn: deleteGenre, onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries({ queryKey: ['admin', 'genres'] }); setDeleteId(null) } })

  const resetForm = () => setForm({ name: '', slug: '', description: '', color: '#6366f1' })

  const openEdit = async (id: number) => {
    setEditingId(id)
    try { const r = await getGenre(id); const g = r.data || r; setForm({ name: g.name || '', slug: g.slug || '', description: g.description || '', color: g.color || '#6366f1' }) }
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
        <div><h1 className="text-xl font-bold text-white">Genres</h1><p className="text-sm mt-1" style={{ color: '#94a3b8' }}>Manage film genres</p></div>
        <Button onClick={() => { setEditingId(-1); resetForm() }} style={{ background: '#09333f' }}><Plus size={16} className="mr-1.5" /> Add Genre</Button>
      </div>

      {editingId !== null && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border" style={{ background: '#111820', borderColor: '#1e3040' }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: '#1e3040' }}><h2 className="font-semibold text-white">{editingId === -1 ? 'Add Genre' : 'Edit Genre'}</h2></div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Name *</label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Slug</label><Input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Color</label><div className="flex gap-2 items-center"><Input type="color" value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} className="w-10 h-10 p-0.5" style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /><Input value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div></div>
            </div>
            <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Description</label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
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
            <div className="relative max-w-xs"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748b' }} /><Input placeholder="Search genres..." value={search} onChange={e => setSearch(e.target.value)} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9', paddingLeft: '2.25rem' }} /></div>
          </div>
          <table className="w-full text-sm">
            <thead><tr style={{ background: '#0a0f14' }}><th className="text-left px-4 py-3 font-medium" style={{ color: '#94a3b8' }}>Name</th><th className="text-left px-4 py-3 font-medium" style={{ color: '#94a3b8' }}>Slug</th><th className="text-right px-4 py-3 font-medium w-32" style={{ color: '#94a3b8' }}>Actions</th></tr></thead>
            <tbody>
              {isLoading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t" style={{ borderColor: '#1e3040' }}><td colSpan={3} className="px-4 py-3"><div className="h-4 rounded w-full animate-pulse" style={{ background: '#1c2a38' }} /></td></tr>
              )) : items.map((g: any) => (
                <tr key={g.id} className="border-t" style={{ borderColor: '#1e3040' }}>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: g.color || '#6366f1' }} /><span className="font-medium text-white">{g.name}</span></div></td>
                  <td className="px-4 py-3" style={{ color: '#94a3b8' }}>{g.slug}</td>
                  <td className="px-4 py-3 text-right"><div className="flex items-center gap-1 justify-end">
                    <button onClick={() => openEdit(g.id)} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white"><Edit2 size={15} /></button>
                    <button onClick={() => setDeleteId(g.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400"><Trash2 size={15} /></button>
                  </div></td>
                </tr>
              ))}
              {items.length === 0 && !isLoading && <tr><td colSpan={3} className="px-4 py-12 text-center" style={{ color: '#64748b' }}>No genres found</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteMut.mutate(deleteId!)} isLoading={deleteMut.isPending} />
    </div>
  )
}
