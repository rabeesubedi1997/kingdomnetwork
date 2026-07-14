import { Film } from '@/types'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Users, Film as FilmIcon, Award } from 'lucide-react'

interface FilmCastCrewProps {
  film: Film
}

export const FilmCastCrew: React.FC<FilmCastCrewProps> = ({ film }) => {
  const leadCast = film.cast?.filter(c => c.is_lead).slice(0, 6) || []
  const supportingCast = film.cast?.filter(c => !c.is_lead).slice(0, 6) || []
  const keyCrew = film.crew?.slice(0, 8) || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className='space-y-12'
    >
      {(leadCast.length > 0 || supportingCast.length > 0) && (
        <div>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='heading-2 text-brand-primary'>Cast</h2>
            <Link to={'/films/' + film.slug + '#cast'} className='text-brand-primary hover:text-brand-secondary text-sm font-medium flex items-center gap-1'>
              View All <span>→</span>
            </Link>
          </div>

          {leadCast.length > 0 && (
            <div className='mb-8'>
              <h3 className='font-semibold text-brand-primary mb-4'>Lead Cast</h3>
              <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4'>
                {leadCast.map((member, index) => (
                  <motion.article
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className='card'
                  >
                    {member.person?.photo_url && (
                      <img
                        src={member.person.photo_url}
                        alt={member.person.name}
                        className='w-full aspect-square object-cover rounded-t-xl'
                      />
                    )}
                    <div className='p-4'>
                      <Link to={'/people/' + member.person.slug} className='block'>
                        <h4 className='font-semibold text-brand-primary mb-1 group-hover:text-brand-secondary transition-colors'>{member.person.name}</h4>
                      </Link>
                      <p className='text-brand-muted text-sm'>{member.role_name || member.character_name}</p>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          )}

          {supportingCast.length > 0 && (
            <div>
              <h3 className='font-semibold text-brand-primary mb-4'>Supporting Cast</h3>
              <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4'>
                {supportingCast.map((member, index) => (
                  <motion.article
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className='card'
                  >
                    {member.person?.photo_url && (
                      <img
                        src={member.person.photo_url}
                        alt={member.person.name}
                        className='w-full aspect-square object-cover rounded-t-xl'
                      />
                    )}
                    <div className='p-4'>
                      <Link to={'/people/' + member.person?.slug} className='block'>
                        <h4 className='font-semibold text-brand-primary mb-1 group-hover:text-brand-secondary transition-colors'>{member.person?.name}</h4>
                      </Link>
                      <p className='text-brand-muted text-sm'>{member.role_name || member.character_name}</p>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {keyCrew.length > 0 && (
        <div>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='heading-2 text-brand-primary'>Key Crew</h2>
            <Link to={'/films/' + film.slug + '#crew'} className='text-brand-primary hover:text-brand-secondary text-sm font-medium flex items-center gap-1'>
              View All <span>→</span>
            </Link>
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
            {keyCrew.map((member, index) => (
              <motion.article
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className='card'
              >
                {member.person?.photo_url && (
                  <img
                    src={member.person.photo_url}
                    alt={member.person.name}
                    className='w-full aspect-square object-cover rounded-t-xl'
                  />
                )}
                <div className='p-4'>
                  <Link to={'/people/' + member.person?.slug} className='block'>
                    <h4 className='font-semibold text-brand-primary mb-1 group-hover:text-brand-secondary transition-colors'>{member.person?.name}</h4>
                  </Link>
                  <p className='text-brand-muted text-sm capitalize'>{member.department}</p>
                  <p className='text-brand-text text-sm font-medium'>{member.role}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}