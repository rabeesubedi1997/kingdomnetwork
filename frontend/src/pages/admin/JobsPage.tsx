import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getJobs, getJob, createJob, updateJob, deleteJob } from '@/lib/admin-api'
import { motion } from 'framer-motion'
import { Edit2, Trash2, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

const typeOptions = [
  { value: 'full_time', label: 'Full Time' }, { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' }, { value: 'internship', label: 'Internship' }, { value: 'freelance', label: 'Freelance' },
]

const typeColors: Record<string, string> = {
  full_time: 'bg-blue-500/10 text-blue-400', part_time: 'bg-purple-500/10 text-purple-400',
  contract: 'bg-amber-500/10 text-amber-400', internship: 'bg-green-500/10 text-green-400',
  freelance: 'bg-cyan-500/10 text-cyan-400',
}

export const JobsPage: React.FC = () => {
  const qc = useQueryClient(); const [page, setPage] = useState(1); const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null); const [deleteId, setDeleteId] = useState<number | null>(null)
  const [form, setForm] = useState({ title: '', slug: '', department: '', type: 'full_time', location: '', description: '', requirements: '', benefits: '', salary_range: '', is_remote: false, is_open: true })

  const { data, isLoading } = useQuery({ queryKey: ['admin', 'jobs', page, search], queryFn: () => getJobs({ page, per_page: 15, search: search || undefined }) })

  const createMut = useMutation({ mutationFn: createJob, onSuccess: () => { toast.success('Created'); qc.invalidateQueries({ queryKey: ['admin', 'jobs'] }); setEditingId(-1); resetForm() }, onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed') })
  const updateMut = useMutation({ mutationFn: ({ id, data }: any) => updateJob(id, data), onSuccess: () => { toast.success('Updated'); qc.invalidateQueries({ queryKey: ['admin', 'jobs'] }); setEditingId(null); resetForm() }, onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed') })
  const deleteMut = useMutation({ mutationFn: deleteJob, onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries({ queryKey: ['admin', 'jobs'] }); setDeleteId(null) } })

  const resetForm = () => setForm({ title: '', slug: '', department: '', type: 'full_time', location: '', description: '', requirements: '', benefits: '', salary_range: '', is_remote: false, is_open: true })

  const openEdit = async (id: number) => {
    setEditingId(id)
    try { const r = await getJob(id); const j = r.data || r; setForm({ title: j.title || '', slug: j.slug || '', department: j.department || '', type: j.type || 'full_time', location: j.location || '', description: j.description || '', requirements: j.requirements || '', benefits: j.benefits || '', salary_range: j.salary_range || '', is_remote: j.is_remote || false, is_open: j.is_open !== false }) }
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
        <div><h1 className="text-xl font-bold text-white">Jobs</h1><p className="text-sm mt-1" style={{ color: '#94a3b8' }}>Manage career listings</p></div>
        <Button onClick={() => { setEditingId(-1); resetForm() }} style={{ background: '#09333f' }}><Plus size={16} className="mr-1.5" /> Add Job</Button>
      </div>

      {editingId !== null && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border" style={{ background: '#111820', borderColor: '#1e3040' }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: '#1e3040' }}><h2 className="font-semibold text-white">{editingId === -1 ? 'Create Job' : 'Edit Job'}</h2></div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Title *</label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Slug</label><Input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Department</label><Input value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Type</label><Select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} options={typeOptions} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Location</label><Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Salary Range</label><Input value={form.salary_range} onChange={e => setForm(p => ({ ...p, salary_range: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
            </div>
            <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Description</label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
            <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Requirements</label><Textarea value={form.requirements} onChange={e => setForm(p => ({ ...p, requirements: e.target.value }))} rows={3} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
            <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Benefits</label><Textarea value={form.benefits} onChange={e => setForm(p => ({ ...p, benefits: e.target.value }))} rows={2} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
            <div className="flex items-center gap-5">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_remote} onChange={e => setForm(p => ({ ...p, is_remote: e.target.checked }))} className="w-4 h-4 rounded" style={{ accentColor: '#ffcd57' }} /><span className="text-sm" style={{ color: '#cbd5e1' }}>Remote</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_open} onChange={e => setForm(p => ({ ...p, is_open: e.target.checked }))} className="w-4 h-4 rounded" style={{ accentColor: '#ffcd57' }} /><span className="text-sm" style={{ color: '#cbd5e1' }}>Open</span></label>
            </div>
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
            <div className="relative max-w-xs"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748b' }} /><Input placeholder="Search jobs..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9', paddingLeft: '2.25rem' }} /></div>
          </div>
          <table className="w-full text-sm">
            <thead><tr style={{ background: '#0a0f14' }}><th className="text-left px-4 py-3 font-medium" style={{ color: '#94a3b8' }}>Title</th><th className="text-left px-4 py-3 font-medium" style={{ color: '#94a3b8' }}>Department</th><th className="text-left px-4 py-3 font-medium" style={{ color: '#94a3b8' }}>Type</th><th className="text-left px-4 py-3 font-medium" style={{ color: '#94a3b8' }}>Status</th><th className="text-right px-4 py-3 font-medium w-32" style={{ color: '#94a3b8' }}>Actions</th></tr></thead>
            <tbody>
              {isLoading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t" style={{ borderColor: '#1e3040' }}><td colSpan={5} className="px-4 py-3"><div className="h-4 rounded w-full animate-pulse" style={{ background: '#1c2a38' }} /></td></tr>
              )) : items.map((j: any) => (
                <tr key={j.id} className="border-t" style={{ borderColor: '#1e3040' }}>
                  <td className="px-4 py-3"><p className="font-medium text-white">{j.title}</p></td>
                  <td className="px-4 py-3" style={{ color: '#94a3b8' }}>{j.department || '-'}</td>
                  <td className="px-4 py-3"><span className={cn('px-2.5 py-1 rounded-full text-xs font-medium border', typeColors[j.type] || '')}>{(j.type || '').replace(/_/g, ' ')}</span></td>
                  <td className="px-4 py-3"><span className={cn('px-2.5 py-1 rounded-full text-xs font-medium border', j.is_open ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20')}>{j.is_open ? 'Open' : 'Closed'}</span></td>
                  <td className="px-4 py-3 text-right"><div className="flex items-center gap-1 justify-end">
                    <button onClick={() => openEdit(j.id)} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white"><Edit2 size={15} /></button>
                    <button onClick={() => setDeleteId(j.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400"><Trash2 size={15} /></button>
                  </div></td>
                </tr>
              ))}
              {items.length === 0 && !isLoading && <tr><td colSpan={5} className="px-4 py-12 text-center" style={{ color: '#64748b' }}>No jobs found</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteMut.mutate(deleteId!)} isLoading={deleteMut.isPending} />
    </div>
  )
}
