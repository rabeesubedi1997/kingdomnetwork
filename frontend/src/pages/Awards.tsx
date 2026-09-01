import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAwardsSummary } from '@/hooks/useData'
import { Section, Container } from '@/components/layout/Section'
import { SEOHead } from '@/components/seo/SEOHead'
import { Loading } from '@/components/ui/Loading'
import { Trophy, Award, Star, ExternalLink, Medal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { statusStyles, awardResultKind } from '@/lib/status'
import { heroChild, fadeUpViewport, staggerContainer, staggerItem, cardHover } from '@/lib/motion'

export const AwardsPage = () => {
  const { data, isLoading } = useAwardsSummary()

  if (isLoading) {
    return (
      <Section padding="xl">
        <Container>
          <Loading text="Loading awards..." />
        </Container>
      </Section>
    )
  }

  return (
    <>
      <SEOHead title="Awards & Accolades" description="Awards and accolades received by Kingdom Network films" />
      <Section id="awards-hero" background="dark" padding="2xl" className="relative overflow-hidden">
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-brand-gold/10 to-transparent' />
        <Container>
          <div className='mx-auto max-w-3xl text-center'>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={heroChild(0)} className='eyebrow-pill mb-6'>
              <Trophy className='w-4 h-4' />
              Awards & Accolades
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={heroChild(0.1)} className='heading-1 text-brand-white mb-4 text-shadow-sm'>
              Celebrating Excellence
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={heroChild(0.2)} className='text-brand-white/70 text-lg max-w-2xl mx-auto'>
              Recognition and honors received by Kingdom Network productions
            </motion.p>
          </div>
        </Container>
      </Section>

      {data && (
        <Section padding="2xl">
          <Container>
            <motion.div
              initial='initial'
              whileInView='whileInView'
              viewport={fadeUpViewport}
              variants={staggerContainer}
              className='grid sm:grid-cols-3 gap-5 mb-12'
            >
              <motion.div variants={staggerItem} className='bg-brand-surface/50 dark:bg-brand-dark/50 rounded-xl p-6 border border-brand-surface dark:border-white/10 text-center'>
                <Trophy size={28} className='mx-auto mb-3 text-brand-gold' />
                <p className='text-4xl font-bold text-brand-primary dark:text-brand-white tracking-tight'>{data.total_wins}</p>
                <p className='text-sm text-brand-muted dark:text-brand-white/60 mt-1'>Total Wins</p>
              </motion.div>
              <motion.div variants={staggerItem} className='bg-brand-surface/50 dark:bg-brand-dark/50 rounded-xl p-6 border border-brand-surface dark:border-white/10 text-center'>
                <Star size={28} className='mx-auto mb-3 text-brand-gold' />
                <p className='text-4xl font-bold text-brand-primary dark:text-brand-white tracking-tight'>{data.total_nominations}</p>
                <p className='text-sm text-brand-muted dark:text-brand-white/60 mt-1'>Total Nominations</p>
              </motion.div>
              <motion.div variants={staggerItem} className='bg-brand-surface/50 dark:bg-brand-dark/50 rounded-xl p-6 border border-brand-surface dark:border-white/10 text-center'>
                <Medal size={28} className='mx-auto mb-3 text-brand-gold' />
                <p className='text-4xl font-bold text-brand-primary dark:text-brand-white tracking-tight'>{data.total_films}</p>
                <p className='text-sm text-brand-muted dark:text-brand-white/60 mt-1'>Awarded Films</p>
              </motion.div>
            </motion.div>

            {data.data.length === 0 ? (
              <div className='text-center py-12'>
                <Award size={48} className='mx-auto mb-4 text-brand-muted/30 dark:text-brand-white/20' />
                <p className='text-brand-muted dark:text-brand-white/60'>No awards data available yet.</p>
              </div>
            ) : (
              <motion.div
                initial='initial'
                whileInView='whileInView'
                viewport={fadeUpViewport}
                variants={staggerContainer}
                className='space-y-5'
              >
                {data.data.map((film) => (
                  <motion.div key={film.film_id} variants={staggerItem} {...cardHover} className='bg-brand-surface/50 dark:bg-brand-dark/50 rounded-xl p-5 md:p-6 border border-brand-surface dark:border-white/10'>
                    <div className='flex flex-wrap items-center justify-between gap-3 mb-4'>
                      <Link to={`/films/${film.film_slug}`} className='flex items-center gap-2 hover:text-brand-primary dark:hover:text-brand-white transition-colors group'>
                        <h2 className='heading-3 text-brand-primary dark:text-brand-white group-hover:text-brand-gold transition-colors'>{film.film_title}</h2>
                        <ExternalLink size={16} className='text-brand-muted dark:text-brand-white/60 opacity-0 group-hover:opacity-100 transition-opacity' />
                      </Link>
                      <div className='flex items-center gap-3'>
                        <span className={cn('px-3 py-1 rounded-full text-sm font-medium', statusStyles[awardResultKind.won].soft)}>{film.total_wins} win{film.total_wins !== 1 ? 's' : ''}</span>
                        <span className={cn('px-3 py-1 rounded-full text-sm font-medium', statusStyles[awardResultKind.nominated].soft)}>{film.total_nominations} nomination{film.total_nominations !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <div className='space-y-2'>
                      {film.awards.map((award) => {
                        const kind = awardResultKind[award.result] || 'neutral'
                        return (
                          <div key={award.id} className='flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-white/5 border border-brand-surface dark:border-white/10'>
                            <div className={cn('w-2 h-2 rounded-full flex-shrink-0', statusStyles[kind].dot)} />
                            <div className='flex-1'>
                              <p className='text-brand-text dark:text-brand-white/90 font-medium'>{award.award_name}</p>
                              <p className='text-brand-muted dark:text-brand-white/60 text-sm'>{award.category}{award.year ? ` • ${award.year}` : ''}</p>
                            </div>
                            <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', statusStyles[kind].soft)}>
                              {award.result === 'won' ? 'Won' : 'Nominated'}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </Container>
        </Section>
      )}
    </>
  )
}
