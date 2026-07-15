import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getJobs, createJob, updateJob, deleteJob } from '@/lib/admin-api'
import { AdminTable, type Column } from '@/components/admin/AdminTable'
import { AdminModal } from '@/components/admin/AdminModal'
import { AdminForm } from '@/components/admin/AdminForm'
import { Button } from '@/components/ui/Button'
import { Edit2, Trash2, Plus } from 'lucide-react'
import { toast } from 'react-hot-toast'
import type { Job } from '@/types'

interface JobForm {
  title: string
  slug: string
  department: string
  type: string
  location: string
  description: string
  requirements: string
  is_open: string
}

const typeOptions = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'freelance', label: 'Freelance' },
]

export const JobsPage: React.FC = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Job | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'jobs', page, search],
    queryFn: () => getJobs({ page, per_page: 15, search: search || undefined }),
  })

  const createMutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      toast.success('Job created')
      queryClient.invalidateQueries({ queryKey: ['admin', 'jobs'] })
      setModalOpen(false)
    },
    onError: () => toast.error('Failed to create job'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => updateJob(id, data),
    onSuccess: () => {
      toast.success('Job updated')
      queryClient.invalidateQueries({ queryKey: ['admin', 'jobs'] })
      setModalOpen(false)
      setEditing(null)
    },
    onError: () => toast.error('Failed to update job'),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      toast.success('Job deleted')
      queryClient.invalidateQueries({ queryKey: ['admin', 'jobs'] })
    },
    onError: () => toast.error('Failed to delete job'),
  })

  const handleSubmit = async (formData: JobForm) => {
    const payload = { ...formData, is_open: formData.is_open === 'true' }
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: payload as unknown as Record<string, unknown> })
    } else {
      createMutation.mutate(payload as unknown as Record<string, unknown>)
    }
  }

  const columns: Column<Job>[] = [
    { key: 'id', label: 'ID', sortable: true, className: 'w-16' },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'type', label: 'Type', sortable: true, render: (j) => (
      <span className="capitalize">{j.type.replace('_', ' ')}</span>
    )},
    { key: 'location', label: 'Location', sortable: true },
    { key: 'is_open', label: 'Status', sortable: true, render: (j) => (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${j.is_open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {j.is_open ? 'Open' : 'Closed'}
      </span>
    )},
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-brand-text">Jobs</h1>
          <p className="text-brand-muted text-sm mt-1">Manage career listings</p>
        </div>
        <Button onClick={() => { setEditing(null); setModalOpen(true) }}>
          <Plus size={18} className="mr-1.5" />
          Add Job
        </Button>
      </div>

      <AdminTable
        columns={columns}
        data={data?.data || []}
        keyExtractor={(j) => j.id}
        isLoading={isLoading}
        currentPage={data?.current_page || page}
        lastPage={data?.last_page || 1}
        total={data?.total || 0}
        onPageChange={setPage}
        onSearch={(val) => { setSearch(val); setPage(1) }}
        searchPlaceholder="Search jobs..."
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
        title={editing ? 'Edit Job' : 'Create Job'}
        size="lg"
      >
        <AdminForm
          fields={[
            { name: 'title', label: 'Title', rules: { required: 'Title is required' } },
            { name: 'slug', label: 'Slug', rules: { required: 'Slug is required' } },
            { name: 'department', label: 'Department', rules: { required: 'Department is required' } },
            { name: 'type', label: 'Type', type: 'select', options: typeOptions, rules: { required: 'Type is required' } },
            { name: 'location', label: 'Location' },
            { name: 'is_open', label: 'Status', type: 'select', options: [{ value: 'true', label: 'Open' }, { value: 'false', label: 'Closed' }] },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'requirements', label: 'Requirements', type: 'textarea' },
          ]}
          onSubmit={handleSubmit}
          defaultValues={editing ? {
            title: editing.title,
            slug: editing.slug,
            department: editing.department,
            type: editing.type,
            location: editing.location || '',
            is_open: editing.is_open ? 'true' : 'false',
            description: editing.description || '',
            requirements: editing.requirements || '',
          } : { type: 'full_time', is_open: 'true' }}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          submitLabel={editing ? 'Update Job' : 'Create Job'}
        />
      </AdminModal>
    </div>
  )
}
