import { Film } from '@/types'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fadeUp, fadeUpViewport, staggerContainer, staggerItem, cardHover } from '@/lib/motion'
import { SafeImage } from '@/components/shared/SafeImage'

interface FilmCastCrewProps {
  film: Film
}

export const FilmCastCrew: React.FC<FilmCastCrewProps> = ({ film }) => {
  const leadCast = film.cast?.filter(c => c.is_lead).slice(0, 6) || []
  const supportingCast = film.cast?.filter(c => !c.is_lead).slice(0, 6) || []
  const keyCrew = film.crew?.slice(0, 8) || []

  return (
    <div className='space-y-12'>
      {(leadCast.length > 0 || supportingCast.length > 0) && (
        <motion.div {...fadeUp} viewport={fadeUpViewport}>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='heading-2 text-brand-primary dark:text-brand-white'>Cast</h2>
            <Link to={'/films/' + film.slug + '#cast'} className='text-brand-primary dark:text-brand-white hover:text-brand-secondary dark:hover:text-brand-gold text-sm font-medium flex items-center gap-1 transition-colors'>
              View All <span>→</span>
            </Link>
          </div>

          {leadCast.length > 0 && (
            <div className='mb-8'>
              <h3 className='font-semibold text-brand-primary dark:text-brand-white/80 mb-4'>Lead Cast</h3>
              <motion.div
                initial='initial'
                whileInView='whileInView'
                viewport={fadeUpViewport}
                variants={staggerContainer}
                className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4'
              >
                {leadCast.map(member => (
                  <motion.article key={member.id} variants={staggerItem} {...cardHover} className='card group'>
                    <SafeImage
                      src={member.person?.photo_url}
                      alt={member.person?.name}
                      placeholderType='person'
                      wrapperClassName='w-full aspect-square rounded-t-xl'
                      className='transition-transform duration-500 group-hover:scale-105'
                    />
                    <div className='p-4'>
                      <Link to={'/people/' + member.person.slug} className='block'>
                        <h4 className='font-semibold text-brand-primary dark:text-brand-white mb-1 group-hover:text-brand-secondary dark:group-hover:text-brand-gold transition-colors'>{member.person.name}</h4>
                      </Link>
                      <p className='text-brand-muted dark:text-brand-white/60 text-sm'>{member.role_name || member.character_name}</p>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </div>
          )}

          {supportingCast.length > 0 && (
            <div>
              <h3 className='font-semibold text-brand-primary dark:text-brand-white/80 mb-4'>Supporting Cast</h3>
              <motion.div
                initial='initial'
                whileInView='whileInView'
                viewport={fadeUpViewport}
                variants={staggerContainer}
                className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4'
              >
                {supportingCast.map(member => (
                  <motion.article key={member.id} variants={staggerItem} {...cardHover} className='card group'>
                    <SafeImage
                      src={member.person?.photo_url}
                      alt={member.person?.name}
                      placeholderType='person'
                      wrapperClassName='w-full aspect-square rounded-t-xl'
                      className='transition-transform duration-500 group-hover:scale-105'
                    />
                    <div className='p-4'>
                      <Link to={'/people/' + member.person?.slug} className='block'>
                        <h4 className='font-semibold text-brand-primary dark:text-brand-white mb-1 group-hover:text-brand-secondary dark:group-hover:text-brand-gold transition-colors'>{member.person?.name}</h4>
                      </Link>
                      <p className='text-brand-muted dark:text-brand-white/60 text-sm'>{member.role_name || member.character_name}</p>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </div>
          )}
        </motion.div>
      )}

      {keyCrew.length > 0 && (
        <motion.div {...fadeUp} viewport={fadeUpViewport}>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='heading-2 text-brand-primary dark:text-brand-white'>Key Crew</h2>
            <Link to={'/films/' + film.slug + '#crew'} className='text-brand-primary dark:text-brand-white hover:text-brand-secondary dark:hover:text-brand-gold text-sm font-medium flex items-center gap-1 transition-colors'>
              View All <span>→</span>
            </Link>
          </div>

          <motion.div
            initial='initial'
            whileInView='whileInView'
            viewport={fadeUpViewport}
            variants={staggerContainer}
            className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'
          >
            {keyCrew.map(member => (
              <motion.article key={member.id} variants={staggerItem} {...cardHover} className='card group'>
                <SafeImage
                  src={member.person?.photo_url}
                  alt={member.person?.name}
                  placeholderType='person'
                  wrapperClassName='w-full aspect-square rounded-t-xl'
                  className='transition-transform duration-500 group-hover:scale-105'
                />
                <div className='p-4'>
                  <Link to={'/people/' + member.person?.slug} className='block'>
                    <h4 className='font-semibold text-brand-primary dark:text-brand-white mb-1 group-hover:text-brand-secondary dark:group-hover:text-brand-gold transition-colors'>{member.person?.name}</h4>
                  </Link>
                  <p className='text-brand-muted dark:text-brand-white/60 text-sm capitalize'>{member.department}</p>
                  <p className='text-brand-text dark:text-brand-white/80 text-sm font-medium'>{member.role}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
