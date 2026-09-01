import { Film } from '@/types'
import { motion } from 'framer-motion'
import { formatDate } from '@/lib/utils'
import { Calendar, Clock, MapPin, Award, Globe, Film as FilmIcon } from 'lucide-react'
import { IconTile } from '@/components/ui/IconTile'
import { fadeUp, fadeUpViewport, staggerContainer, staggerItem } from '@/lib/motion'

interface FilmInfoProps {
  film: Film
}

export const FilmInfo: React.FC<FilmInfoProps> = ({ film }) => (
  <div className='space-y-10'>
    <motion.div {...fadeUp} viewport={fadeUpViewport}>
      <h2 className='heading-2 text-brand-primary dark:text-brand-white mb-4'>Synopsis</h2>
      <p className='text-brand-text dark:text-brand-white/90 leading-relaxed text-lg'>{film.synopsis}</p>
    </motion.div>

    {film.short_description && (
      <motion.div {...fadeUp} viewport={fadeUpViewport} className='bg-brand-surface/50 dark:bg-white/10 rounded-xl p-6 border border-brand-surface dark:border-white/10'>
        <h3 className='font-semibold text-brand-primary dark:text-brand-white mb-2'>Short Description</h3>
        <p className='text-brand-text dark:text-brand-white/90'>{film.short_description}</p>
      </motion.div>
    )}

    <motion.div
      initial='initial'
      whileInView='whileInView'
      viewport={fadeUpViewport}
      variants={staggerContainer}
      className='grid sm:grid-cols-2 gap-4'
    >
      {film.release_date && (
        <motion.div variants={staggerItem}>
          <IconTile
            icon={Calendar}
            layout='horizontal'
            size='sm'
            label='Release Date'
            value={formatDate(film.release_date, { year: 'numeric', month: 'long', day: 'numeric' })}
            className='p-4 bg-brand-surface/50 dark:bg-white/10 rounded-xl border border-brand-surface dark:border-white/10 h-full'
          />
        </motion.div>
      )}
      {film.runtime_minutes && (
        <motion.div variants={staggerItem}>
          <IconTile
            icon={Clock}
            layout='horizontal'
            size='sm'
            label='Runtime'
            value={`${film.runtime_minutes} minutes`}
            className='p-4 bg-brand-surface/50 dark:bg-white/10 rounded-xl border border-brand-surface dark:border-white/10 h-full'
          />
        </motion.div>
      )}
      {film.rating && (
        <motion.div variants={staggerItem}>
          <IconTile
            icon={Award}
            layout='horizontal'
            size='sm'
            label='Rating'
            value={film.rating}
            className='p-4 bg-brand-surface/50 dark:bg-white/10 rounded-xl border border-brand-surface dark:border-white/10 h-full'
          />
        </motion.div>
      )}
      {film.language && (
        <motion.div variants={staggerItem}>
          <IconTile
            icon={Globe}
            layout='horizontal'
            size='sm'
            label='Language'
            value={film.language}
            className='p-4 bg-brand-surface/50 dark:bg-white/10 rounded-xl border border-brand-surface dark:border-white/10 h-full'
          />
        </motion.div>
      )}
      {film.country && (
        <motion.div variants={staggerItem}>
          <IconTile
            icon={MapPin}
            layout='horizontal'
            size='sm'
            label='Country'
            value={film.country}
            className='p-4 bg-brand-surface/50 dark:bg-white/10 rounded-xl border border-brand-surface dark:border-white/10 h-full'
          />
        </motion.div>
      )}
      {film.budget && (
        <motion.div variants={staggerItem}>
          <IconTile
            icon={FilmIcon}
            layout='horizontal'
            size='sm'
            label='Budget'
            value={film.budget ? '$' + Number(film.budget).toLocaleString() : 'N/A'}
            className='p-4 bg-brand-surface/50 dark:bg-white/10 rounded-xl border border-brand-surface dark:border-white/10 h-full'
          />
        </motion.div>
      )}
      {film.box_office && (
        <motion.div variants={staggerItem}>
          <IconTile
            icon={Award}
            layout='horizontal'
            size='sm'
            label='Box Office'
            value={film.box_office ? '$' + Number(film.box_office).toLocaleString() : 'N/A'}
            iconBoxClassName='bg-brand-gold/20 dark:bg-brand-gold/20'
            iconClassName='text-brand-gold dark:text-brand-gold'
            className='p-4 bg-brand-surface/50 dark:bg-white/10 rounded-xl border border-brand-surface dark:border-white/10 h-full'
          />
        </motion.div>
      )}
    </motion.div>

    {film.genres?.length > 0 && (
      <motion.div {...fadeUp} viewport={fadeUpViewport}>
        <h2 className='heading-2 text-brand-primary dark:text-brand-white mb-4'>Genres</h2>
        <div className='flex flex-wrap gap-2'>
          {film.genres.map(genre => (
            <span key={genre.id} className='px-3 py-1 bg-brand-primary/10 dark:bg-white/10 text-brand-primary dark:text-brand-white rounded-full text-sm font-medium'>
              {genre.name}
            </span>
          ))}
        </div>
      </motion.div>
    )}

    {film.locations?.length > 0 && (
      <motion.div {...fadeUp} viewport={fadeUpViewport}>
        <h2 className='heading-2 text-brand-primary dark:text-brand-white mb-4'>Filming Locations</h2>
        <div className='flex flex-wrap gap-2'>
          {film.locations.map((location, index) => (
            <span key={index} className='px-3 py-1 bg-brand-surface/50 dark:bg-white/10 text-brand-text dark:text-brand-white/90 rounded-full text-sm border border-brand-surface dark:border-white/10'>
              {location.location_name}{location.country && ', ' + location.country}
            </span>
          ))}
        </div>
      </motion.div>
    )}
  </div>
)
