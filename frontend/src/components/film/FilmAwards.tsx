import { Film } from '@/types'
import { motion } from 'framer-motion'
import { Award, Calendar, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { statusStyles, awardResultKind } from '@/lib/status'
import { fadeUpViewport, staggerContainer, staggerItem, cardHover } from '@/lib/motion'

interface FilmAwardsProps {
  film: Film
}

export const FilmAwards: React.FC<FilmAwardsProps> = ({ film }) => {
  const awards = film.awards || []

  if (awards.length === 0) return null

  return (
    <motion.section
      initial='initial'
      whileInView='whileInView'
      viewport={fadeUpViewport}
      variants={staggerContainer}
      className='space-y-8'
    >
      <motion.h2 variants={staggerItem} className='heading-2 text-brand-primary dark:text-brand-white flex items-center gap-3'>
        <Trophy className='w-6 h-6 text-brand-gold' />
        Awards & Recognition
      </motion.h2>
      <div className='grid md:grid-cols-2 gap-4'>
        {awards.map((award, index) => {
          const kind = awardResultKind[award.result] || 'neutral'
          return (
            <motion.div
              key={index}
              variants={staggerItem}
              {...cardHover}
              className='card p-6 flex items-start gap-4'
            >
              <div className={cn('flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center', statusStyles[kind].soft)}>
                {award.result === 'won' ? <Trophy className='w-6 h-6' /> : <Award className='w-6 h-6' />}
              </div>
              <div className='flex-1'>
                <h4 className='font-semibold text-brand-primary dark:text-brand-white'>{award.award_name}</h4>
                {award.category && <p className='text-brand-muted dark:text-brand-white/60 text-sm'>{award.category}</p>}
                <div className='flex items-center gap-4 mt-2 text-sm text-brand-muted dark:text-brand-white/60'>
                  <span className='flex items-center gap-1'>
                    <Calendar className='w-4 h-4' />
                    {award.year}
                  </span>
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium capitalize', statusStyles[kind].soft)}>
                    {award.result}
                  </span>
                </div>
                {award.notes && <p className='text-brand-muted dark:text-brand-white/60 text-sm mt-2'>{award.notes}</p>}
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.section>
  )
}
