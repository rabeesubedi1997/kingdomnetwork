import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getGenres, createGenre, updateGenre, deleteGenre } from '@/lib/admin-api'
import { AdminTable, type Column } from '@/components/admin/AdminTable'
import { AdminModal } from '@/components/admin/AdminModal'
import { AdminForm } from '@/components/admin/AdminForm'
import { Button } from '@/components/ui/Button'
import { Edit2, Trash2, Plus } from 'lucide-react'
import { toast } from 'react-hot-toast'
import type { Genre } from '@/types'

interface GenreForm {
  name: string
  slug: string
  description: string
  color: string
}

export const GenresPage: React.FC = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Genre | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'genres', page, search],
    queryFn: () => getGenres({ page, per_page: 15, search: search || undefined }),
  })

  const createMutation = useMutation({
    mutationFn: createGenre,
    onSuccess: () => {
      toast.success('Genre created')
      queryClient.invalidateQueries({ queryKey: ['admin', 'genres'] })
      setModalOpen(false)
    },
    onError: () => toast.error('Failed to create genre'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => updateGenre(id, data),
    onSuccess: () => {
      toast.success('Genre updated')
      queryClient.invalidateQueries({ queryKey: ['admin', 'genres'] })
      setModalOpen(false)
      setEditing(null)
    },
    onError: () => toast.error('Failed to update genre'),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteGenre,
    onSuccess: () => {
      toast.success('Genre deleted')
      queryClient.invalidateQueries({ queryKey: ['admin', 'genres'] })
    },
    onError: () => toast.error('Failed to delete genre'),
  })

  const handleSubmit = async (formData: GenreForm) => {
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: formData as unknown as Record<string, unknown> })
    } else {
      createMutation.mutate(formData as unknown as Record<string, unknown>)
    }
  }

  const columns: Column<Genre>[] = [
    { key: 'id', label: 'ID', sortable: true, className: 'w-16' },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'slug', label: 'Slug', sortable: true },
    { key: 'description', label: 'Description', render: (g) => g.description || '-' },
    { key: 'color', label: 'Color', render: (g) => g.color ? (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: g.color }} />
        <span className="text-xs text-brand-muted">{g.color}</span>
      </div>
    ) : '-' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-brand-text">Genres</h1>
          <p className="text-brand-muted text-sm mt-1">Manage film genres</p>
        </div>
        <Button onClick={() => { setEditing(null); setModalOpen(true) }}>
          <Plus size={18} className="mr-1.5" />
          Add Genre
        </Button>
      </div>

      <AdminTable
        columns={columns}
        data={data?.data || []}
        keyExtractor={(g) => g.id}
        isLoading={isLoading}
        currentPage={data?.current_page || page}
        lastPage={data?.last_page || 1}
        total={data?.total || 0}
        onPageChange={setPage}
        onSearch={(val) => { setSearch(val); setPage(1) }}
        searchPlaceholder="Search genres..."
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
        title={editing ? 'Edit Genre' : 'Add Genre'}
      >
        <AdminForm
          fields={[
            { name: 'name', label: 'Name', rules: { required: 'Name is required' } },
            { name: 'slug', label: 'Slug', rules: { required: 'Slug is required' } },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'color', label: 'Color (hex)', placeholder: '#09333f' },
          ]}
          onSubmit={handleSubmit}
          defaultValues={editing ? {
            name: editing.name,
            slug: editing.slug,
            description: editing.description || '',
            color: editing.color || '',
          } : undefined}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          submitLabel={editing ? 'Update Genre' : 'Add Genre'}
        />
      </AdminModal>
    </div>
  )
}
