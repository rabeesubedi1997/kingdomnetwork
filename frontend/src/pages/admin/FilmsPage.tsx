import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFilms, createFilm, updateFilm, deleteFilm } from '@/lib/admin-api'
import { AdminTable, type Column } from '@/components/admin/AdminTable'
import { AdminModal } from '@/components/admin/AdminModal'
import { AdminForm } from '@/components/admin/AdminForm'
import { Button } from '@/components/ui/Button'
import { Edit2, Trash2, Plus } from 'lucide-react'
import { toast } from 'react-hot-toast'
import type { Film } from '@/types'

interface FilmForm {
  title: string
  slug: string
  status: string
  year: string
  poster_url: string
}

const statusOptions = [
  { value: 'released', label: 'Released' },
  { value: 'post_production', label: 'Post Production' },
  { value: 'pre_production', label: 'Pre Production' },
  { value: 'development', label: 'Development' },
  { value: 'announced', label: 'Announced' },
  { value: 'cancelled', label: 'Cancelled' },
]

export const FilmsPage: React.FC = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Film | null>(null)
  const [searchInput, setSearchInput] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'films', page, search],
    queryFn: () => getFilms({ page, per_page: 15, search: search || undefined }),
  })

  const createMutation = useMutation({
    mutationFn: createFilm,
    onSuccess: () => {
      toast.success('Film created')
      queryClient.invalidateQueries({ queryKey: ['admin', 'films'] })
      setModalOpen(false)
    },
    onError: () => toast.error('Failed to create film'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => updateFilm(id, data),
    onSuccess: () => {
      toast.success('Film updated')
      queryClient.invalidateQueries({ queryKey: ['admin', 'films'] })
      setModalOpen(false)
      setEditing(null)
    },
    onError: () => toast.error('Failed to update film'),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteFilm,
    onSuccess: () => {
      toast.success('Film deleted')
      queryClient.invalidateQueries({ queryKey: ['admin', 'films'] })
    },
    onError: () => toast.error('Failed to delete film'),
  })

  const handleSearch = useCallback((val: string) => {
    setSearchInput(val)
    const timeout = setTimeout(() => {
      setSearch(val)
      setPage(1)
    }, 400)
    return () => clearTimeout(timeout)
  }, [])

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (film: Film) => {
    setEditing(film)
    setModalOpen(true)
  }

  const handleDelete = (film: Film) => {
    if (window.confirm(`Delete "${film.title}"?`)) {
      deleteMutation.mutate(film.id)
    }
  }

  const handleSubmit = async (formData: FilmForm) => {
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: formData as unknown as Record<string, unknown> })
    } else {
      createMutation.mutate(formData as unknown as Record<string, unknown>)
    }
  }

  const columns: Column<Film>[] = [
    { key: 'id', label: 'ID', sortable: true, className: 'w-16' },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'status', label: 'Status', sortable: true, render: (f) => {
      const statusLabel = statusOptions.find(s => s.value === f.status)?.label || f.status
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-brand-primary/10 text-brand-primary capitalize">
          {statusLabel}
        </span>
      )
    }},
    { key: 'release_date', label: 'Year', sortable: true, render: (f) => f.release_date ? new Date(f.release_date).getFullYear() : '-' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-brand-text">Films</h1>
          <p className="text-brand-muted text-sm mt-1">Manage your film catalog</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={18} className="mr-1.5" />
          Add Film
        </Button>
      </div>

      <AdminTable
        columns={columns}
        data={data?.data || []}
        keyExtractor={(f) => f.id}
        isLoading={isLoading}
        currentPage={data?.current_page || page}
        lastPage={data?.last_page || 1}
        total={data?.total || 0}
        onPageChange={setPage}
        onSearch={(val) => { setSearchInput(val); setSearch(val); setPage(1) }}
        searchPlaceholder="Search films..."
        actions={(film) => (
          <div className="flex items-center gap-1 justify-end">
            <button onClick={() => openEdit(film)} className="p-1.5 rounded-lg hover:bg-brand-primary/10 text-brand-muted hover:text-brand-primary transition-colors" title="Edit">
              <Edit2 size={16} />
            </button>
            <button onClick={() => handleDelete(film)} className="p-1.5 rounded-lg hover:bg-red-50 text-brand-muted hover:text-red-500 transition-colors" title="Delete">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      />

      <AdminModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        title={editing ? 'Edit Film' : 'Create Film'}
        size="lg"
      >
        <AdminForm
          fields={[
            { name: 'title', label: 'Title', rules: { required: 'Title is required' } },
            { name: 'slug', label: 'Slug', rules: { required: 'Slug is required' } },
            { name: 'status', label: 'Status', type: 'select', options: statusOptions, rules: { required: 'Status is required' } },
            { name: 'year', label: 'Year', type: 'number' },
            { name: 'poster_url', label: 'Poster URL', type: 'url' },
          ]}
          onSubmit={handleSubmit}
          defaultValues={editing ? {
            title: editing.title,
            slug: editing.slug,
            status: editing.status,
            year: editing.release_date ? String(new Date(editing.release_date).getFullYear()) : '',
            poster_url: editing.poster_url || '',
          } : { status: 'development' }}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          submitLabel={editing ? 'Update Film' : 'Create Film'}
        />
      </AdminModal>
    </div>
  )
}
