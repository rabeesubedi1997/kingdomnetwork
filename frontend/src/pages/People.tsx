import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Section, Container } from '@/components/layout/Section'
import { SEOHead } from '@/components/seo/SEOHead'
import { Loading } from '@/components/ui/Loading'
import api from '@/lib/api'
import { UserCircle, Search, Filter, X } from 'lucide-react'
import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'

interface PersonItem {
  id: number
  name: string
  slug: string
  role: string
  photo_url?: string
  bio?: string
}

export const People = () => {
  const [search, setSearch] = useState('')
  const [selectedRole, setSelectedRole] = useState('All')
  const { data, isLoading } = useQuery<{ data: PersonItem[] }>({
    queryKey: ['people'],
    queryFn: async () => {
      const res = await api.get('/people')
      return res.data
    },
  })

  const roles = useMemo(() => {
    const roleSet = new Set((data?.data || []).map(p => p.role).filter(Boolean))
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
        <Container>
          <div className='mx-auto max-w-3xl text-center'>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='heading-1 text-brand-white mb-4'>
              Our People
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className='text-brand-white/70 text-lg max-w-2xl mx-auto'>
              The talented individuals who bring our stories to life
            </motion.p>
          </div>
        </Container>
      </Section>

      <Section padding="xl">
        <Container>
          <div className='flex flex-col sm:flex-row gap-4 mb-5'>
            <div className='relative flex-1 max-w-xs'>
              <Search size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted' />
              <input type='text' value={search} onChange={e => setSearch(e.target.value)} placeholder='Search people...' className='w-full pl-10 pr-4 py-2.5 bg-brand-surface/50 border border-brand-surface rounded-xl text-brand-text text-sm outline-none focus:border-brand-primary/50 transition-colors placeholder:text-brand-muted/50' />
            </div>
            {roles.length > 1 && (
              <div className='flex flex-wrap gap-2 items-center'>
                {roles.map(role => (
                  <button key={role} onClick={() => setSelectedRole(role)} className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-medium transition-colors border',
                    selectedRole === role
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-brand-surface/50 text-brand-muted border-brand-surface/50 hover:border-brand-primary/30 hover:text-brand-primary'
                  )}>
                    {role === 'All' ? 'All Roles' : role}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isLoading ? (
            <Loading text="Loading people..." />
          ) : filtered.length === 0 ? (
            <div className='text-center py-12'>
              <UserCircle size={48} className='mx-auto mb-4 text-brand-muted/30' />
              <p className='text-brand-muted'>{search || selectedRole !== 'All' ? 'No people match your filters.' : 'No people listed yet.'}</p>
              {(search || selectedRole !== 'All') && (
                <button onClick={() => { setSearch(''); setSelectedRole('All') }} className='mt-3 btn-secondary text-sm'>
                  <X size={14} className='mr-1' /> Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <p className='text-sm text-brand-muted mb-4'>{filtered.length} {filtered.length === 1 ? 'person' : 'people'} found</p>
              <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {filtered.map((person, idx) => (
                  <motion.div key={person.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.03 }}>
                    <Link to={`/people/${person.slug}`} className='block card group border border-brand-surface/30 hover:border-brand-primary/30 transition-colors'>
                      <div className='aspect-square overflow-hidden rounded-t-xl'>
                        {person.photo_url ? (
                          <img src={person.photo_url} alt={person.name} className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105' />
                        ) : (
                          <div className='w-full h-full bg-brand-surface flex items-center justify-center'>
                            <UserCircle size={48} className='text-brand-muted/30' />
                          </div>
                        )}
                      </div>
                      <div className='p-4 text-center'>
                        <h3 className='font-semibold text-brand-primary group-hover:text-brand-gold transition-colors'>{person.name}</h3>
                        {person.role && <p className='text-brand-muted text-sm mt-1'>{person.role}</p>}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </Container>
      </Section>
    </>
  )
}
