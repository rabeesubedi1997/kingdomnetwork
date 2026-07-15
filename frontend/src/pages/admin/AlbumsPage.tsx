import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAlbums, createAlbum, updateAlbum, deleteAlbum } from '@/lib/admin-api'
import { AdminTable, type Column } from '@/components/admin/AdminTable'
import { AdminModal } from '@/components/admin/AdminModal'
import { AdminForm } from '@/components/admin/AdminForm'
import { Button } from '@/components/ui/Button'
import { Edit2, Trash2, Plus } from 'lucide-react'
import { toast } from 'react-hot-toast'
import type { Album } from '@/types'

interface AlbumForm {
  title: string
  slug: string
  description: string
  category: string
  cover_url: string
  is_public: string
}

const categoryOptions = [
  { value: 'behind_the_scenes', label: 'Behind the Scenes' },
  { value: 'posters', label: 'Posters' },
  { value: 'stills', label: 'Stills' },
  { value: 'events', label: 'Events' },
  { value: 'concept_art', label: 'Concept Art' },
  { value: 'marketing', label: 'Marketing' },
]

export const AlbumsPage: React.FC = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Album | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'albums', page, search],
    queryFn: () => getAlbums({ page, per_page: 15, search: search || undefined }),
  })

  const createMutation = useMutation({
    mutationFn: createAlbum,
    onSuccess: () => {
      toast.success('Album created')
      queryClient.invalidateQueries({ queryKey: ['admin', 'albums'] })
      setModalOpen(false)
    },
    onError: () => toast.error('Failed to create album'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => updateAlbum(id, data),
    onSuccess: () => {
      toast.success('Album updated')
      queryClient.invalidateQueries({ queryKey: ['admin', 'albums'] })
      setModalOpen(false)
      setEditing(null)
    },
    onError: () => toast.error('Failed to update album'),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAlbum,
    onSuccess: () => {
      toast.success('Album deleted')
      queryClient.invalidateQueries({ queryKey: ['admin', 'albums'] })
    },
    onError: () => toast.error('Failed to delete album'),
  })

  const handleSubmit = async (formData: AlbumForm) => {
    const payload = { ...formData, is_public: formData.is_public === 'true' }
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: payload as unknown as Record<string, unknown> })
    } else {
      createMutation.mutate(payload as unknown as Record<string, unknown>)
    }
  }

  const columns: Column<Album>[] = [
    { key: 'id', label: 'ID', sortable: true, className: 'w-16' },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'category', label: 'Category', sortable: true, render: (a) => (
      <span className="capitalize">{a.category.replace(/_/g, ' ')}</span>
    )},
    { key: 'is_public', label: 'Visibility', render: (a) => (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${a.is_public ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
        {a.is_public ? 'Public' : 'Private'}
      </span>
    )},
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-brand-text">Gallery Albums</h1>
          <p className="text-brand-muted text-sm mt-1">Manage gallery albums</p>
        </div>
        <Button onClick={() => { setEditing(null); setModalOpen(true) }}>
          <Plus size={18} className="mr-1.5" />
          Add Album
        </Button>
      </div>

      <AdminTable
        columns={columns}
        data={data?.data || []}
        keyExtractor={(a) => a.id}
        isLoading={isLoading}
        currentPage={data?.current_page || page}
        lastPage={data?.last_page || 1}
        total={data?.total || 0}
        onPageChange={setPage}
        onSearch={(val) => { setSearch(val); setPage(1) }}
        searchPlaceholder="Search albums..."
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
        title={editing ? 'Edit Album' : 'Create Album'}
        size="lg"
      >
        <AdminForm
          fields={[
            { name: 'title', label: 'Title', rules: { required: 'Title is required' } },
            { name: 'slug', label: 'Slug', rules: { required: 'Slug is required' } },
            { name: 'category', label: 'Category', type: 'select', options: categoryOptions, rules: { required: 'Category is required' } },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'cover_url', label: 'Cover URL', type: 'url' },
            { name: 'is_public', label: 'Visibility', type: 'select', options: [{ value: 'true', label: 'Public' }, { value: 'false', label: 'Private' }] },
          ]}
          onSubmit={handleSubmit}
          defaultValues={editing ? {
            title: editing.title,
            slug: editing.slug,
            category: editing.category,
            description: editing.description || '',
            cover_url: editing.cover_url || '',
            is_public: editing.is_public ? 'true' : 'false',
          } : { category: 'stills', is_public: 'true' }}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          submitLabel={editing ? 'Update Album' : 'Create Album'}
        />
      </AdminModal>
    </div>
  )
}
