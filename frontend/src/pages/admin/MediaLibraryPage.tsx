import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMedia, uploadMedia, deleteMedia, bulkDeleteMedia } from '@/lib/admin-api'
import { motion } from 'framer-motion'
import {
  Upload, Image, Film, Search, Trash2, X, Check, Grid3X3, List,
  Download, ExternalLink, Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface MediaItem {
  id: number; name: string; file_name: string; mime_type: string
  size: number; url: string; thumb: string; is_image: boolean
  is_video: boolean; created_at: string
}

export const MediaLibraryPage: React.FC = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [type, setType] = useState<'all' | 'image' | 'video'>('all')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [selected, setSelected] = useState<number[]>([])
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'media-library', search, page, type],
    queryFn: () => getMedia({ search: search || undefined, page, per_page: 30, type: type === 'all' ? undefined : type }),
  })

  const items: MediaItem[] = data?.data || []

  const deleteMutation = useMutation({
    mutationFn: deleteMedia,
    onSuccess: () => { toast.success('Deleted'); queryClient.invalidateQueries({ queryKey: ['admin', 'media-library'] }); setDeleteId(null) },
    onError: () => toast.error('Delete failed'),
  })

  const bulkDeleteMutation = useMutation({
    mutationFn: bulkDeleteMedia,
    onSuccess: () => { toast.success('Deleted'); queryClient.invalidateQueries({ queryKey: ['admin', 'media-library'] }); setSelected([]); setBulkDeleteOpen(false) },
    onError: () => toast.error('Bulk delete failed'),
  })

  const handleUpload = async () => {
    if (!files.length) return
    setUploading(true)
    try {
      for (const f of files) await uploadMedia(f)
      toast.success(`${files.length} uploaded`)
      setFiles([])
      setUploadOpen(false)
      queryClient.invalidateQueries({ queryKey: ['admin', 'media-library'] })
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  const toggleSelect = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const selectAll = () => {
    if (selected.length === items.length) setSelected([])
    else setSelected(items.map(i => i.id))
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url)
    toast.success('URL copied')
  }

  const totalPages = data?.last_page || 1

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your images, videos, and files</p>
        </div>
        <Button onClick={() => setUploadOpen(true)}>
          <Upload size={16} className="mr-1.5" /> Upload Media
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search media..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} style={{ paddingLeft: '2.25rem' }} />
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
            {(['all', 'image', 'video'] as const).map(t => (
              <button key={t} onClick={() => { setType(t); setPage(1) }}
                className={cn('px-3 py-1.5 rounded-md text-sm font-medium transition-all capitalize',
                  type === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700')}>
                {t === 'all' ? 'All' : t === 'image' ? 'Images' : 'Videos'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5 ml-auto">
            <button onClick={() => setView('grid')} className={cn('p-1.5 rounded-md', view === 'grid' ? 'bg-white shadow-sm' : '')}><Grid3X3 size={16} className="text-gray-600" /></button>
            <button onClick={() => setView('list')} className={cn('p-1.5 rounded-md', view === 'list' ? 'bg-white shadow-sm' : '')}><List size={16} className="text-gray-600" /></button>
          </div>
        </div>

        {selected.length > 0 && (
          <div className="px-4 py-2.5 bg-brand-primary/5 border-b border-brand-primary/10 flex items-center gap-3">
            <span className="text-sm font-medium text-brand-primary">{selected.length} selected</span>
            <button onClick={() => setBulkDeleteOpen(true)} className="text-sm text-red-500 hover:text-red-700 font-medium">Delete Selected</button>
            <button onClick={() => setSelected([])} className="text-sm text-gray-500 hover:text-gray-700 ml-auto">Clear Selection</button>
          </div>
        )}

        <div className="p-4">
          {isLoading ? (
            <div className={view === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3'
              : 'space-y-2'}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className={cn('bg-gray-100 animate-pulse rounded-xl', view === 'grid' ? 'aspect-square' : 'h-12')} />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <Image size={56} className="mx-auto mb-4 text-gray-200" />
              <p className="text-gray-400 font-medium">No media found</p>
              <p className="text-gray-300 text-sm mt-1">Upload your first file to get started</p>
              <Button className="mt-4" onClick={() => setUploadOpen(true)}><Upload size={16} className="mr-1.5" /> Upload</Button>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {items.map((item) => (
                <div key={item.id} className={cn(
                  'relative group aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer',
                  selected.includes(item.id) ? 'border-brand-primary ring-2 ring-brand-primary/30' : 'border-gray-200 hover:border-gray-300'
                )}>
                  <input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggleSelect(item.id)}
                    className="absolute top-2 left-2 z-10 w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                  {item.is_image ? (
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                      <Film size={36} className="text-white/40" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-black/60 rounded px-2 py-0.5 text-xs text-white truncate">{item.file_name}</div>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-x-0 -bottom-10 group-hover:bottom-0 transition-all duration-200 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-2 flex gap-1">
                    <button onClick={() => copyUrl(item.url)} className="flex-1 text-[10px] bg-white/20 hover:bg-white/30 text-white rounded py-1 transition-colors">Copy URL</button>
                    <button onClick={() => window.open(item.url, '_blank')} className="p-1 bg-white/20 hover:bg-white/30 text-white rounded transition-colors"><ExternalLink size={12} /></button>
                    <button onClick={() => setDeleteId(item.id)} className="p-1 bg-red-500/60 hover:bg-red-500 text-white rounded transition-colors"><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {items.map((item) => (
                <div key={item.id} className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors border',
                  selected.includes(item.id) ? 'border-brand-primary/30 bg-brand-primary/5' : 'border-transparent hover:border-gray-200 hover:bg-gray-50'
                )}>
                  <input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggleSelect(item.id)}
                    className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                  {item.is_image ? (
                    <img src={item.url} alt={item.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0"><Film size={16} className="text-white/60" /></div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.file_name} &middot; {(item.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <span className="text-xs text-gray-400 capitalize">{item.mime_type?.split('/')[0]}</span>
                  <button onClick={() => copyUrl(item.url)} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600"><Download size={14} /></button>
                  <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">Page {page} of {totalPages} ({data?.total || 0} total)</p>
              <div className="flex gap-1">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30">Previous</button>
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {uploadOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setUploadOpen(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Upload Media</h2>
              <button onClick={() => setUploadOpen(false)} className="p-1 rounded-lg hover:bg-gray-100"><X size={18} /></button>
            </div>
            <div onClick={() => fileRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); setFiles(Array.from(e.dataTransfer.files)) }}
              className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-brand-primary/50 cursor-pointer transition-colors">
              <Upload size={40} className="mx-auto mb-3 text-gray-300" />
              <p className="text-gray-600 font-medium">Drop files or click to browse</p>
              <p className="text-gray-400 text-sm mt-1">Images & videos up to 100MB</p>
              <input ref={fileRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={e => setFiles(Array.from(e.target.files || []))} />
            </div>
            {files.length > 0 && (
              <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-sm">
                    {f.type.startsWith('image/') ? <Image size={14} className="text-gray-400" /> : <Film size={14} className="text-gray-400" />}
                    <span className="flex-1 truncate">{f.name}</span>
                    <span className="text-gray-400 text-xs">{(f.size / 1024 / 1024).toFixed(1)}MB</span>
                    <button onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600"><X size={14} /></button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
              <Button variant="ghost" onClick={() => setUploadOpen(false)}>Cancel</Button>
              <Button onClick={handleUpload} loading={uploading} disabled={!files.length}>
                <Upload size={16} className="mr-1.5" /> Upload {files.length > 0 ? `(${files.length})` : ''}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Media" message="This action cannot be undone." isLoading={deleteMutation.isPending} />

      <ConfirmDialog open={bulkDeleteOpen} onClose={() => setBulkDeleteOpen(false)}
        onConfirm={() => bulkDeleteMutation.mutate(selected)}
        title={`Delete ${selected.length} files?`} message="This action cannot be undone."
        isLoading={bulkDeleteMutation.isPending} />
    </div>
  )
}
