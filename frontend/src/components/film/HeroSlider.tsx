import { motion, AnimatePresence } from 'framer-motion'
import { Film } from '@/types'
import { cn, getEmbedUrl } from '@/lib/utils'
import { Play, ChevronLeft, ChevronRight, X, Film as FilmIcon } from 'lucide-react'
import { SafeImage } from '@/components/shared/SafeImage'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface HeroSliderProps {
  films: Film[]
  loading?: boolean
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ films, loading }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showTrailer, setShowTrailer] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)

  const displayFilms = films.slice(0, 4)

  useEffect(() => {
    if (displayFilms.length <= 1 || !isPlaying) return
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % displayFilms.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [displayFilms.length, isPlaying])

  if (displayFilms.length === 0) return null

  const currentFilm = displayFilms[currentIndex]
  const trailerUrl = currentFilm.trailer_embed_url || getEmbedUrl(currentFilm.trailer_url || '')

  const nextSlide = () => setCurrentIndex(prev => (prev + 1) % displayFilms.length)
  const prevSlide = () => setCurrentIndex(prev => (prev - 1 + displayFilms.length) % displayFilms.length)

  if (loading) {
    return (
      <section className='relative h-[70vh] md:h-[80vh] bg-brand-dark'>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-brand-primary/20 to-transparent' />
        <div className='relative h-full flex items-center justify-center'>
          <div className='animate-spin w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full' />
        </div>
      </section>
    )
  }

  return (
    <section className='relative h-[70vh] md:h-[80vh] overflow-hidden'>
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.5 }}
          className='absolute inset-0'
        >
          <SafeImage
            src={currentFilm.banner_url || currentFilm.poster_url}
            alt={currentFilm.title}
            placeholderType='banner'
            placeholderText={currentFilm.title}
            className='w-full h-full object-cover'
            wrapperClassName='absolute inset-0'
          />

          <div className='absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/30 to-transparent' />
          <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-brand-primary/20 to-transparent' />

          <div className='relative h-full flex items-end'>
            <div className='container pb-12 md:pb-20'>
              <div className='max-w-4xl'>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className='mb-6'
                >
                  <span className='inline-flex items-center gap-2 bg-brand-white/10 px-4 py-2 rounded-full text-brand-gold text-sm font-medium mb-6'>
                    <FilmIcon className='w-4 h-4' />
                    {currentFilm.status === 'released' ? 'Now Playing' : 'Coming Soon'}
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className='text-4xl md:text-5xl lg:text-6xl font-display font-bold text-brand-white mb-4'
                >
                  {currentFilm.title}
                </motion.h1>

                {currentFilm.tagline && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className='text-xl md:text-2xl text-brand-gold font-medium mb-6 max-w-2xl'
                  >
                    &ldquo;{currentFilm.tagline}&rdquo;
                  </motion.p>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className='flex flex-wrap items-center gap-4'
                >
                  {currentFilm.release_date && (
                    <span className='px-4 py-2 bg-brand-white/10 rounded-lg text-brand-white text-sm font-medium'>
                      Released: {new Date(currentFilm.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  )}
                  {currentFilm.runtime_minutes && (
                    <span className='px-4 py-2 bg-brand-white/10 rounded-lg text-brand-white text-sm font-medium'>
                      {currentFilm.runtime_minutes} min
                    </span>
                  )}
                  {currentFilm.rating && (
                    <span className='px-4 py-2 bg-brand-white/10 rounded-lg text-brand-white text-sm font-medium'>
                      {currentFilm.rating}
                    </span>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className='mt-8 flex flex-wrap gap-4'
                >
                  {trailerUrl && (
                    <button
                      onClick={() => setShowTrailer(true)}
                      className='btn-primary flex items-center gap-2'
                    >
                      <Play className='w-5 h-5' />
                      Watch Trailer
                    </button>
                  )}
                  <Link to={'/films/' + currentFilm.slug} className='btn-secondary'>
                    View Details
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prevSlide}
        className='absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-brand-white/10 hover:bg-brand-white/20 rounded-full text-brand-white transition-colors hidden md:block'
        aria-label='Previous slide'
      >
        <ChevronLeft className='w-6 h-6' />
      </button>
      <button
        onClick={nextSlide}
        className='absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-brand-white/10 hover:bg-brand-white/20 rounded-full text-brand-white transition-colors hidden md:block'
        aria-label='Next slide'
      >
        <ChevronRight className='w-6 h-6' />
      </button>

      <div className='absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2'>
        {displayFilms.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              'w-2 h-2 rounded-full transition-all',
              index === currentIndex
                ? 'bg-brand-primary w-8'
                : 'bg-brand-white/30 hover:bg-brand-white/50'
            )}
            aria-label={'Go to slide ' + (index + 1)}
            aria-current={index === currentIndex ? 'true' : 'false'}
          />
        ))}
      </div>

      <div className='absolute bottom-4 right-4 flex items-center gap-2'>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className='p-2 bg-brand-white/10 hover:bg-brand-white/20 rounded-full text-brand-white transition-colors'
          aria-label={isPlaying ? 'Pause auto-play' : 'Resume auto-play'}
        >
          {isPlaying ? (
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'><rect x='6' y='4' width='4' height='16'/><rect x='14' y='4' width='4' height='16'/></svg>
          ) : (
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 5v14l11-7z'/></svg>
          )}
        </button>
        <span className='text-brand-white/60 text-sm'>
          {currentIndex + 1} / {displayFilms.length}
        </span>
      </div>

      {showTrailer && trailerUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/95 backdrop-blur-sm'
          onClick={() => setShowTrailer(false)}
          role='dialog'
          aria-modal='true'
          aria-label='Trailer player'
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className='relative w-full max-w-4xl aspect-video mx-4'
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTrailer(false)}
              className='absolute top-4 right-4 z-10 p-2 bg-brand-dark/80 rounded-full text-brand-white hover:bg-brand-primary transition-colors'
              aria-label='Close trailer'
            >
              <X className='w-6 h-6' />
            </button>
            <iframe
              src={trailerUrl}
              title={currentFilm.title + ' Trailer'}
              frameBorder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              sandbox='allow-scripts allow-same-origin allow-presentation'
              allowFullScreen
              className='w-full h-full rounded-xl'
            />
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}