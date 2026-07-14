import { Film } from '@/types'
import { motion } from 'framer-motion'
import { Award, Calendar, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilmAwardsProps {
  film: Film
}

export const FilmAwards: React.FC<FilmAwardsProps> = ({ film }) => {
  const awards = film.awards || []

  if (awards.length === 0) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className='space-y-8'
    >
      <h2 className='heading-2 text-brand-primary mb-6 flex items-center gap-3'>
        <Trophy className='w-6 h-6 text-brand-gold' />
        Awards & Recognition
      </h2>
      <div className='grid md:grid-cols-2 gap-4'>
        {awards.map((award, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: index * 0.1 }}
            className='card p-6 flex items-start gap-4'
          >
            <div className='flex-shrink-0 w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center'>
              {award.result === 'won' ? (
                <Trophy className='w-6 h-6 text-brand-gold' />
              ) : (
                <Award className='w-6 h-6 text-brand-primary' />
              )}
            </div>
            <div className='flex-1'>
              <h4 className='font-semibold text-brand-primary'>{award.award_name}</h4>
              {award.category && <p className='text-brand-muted text-sm'>{award.category}</p>}
              <div className='flex items-center gap-4 mt-2 text-sm text-brand-muted'>
                <span className='flex items-center gap-1'>
                  <Calendar className='w-4 h-4' />
                  {award.year}
                </span>
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-medium',
                  award.result === 'won' && 'bg-green-100 text-green-800',
                  award.result === 'nominated' && 'bg-blue-100 text-blue-800',
                  award.result === 'shortlisted' && 'bg-yellow-100 text-yellow-800',
                )}>
                  {award.result}
                </span>
              </div>
              {award.notes && <p className='text-brand-muted text-sm mt-2'>{award.notes}</p>}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}