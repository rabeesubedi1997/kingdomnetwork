import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SafeImage } from '@/components/shared/SafeImage'

interface LightboxImage {
  url: string
  alt?: string
  caption?: string
}

interface LightboxProps {
  images: LightboxImage[]
  initialIndex?: number
  open: boolean
  onClose: () => void
}

export const Lightbox: React.FC<LightboxProps> = ({ images, initialIndex = 0, open, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [zoomed, setZoomed] = useState(false)

  useEffect(() => {
    setCurrentIndex(initialIndex)
    setZoomed(false)
  }, [initialIndex, open])

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
    setZoomed(false)
  }, [images.length])

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    setZoomed(false)
  }, [images.length])

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose, goNext, goPrev])

  const current = images[currentIndex]
  if (!current) return null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
          onClick={onClose}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 h-16 shrink-0">
            <span className="text-white/60 text-sm">
              {currentIndex + 1} / {images.length}
              {current.caption && <span className="ml-3 text-white/40">· {current.caption}</span>}
            </span>
            <div className="flex items-center gap-2">
              <button onClick={(e) => { e.stopPropagation(); setZoomed(!zoomed) }} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                {zoomed ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
              </button>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="flex-1 flex items-center justify-center min-h-0 relative" onClick={(e) => e.stopPropagation()}>
            {images.length > 1 && (
              <>
                <button onClick={goPrev} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={goNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10">
                  <ChevronRight size={24} />
                </button>
              </>
            )}
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: zoomed ? 1.5 : 1 }}
              transition={{ duration: 0.2 }}
              className={cn('flex items-center justify-center transition-transform duration-200 cursor-pointer', zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in')}
              onClick={() => setZoomed(!zoomed)}
            >
              <SafeImage
                src={current.url}
                alt={current.alt || ''}
                placeholderType='gallery'
                className='max-h-full max-w-full object-contain'
              />
            </motion.div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center justify-center gap-2 px-5 py-4 overflow-x-auto shrink-0">
              {images.map((img, i) => (
                <button key={i} onClick={() => { setCurrentIndex(i); setZoomed(false) }}
                  className={cn(
                    'w-12 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all',
                    i === currentIndex ? 'border-brand-primary opacity-100 scale-110' : 'border-transparent opacity-50 hover:opacity-80'
                  )}
                >
                  <SafeImage src={img.url} alt={img.alt || ''} placeholderType='gallery' wrapperClassName='w-full h-full' className='object-cover' />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}


