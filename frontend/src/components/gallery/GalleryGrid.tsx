import { Album } from '@/types'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Maximize2 } from 'lucide-react'
import { SafeImage } from '@/components/shared/SafeImage'
import { Link } from 'react-router-dom'
import { staggerContainer, staggerItem, fadeUpViewport, cardHover } from '@/lib/motion'

interface GalleryGridProps {
  albums: Album[]
}

// Bento rhythm: every 5th tile (0-indexed 0, 5, 10…) spans two columns and
// gets a taller frame, giving the grid a NEON/A24-style irregular cadence
// instead of a flat uniform mosaic.
const isFeatureTile = (index: number) => index % 5 === 0

export const GalleryGrid: React.FC<GalleryGridProps> = ({ albums }) => {
  return (
    <motion.div
      initial='initial'
      whileInView='whileInView'
      viewport={fadeUpViewport}
      variants={staggerContainer}
      className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr'
    >
      {albums.map((album, index) => {
        const featureTile = isFeatureTile(index)
        return (
          <motion.article
            key={album.id}
            variants={staggerItem}
            {...cardHover}
            className={cn(featureTile && 'sm:col-span-2')}
          >
            <Link
              to={'/gallery/' + album.slug}
              className='card group block h-full overflow-hidden'
              aria-label={'View ' + album.title + ' album'}
            >
              <div className={cn('relative overflow-hidden', featureTile ? 'aspect-[16/10]' : 'aspect-[4/3]')}>
                <SafeImage
                  src={album.cover_url}
                  alt={album.title}
                  placeholderType='gallery'
                  className='transition-transform duration-500 group-hover:scale-110'
                  wrapperClassName='absolute inset-0'
                  loading='lazy'
                />
                <div className='hero-scrim opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                <div className='absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300'>
                  <span className='inline-flex items-center gap-2 px-3 py-1.5 bg-brand-white/90 text-brand-dark rounded-full text-sm font-medium'>
                    <Maximize2 className='w-4 h-4' />
                    View Album
                  </span>
                </div>
              </div>
              <div className='p-4'>
                <span className='eyebrow text-brand-primary dark:text-brand-gold mb-2 block'>
                  {album.category.replace('_', ' ')}
                </span>
                <h3 className={cn('font-display font-semibold text-brand-primary dark:text-brand-white mb-1 group-hover:text-brand-secondary dark:group-hover:text-brand-gold transition-colors', featureTile ? 'text-xl' : 'text-base')}>
                  {album.title}
                </h3>
                {album.description && (
                  <p className='text-brand-muted dark:text-brand-white/60 text-sm line-clamp-2'>{album.description}</p>
                )}
                <p className='text-brand-muted dark:text-brand-white/60 text-xs mt-2'>
                  {album.images?.length || 0} images
                  {album.film && ' · ' + album.film.title}
                </p>
              </div>
            </Link>
          </motion.article>
        )
      })}
    </motion.div>
  )
}
