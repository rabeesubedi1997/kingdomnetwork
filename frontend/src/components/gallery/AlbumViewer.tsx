import { Album } from '@/types'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Image, Maximize2, ChevronLeft, ChevronRight, Film, Check } from 'lucide-react'
import { useState } from 'react'
import { Section, Container } from '@/components/layout/Section'

interface GalleryGridProps {
  albums: Album[]
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ albums }) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {albums.map((album, index) => (
        <motion.article
          key={album.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}
        >
          <Link
            to={'/gallery/' + album.slug}
            className='card group overflow-hidden'
            aria-label={'View ' + album.title + ' album'}
          >
            <div className='relative aspect-[4/3] overflow-hidden'>
              {album.cover_url ? (
                <img
                  src={album.cover_url}
                  alt={album.title}
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
                  View Album
                </span>
              </div>
            </div>
            <div className='p-4'>
              <span className='inline-block px-2 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-medium mb-2'>
                {album.category.replace('_', ' ')}
              </span>
              <h3 className='font-semibold text-brand-primary mb-1 group-hover:text-brand-secondary transition-colors'>
                {album.title}
              </h3>
              {album.description && (
                <p className='text-brand-muted text-sm line-clamp-2'>{album.description}</p>
              )}
              <p className='text-brand-muted text-xs mt-2'>
                {album.images?.length || 0} images
                {album.film && ' \u00B7 ' + album.film.title}
              </p>
            </div>
          </Link>
        </motion.article>
      ))}
    </div>
  )
}

interface AlbumViewerProps {
  album: Album
}

export const AlbumViewer: React.FC<AlbumViewerProps> = ({ album }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

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
            <span className='inline-block px-3 py-1 bg-brand-white/10 text-brand-gold rounded-full text-sm font-medium mb-4'>
              {album.category.replace('_', ' ')}
            </span>
            <h1 className='heading-1 text-brand-white mb-4'>{album.title}</h1>
            {album.description && (
              <p className='text-brand-white/70 text-lg max-w-2xl mx-auto mb-6'>{album.description}</p>
            )}
            <div className='flex items-center justify-center gap-4 text-brand-white/70'>
              <span>{images.length} images</span>
              {album.film && (
                <Link to={'/films/' + album.film.slug} className='hover:text-brand-gold transition-colors'>
                  {album.film.title}
                </Link>
              )}
            </div>
          </div>
        </Container>
      </Section>

      <Section id='album-gallery' padding='xl'>
        <Container>
          <div className='max-w-4xl mx-auto'>
            <div className='relative aspect-video rounded-xl overflow-hidden mb-6'>
              {currentImage.media?.url && (
                <img
                  src={currentImage.media.url}
                  alt={currentImage.caption || album.title + ' - Image ' + (currentIndex + 1)}
                  className='w-full h-full object-cover'
                />
              )}
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />
              <button
                onClick={prevImage}
                className='absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-brand-white/10 hover:bg-brand-white/20 rounded-full text-brand-white transition-colors'
                aria-label='Previous image'
              >
                <ChevronLeft className='w-6 h-6' />
              </button>
              <button
                onClick={nextImage}
                className='absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-brand-white/10 hover:bg-brand-white/20 rounded-full text-brand-white transition-colors'
                aria-label='Next image'
              >
                <ChevronRight className='w-6 h-6' />
              </button>
            </div>

            <div className='flex justify-center gap-2 mt-4'>
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    'w-3 h-3 rounded-full transition-all',
                    index === currentIndex
                      ? 'bg-brand-primary w-8'
                      : 'bg-brand-white/30 hover:bg-brand-white/50'
                  )}
                  aria-label={'Go to image ' + (index + 1)}
                  aria-current={index === currentIndex ? 'true' : 'false'}
                />
              ))}
            </div>

            {currentImage.caption && (
              <p className='text-center text-brand-muted mt-4'>{currentImage.caption}</p>
            )}

            <div className='mt-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3'>
              {images.map((img, index) => (
                <button
                  key={img.media?.id || index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    'relative aspect-square rounded-lg overflow-hidden border-2 transition-all',
                    index === currentIndex
                      ? 'border-brand-primary scale-105'
                      : 'border-transparent hover:border-brand-primary/50'
                  )}
                  aria-label={'View image ' + (index + 1)}
                  aria-current={index === currentIndex ? 'true' : 'false'}
                >
                  {img.media?.thumb && (
                    <img
                      src={img.media.thumb}
                      alt={img.caption || 'Thumbnail ' + (index + 1)}
                      className='w-full h-full object-cover'
                    />
                  )}
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
            <div className='flex items-center gap-4 p-4 bg-brand-white dark:bg-brand-dark rounded-xl border border-brand-surface/50'>
              <div className='w-16 h-16 rounded-lg bg-brand-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden'>
                {album.film.poster_url ? (
                  <img src={album.film.poster_url} alt={album.film.title} className='w-full h-full object-cover rounded-lg' />
                ) : (
                  <Film className='w-8 h-8 text-brand-primary' />
                )}
              </div>
              <div className='flex-1'>
                <h3 className='font-semibold text-brand-primary'>{album.film.title}</h3>
                <p className='text-brand-muted text-sm'>{album.film.short_description || album.film.synopsis?.slice(0, 100)}...</p>
              </div>
              <Link to={'/films/' + album.film.slug} className='btn-secondary'>
                View Film
              </Link>
            </div>
          </Container>
        </Section>
      )}
    </>
  )
}
