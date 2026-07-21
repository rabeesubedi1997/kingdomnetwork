import { Film } from '@/types'
import { cn, getEmbedUrl } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, ChevronLeft, ChevronRight, X, Maximize2, Award, Calendar, Clock } from 'lucide-react'
import { useState } from 'react'
import { StatusBadge } from './StatusBadge'
import { FilmSchema } from './FilmSchema'

interface FilmHeroProps {
  film: Film
}

export const FilmHero: React.FC<FilmHeroProps> = ({ film }) => {
  const [showTrailer, setShowTrailer] = useState(false)
  const trailerUrl = getEmbedUrl(film.trailer_url || '')

  return (
    <>
      <FilmSchema film={film} />
      
      <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={film.banner_url || film.poster_url || ''}
            alt={`${film.title} background`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/30 to-transparent" />
        </div>

        <div className="relative z-10 w-full pb-12 md:pb-20">
          <div className="container">
            <div className="grid lg:grid-cols-4 gap-8 items-end">
              <div className="lg:col-span-3">
                {film.poster_url && (
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-xs mx-auto lg:mx-0 relative z-20 md:-mb-28"
                  >
                    <img
                      src={film.poster_url}
                      alt={`${film.title} poster`}
                      className="w-full aspect-[2/3] object-cover rounded-xl shadow-2xl border border-brand-white/10"
                    />
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mt-6 md:mt-0"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <StatusBadge status={film.status} large />
                    {film.genres?.map(genre => (
                      <span key={genre.id} className="px-3 py-1 bg-brand-white/10 text-brand-white rounded-full text-xs font-medium">
                        {genre.name}
                      </span>
                    ))}
                  </div>

                  <h1 className="heading-1 text-brand-white mb-3">{film.title}</h1>
                  {film.tagline && (
                    <p className="text-brand-gold text-lg font-medium mb-4">"{film.tagline}"</p>
                  )}

                  <div className="flex flex-wrap items-center gap-6 text-brand-white/80 mb-6">
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
                  </div>

                  <div className="flex flex-wrap gap-3">
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
                  </div>
                </motion.div>
              </div>

              {film.poster_url && (
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="hidden lg:block lg:col-span-1"
                >
                  <div className="sticky top-24">
                    <img
                      src={film.poster_url}
                      alt={`${film.title} poster`}
                      className="w-full aspect-[2/3] object-cover rounded-xl shadow-2xl border border-brand-white/10"
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
              allowFullScreen
              className="w-full h-full rounded-xl"
            />
          </motion.div>
        </motion.div>
      )}
    </>
  )
}