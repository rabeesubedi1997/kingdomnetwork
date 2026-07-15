import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getNews, createNews, updateNews, deleteNews } from '@/lib/admin-api'
import { AdminTable, type Column } from '@/components/admin/AdminTable'
import { AdminModal } from '@/components/admin/AdminModal'
import { AdminForm } from '@/components/admin/AdminForm'
import { Button } from '@/components/ui/Button'
import { Edit2, Trash2, Plus } from 'lucide-react'
import { toast } from 'react-hot-toast'
import type { Post } from '@/types'

interface NewsForm {
  title: string
  slug: string
  excerpt: string
  status: string
  content: string
}

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'archived', label: 'Archived' },
]

export const NewsPage: React.FC = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Post | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'news', page, search],
    queryFn: () => getNews({ page, per_page: 15, search: search || undefined }),
  })

  const createMutation = useMutation({
    mutationFn: createNews,
    onSuccess: () => {
      toast.success('News post created')
      queryClient.invalidateQueries({ queryKey: ['admin', 'news'] })
      setModalOpen(false)
    },
    onError: () => toast.error('Failed to create news post'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => updateNews(id, data),
    onSuccess: () => {
      toast.success('News post updated')
      queryClient.invalidateQueries({ queryKey: ['admin', 'news'] })
      setModalOpen(false)
      setEditing(null)
    },
    onError: () => toast.error('Failed to update news post'),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteNews,
    onSuccess: () => {
      toast.success('News post deleted')
      queryClient.invalidateQueries({ queryKey: ['admin', 'news'] })
    },
    onError: () => toast.error('Failed to delete news post'),
  })

  const handleSubmit = async (formData: NewsForm) => {
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: formData as unknown as Record<string, unknown> })
    } else {
      createMutation.mutate(formData as unknown as Record<string, unknown>)
    }
  }

  const columns: Column<Post>[] = [
    { key: 'id', label: 'ID', sortable: true, className: 'w-16' },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'status', label: 'Status', sortable: true, render: (p) => (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
        p.status === 'published' ? 'bg-green-100 text-green-700' :
        p.status === 'draft' ? 'bg-gray-100 text-gray-600' :
        p.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
        'bg-orange-100 text-orange-700'
      }`}>{p.status}</span>
    )},
    { key: 'published_at', label: 'Published', sortable: true, render: (p) => p.published_at ? new Date(p.published_at).toLocaleDateString() : '-' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-brand-text">News</h1>
          <p className="text-brand-muted text-sm mt-1">Manage news posts</p>
        </div>
        <Button onClick={() => { setEditing(null); setModalOpen(true) }}>
          <Plus size={18} className="mr-1.5" />
          Add News
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
        searchPlaceholder="Search news..."
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
        title={editing ? 'Edit News Post' : 'Create News Post'}
        size="lg"
      >
        <AdminForm
          fields={[
            { name: 'title', label: 'Title', rules: { required: 'Title is required' } },
            { name: 'slug', label: 'Slug', rules: { required: 'Slug is required' } },
            { name: 'status', label: 'Status', type: 'select', options: statusOptions, rules: { required: 'Status is required' } },
            { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
            { name: 'content', label: 'Content', type: 'textarea' },
          ]}
          onSubmit={handleSubmit}
          defaultValues={editing ? {
            title: editing.title,
            slug: editing.slug,
            status: editing.status,
            excerpt: editing.excerpt || '',
            content: editing.content || '',
          } : { status: 'draft' }}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          submitLabel={editing ? 'Update News' : 'Create News'}
        />
      </AdminModal>
    </div>
  )
}
