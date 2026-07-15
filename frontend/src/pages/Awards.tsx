import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Section, Container } from '@/components/layout/Section'
import { SEOHead } from '@/components/seo/SEOHead'
import { Loading } from '@/components/ui/Loading'
import api from '@/lib/api'
import { Trophy, Award, Star, ExternalLink, Medal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilmAwardGroup {
  film_id: number
  film_title: string
  film_slug: string
  total_wins: number
  total_nominations: number
  awards: { id: number; award_name: string; category: string; year: number; result: string; notes?: string }[]
}

interface AwardsResponse {
  total_films: number
  total_wins: number
  total_nominations: number
  data: FilmAwardGroup[]
}

export const AwardsPage = () => {
  const { data, isLoading } = useQuery<AwardsResponse>({
    queryKey: ['awards'],
    queryFn: async () => {
      const res = await api.get('/awards')
      return res.data
    },
  })

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
      <Section id="awards-hero" background="dark" padding="xl" className="relative overflow-hidden">
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-brand-gold/10 to-transparent' />
        <Container>
          <div className='mx-auto max-w-3xl text-center'>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='inline-flex items-center gap-2 bg-brand-white/10 px-4 py-2 rounded-full text-brand-gold text-sm font-medium mb-6'>
              <Trophy className='w-4 h-4' />
              Awards & Accolades
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className='heading-1 text-brand-white mb-4'>
              Celebrating Excellence
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='text-brand-white/70 text-lg max-w-2xl mx-auto'>
              Recognition and honors received by Kingdom Network productions
            </motion.p>
          </div>
        </Container>
      </Section>

      {data && (
        <Section padding="xl">
          <Container>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className='grid sm:grid-cols-3 gap-5 mb-5'>
              <div className='bg-brand-surface/50 rounded-xl p-5 border border-brand-surface text-center'>
                <Trophy size={28} className='mx-auto mb-3 text-brand-gold' />
                <p className='text-3xl font-bold text-brand-primary'>{data.total_wins}</p>
                <p className='text-sm text-brand-muted'>Total Wins</p>
              </div>
              <div className='bg-brand-surface/50 rounded-xl p-5 border border-brand-surface text-center'>
                <Star size={28} className='mx-auto mb-3 text-brand-gold' />
                <p className='text-3xl font-bold text-brand-primary'>{data.total_nominations}</p>
                <p className='text-sm text-brand-muted'>Total Nominations</p>
              </div>
              <div className='bg-brand-surface/50 rounded-xl p-5 border border-brand-surface text-center'>
                <Medal size={28} className='mx-auto mb-3 text-brand-gold' />
                <p className='text-3xl font-bold text-brand-primary'>{data.total_films}</p>
                <p className='text-sm text-brand-muted'>Awarded Films</p>
              </div>
            </motion.div>

            {data.data.length === 0 ? (
              <div className='text-center py-12'>
                <Award size={48} className='mx-auto mb-4 text-brand-muted/30' />
                <p className='text-brand-muted'>No awards data available yet.</p>
              </div>
            ) : (
              <div className='space-y-5'>
                {data.data.map((film, idx) => (
                  <motion.div key={film.film_id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }} className='bg-brand-surface/50 rounded-xl p-5 border border-brand-surface'>
                    <div className='flex items-center justify-between mb-4'>
                      <Link to={`/films/${film.film_slug}`} className='flex items-center gap-2 hover:text-brand-primary transition-colors group'>
                        <h2 className='heading-3 text-brand-primary group-hover:text-brand-gold transition-colors'>{film.film_title}</h2>
                        <ExternalLink size={16} className='text-brand-muted opacity-0 group-hover:opacity-100 transition-opacity' />
                      </Link>
                      <div className='flex items-center gap-3'>
                        <span className='px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm font-medium'>{film.total_wins} win{film.total_wins !== 1 ? 's' : ''}</span>
                        <span className='px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium'>{film.total_nominations} nomination{film.total_nominations !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <div className='space-y-2'>
                      {film.awards.map((award) => (
                        <div key={award.id} className='flex items-center gap-3 p-3 rounded-lg bg-brand-dark border border-brand-surface'>
                          <div className={cn('w-2 h-2 rounded-full flex-shrink-0', award.result === 'won' ? 'bg-green-500' : 'bg-blue-500')} />
                          <div className='flex-1'>
                            <p className='text-brand-text font-medium'>{award.award_name}</p>
                            <p className='text-brand-muted text-sm'>{award.category}{award.year ? ` • ${award.year}` : ''}</p>
                          </div>
                          <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', award.result === 'won' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400')}>
                            {award.result === 'won' ? 'Won' : 'Nominated'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Container>
        </Section>
      )}
    </>
  )
}
