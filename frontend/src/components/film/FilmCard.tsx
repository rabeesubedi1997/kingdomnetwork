import { Film } from '@/types'
import { cn, formatDate, getEmbedUrl } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, Award, Calendar, Clock } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { PlaceholderImage } from '@/components/shared/PlaceholderImage'

interface FilmCardProps {
  film: Film
  index?: number
  featured?: boolean
}

export const FilmCard: React.FC<FilmCardProps> = ({ film, index = 0, featured = false }) => {
  const trailerUrl = getEmbedUrl(film.trailer_url || '')

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        'card group',
        featured && 'md:col-span-2'
      )}
    >
      <div className='relative overflow-hidden'>
        {film.poster_url ? (
          <div className='aspect-[2/3]'>
            <img
              src={film.poster_url}
              alt={film.title}
              className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
              loading='lazy'
            />
          </div>
        ) : (
          <PlaceholderImage type="film" text={film.title} />
        )}

        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

        <div className='absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300'>
          <StatusBadge status={film.status} large />
        </div>

        {trailerUrl && (
          <button
            className='absolute top-4 right-4 w-10 h-10 rounded-full bg-brand-white/90 text-brand-primary flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-brand-primary hover:text-white'
            aria-label={'Watch ' + film.title + ' trailer'}
          >
            <Play className='w-5 h-5 ml-0.5' />
          </button>
        )}
      </div>

      <div className='p-5'>
        <div className='flex items-center gap-2 mb-2'>
          {film.genres.slice(0, 2).map(genre => (
            <span key={genre.id} className='px-2 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-medium'>
              {genre.name}
            </span>
          ))}
          {film.genres.length > 2 && (
            <span className='px-2 py-1 bg-brand-surface/50 text-brand-muted rounded-full text-xs font-medium'>
              +{film.genres.length - 2}
            </span>
          )}
        </div>

        <Link to={'/films/' + film.slug} className='block'>
          <h3 className='heading-3 text-brand-primary mb-2 group-hover:text-brand-secondary transition-colors'>
            {film.title}
          </h3>
        </Link>

        {film.short_description && (
          <p className='text-brand-muted text-sm mb-4 line-clamp-2'>{film.short_description}</p>
        )}

        <div className='flex flex-wrap items-center gap-3 text-sm text-brand-muted'>
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
    </motion.article>
  )
}