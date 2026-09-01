import { Film } from '@/types'
import { cn, formatDate, getEmbedUrl } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, Award, Calendar, Clock } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { SafeImage } from '@/components/shared/SafeImage'
import { reveal, cardHover } from '@/lib/motion'

interface FilmCardProps {
  film: Film
  index?: number
  featured?: boolean
}

export const FilmCard: React.FC<FilmCardProps> = ({ film, index = 0, featured = false }) => {
  const trailerUrl = getEmbedUrl(film.trailer_url || '')

  return (
    <Link to={'/films/' + film.slug} className='block h-full'>
      <motion.article
        {...reveal(index)}
        {...cardHover}
        className={cn(
          'group relative aspect-[2/3] overflow-hidden rounded-2xl cursor-pointer',
          featured && 'md:col-span-2'
        )}
      >
        <SafeImage
          src={film.poster_url}
          alt={film.title}
          placeholderType='film'
          placeholderText={film.title}
          wrapperClassName='absolute inset-0'
          className='transition-transform duration-500 group-hover:scale-105'
          loading='lazy'
        />

        {/* Bottom-weighted scrim keeps overlaid title/meta legible over any poster */}
        <div className='hero-scrim opacity-90 group-hover:opacity-100 transition-opacity duration-300' />

        {trailerUrl && (
          <span
            className='absolute top-4 right-4 w-10 h-10 rounded-full bg-brand-white/90 text-brand-primary flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-brand-primary hover:text-white'
            aria-label={'Watch ' + film.title + ' trailer'}
          >
            <Play className='w-5 h-5 ml-0.5' />
          </span>
        )}

        <div className='absolute inset-x-0 bottom-0 p-4 md:p-5'>
          <div className='mb-2'>
            <StatusBadge status={film.status} />
          </div>

          <h3 className='heading-3 text-white text-shadow-sm mb-1 leading-tight line-clamp-2 transition-colors group-hover:text-brand-gold'>
            {film.title}
          </h3>

          {film.genres.length > 0 && (
            <p className='text-xs font-medium text-white/60 uppercase tracking-wider line-clamp-1'>
              {film.genres.slice(0, 2).map(g => g.name).join(' • ')}
              {film.genres.length > 2 && ` +${film.genres.length - 2}`}
            </p>
          )}

          <div className='grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out'>
            <div className='overflow-hidden'>
              <div className='pt-3 mt-3 border-t border-white/15 space-y-1.5'>
                {film.short_description && (
                  <p className='text-white/70 text-xs leading-relaxed line-clamp-2'>{film.short_description}</p>
                )}
                <div className='flex flex-wrap items-center gap-3 text-xs text-white/60'>
                  {film.release_date && (
                    <span className='flex items-center gap-1'>
                      <Calendar className='w-3.5 h-3.5' />
                      {formatDate(film.release_date, { year: 'numeric', month: 'short' })}
                    </span>
                  )}
                  {film.runtime_minutes && (
                    <span className='flex items-center gap-1'>
                      <Clock className='w-3.5 h-3.5' />
                      {film.runtime_minutes} min
                    </span>
                  )}
                  {film.awards && film.awards.length > 0 && (
                    <span className='flex items-center gap-1 text-brand-gold'>
                      <Award className='w-3.5 h-3.5' />
                      {film.awards.length} award{film.awards.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  )
}
