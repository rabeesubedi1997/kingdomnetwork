import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPeople, createPerson, updatePerson, deletePerson } from '@/lib/admin-api'
import { AdminTable, type Column } from '@/components/admin/AdminTable'
import { AdminModal } from '@/components/admin/AdminModal'
import { AdminForm } from '@/components/admin/AdminForm'
import { Button } from '@/components/ui/Button'
import { Edit2, Trash2, Plus } from 'lucide-react'
import { toast } from 'react-hot-toast'
import type { Person } from '@/types'

interface PersonForm {
  name: string
  slug: string
  role: string
  bio: string
  photo_url: string
  is_active: string
}

export const PeoplePage: React.FC = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Person | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'people', page, search],
    queryFn: () => getPeople({ page, per_page: 15, search: search || undefined }),
  })

  const createMutation = useMutation({
    mutationFn: createPerson,
    onSuccess: () => {
      toast.success('Person created')
      queryClient.invalidateQueries({ queryKey: ['admin', 'people'] })
      setModalOpen(false)
    },
    onError: () => toast.error('Failed to create person'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => updatePerson(id, data),
    onSuccess: () => {
      toast.success('Person updated')
      queryClient.invalidateQueries({ queryKey: ['admin', 'people'] })
      setModalOpen(false)
      setEditing(null)
    },
    onError: () => toast.error('Failed to update person'),
  })

  const deleteMutation = useMutation({
    mutationFn: deletePerson,
    onSuccess: () => {
      toast.success('Person deleted')
      queryClient.invalidateQueries({ queryKey: ['admin', 'people'] })
    },
    onError: () => toast.error('Failed to delete person'),
  })

  const handleSubmit = async (formData: PersonForm) => {
    const payload = { ...formData, is_active: formData.is_active === 'true' }
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: payload as unknown as Record<string, unknown> })
    } else {
      createMutation.mutate(payload as unknown as Record<string, unknown>)
    }
  }

  const columns: Column<Person>[] = [
    { key: 'id', label: 'ID', sortable: true, className: 'w-16' },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'role', label: 'Role', sortable: true, render: (p) => p.role || '-' },
    { key: 'is_active', label: 'Active', render: (p) => (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
        {p.is_active ? 'Active' : 'Inactive'}
      </span>
    )},
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-brand-text">People</h1>
          <p className="text-brand-muted text-sm mt-1">Manage cast and crew</p>
        </div>
        <Button onClick={() => { setEditing(null); setModalOpen(true) }}>
          <Plus size={18} className="mr-1.5" />
          Add Person
        </Button>
      </div>

      <AdminTable
        columns={columns}
        data={data?.data || []}
        keyExtractor={(p) => p.id}
        isLoading={isLoading}
        currentPage={data?.current_page || page}
        lastPage={data?.last_page || 1}
        total={data?.total || 0}
        onPageChange={setPage}
        onSearch={(val) => { setSearch(val); setPage(1) }}
        searchPlaceholder="Search people..."
        actions={(item) => (
          <div className="flex items-center gap-1 justify-end">
            <button onClick={() => { setEditing(item); setModalOpen(true) }} className="p-1.5 rounded-lg hover:bg-brand-primary/10 text-brand-muted hover:text-brand-primary transition-colors"><Edit2 size={16} /></button>
            <button onClick={() => { if (window.confirm(`Delete "${item.name}"?`)) deleteMutation.mutate(item.id) }} className="p-1.5 rounded-lg hover:bg-red-50 text-brand-muted hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
          </div>
        )}
      />

      <AdminModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        title={editing ? 'Edit Person' : 'Add Person'}
        size="lg"
      >
        <AdminForm
          fields={[
            { name: 'name', label: 'Name', rules: { required: 'Name is required' } },
            { name: 'slug', label: 'Slug', rules: { required: 'Slug is required' } },
            { name: 'role', label: 'Role' },
            { name: 'bio', label: 'Bio', type: 'textarea' },
            { name: 'photo_url', label: 'Photo URL', type: 'url' },
            { name: 'is_active', label: 'Status', type: 'select', options: [{ value: 'true', label: 'Active' }, { value: 'false', label: 'Inactive' }] },
          ]}
          onSubmit={handleSubmit}
          defaultValues={editing ? {
            name: editing.name,
            slug: editing.slug,
            role: editing.role || '',
            bio: editing.bio || '',
            photo_url: editing.photo_url || '',
            is_active: editing.is_active ? 'true' : 'false',
          } : { is_active: 'true' }}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          submitLabel={editing ? 'Update Person' : 'Add Person'}
        />
      </AdminModal>
    </div>
  )
}
