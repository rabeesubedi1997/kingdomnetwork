import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPressKits, getPressKit, createPressKit, updatePressKit, deletePressKit } from '@/lib/admin-api'
import { motion } from 'framer-motion'
import { Edit2, Trash2, Plus, Search, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

export const PressKitsPage: React.FC = () => {
  const qc = useQueryClient(); const [page, setPage] = useState(1); const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null); const [deleteId, setDeleteId] = useState<number | null>(null)
  const [form, setForm] = useState({ title: '', slug: '', logline: '', synopsis_short: '', synopsis_long: '', contact_email: '', is_public: false })

  const { data, isLoading } = useQuery({ queryKey: ['admin', 'press-kits', page, search], queryFn: () => getPressKits({ page, per_page: 15, search: search || undefined }) })
  const createMut = useMutation({ mutationFn: createPressKit, onSuccess: () => { toast.success('Created'); qc.invalidateQueries({ queryKey: ['admin', 'press-kits'] }); setEditingId(-1); resetForm() }, onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed') })
  const updateMut = useMutation({ mutationFn: ({ id, data }: any) => updatePressKit(id, data), onSuccess: () => { toast.success('Updated'); qc.invalidateQueries({ queryKey: ['admin', 'press-kits'] }); setEditingId(null); resetForm() }, onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed') })
  const deleteMut = useMutation({ mutationFn: deletePressKit, onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries({ queryKey: ['admin', 'press-kits'] }); setDeleteId(null) } })

  const resetForm = () => setForm({ title: '', slug: '', logline: '', synopsis_short: '', synopsis_long: '', contact_email: '', is_public: false })

  const openEdit = async (id: number) => {
    setEditingId(id)
    try { const r = await getPressKit(id); const p = r.data || r; setForm({ title: p.title || '', slug: p.slug || '', logline: p.logline || '', synopsis_short: p.synopsis_short || '', synopsis_long: p.synopsis_long || '', contact_email: p.contact_email || '', is_public: p.is_public || false }) }
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
        <div><h1 className="text-xl font-bold text-white">Press Kits</h1><p className="text-sm mt-1" style={{ color: '#94a3b8' }}>Manage press kits for films</p></div>
        <Button onClick={() => { setEditingId(-1); resetForm() }} style={{ background: '#09333f' }}><Plus size={16} className="mr-1.5" /> Add Press Kit</Button>
      </div>

      {editingId !== null && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border" style={{ background: '#111820', borderColor: '#1e3040' }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: '#1e3040' }}><h2 className="font-semibold text-white">{editingId === -1 ? 'Create Press Kit' : 'Edit Press Kit'}</h2></div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Title *</label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Slug</label><Input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Contact Email</label><Input value={form.contact_email} onChange={e => setForm(p => ({ ...p, contact_email: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
            </div>
            <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Logline</label><Textarea value={form.logline} onChange={e => setForm(p => ({ ...p, logline: e.target.value }))} rows={2} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
            <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Short Synopsis</label><Textarea value={form.synopsis_short} onChange={e => setForm(p => ({ ...p, synopsis_short: e.target.value }))} rows={2} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
            <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Long Synopsis</label><Textarea value={form.synopsis_long} onChange={e => setForm(p => ({ ...p, synopsis_long: e.target.value }))} rows={4} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_public} onChange={e => setForm(p => ({ ...p, is_public: e.target.checked }))} className="w-4 h-4 rounded" style={{ accentColor: '#ffcd57' }} /><span className="text-sm" style={{ color: '#cbd5e1' }}>Public</span></label>
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
            <div className="relative max-w-xs"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748b' }} /><Input placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9', paddingLeft: '2.25rem' }} /></div>
          </div>
          <table className="w-full text-sm">
            <thead><tr style={{ background: '#0a0f14' }}><th className="text-left px-4 py-3 font-medium" style={{ color: '#94a3b8' }}>Title</th><th className="text-left px-4 py-3 font-medium" style={{ color: '#94a3b8' }}>Visibility</th><th className="text-right px-4 py-3 font-medium w-32" style={{ color: '#94a3b8' }}>Actions</th></tr></thead>
            <tbody>
              {isLoading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t" style={{ borderColor: '#1e3040' }}><td colSpan={3} className="px-4 py-3"><div className="h-4 rounded w-full animate-pulse" style={{ background: '#1c2a38' }} /></td></tr>
              )) : items.map((p: any) => (
                <tr key={p.id} className="border-t" style={{ borderColor: '#1e3040' }}>
                  <td className="px-4 py-3"><p className="font-medium text-white">{p.title}</p></td>
                  <td className="px-4 py-3"><span className={cn('px-2.5 py-1 rounded-full text-xs font-medium border', p.is_public ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20')}>{p.is_public ? 'Public' : 'Private'}</span></td>
                  <td className="px-4 py-3 text-right"><div className="flex items-center gap-1 justify-end">
                    <button onClick={() => openEdit(p.id)} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white"><Edit2 size={15} /></button>
                    <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400"><Trash2 size={15} /></button>
                  </div></td>
                </tr>
              ))}
              {items.length === 0 && !isLoading && <tr><td colSpan={3} className="px-4 py-12 text-center" style={{ color: '#64748b' }}>No press kits found</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteMut.mutate(deleteId!)} isLoading={deleteMut.isPending} />
    </div>
  )
}
