import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getBanners } from '@/lib/public-api'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { SafeImage } from '@/components/shared/SafeImage'
import { EASE, heroChild } from '@/lib/motion'

interface Banner {
  id: number
  title: string | null
  subtitle: string | null
  link_url: string | null
  link_text: string | null
  image_url: string | null
  bg_color: string | null
  sort_order: number
  is_active: boolean
}

const SLIDE_DURATION_MS = 5000

export const BannerSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const { data, isLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: getBanners,
  })

  const banners: Banner[] = Array.isArray(data) ? data : data?.data || []

  useEffect(() => {
    if (banners.length <= 1 || !isPlaying) return
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % banners.length)
    }, SLIDE_DURATION_MS)
    return () => clearInterval(interval)
  }, [banners.length, isPlaying])

  const nextSlide = () => setCurrentIndex(prev => (prev + 1) % banners.length)
  const prevSlide = () => setCurrentIndex(prev => (prev - 1 + banners.length) % banners.length)

  if (isLoading) {
    return (
      <section className='relative h-[70vh] md:h-[80vh] bg-[#0a141e]'>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-[#09333f]/20 to-transparent' />
        <div className='relative h-full flex items-center justify-center'>
          <div className='animate-spin w-12 h-12 border-4 border-[#09333f]/20 border-t-[#09333f] rounded-full' />
        </div>
      </section>
    )
  }

  if (banners.length === 0) return null

  const current = banners[currentIndex]

  return (
    <section className='relative h-[70vh] md:h-[80vh] overflow-hidden bg-brand-dark'>
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className='absolute inset-0'
        >
          {/* Slow Ken-Burns zoom on the active slide's image */}
          <motion.div
            className='absolute inset-0'
            initial={{ scale: 1 }}
            animate={{ scale: 1.06 }}
            transition={{ duration: SLIDE_DURATION_MS / 1000, ease: 'linear' }}
          >
            <SafeImage
              src={current.image_url}
              alt={current.title || ''}
              placeholderType='banner'
              className='w-full h-full object-cover'
              wrapperClassName='absolute inset-0'
            />
          </motion.div>

          <div className='hero-scrim' />

          <div className='relative h-full flex items-end'>
            <div className='container pb-12 md:pb-20'>
              <div className='max-w-4xl'>
                <motion.span
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={heroChild(0)}
                  className='eyebrow-pill mb-5'
                >
                  Featured
                </motion.span>

                {current.title && (
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={heroChild(0.12)}
                    className='text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-4 leading-[1.05] tracking-tight text-shadow-sm'
                  >
                    {current.title}
                  </motion.h1>
                )}

                {current.subtitle && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={heroChild(0.22)}
                    className='text-xl md:text-2xl text-brand-gold font-medium mb-6 max-w-2xl'
                  >
                    {current.subtitle}
                  </motion.p>
                )}

                {current.link_url && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={heroChild(0.32)}
                  >
                    {current.link_url.startsWith('/') ? (
                      <Link
                        to={current.link_url}
                        className='btn-primary'
                      >
                        {current.link_text || 'View Details'}
                        <ExternalLink size={18} />
                      </Link>
                    ) : (
                      <a
                        href={current.link_url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='btn-primary'
                      >
                        {current.link_text || 'Learn More'}
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className='absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors hidden md:block'
          >
            <ChevronLeft className='w-6 h-6' />
          </button>
          <button
            onClick={nextSlide}
            className='absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors hidden md:block'
          >
            <ChevronRight className='w-6 h-6' />
          </button>
          <div className='absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2'>
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'h-1 rounded-full transition-all duration-500',
                  index === currentIndex
                    ? 'bg-brand-gold w-10'
                    : 'bg-white/30 hover:bg-white/50 w-3'
                )}
                aria-label={'Go to slide ' + (index + 1)}
              />
            ))}
          </div>
          <div className='absolute bottom-4 right-4 flex items-center gap-2'>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className='p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors'
              aria-label={isPlaying ? 'Pause auto-play' : 'Resume auto-play'}
            >
              {isPlaying ? (
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'><rect x='6' y='4' width='4' height='16'/><rect x='14' y='4' width='4' height='16'/></svg>
              ) : (
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 5v14l11-7z'/></svg>
              )}
            </button>
            <span className='text-white/60 text-sm'>
              {currentIndex + 1} / {banners.length}
            </span>
          </div>
        </>
      )}
    </section>
  )
}
