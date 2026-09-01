import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTeamMembers, getTeamMember, createTeamMember, updateTeamMember, deleteTeamMember } from '@/lib/admin-api'
import { motion } from 'framer-motion'
import { Edit2, Trash2, Plus, Search, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { MediaPicker } from '@/components/admin/MediaPicker'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface MediaItem { id: number; url: string; name: string }

export const TeamPage: React.FC = () => {
  const qc = useQueryClient(); const [page, setPage] = useState(1); const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null); const [deleteId, setDeleteId] = useState<number | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [form, setForm] = useState({ name: '', role: '', bio: '', photo_id: null as number | null, photo_url: '', email: '', phone: '', birth_date: '', birth_place: '', imdb_url: '', instagram_url: '', twitter_url: '', linkedin_url: '', website_url: '', social_links: {} as Record<string, string>, sort_order: '0', is_active: true })

  const { data, isLoading } = useQuery({ queryKey: ['admin', 'team', page, search], queryFn: () => getTeamMembers({ page, per_page: 15, search: search || undefined }) })
  const createMut = useMutation({ mutationFn: createTeamMember, onSuccess: () => { toast.success('Created'); qc.invalidateQueries({ queryKey: ['admin', 'team'] }); setEditingId(-1); resetForm() }, onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed') })
  const updateMut = useMutation({ mutationFn: ({ id, data }: any) => updateTeamMember(id, data), onSuccess: () => { toast.success('Updated'); qc.invalidateQueries({ queryKey: ['admin', 'team'] }); setEditingId(null); resetForm() }, onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed') })
  const deleteMut = useMutation({ mutationFn: deleteTeamMember, onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries({ queryKey: ['admin', 'team'] }); setDeleteId(null) } })

  const resetForm = () => setForm({ name: '', role: '', bio: '', photo_id: null, photo_url: '', email: '', phone: '', birth_date: '', birth_place: '', imdb_url: '', instagram_url: '', twitter_url: '', linkedin_url: '', website_url: '', social_links: {}, sort_order: '0', is_active: true })

  const openEdit = async (id: number) => {
    setEditingId(id)
    try {
      const r = await getTeamMember(id); const t = r.data || r
      setForm({
        name: t.name || '', role: t.role || '', bio: t.bio || '',
        photo_id: t.photo_id || null, photo_url: t.photo_url || '',
        email: t.email || '', phone: t.phone || '',
        birth_date: t.birth_date || '', birth_place: t.birth_place || '',
        imdb_url: t.imdb_url || '', instagram_url: t.instagram_url || '',
        twitter_url: t.twitter_url || '', linkedin_url: t.linkedin_url || '',
        website_url: t.website_url || '',
        social_links: t.social_links || {},
        sort_order: String(t.sort_order || '0'), is_active: t.is_active !== false,
      })
    }
    catch { toast.error('Failed to load') }
  }

  const handleSubmit = () => {
    const { photo_url, social_links, ...rest } = form
    const sanitizedSocial = Object.fromEntries(Object.entries(social_links).filter(([, v]) => v))
    const payload = { ...rest, social_links: Object.keys(sanitizedSocial).length ? sanitizedSocial : null, sort_order: parseInt(form.sort_order) || 0 }
    if (editingId && editingId > 0) updateMut.mutate({ id: editingId, data: payload })
    else createMut.mutate(payload as any)
  }

  const items = data?.data || []

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-white">Team Members</h1><p className="text-sm mt-1" style={{ color: '#94a3b8' }}>Manage your leadership team</p></div>
        <Button onClick={() => { setEditingId(-1); resetForm() }} style={{ background: '#09333f' }}><Plus size={16} className="mr-1.5" /> Add Member</Button>
      </div>

      {editingId !== null && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border" style={{ background: '#111820', borderColor: '#1e3040' }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: '#1e3040' }}><h2 className="font-semibold text-white">{editingId === -1 ? 'Add Member' : 'Edit Member'}</h2></div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Name *</label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Role *</label><Input value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Email</label><Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Phone</label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Birth Date</label><Input type="date" value={form.birth_date} onChange={e => setForm(p => ({ ...p, birth_date: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Birth Place</label><Input value={form.birth_place} onChange={e => setForm(p => ({ ...p, birth_place: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>IMDb URL</label><Input value={form.imdb_url} onChange={e => setForm(p => ({ ...p, imdb_url: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} placeholder="https://imdb.com/name/..." /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Sort Order</label><Input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
            </div>
            <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Bio</label><Textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={3} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Website URL</label><Input value={form.website_url} onChange={e => setForm(p => ({ ...p, website_url: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} placeholder="https://..." /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>LinkedIn URL</label><Input value={form.linkedin_url} onChange={e => setForm(p => ({ ...p, linkedin_url: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} placeholder="https://linkedin.com/in/..." /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Twitter URL</label><Input value={form.twitter_url} onChange={e => setForm(p => ({ ...p, twitter_url: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} placeholder="https://twitter.com/..." /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Instagram URL</label><Input value={form.instagram_url} onChange={e => setForm(p => ({ ...p, instagram_url: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} placeholder="https://instagram.com/..." /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Facebook URL</label><Input value={form.social_links?.facebook || ''} onChange={e => setForm(p => ({ ...p, social_links: { ...p.social_links, facebook: e.target.value } }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} placeholder="https://facebook.com/..." /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>YouTube URL</label><Input value={form.social_links?.youtube || ''} onChange={e => setForm(p => ({ ...p, social_links: { ...p.social_links, youtube: e.target.value } }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} placeholder="https://youtube.com/@..." /></div>
            </div>
            <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Photo</label>
              <div className="flex items-start gap-3">
                {form.photo_url && <img src={form.photo_url} className="w-16 h-16 rounded-full object-cover border" style={{ borderColor: '#1e3040' }} />}
                <Button size="sm" variant="outline" onClick={() => setPickerOpen(true)} style={{ borderColor: '#1e3040', color: '#cbd5e1' }}>{form.photo_url ? 'Change' : 'Select Photo'}</Button>
                {form.photo_url && <Button size="sm" variant="ghost" onClick={() => setForm(p => ({ ...p, photo_id: null, photo_url: '' }))} className="text-red-400">Remove</Button>}
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
        <>
          <div className="relative max-w-xs"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748b' }} /><Input placeholder="Search team..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9', paddingLeft: '2.25rem' }} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border p-5 animate-pulse flex items-start gap-4" style={{ background: '#111820', borderColor: '#1e3040' }}>
                <div className="w-14 h-14 rounded-full flex-shrink-0" style={{ background: '#1c2a38' }} />
                <div className="flex-1"><div className="h-4 rounded w-2/3" style={{ background: '#1c2a38' }} /><div className="h-3 rounded w-1/2 mt-2" style={{ background: '#1c2a38' }} /></div>
              </div>
            )) : items.map((t: any) => (
              <motion.div key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border p-5 flex items-start gap-4 group" style={{ background: '#111820', borderColor: '#1e3040' }}>
                <div className="w-14 h-14 rounded-full flex-shrink-0 overflow-hidden" style={{ background: 'linear-gradient(135deg,#09333f,#0d4555)' }}>
                  {t.photo_url ? <img src={t.photo_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">{t.name?.charAt(0)}</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white">{t.name}</h3>
                  <p className="text-sm" style={{ color: '#94a3b8' }}>{t.role}</p>
                  {t.bio && <p className="text-xs mt-1 line-clamp-2" style={{ color: '#64748b' }}>{t.bio}</p>}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(t.id)} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white"><Edit2 size={14} /></button>
                  <button onClick={() => setDeleteId(t.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              </motion.div>
            ))}
            {items.length === 0 && !isLoading && <div className="col-span-full text-center py-12" style={{ color: '#64748b' }}>No team members found</div>}
          </div>
        </>
      )}

      <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={(m: MediaItem) => { setForm(p => ({ ...p, photo_id: m.id, photo_url: m.url })); setPickerOpen(false) }} />
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteMut.mutate(deleteId!)} isLoading={deleteMut.isPending} />
    </div>
  )
}
