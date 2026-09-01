import { motion } from 'framer-motion'
import { useCareers, useJob } from '@/hooks/useData'
import { useParams, Link } from 'react-router-dom'
import { Section, Container } from '@/components/layout/Section'
import { CareerCard } from '@/components/career/CareerCard'
import { CareerFilters } from '@/components/career/CareerFilters'
import { CareerApplicationForm } from '@/components/career/CareerApplicationForm'
import { Loading, GridSkeleton } from '@/components/ui/Loading'
import { IconTile } from '@/components/ui/IconTile'
import { SEOHead } from '@/components/seo/SEOHead'
import { Briefcase, Filter, ArrowLeft, MapPin as MapPinIcon, Clock as ClockIcon, DollarSign as DollarSignIcon, Film, Globe, Award, BookOpen, Handshake, Scale } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Job } from '@/types'
import { heroTitle, heroChild, staggerContainer, staggerItem, fadeUpViewport, cardHover, buttonTap } from '@/lib/motion'

export const Careers: React.FC = () => {
  const [filters, setFilters] = useState({ department: 'All', type: 'All', search: '' })
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const [positions, setPositions] = useState<Job[]>([])

  const queryParams: Record<string, unknown> = { per_page: 20, page }
  if (filters.department !== 'All') queryParams.department = filters.department.toLowerCase()
  if (filters.type !== 'All') queryParams.type = filters.type === 'Full-time' ? 'full_time' : filters.type.toLowerCase()
  if (filters.search) queryParams.search = filters.search

  const { data: jobs, isLoading, isFetching } = useCareers(queryParams)

  // Reset to page 1 whenever the filters change.
  useEffect(() => { setPage(1) }, [filters.department, filters.type, filters.search])

  // Accumulate pages so "Load More" appends instead of replacing the grid.
  useEffect(() => {
    if (!jobs?.data) return
    setPositions(prev => (page === 1 ? jobs.data : [...prev, ...jobs.data.filter(j => !prev.some(p => p.id === j.id))]))
  }, [jobs, page])

  const hasMore = jobs ? positions.length < jobs.total : false

  return (
    <>
      <SEOHead title="Careers" description="Join Our Team" />
      <Section id='careers-hero' background='dark' padding='2xl' className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-brand-primary/20 to-transparent' />
        <Container>
          <div className='mx-auto max-w-3xl text-center'>
            <motion.span initial='initial' animate='animate' variants={heroTitle} className='eyebrow-pill'>
              <Briefcase className='h-4 w-4' />
              Join Our Team
            </motion.span>
            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={heroChild(0.1)} className='heading-1 mt-6 mb-4 text-brand-white'>
              Build Legacies With Us
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={heroChild(0.2)} className='mx-auto max-w-2xl text-lg text-brand-white/70'>
              We're not just making films — we're building legacies. Join a team of passionate storytellers pushing the boundaries of Nepali cinema on the global stage.
            </motion.p>
          </div>
        </Container>
      </Section>

      <Section id='benefits' padding='2xl' background='surface'>
        <Container>
          <div className='text-center mb-10'>
            <span className='eyebrow text-brand-primary dark:text-brand-gold'>Why Kingdom Network</span>
            <h2 className='heading-2 mt-3 text-brand-primary dark:text-brand-white'>Why Work With Us</h2>
          </div>
          <motion.div initial='initial' whileInView='whileInView' viewport={fadeUpViewport} variants={staggerContainer} className='grid gap-5 md:grid-cols-3'>
            {[
              { icon: Film, title: 'Creative Freedom', desc: 'Shape stories that matter with artistic autonomy and collaborative support.' },
              { icon: Globe, title: 'Global Exposure', desc: 'Work on international co-productions reaching audiences worldwide.' },
              { icon: Award, title: 'Award-Winning', desc: 'Be part of nationally and internationally recognized productions.' },
              { icon: BookOpen, title: 'Continuous Learning', desc: 'Access to workshops, festivals, and industry mentorship programs.' },
              { icon: Handshake, title: 'Collaborative Culture', desc: 'Join a close-knit team where every voice matters and ideas flourish.' },
              { icon: Scale, title: 'Work-Life Balance', desc: 'Flexible schedules and understanding of the creative process rhythms.' },
            ].map((benefit) => (
              <motion.div key={benefit.title} variants={staggerItem} {...cardHover} className='card p-6'>
                <IconTile
                  icon={benefit.icon}
                  align='left'
                  title={benefit.title}
                  titleClassName='heading-3'
                  description={benefit.desc}
                />
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>

      <Section id='open-positions' padding='2xl'>
        <Container>
          <div className='mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
            <div>
              <span className='eyebrow text-brand-primary dark:text-brand-gold'>We're Hiring</span>
              <h2 className='heading-2 text-brand-primary dark:text-brand-white mt-3'>Open Positions</h2>
              <p className='mt-2 text-brand-muted dark:text-brand-white/60'>Find your role in our next production.</p>
            </div>
            <motion.button {...buttonTap} onClick={() => setShowFilters(!showFilters)} className='flex items-center gap-2 rounded-lg border border-brand-primary px-4 py-2 text-brand-primary dark:text-brand-white dark:border-brand-white/30 hover:bg-brand-primary/10'>
              <Filter className='h-4 w-4' />
              Filters
            </motion.button>
          </div>

          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className='card p-5 mb-5'>
              <CareerFilters onClose={() => setShowFilters(false)} onFilterChange={setFilters} />
            </motion.div>
          )}

          <motion.div initial='initial' whileInView='whileInView' viewport={fadeUpViewport} variants={staggerContainer} className='grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
            {isLoading && page === 1 ? (
              <GridSkeleton count={6} />
            ) : positions.length > 0 ? positions.map((job, index) => (
              <motion.div key={job.id} variants={staggerItem} {...cardHover}>
                <CareerCard job={job} index={index} />
              </motion.div>
            )) : (
              <div className='col-span-full py-12 text-center'>
                <p className='text-brand-muted dark:text-brand-white/60'>No open positions at the moment. Check back soon!</p>
              </div>
            )}

            {hasMore && (
              <div className='col-span-full pt-8 text-center'>
                <motion.button {...buttonTap} className='btn-secondary' disabled={isFetching} onClick={() => setPage(p => p + 1)}>
                  {isFetching ? 'Loading…' : 'Load More Positions'}
                </motion.button>
              </div>
            )}
          </motion.div>
        </Container>
      </Section>

      <Section id='cta' background='dark' padding='2xl' className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-brand-primary/20 to-transparent' />
        <Container>
          <div className='mx-auto max-w-3xl text-center'>
            <h2 className='heading-2 mb-4 text-brand-white'>Don't See Your Perfect Role?</h2>
            <p className='mb-5 text-lg text-brand-white/70'>We're always looking for exceptional talent. Send us your portfolio and tell us why you'd be a great fit for Kingdom Network.</p>
            <Link to='/contact'>
              <button className='btn-primary'>Send Your Portfolio</button>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  )
}

export const CareerDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data: job, isLoading } = useJob(slug!)

  if (isLoading) {
    return <Section padding='2xl'><Container><Loading text='Loading position...' /></Container></Section>
  }

  if (!job) {
    return (
      <Section padding='2xl'>
        <Container>
          <div className='max-w-lg mx-auto text-center'>
            <div className='card p-10'>
              <h1 className='heading-2 text-brand-primary dark:text-brand-white mb-4'>Position Not Found</h1>
              <p className='text-brand-muted dark:text-brand-white/70 mb-6'>The position you&apos;re looking for doesn&apos;t exist or has been filled.</p>
              <Link to='/careers'><button className='btn-primary'>Back to Careers</button></Link>
            </div>
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <>
      <SEOHead title={job.title} description={`Join our team as ${job.title}`} />
      <Section padding='lg'>
        <Container>
          <Link to='/careers' className='inline-flex items-center gap-1.5 text-sm text-brand-muted dark:text-brand-white/60 hover:text-brand-primary dark:hover:text-brand-white transition-colors mb-4'>
            <ArrowLeft className='h-4 w-4' />
            Back to Careers
          </Link>
          <div className='card p-5'>
            <div className='mb-3 flex flex-wrap items-center gap-2'>
              <span className='rounded-full bg-brand-primary/10 dark:bg-white/10 px-2.5 py-0.5 text-xs font-medium text-brand-primary dark:text-brand-white'>{job.department}</span>
              {job.is_remote && <span className='rounded-full bg-brand-primary/10 dark:bg-white/10 px-2.5 py-0.5 text-xs font-medium text-brand-primary dark:text-brand-white'>Remote</span>}
            </div>
            <h1 className='text-xl font-bold text-brand-primary dark:text-brand-white mb-2'>{job.title}</h1>
            <div className='flex flex-wrap items-center gap-3 text-sm text-brand-muted dark:text-brand-white/60'>
              <span className='flex items-center gap-1'><MapPinIcon className='h-4 w-4' /> {job.location}</span>
              <span className='flex items-center gap-1'><ClockIcon className='h-4 w-4' /> {job.type.replace('_', ' ')}</span>
              {job.salary_range && <span className='flex items-center gap-1'><DollarSignIcon className='h-4 w-4' /> {job.salary_range}</span>}
            </div>
          </div>
        </Container>
      </Section>

      <Section padding='lg'>
        <Container>
          <div className='grid gap-5 lg:grid-cols-3'>
            <div className='space-y-5 lg:col-span-2'>
              <div className='card p-5'>
                <h2 className='text-sm font-semibold text-brand-primary dark:text-brand-white uppercase tracking-wider mb-3'>About This Role</h2>
                <div className='text-sm text-brand-text dark:text-brand-white/90 leading-relaxed prose prose-brand dark:prose-invert max-w-none'>{job.description}</div>
              </div>
              <div className='card p-5'>
                <h2 className='text-sm font-semibold text-brand-primary dark:text-brand-white uppercase tracking-wider mb-3'>Requirements</h2>
                <div className='text-sm text-brand-text dark:text-brand-white/90 leading-relaxed prose prose-brand dark:prose-invert max-w-none'>{job.requirements}</div>
              </div>
              {job.benefits && (
                <div className='card p-5'>
                  <h2 className='text-sm font-semibold text-brand-primary dark:text-brand-white uppercase tracking-wider mb-3'>Benefits</h2>
                  <div className='text-sm text-brand-text dark:text-brand-white/90 leading-relaxed prose prose-brand dark:prose-invert max-w-none'>{job.benefits}</div>
                </div>
              )}
            </div>
            <div className='lg:col-span-1'>
              <div className='md:sticky md:top-24'>
                <CareerApplicationForm />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section id='cta' background='dark' padding='2xl' className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-brand-primary/20 to-transparent' />
        <Container>
          <div className='mx-auto max-w-3xl text-center'>
            <h2 className='heading-2 mb-4 text-brand-white'>Don't See Your Perfect Role?</h2>
            <p className='mb-5 text-lg text-brand-white/70'>We're always looking for exceptional talent. Send us your portfolio and tell us why you'd be a great fit for Kingdom Network.</p>
            <Link to='/contact'>
              <button className='btn-primary'>Send Your Portfolio</button>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  )
}
