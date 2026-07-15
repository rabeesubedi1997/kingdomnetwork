import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAdvertisements, getAdvertisement, createAdvertisement, updateAdvertisement, deleteAdvertisement } from '@/lib/admin-api'
import { motion } from 'framer-motion'
import { Edit2, Trash2, Plus, ImageIcon, Code, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { MediaPicker } from '@/components/admin/MediaPicker'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface MediaItem { id: number; url: string; name: string; is_image: boolean }

const typeOptions = [
  { value: 'image', label: 'Image Banner' },
  { value: 'code', label: 'Custom Code (HTML/JS)' },
]

const positionOptions = [
  { value: 'sidebar', label: 'Sidebar' },
  { value: 'banner_top', label: 'Top Banner' },
  { value: 'banner_bottom', label: 'Bottom Banner' },
  { value: 'between_content', label: 'Between Content' },
  { value: 'popup', label: 'Popup' },
]

export const AdvertisementsPage: React.FC = () => {
  const qc = useQueryClient()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [form, setForm] = useState({ title: '', type: 'image', image_url: '', link_url: '', code: '', position: 'sidebar', sort_order: '0', starts_at: '', ends_at: '', is_active: true })

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'advertisements'],
    queryFn: async () => {
      const res = await getAdvertisements()
      return Array.isArray(res) ? res : res.data || []
    },
  })

  const ads = data || []

  const createMut = useMutation({ mutationFn: createAdvertisement, onSuccess: () => { toast.success('Created'); qc.invalidateQueries({ queryKey: ['admin', 'advertisements'] }); setEditingId(-1); resetForm() }, onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed') })
  const updateMut = useMutation({ mutationFn: ({ id, data }: any) => updateAdvertisement(id, data), onSuccess: () => { toast.success('Updated'); qc.invalidateQueries({ queryKey: ['admin', 'advertisements'] }); setEditingId(null); resetForm() }, onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed') })
  const deleteMut = useMutation({ mutationFn: deleteAdvertisement, onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries({ queryKey: ['admin', 'advertisements'] }); setDeleteId(null) } })

  const resetForm = () => setForm({ title: '', type: 'image', image_url: '', link_url: '', code: '', position: 'sidebar', sort_order: '0', starts_at: '', ends_at: '', is_active: true })

  const openEdit = async (id: number) => {
    setEditingId(id)
    try {
      const r = await getAdvertisement(id)
      const a = r.data || r
      setForm({
        title: a.title || '', type: a.type || 'image', image_url: a.image_url || '', link_url: a.link_url || '',
        code: a.code || '', position: a.position || 'sidebar', sort_order: String(a.sort_order || '0'),
        starts_at: a.starts_at ? a.starts_at.split('T')[0] : '', ends_at: a.ends_at ? a.ends_at.split('T')[0] : '',
        is_active: a.is_active !== false,
      })
    } catch { toast.error('Failed to load') }
  }

  const handleSubmit = () => {
    const payload = { ...form, sort_order: parseInt(form.sort_order) || 0, starts_at: form.starts_at || null, ends_at: form.ends_at || null }
    if (editingId && editingId > 0) updateMut.mutate({ id: editingId, data: payload })
    else createMut.mutate(payload)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-white">Advertisements</h1><p className="text-sm mt-1" style={{ color: '#94a3b8' }}>Manage ad placements across the site</p></div>
        <Button onClick={() => { setEditingId(-1); resetForm() }} style={{ background: '#09333f' }}><Plus size={16} className="mr-1.5" /> Add Ad</Button>
      </div>

      {editingId !== null && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border" style={{ background: '#111820', borderColor: '#1e3040' }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: '#1e3040' }}><h2 className="font-semibold text-white">{editingId === -1 ? 'Create Advertisement' : 'Edit Advertisement'}</h2></div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Title</label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Type</label><Select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} options={typeOptions} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Position</label><Select value={form.position} onChange={e => setForm(p => ({ ...p, position: e.target.value }))} options={positionOptions} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Sort Order</label><Input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Link URL</label><Input value={form.link_url} onChange={e => setForm(p => ({ ...p, link_url: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Start Date</label><Input type="date" value={form.starts_at} onChange={e => setForm(p => ({ ...p, starts_at: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>End Date</label><Input type="date" value={form.ends_at} onChange={e => setForm(p => ({ ...p, ends_at: e.target.value }))} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} /></div>
            </div>
            {form.type === 'image' && (
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Ad Image</label>
                <div className="flex items-start gap-3">
                  {form.image_url && <img src={form.image_url} className="w-32 h-20 object-cover rounded-lg border" style={{ borderColor: '#1e3040' }} />}
                  <div className="space-y-1">
                    <Button size="sm" variant="outline" onClick={() => setPickerOpen(true)} style={{ borderColor: '#1e3040', color: '#cbd5e1' }}>{form.image_url ? 'Change' : 'Select Image'}</Button>
                    {form.image_url && <Button size="sm" variant="ghost" onClick={() => setForm(p => ({ ...p, image_url: '' }))} className="text-red-400 block">Remove</Button>}
                  </div>
                </div>
              </div>
            )}
            {form.type === 'code' && (
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Ad Code (HTML/JS)</label><Textarea value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value }))} rows={4} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9', fontFamily: 'monospace' }} /></div>
            )}
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} className="w-4 h-4 rounded" style={{ accentColor: '#ffcd57' }} /><span className="text-sm" style={{ color: '#cbd5e1' }}>Active</span></label>
            <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: '#1e3040' }}>
              <Button variant="ghost" onClick={() => { setEditingId(null); resetForm() }} className="text-gray-400">Cancel</Button>
              <Button onClick={handleSubmit} loading={createMut.isPending || updateMut.isPending} style={{ background: '#09333f' }}>{editingId === -1 ? 'Create' : 'Update'}</Button>
            </div>
          </div>
        </motion.div>
      )}

      {!editingId && (
        <div className="grid grid-cols-1 gap-3">
          {isLoading ? Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border animate-pulse h-20" style={{ background: '#111820', borderColor: '#1e3040' }} />
          )) : ads.length === 0 ? (
            <div className="text-center py-12 rounded-xl border" style={{ background: '#111820', borderColor: '#1e3040', color: '#64748b' }}>
              <DollarSign size={48} className="mx-auto mb-3 opacity-30" />
              <p>No advertisements yet.</p>
            </div>
          ) : ads.map((ad: any) => (
            <motion.div
              key={ad.id}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-xl border overflow-hidden group"
              style={{ background: '#111820', borderColor: '#1e3040' }}
            >
              <div className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#1c2a38' }}>
                  {ad.type === 'code' ? <Code size={18} className="text-[#ffcd57]" /> : <ImageIcon size={18} className="text-[#ffcd57]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white">{ad.title || 'Untitled'}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs capitalize" style={{ color: '#64748b' }}>{ad.position?.replace(/_/g, ' ')}</span>
                    <span className={cn('px-2 py-0.5 rounded text-[11px] font-medium', ad.is_active ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-500')}>{ad.is_active ? 'Active' : 'Inactive'}</span>
                    <span className="text-xs" style={{ color: '#64748b' }}>{ad.type === 'code' ? 'Custom Code' : 'Image'}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(ad.id)} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white"><Edit2 size={15} /></button>
                  <button onClick={() => setDeleteId(ad.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400"><Trash2 size={15} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={(m: MediaItem) => { setForm(p => ({ ...p, image_url: m.url })); setPickerOpen(false) }} />
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteMut.mutate(deleteId!)} isLoading={deleteMut.isPending} />
    </div>
  )
}
