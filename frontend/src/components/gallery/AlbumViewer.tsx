import { Album } from '@/types'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Check, Expand } from 'lucide-react'
import { SafeImage } from '@/components/shared/SafeImage'
import { useState } from 'react'
import { Section, Container } from '@/components/layout/Section'
import { Lightbox } from '@/components/shared/Lightbox'
import { heroTitle, heroChild, EASE } from '@/lib/motion'

interface AlbumViewerProps {
  album: Album
}

export const AlbumViewer: React.FC<AlbumViewerProps> = ({ album }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const images = album.images || []

  if (images.length === 0) {
    return (
      <Section padding='xl'>
        <Container>
          <div className='max-w-2xl mx-auto text-center'>
            <h1 className='heading-2 text-brand-primary mb-4'>{album.title}</h1>
            <p className='text-brand-muted'>No images in this album.</p>
          </div>
        </Container>
      </Section>
    )
  }

  const currentImage = images[currentIndex]

  const nextImage = () => setCurrentIndex(prev => (prev + 1) % images.length)
  const prevImage = () => setCurrentIndex(prev => (prev - 1 + images.length) % images.length)

  return (
    <>
      <Section id='album-header' padding='lg' background='dark' className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-brand-primary/20 to-transparent' />
        <Container>
          <div className='max-w-3xl mx-auto text-center'>
            <motion.span initial='initial' animate='animate' variants={heroTitle} className='eyebrow-pill'>
              {album.category.replace('_', ' ')}
            </motion.span>
            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={heroChild(0.1)} className='heading-1 text-brand-white mt-6 mb-4'>
              {album.title}
            </motion.h1>
            {album.description && (
              <motion.p initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={heroChild(0.2)} className='text-brand-white/70 text-lg max-w-2xl mx-auto mb-6'>
                {album.description}
              </motion.p>
            )}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={heroChild(0.3)} className='flex items-center justify-center gap-4 text-brand-white/70'>
              <span>{images.length} images</span>
              {album.film && (
                <Link to={'/films/' + album.film.slug} className='hover:text-brand-gold transition-colors'>
                  {album.film.title}
                </Link>
              )}
            </motion.div>
          </div>
        </Container>
      </Section>

      <Section id='album-gallery' padding='xl'>
        <Container>
          <div className='max-w-4xl mx-auto'>
            <div className='relative aspect-video rounded-xl overflow-hidden mb-6 group'>
              <AnimatePresence mode='wait'>
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className='absolute inset-0'
                >
                  <SafeImage
                    src={currentImage.media?.url}
                    alt={currentImage.caption || album.title + ' - Image ' + (currentIndex + 1)}
                    placeholderType='gallery'
                    wrapperClassName='absolute inset-0'
                    className='w-full h-full object-cover'
                  />
                </motion.div>
              </AnimatePresence>
              <div className='hero-scrim' />
              <button
                onClick={prevImage}
                className='absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-brand-white/10 hover:bg-brand-white/20 rounded-full text-brand-white transition-colors backdrop-blur-sm'
                aria-label='Previous image'
              >
                <ChevronLeft className='w-6 h-6' />
              </button>
              <button
                onClick={nextImage}
                className='absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-brand-white/10 hover:bg-brand-white/20 rounded-full text-brand-white transition-colors backdrop-blur-sm'
                aria-label='Next image'
              >
                <ChevronRight className='w-6 h-6' />
              </button>
              <button
                onClick={() => setLightboxOpen(true)}
                className='absolute top-4 right-4 p-2 bg-brand-white/10 hover:bg-brand-white/20 rounded-full text-brand-white transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100'
                aria-label='View fullscreen'
              >
                <Expand className='w-5 h-5' />
              </button>
            </div>

            <div className='flex justify-center gap-2 mt-4'>
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300',
                    index === currentIndex
                      ? 'bg-brand-gold w-8'
                      : 'bg-brand-muted/30 dark:bg-white/20 w-1.5 hover:bg-brand-primary/50'
                  )}
                  aria-label={'Go to image ' + (index + 1)}
                  aria-current={index === currentIndex ? 'true' : 'false'}
                />
              ))}
            </div>

            <AnimatePresence mode='wait'>
              {currentImage.caption && (
                <motion.p
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='text-center text-brand-muted dark:text-brand-white/60 mt-4'
                >
                  {currentImage.caption}
                </motion.p>
              )}
            </AnimatePresence>

            <div className='mt-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3'>
              {images.map((img, index) => (
                <button
                  key={img.media?.id || index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    'relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 group',
                    index === currentIndex
                      ? 'border-brand-gold scale-[1.03]'
                      : 'border-transparent hover:border-brand-primary/50'
                  )}
                  aria-label={'View image ' + (index + 1)}
                  aria-current={index === currentIndex ? 'true' : 'false'}
                >
                  <SafeImage
                    src={img.media?.thumb}
                    alt={img.caption || 'Thumbnail ' + (index + 1)}
                    placeholderType='gallery'
                    wrapperClassName='absolute inset-0'
                    className={cn('w-full h-full object-cover transition-transform duration-300', index !== currentIndex && 'group-hover:scale-110')}
                  />
                  {index === currentIndex && (
                    <div className='absolute inset-0 bg-brand-primary/20 flex items-center justify-center'>
                      <Check className='w-6 h-6 text-white' />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {album.film && (
        <Section id='related-film' padding='xl' background='surface'>
          <Container>
            <div className='flex items-center gap-4 p-4 bg-brand-white dark:bg-brand-dark rounded-xl border border-brand-surface/50 dark:border-white/10'>
              <div className='w-16 h-16 rounded-lg bg-brand-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden'>
                <SafeImage
                  src={album.film.poster_url}
                  alt={album.film.title}
                  placeholderType='film'
                  wrapperClassName='w-full h-full'
                  className='object-cover rounded-lg'
                />
              </div>
              <div className='flex-1'>
                <h3 className='font-semibold text-brand-primary dark:text-brand-white'>{album.film.title}</h3>
                <p className='text-brand-muted dark:text-brand-white/60 text-sm'>{album.film.short_description || album.film.synopsis?.slice(0, 100)}...</p>
              </div>
              <Link to={'/films/' + album.film.slug} className='btn-secondary'>
                View Film
              </Link>
            </div>
          </Container>
        </Section>
      )}

      <Lightbox
        images={images.map(img => ({
          url: img.media?.url || '',
          alt: img.caption || album.title + ' image',
          caption: img.caption || undefined,
        }))}
        initialIndex={currentIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  )
}
