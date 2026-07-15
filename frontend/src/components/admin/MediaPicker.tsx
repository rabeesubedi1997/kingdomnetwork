import { useState, useRef, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getMedia, uploadMedia } from '@/lib/admin-api'
import { motion } from 'framer-motion'
import { X, Upload, Image, Film, Search, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface MediaItem {
  id: number; name: string; file_name: string; mime_type: string
  size: number; url: string; thumb: string; is_image: boolean; is_video: boolean; created_at: string
}

interface MediaPickerProps {
  open: boolean; onClose: () => void; onSelect: (media: MediaItem) => void
  selectedId?: number | null; multiple?: boolean; onSelectMultiple?: (media: MediaItem[]) => void
}

export const MediaPicker: React.FC<MediaPickerProps> = ({ open, onClose, onSelect, multiple, onSelectMultiple }) => {
  const [tab, setTab] = useState<'library' | 'upload'>('library')
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'media-picker', search],
    queryFn: () => getMedia({ search: search || undefined, per_page: 50 }),
    enabled: open && tab === 'library',
  })

  const items: MediaItem[] = data?.data || data || []

  const handleUpload = async () => {
    if (!files.length) return
    setUploading(true)
    try {
      for (const file of files) await uploadMedia(file)
      toast.success(`${files.length} uploaded`)
      setFiles([])
      queryClient.invalidateQueries({ queryKey: ['admin', 'media-picker'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'media-library'] })
      setTab('library')
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setFiles(Array.from(e.dataTransfer.files)) }, [])

  const toggleSelect = (id: number) => {
    if (multiple) { setSelectedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]) }
    else { const item = items.find(m => m.id === id); if (item) { onSelect(item); onClose() } }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-2xl shadow-2xl w-[95vw] max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border"
        style={{ background: '#111820', borderColor: '#1e3040' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#1e3040' }}>
          <h2 className="text-lg font-semibold text-white">Media Library</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5"><X size={20} className="text-gray-500" /></button>
        </div>
        <div className="flex border-b" style={{ borderColor: '#1e3040' }}>
          {(['library', 'upload'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={cn('flex-1 py-3 text-sm font-medium text-center transition-colors relative',
                tab === t ? 'text-[#ffcd57]' : 'text-gray-500 hover:text-gray-300')}>
              {t === 'library' ? <><Image size={16} className="inline mr-1.5" />Select from Library</> : <><Upload size={16} className="inline mr-1.5" />Upload New</>}
              {tab === t && <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: '#ffcd57' }} />}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'library' ? (
            <>
              <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <Input placeholder="Search media..." value={search} onChange={e => setSearch(e.target.value)}
                  className="pl-9" style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} />
              </div>
              {isLoading ? (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {Array.from({ length: 12 }).map((_, i) => <div key={i} className="aspect-square rounded-xl animate-pulse" style={{ background: '#1c2a38' }} />)}
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-12 text-gray-500"><Image size={48} className="mx-auto mb-3 opacity-30" /><p>No media found</p></div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                  {items.map((item) => (
                    <button key={item.id} onClick={() => toggleSelect(item.id)}
                      className={cn('relative aspect-square rounded-xl overflow-hidden border-2 transition-all group',
                        selectedIds.includes(item.id) ? 'border-[#ffcd57] ring-2 ring-[#ffcd57]/30' : 'border-[#1e3040] hover:border-[#516f78]')}>
                      {item.is_image ? (
                        <img src={item.url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: '#0a0f14' }}>
                          <Film size={32} className="text-gray-500" />
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-xs truncate">{item.name}</p>
                      </div>
                      {selectedIds.includes(item.id) && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#ffcd57' }}>
                          <Check size={14} className="text-[#09333f]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
              {multiple && selectedIds.length > 0 && (
                <div className="mt-4 flex justify-end gap-3 pt-4 border-t" style={{ borderColor: '#1e3040' }}>
                  <Button variant="ghost" onClick={onClose} className="text-gray-400">Cancel</Button>
                  <Button onClick={() => { onSelectMultiple?.(items.filter(m => selectedIds.includes(m.id))); onClose() }}
                    style={{ background: '#09333f' }} className="text-white">Select ({selectedIds.length})</Button>
                </div>
              )}
            </>
          ) : (
            <div>
              <div ref={dropRef} onDrop={handleDrop} onDragOver={e => e.preventDefault()}
                className="border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors" style={{ borderColor: '#1e3040' }}
                onClick={() => fileInputRef.current?.click()}>
                <Upload size={48} className="mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400 font-medium">Drop files here or click to browse</p>
                <p className="text-gray-600 text-sm mt-1">JPG, PNG, GIF, WebP, SVG, MP4, WebM (max 100MB)</p>
                <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={e => setFiles(Array.from(e.target.files || []))} />
              </div>
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm" style={{ background: '#1c2a38' }}>
                      {f.type.startsWith('image/') ? <Image size={16} className="text-gray-500" /> : <Film size={16} className="text-gray-500" />}
                      <span className="flex-1 truncate text-gray-300">{f.name}</span>
                      <span className="text-gray-500">{(f.size / 1024 / 1024).toFixed(1)} MB</span>
                      <button onClick={() => setFiles(p => p.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-300"><X size={16} /></button>
                    </div>
                  ))}
                  <Button onClick={handleUpload} loading={uploading} className="mt-2" style={{ background: '#09333f' }}>
                    <Upload size={16} className="mr-1.5" />Upload {files.length} file(s)
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
