import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '@/lib/admin-api'
import { Plus, Edit3, Trash2, Star, Quote } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

export const TestimonialsPage: React.FC = () => {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: '', position: '', company: '', content: '', photo_url: '', rating: 5, is_active: true })

  const { data, isLoading } = useQuery({ queryKey: ['admin', 'testimonials'], queryFn: getTestimonials })
  const createMut = useMutation({ mutationFn: createTestimonial, onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'testimonials'] }); setShowForm(false); resetForm(); toast.success('Testimonial created') }, onError: () => toast.error('Failed to create') })
  const updateMut = useMutation({ mutationFn: ({ id, data }: any) => updateTestimonial(id, data), onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'testimonials'] }); setEditing(null); resetForm(); toast.success('Testimonial updated') }, onError: () => toast.error('Failed to update') })
  const deleteMut = useMutation({ mutationFn: deleteTestimonial, onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'testimonials'] }); toast.success('Testimonial deleted') }, onError: () => toast.error('Failed to delete') })

  const resetForm = () => setForm({ name: '', position: '', company: '', content: '', photo_url: '', rating: 5, is_active: true })
  const handleSave = () => { if (editing) updateMut.mutate({ id: editing.id, data: form }); else createMut.mutate(form) }
  const openEdit = (t: any) => { setEditing(t); setForm(t); setShowForm(true) }

  const testimonials = Array.isArray(data) ? data : []

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-white">Testimonials</h1></div>
        <button onClick={() => { setShowForm(true); setEditing(null); resetForm() }} className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/80 text-white rounded-lg text-sm font-medium">
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {showForm && (
        <div className="bg-brand-dark border border-brand-surface rounded-xl p-5 space-y-4">
          <h3 className="text-white font-medium">{editing ? 'Edit Testimonial' : 'New Testimonial'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-xs text-brand-muted mb-1">Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm" /></div>
            <div><label className="block text-xs text-brand-muted mb-1">Position</label><input value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm" /></div>
            <div><label className="block text-xs text-brand-muted mb-1">Company</label><input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm" /></div>
          </div>
          <div><label className="block text-xs text-brand-muted mb-1">Content</label><textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={4} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm" /></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-xs text-brand-muted mb-1">Photo URL</label><input value={form.photo_url} onChange={e => setForm({ ...form, photo_url: e.target.value })} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm" /></div>
            <div><label className="block text-xs text-brand-muted mb-1">Rating (1-5)</label>
              <div className="flex gap-1 mt-1">
                {[1,2,3,4,5].map(n => <button key={n} onClick={() => setForm({ ...form, rating: n })} className={cn('p-1 rounded', n <= form.rating ? 'text-yellow-400' : 'text-gray-600')}><Star size={20} fill={n <= form.rating ? 'currentColor' : 'none'} /></button>)}
              </div>
            </div>
            <div className="flex items-end pb-2"><label className="flex items-center gap-2 text-sm text-brand-muted"><input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="rounded bg-[#1c2a38]" /> Active</label></div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm">{editing ? 'Update' : 'Create'}</button>
            <button onClick={() => { setShowForm(false); setEditing(null); resetForm() }} className="px-4 py-2 bg-brand-surface text-brand-muted rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((t: any) => (
          <div key={t.id} className="bg-brand-dark border border-brand-surface rounded-xl p-5 hover:border-brand-primary/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                {t.photo_url ? <img src={t.photo_url} className="w-full h-full object-cover" /> : <Quote size={20} className="text-brand-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-white text-sm">{t.name}</span>
                    {t.position && <span className="text-brand-muted text-xs ml-2">{t.position}{t.company ? ` at ${t.company}` : ''}</span>}
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(t)} className="p-1.5 text-brand-muted hover:text-white rounded-lg"><Edit3 size={14} /></button>
                    <button onClick={() => { if (confirm('Delete?')) deleteMut.mutate(t.id) }} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div className="flex gap-0.5 my-1">{Array.from({ length: t.rating || 5 }).map((_, i) => <Star key={i} size={12} className="text-yellow-400" fill="currentColor" />)}</div>
                <p className="text-brand-muted text-sm mt-1 line-clamp-3">{t.content}</p>
                <span className={cn('text-[10px] px-1.5 py-0.5 rounded mt-2 inline-block', t.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400')}>{t.is_active ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && !isLoading && <div className="col-span-2 text-center py-12 text-brand-muted text-sm">No testimonials yet.</div>}
      </div>
    </div>
  )
}
