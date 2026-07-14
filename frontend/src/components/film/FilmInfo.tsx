import { Film } from '@/types'
import { motion } from 'framer-motion'
import { cn, formatDate } from '@/lib/utils'
import { Calendar, Clock, MapPin, Award, Globe, Users, Film as FilmIcon } from 'lucide-react'

interface FilmInfoProps {
  film: Film
}

export const FilmInfo: React.FC<FilmInfoProps> = ({ film }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className='space-y-8'
  >
    <div>
      <h2 className='heading-2 text-brand-primary mb-4'>Synopsis</h2>
      <p className='text-brand-text leading-relaxed text-lg'>{film.synopsis}</p>
    </div>

    {film.short_description && (
      <div className='bg-brand-surface/50 rounded-xl p-6 border border-brand-surface'>
        <h3 className='font-semibold text-brand-primary mb-2'>Short Description</h3>
        <p className='text-brand-text'>{film.short_description}</p>
      </div>
    )}

    <div className='grid sm:grid-cols-2 gap-6'>
      {film.release_date && (
        <div className='flex items-start gap-3 p-4 bg-brand-surface/50 rounded-xl border border-brand-surface'>
          <div className='w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center flex-shrink-0'>
            <Calendar className='w-5 h-5 text-brand-primary' />
          </div>
          <div>
            <p className='text-xs font-medium text-brand-muted uppercase tracking-wide'>Release Date</p>
            <p className='text-brand-text'>{formatDate(film.release_date, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      )}
      {film.runtime_minutes && (
        <div className='flex items-start gap-3 p-4 bg-brand-surface/50 rounded-xl border border-brand-surface'>
          <div className='w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center flex-shrink-0'>
            <Clock className='w-5 h-5 text-brand-primary' />
          </div>
          <div>
            <p className='text-xs font-medium text-brand-muted uppercase tracking-wide'>Runtime</p>
            <p className='text-brand-text'>{film.runtime_minutes} minutes</p>
          </div>
        </div>
      )}
      {film.rating && (
        <div className='flex items-start gap-3 p-4 bg-brand-surface/50 rounded-xl border border-brand-surface'>
          <div className='w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center flex-shrink-0'>
            <Award className='w-5 h-5 text-brand-primary' />
          </div>
          <div>
            <p className='text-xs font-medium text-brand-muted uppercase tracking-wide'>Rating</p>
            <p className='text-brand-text'>{film.rating}</p>
          </div>
        </div>
      )}
      {film.language && (
        <div className='flex items-start gap-3 p-4 bg-brand-surface/50 rounded-xl border border-brand-surface'>
          <div className='w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center flex-shrink-0'>
            <Globe className='w-5 h-5 text-brand-primary' />
          </div>
          <div>
            <p className='text-xs font-medium text-brand-muted uppercase tracking-wide'>Language</p>
            <p className='text-brand-text'>{film.language}</p>
          </div>
        </div>
      )}
      {film.country && (
        <div className='flex items-start gap-3 p-4 bg-brand-surface/50 rounded-xl border border-brand-surface'>
          <div className='w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center flex-shrink-0'>
            <MapPin className='w-5 h-5 text-brand-primary' />
          </div>
          <div>
            <p className='text-xs font-medium text-brand-muted uppercase tracking-wide'>Country</p>
            <p className='text-brand-text'>{film.country}</p>
          </div>
        </div>
      )}
      {film.budget && (
        <div className='flex items-start gap-3 p-4 bg-brand-surface/50 rounded-xl border border-brand-surface'>
          <div className='w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center flex-shrink-0'>
            <FilmIcon className='w-5 h-5 text-brand-primary' />
          </div>
          <div>
            <p className='text-xs font-medium text-brand-muted uppercase tracking-wide'>Budget</p>
            <p className='text-brand-text'>{film.budget ? '$' + Number(film.budget).toLocaleString() : 'N/A'}</p>
          </div>
        </div>
      )}
      {film.box_office && (
        <div className='flex items-start gap-3 p-4 bg-brand-surface/50 rounded-xl border border-brand-surface'>
          <div className='w-10 h-10 rounded-lg bg-brand-gold/20 flex items-center justify-center flex-shrink-0'>
            <Award className='w-5 h-5 text-brand-gold' />
          </div>
          <div>
            <p className='text-xs font-medium text-brand-muted uppercase tracking-wide'>Box Office</p>
            <p className='text-brand-text'>{film.box_office ? '$' + Number(film.box_office).toLocaleString() : 'N/A'}</p>
          </div>
        </div>
      )}
    </div>

    {film.genres?.length > 0 && (
      <div>
        <h2 className='heading-2 text-brand-primary mb-4'>Genres</h2>
        <div className='flex flex-wrap gap-2'>
          {film.genres.map(genre => (
            <span key={genre.id} className='px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-medium'>
              {genre.name}
            </span>
          ))}
        </div>
      </div>
    )}

    {film.locations?.length > 0 && (
      <div>
        <h2 className='heading-2 text-brand-primary mb-4'>Filming Locations</h2>
        <div className='flex flex-wrap gap-2'>
          {film.locations.map((location, index) => (
            <span key={index} className='px-3 py-1 bg-brand-surface/50 text-brand-text rounded-full text-sm border border-brand-surface'>
              {location.location_name}{location.country && ', ' + location.country}
            </span>
          ))}
        </div>
      </div>
    )}
  </motion.div>
)