import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPartners, createPartner, updatePartner, deletePartner } from '@/lib/admin-api'
import { Plus, Edit3, Trash2, ExternalLink, Image } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

export const PartnersPage: React.FC = () => {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: '', logo_url: '', website_url: '', category: 'partner', is_active: true })

  const { data, isLoading } = useQuery({ queryKey: ['admin', 'partners'], queryFn: getPartners })
  const createMut = useMutation({ mutationFn: createPartner, onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'partners'] }); setShowForm(false); resetForm(); toast.success('Partner created') }, onError: () => toast.error('Failed to create') })
  const updateMut = useMutation({ mutationFn: ({ id, data }: any) => updatePartner(id, data), onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'partners'] }); setEditing(null); resetForm(); toast.success('Partner updated') }, onError: () => toast.error('Failed to update') })
  const deleteMut = useMutation({ mutationFn: deletePartner, onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'partners'] }); toast.success('Partner deleted') }, onError: () => toast.error('Failed to delete') })

  const resetForm = () => setForm({ name: '', logo_url: '', website_url: '', category: 'partner', is_active: true })
  const handleSave = () => { if (editing) updateMut.mutate({ id: editing.id, data: form }); else createMut.mutate(form) }
  const openEdit = (p: any) => { setEditing(p); setForm(p); setShowForm(true) }

  const partners = Array.isArray(data) ? data : []

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-white">Partners & Sponsors</h1></div>
        <button onClick={() => { setShowForm(true); setEditing(null); resetForm() }} className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/80 text-white rounded-lg text-sm font-medium">
          <Plus size={16} /> Add Partner
        </button>
      </div>

      {showForm && (
        <div className="bg-brand-dark border border-brand-surface rounded-xl p-5 space-y-4">
          <h3 className="text-white font-medium">{editing ? 'Edit Partner' : 'New Partner'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-xs text-brand-muted mb-1">Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm" /></div>
            <div><label className="block text-xs text-brand-muted mb-1">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm">
                <option value="partner">Partner</option>
                <option value="sponsor">Sponsor</option>
                <option value="media">Media Partner</option>
                <option value="festival">Festival</option>
              </select>
            </div>
            <div><label className="block text-xs text-brand-muted mb-1">Logo URL</label><input value={form.logo_url} onChange={e => setForm({ ...form, logo_url: e.target.value })} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm" /></div>
            <div><label className="block text-xs text-brand-muted mb-1">Website URL</label><input value={form.website_url} onChange={e => setForm({ ...form, website_url: e.target.value })} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm" /></div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-brand-muted"><input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="rounded bg-[#1c2a38]" /> Active</label>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm">{editing ? 'Update' : 'Create'}</button>
            <button onClick={() => { setShowForm(false); setEditing(null); resetForm() }} className="px-4 py-2 bg-brand-surface text-brand-muted rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-brand-dark border border-brand-surface rounded-xl overflow-hidden">
        <div className="divide-y divide-brand-surface">
          {partners.map((p: any) => (
            <div key={p.id} className="flex items-center gap-4 px-5 py-4 hover:bg-brand-surface/30 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-brand-surface flex items-center justify-center overflow-hidden shrink-0">
                {p.logo_url ? <img src={p.logo_url} alt={p.name} className="w-full h-full object-contain p-1" /> : <Image size={20} className="text-brand-muted" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium text-sm">{p.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-primary/20 text-brand-primary">{p.category}</span>
                  <span className={cn('text-[10px] px-1.5 py-0.5 rounded', p.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400')}>{p.is_active ? 'Active' : 'Inactive'}</span>
                </div>
                {p.website_url && <a href={p.website_url} target="_blank" className="text-xs text-brand-muted hover:text-brand-primary flex items-center gap-1 mt-0.5">{p.website_url} <ExternalLink size={10} /></a>}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(p)} className="p-1.5 text-brand-muted hover:text-white rounded-lg"><Edit3 size={14} /></button>
                <button onClick={() => { if (confirm('Delete?')) deleteMut.mutate(p.id) }} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
          {partners.length === 0 && !isLoading && <div className="text-center py-12 text-brand-muted text-sm">No partners yet.</div>}
        </div>
      </div>
    </div>
  )
}
