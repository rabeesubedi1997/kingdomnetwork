import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPressKits, createPressKit, updatePressKit, deletePressKit } from '@/lib/admin-api'
import { AdminTable, type Column } from '@/components/admin/AdminTable'
import { AdminModal } from '@/components/admin/AdminModal'
import { AdminForm } from '@/components/admin/AdminForm'
import { Button } from '@/components/ui/Button'
import { Edit2, Trash2, Plus } from 'lucide-react'
import { toast } from 'react-hot-toast'
import type { PressKit } from '@/types'

interface PressKitForm {
  title: string
  slug: string
  logline: string
  contact_email: string
  is_public: string
}

export const PressKitsPage: React.FC = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<PressKit | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'press-kits', page, search],
    queryFn: () => getPressKits({ page, per_page: 15, search: search || undefined }),
  })

  const createMutation = useMutation({
    mutationFn: createPressKit,
    onSuccess: () => {
      toast.success('Press kit created')
      queryClient.invalidateQueries({ queryKey: ['admin', 'press-kits'] })
      setModalOpen(false)
    },
    onError: () => toast.error('Failed to create press kit'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => updatePressKit(id, data),
    onSuccess: () => {
      toast.success('Press kit updated')
      queryClient.invalidateQueries({ queryKey: ['admin', 'press-kits'] })
      setModalOpen(false)
      setEditing(null)
    },
    onError: () => toast.error('Failed to update press kit'),
  })

  const deleteMutation = useMutation({
    mutationFn: deletePressKit,
    onSuccess: () => {
      toast.success('Press kit deleted')
      queryClient.invalidateQueries({ queryKey: ['admin', 'press-kits'] })
    },
    onError: () => toast.error('Failed to delete press kit'),
  })

  const handleSubmit = async (formData: PressKitForm) => {
    const payload = { ...formData, is_public: formData.is_public === 'true' }
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: payload as unknown as Record<string, unknown> })
    } else {
      createMutation.mutate(payload as unknown as Record<string, unknown>)
    }
  }

  const columns: Column<PressKit>[] = [
    { key: 'id', label: 'ID', sortable: true, className: 'w-16' },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'logline', label: 'Logline', render: (p) => p.logline || '-' },
    { key: 'is_public', label: 'Visibility', render: (p) => (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.is_public ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
        {p.is_public ? 'Public' : 'Private'}
      </span>
    )},
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-brand-text">Press Kits</h1>
          <p className="text-brand-muted text-sm mt-1">Manage press kits</p>
        </div>
        <Button onClick={() => { setEditing(null); setModalOpen(true) }}>
          <Plus size={18} className="mr-1.5" />
          Add Press Kit
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
        searchPlaceholder="Search press kits..."
        actions={(item) => (
          <div className="flex items-center gap-1 justify-end">
            <button onClick={() => { setEditing(item); setModalOpen(true) }} className="p-1.5 rounded-lg hover:bg-brand-primary/10 text-brand-muted hover:text-brand-primary transition-colors"><Edit2 size={16} /></button>
            <button onClick={() => { if (window.confirm(`Delete "${item.title}"?`)) deleteMutation.mutate(item.id) }} className="p-1.5 rounded-lg hover:bg-red-50 text-brand-muted hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
          </div>
        )}
      />

      <AdminModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        title={editing ? 'Edit Press Kit' : 'Create Press Kit'}
        size="lg"
      >
        <AdminForm
          fields={[
            { name: 'title', label: 'Title', rules: { required: 'Title is required' } },
            { name: 'slug', label: 'Slug', rules: { required: 'Slug is required' } },
            { name: 'logline', label: 'Logline', type: 'textarea' },
            { name: 'contact_email', label: 'Contact Email', type: 'email' },
            { name: 'is_public', label: 'Visibility', type: 'select', options: [{ value: 'true', label: 'Public' }, { value: 'false', label: 'Private' }] },
          ]}
          onSubmit={handleSubmit}
          defaultValues={editing ? {
            title: editing.title,
            slug: editing.slug,
            logline: editing.logline || '',
            contact_email: editing.contact_email || '',
            is_public: editing.is_public ? 'true' : 'false',
          } : { is_public: 'true' }}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          submitLabel={editing ? 'Update Press Kit' : 'Create Press Kit'}
        />
      </AdminModal>
    </div>
  )
}
