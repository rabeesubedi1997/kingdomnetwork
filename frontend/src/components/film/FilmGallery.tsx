import { Film } from '@/types'
import { motion } from 'framer-motion'
import { Maximize2 } from 'lucide-react'
import { SafeImage } from '@/components/shared/SafeImage'
import { fadeUp, fadeUpViewport, staggerContainer, staggerItem, cardHover } from '@/lib/motion'

interface FilmGalleryProps {
  film: Film
}

export const FilmGallery: React.FC<FilmGalleryProps> = ({ film }) => {
  const images = film.gallery_images || []

  if (images.length === 0) return null

  return (
    <div className='space-y-8'>
      <motion.h2 {...fadeUp} viewport={fadeUpViewport} className='heading-2 text-brand-primary dark:text-brand-white'>
        Gallery
      </motion.h2>

      <motion.div
        initial='initial'
        whileInView='whileInView'
        viewport={fadeUpViewport}
        variants={staggerContainer}
        className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
      >
        {images.map((img, index) => (
          <motion.article key={img.id || index} variants={staggerItem} {...cardHover} className='card group overflow-hidden'>
            <div className='relative aspect-[4/3] overflow-hidden'>
              <SafeImage
                src={img.url}
                alt={img.caption || film.title + ' image ' + (index + 1)}
                placeholderType='gallery'
                className='transition-transform duration-500 group-hover:scale-105'
                wrapperClassName='absolute inset-0'
                loading='lazy'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
              <div className='absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300'>
                <span className='inline-flex items-center gap-2 px-3 py-1.5 bg-brand-white/90 text-brand-dark rounded-full text-sm font-medium'>
                  <Maximize2 className='w-4 h-4' />
                  View Fullscreen
                </span>
              </div>
            </div>
            <div className='p-4'>
              <span className='inline-block px-2 py-1 bg-brand-primary/10 dark:bg-white/10 text-brand-primary dark:text-brand-white rounded-full text-xs font-medium mb-2 capitalize'>
                {img.type}
              </span>
              <h3 className='font-semibold text-brand-primary dark:text-brand-white mb-1 group-hover:text-brand-secondary dark:group-hover:text-brand-gold transition-colors'>
                {img.caption || film.title + ' - Image ' + (index + 1)}
              </h3>
              <p className='text-brand-muted dark:text-brand-white/60 text-xs mt-2'>{img.caption || 'Gallery image ' + (index + 1)}</p>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </div>
  )
}
