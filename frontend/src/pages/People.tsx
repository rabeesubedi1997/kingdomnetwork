import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { usePeople } from '@/hooks/useData'
import { Section, Container } from '@/components/layout/Section'
import { SEOHead } from '@/components/seo/SEOHead'
import { Loading } from '@/components/ui/Loading'
import { UserCircle, X } from 'lucide-react'
import { SafeImage } from '@/components/shared/SafeImage'
import { FilterBar } from '@/components/shared/FilterBar'
import { useState, useMemo } from 'react'
import { heroTitle, heroChild, staggerContainer, staggerItem, fadeUpViewport } from '@/lib/motion'

export const People = () => {
  const [search, setSearch] = useState('')
  const [selectedRole, setSelectedRole] = useState('All')
  const { data, isLoading } = usePeople()

  const roles = useMemo(() => {
    const roleSet = new Set((data?.data || []).map(p => p.role).filter((r): r is string => Boolean(r)))
    return ['All', ...Array.from(roleSet).sort()]
  }, [data])

  const filtered = (data?.data || []).filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.role || '').toLowerCase().includes(search.toLowerCase())
    const matchesRole = selectedRole === 'All' || p.role === selectedRole
    return matchesSearch && matchesRole
  })

  return (
    <>
      <SEOHead title="People" description="Cast and crew of Kingdom Network productions" />
      <Section id="people-hero" background="dark" padding="xl" className="relative overflow-hidden">
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-brand-primary/20 to-transparent' />
        <Container>
          <div className='mx-auto max-w-3xl text-center'>
            <motion.span initial="initial" animate="animate" variants={heroTitle} className='eyebrow-pill'>
              Cast &amp; Crew
            </motion.span>
            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={heroChild(0.1)} className='heading-1 text-brand-white mt-6 mb-4'>
              Our People
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={heroChild(0.2)} className='text-brand-white/70 text-lg max-w-2xl mx-auto'>
              The talented individuals who bring our stories to life
            </motion.p>
          </div>
        </Container>
      </Section>

      <Section padding="xl">
        <Container>
          <FilterBar
            className='mb-8'
            pills={roles}
            activePill={selectedRole}
            onPillChange={setSelectedRole}
            search={{ value: search, onChange: setSearch, placeholder: 'Search people...', className: 'max-w-xs mb-4' }}
          />

          {isLoading ? (
            <Loading text="Loading people..." />
          ) : filtered.length === 0 ? (
            <div className='text-center py-12'>
              <UserCircle size={48} className='mx-auto mb-4 text-brand-muted/30 dark:text-brand-white/20' />
              <p className='text-brand-muted dark:text-brand-white/60'>{search || selectedRole !== 'All' ? 'No people match your filters.' : 'No people listed yet.'}</p>
              {(search || selectedRole !== 'All') && (
                <button onClick={() => { setSearch(''); setSelectedRole('All') }} className='mt-3 btn-secondary text-sm'>
                  <X size={14} className='mr-1' /> Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <p className='text-sm text-brand-muted dark:text-brand-white/60 mb-4'>{filtered.length} {filtered.length === 1 ? 'person' : 'people'} found</p>
              <motion.div initial="initial" whileInView="whileInView" viewport={fadeUpViewport} variants={staggerContainer} className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {filtered.map((person) => (
                  <motion.div key={person.id} variants={staggerItem}>
                    <Link to={`/people/${person.slug}`} className='block card group border border-brand-surface/30 hover:border-brand-primary/30 transition-colors overflow-hidden'>
                      <div className='relative aspect-square overflow-hidden'>
                        <SafeImage
                          src={person.photo_url}
                          alt={person.name}
                          placeholderType='person'
                          className='transition-transform duration-500 group-hover:scale-110'
                          wrapperClassName='absolute inset-0'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                      </div>
                      <div className='p-4 text-center'>
                        <h3 className='font-semibold text-brand-primary dark:text-brand-white group-hover:text-brand-gold transition-colors'>{person.name}</h3>
                        {person.role && <p className='text-brand-muted dark:text-brand-white/60 text-sm mt-1'>{person.role}</p>}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </Container>
      </Section>
    </>
  )
}
