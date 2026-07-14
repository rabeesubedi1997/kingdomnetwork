import { Film } from '@/types'
import { motion } from 'framer-motion'
import { Image, Maximize2 } from 'lucide-react'

interface FilmGalleryProps {
  film: Film
}

export const FilmGallery: React.FC<FilmGalleryProps> = ({ film }) => {
  const images = film.gallery_images || []

  if (images.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className='space-y-8'
    >
      <h2 className='heading-2 text-brand-primary mb-6'>Gallery</h2>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {images.map((img, index) => (
          <motion.article
            key={img.id || index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
          >
            <div
              className='card group overflow-hidden'
            >
              <div className='relative aspect-[4/3] overflow-hidden'>
                {img.url ? (
                  <img
                    src={img.url}
                    alt={img.caption || film.title + ' image ' + (index + 1)}
                    className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                    loading='lazy'
                  />
                ) : (
                  <div className='w-full h-full bg-brand-primary/10 flex items-center justify-center'>
                    <Image className='w-12 h-12 text-brand-primary/50' />
                  </div>
                )}
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                <div className='absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300'>
                  <span className='inline-flex items-center gap-2 px-3 py-1.5 bg-brand-white/90 text-brand-dark rounded-full text-sm font-medium'>
                    <Maximize2 className='w-4 h-4' />
                    View Fullscreen
                  </span>
                </div>
              </div>
              <div className='p-4'>
                <span className='inline-block px-2 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-medium mb-2'>
                  {img.type}
                </span>
                <h3 className='font-semibold text-brand-primary mb-1 group-hover:text-brand-secondary transition-colors'>
                  {img.caption || film.title + ' - Image ' + (index + 1)}
                </h3>
                <p className='text-brand-muted text-xs mt-2'>{img.caption || 'Gallery image ' + (index + 1)}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.div>
  )
}