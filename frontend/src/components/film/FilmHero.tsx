import { Film } from '@/types'
import { getEmbedUrl } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, X, Award, Calendar, Clock } from 'lucide-react'
import { useState } from 'react'
import { StatusBadge } from './StatusBadge'
import { FilmSchema } from './FilmSchema'
import { SafeImage } from '@/components/shared/SafeImage'
import { filmStatusLabel } from '@/lib/status'
import { heroTitle, heroChild } from '@/lib/motion'

interface FilmHeroProps {
  film: Film
}

export const FilmHero: React.FC<FilmHeroProps> = ({ film }) => {
  const [showTrailer, setShowTrailer] = useState(false)
  const trailerUrl = getEmbedUrl(film.trailer_url || '')

  const eyebrowText = film.status === 'released'
    ? 'Now Showing'
    : filmStatusLabel[film.status] || film.genres?.[0]?.name || 'Kingdom Network Films'

  return (
    <>
      <FilmSchema film={film} />

      <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <SafeImage
            src={film.banner_url || film.poster_url}
            alt={`${film.title} background`}
            placeholderType="banner"
            aspectRatio="auto"
            className="w-full h-full object-cover"
          />
          <div className="hero-scrim" />
        </div>

        <div className="relative z-10 w-full pb-12 md:pb-20">
          <div className="container">
            <div className="grid lg:grid-cols-4 gap-8 items-end">
              <div className="lg:col-span-3">
                {film.poster_url && (
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={heroChild(0)}
                    className="max-w-xs mx-auto lg:mx-0 relative z-20 md:-mb-28"
                  >
                    <SafeImage
                      src={film.poster_url}
                      alt={`${film.title} poster`}
                      placeholderType="film"
                      wrapperClassName="w-full aspect-[2/3] rounded-xl shadow-2xl border border-brand-white/10"
                    />
                  </motion.div>
                )}

                <div className="mt-6 md:mt-0">
                  <motion.span
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={heroChild(0.05)}
                    className="eyebrow text-brand-gold mb-4"
                  >
                    {eyebrowText}
                  </motion.span>

                  <motion.h1
                    initial="initial"
                    animate="animate"
                    variants={heroTitle}
                    className="heading-1 text-4xl md:text-6xl lg:text-7xl text-brand-white mb-3 text-shadow-sm"
                  >
                    {film.title}
                  </motion.h1>
                  {film.tagline && (
                    <motion.p
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={heroChild(0.15)}
                      className="text-brand-gold text-lg font-medium mb-4"
                    >
                      "{film.tagline}"
                    </motion.p>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={heroChild(0.2)}
                    className="flex flex-wrap items-center gap-2 mb-4"
                  >
                    <StatusBadge status={film.status} large />
                    {film.genres?.map(genre => (
                      <span key={genre.id} className="px-3 py-1 bg-brand-white/10 text-brand-white rounded-full text-xs font-medium">
                        {genre.name}
                      </span>
                    ))}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={heroChild(0.25)}
                    className="flex flex-wrap items-center gap-6 text-brand-white/80 mb-6"
                  >
                    {film.release_date && (
                      <span className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        {new Date(film.release_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                    {film.runtime_minutes && (
                      <span className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        {film.runtime_minutes} min
                      </span>
                    )}
                    {film.rating && (
                      <span className="flex items-center gap-2 px-3 py-1 bg-brand-white/10 rounded-full text-sm">
                        {film.rating}
                      </span>
                    )}
                    {film.awards && film.awards.length > 0 && (
                      <span className="flex items-center gap-2 text-brand-gold">
                        <Award className="w-5 h-5" />
                        {film.awards.length} award{film.awards.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={heroChild(0.3)}
                    className="flex flex-wrap gap-3"
                  >
                    {trailerUrl && (
                      <button
                        onClick={() => setShowTrailer(true)}
                        className="btn-primary flex items-center gap-2"
                      >
                        <Play className="w-5 h-5" />
                        Watch Trailer
                      </button>
                    )}
                    <Link to={`/films/${film.slug}`} className="btn-secondary">
                      View Details
                    </Link>
                  </motion.div>
                </div>
              </div>

              {film.poster_url && (
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={heroChild(0.2)}
                  className="hidden lg:block lg:col-span-1"
                >
                  <div className="sticky top-24">
                    <SafeImage
                      src={film.poster_url}
                      alt={`${film.title} poster`}
                      placeholderType="film"
                      wrapperClassName="w-full aspect-[2/3] rounded-xl shadow-2xl border border-brand-white/10"
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {showTrailer && trailerUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/95 backdrop-blur-sm"
          onClick={() => setShowTrailer(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Trailer player"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-4xl aspect-video mx-4"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-brand-dark/80 rounded-full text-brand-white hover:bg-brand-primary transition-colors"
              aria-label="Close trailer"
            >
              <X className="w-6 h-6" />
            </button>
            <iframe
              src={trailerUrl}
              title={`${film.title} Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              sandbox="allow-scripts allow-same-origin allow-presentation"
              allowFullScreen
              className="w-full h-full rounded-xl"
            />
          </motion.div>
        </motion.div>
      )}
    </>
  )
}
