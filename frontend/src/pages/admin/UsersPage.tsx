import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUsers, createUser, updateUser, deleteUser, getRoles } from '@/lib/admin-api'
import { Plus, Edit3, Trash2, Shield, User, Lock } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'
import { useAdminStore } from '@/lib/admin-store'

export const UsersPage: React.FC = () => {
  const qc = useQueryClient()
  const { canManage } = useAdminStore()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'editor' })
  const [roles, setRoles] = useState<any[]>([])

  const { data, isLoading } = useQuery({ queryKey: ['admin', 'users'], queryFn: getUsers })
  const createMut = useMutation({ mutationFn: createUser, onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'users'] }); setShowForm(false); resetForm(); toast.success('User created') }, onError: () => toast.error('Failed to create') })
  const updateMut = useMutation({ mutationFn: ({ id, data }: any) => updateUser(id, data), onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'users'] }); setEditing(null); resetForm(); toast.success('User updated') }, onError: () => toast.error('Failed to update') })
  const deleteMut = useMutation({ mutationFn: deleteUser, onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'users'] }); toast.success('User deleted') }, onError: () => toast.error('Failed to delete') })

  const rolesQuery = useQuery({ queryKey: ['admin', 'roles'], queryFn: getRoles })
  useEffect(() => { if (rolesQuery.data) setRoles(rolesQuery.data?.data || rolesQuery.data || []) }, [rolesQuery.data])

  const resetForm = () => setForm({ name: '', email: '', password: '', role: 'editor' })
  const handleSave = () => { if (editing) updateMut.mutate({ id: editing.id, data: form }); else createMut.mutate(form) }
  const openEdit = (u: any) => { setEditing(u); setForm({ name: u.name, email: u.email, password: '', role: u.roles?.[0]?.name || 'editor' }); setShowForm(true) }

  const users = Array.isArray(data) ? data : data?.data || []

  if (!canManage('manage_users')) {
    return <div className="text-center py-12 text-brand-muted text-sm">You don't have permission to manage users.</div>
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-white">Admin Users</h1></div>
        <button onClick={() => { setShowForm(true); setEditing(null); resetForm() }} className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/80 text-white rounded-lg text-sm font-medium">
          <Plus size={16} /> Add User
        </button>
      </div>

      {showForm && (
        <div className="bg-brand-dark border border-brand-surface rounded-xl p-5 space-y-4">
          <h3 className="text-white font-medium">{editing ? 'Edit User' : 'New User'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-xs text-brand-muted mb-1">Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm" /></div>
            <div><label className="block text-xs text-brand-muted mb-1">Email</label><input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm" /></div>
            <div><label className="block text-xs text-brand-muted mb-1">Password {editing ? '(leave blank to keep current)' : ''}</label><input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm" /></div>
            <div><label className="block text-xs text-brand-muted mb-1">Role</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full bg-[#1c2a38] border border-brand-border rounded-lg px-3 py-2 text-white text-sm">
                {roles.map((r: any) => <option key={r.name} value={r.name}>{r.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm">{editing ? 'Update' : 'Create'}</button>
            <button onClick={() => { setShowForm(false); setEditing(null); resetForm() }} className="px-4 py-2 bg-brand-surface text-brand-muted rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-brand-dark border border-brand-surface rounded-xl overflow-hidden">
        <div className="divide-y divide-brand-surface">
          {users.map((u: any) => (
            <div key={u.id} className="flex items-center gap-4 px-5 py-4 hover:bg-brand-surface/30 transition-colors group">
              <div className="w-9 h-9 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-sm">
                {u.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium text-sm truncate">{u.name}</span>
                  <span className="text-xs text-brand-muted">{u.email}</span>
                  {u.roles?.map((r: any) => <span key={r.id} className="px-1.5 py-0.5 rounded text-[10px] bg-brand-primary/20 text-brand-primary">{r.name}</span>)}
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(u)} className="p-1.5 text-brand-muted hover:text-white rounded-lg" title="Edit"><Edit3 size={14} /></button>
                <button onClick={() => { if (confirm('Delete this user?')) deleteMut.mutate(u.id) }} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg" title="Delete"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
          {users.length === 0 && !isLoading && <div className="text-center py-12 text-brand-muted text-sm">No users yet.</div>}
        </div>
      </div>
    </div>
  )
}