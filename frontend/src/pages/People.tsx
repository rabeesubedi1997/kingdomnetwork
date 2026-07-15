import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Section, Container } from '@/components/layout/Section'
import { SEOHead } from '@/components/seo/SEOHead'
import { Loading } from '@/components/ui/Loading'
import api from '@/lib/api'
import { UserCircle, Search } from 'lucide-react'
import { useState } from 'react'

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
  const { data, isLoading } = useQuery<{ data: PersonItem[] }>({
    queryKey: ['people'],
    queryFn: async () => {
      const res = await api.get('/people')
      return res.data
    },
  })

  const filtered = (data?.data || []).filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.role || '').toLowerCase().includes(search.toLowerCase())
  )

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
          <div className='relative max-w-xs mb-5'>
            <Search size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted' />
            <input type='text' value={search} onChange={e => setSearch(e.target.value)} placeholder='Search people...' className='w-full pl-10 pr-4 py-2.5 bg-brand-surface/50 border border-brand-surface rounded-xl text-brand-text text-sm outline-none focus:border-brand-primary/50 transition-colors placeholder:text-brand-muted/50' />
          </div>

          {isLoading ? (
            <Loading text="Loading people..." />
          ) : filtered.length === 0 ? (
            <div className='text-center py-12'>
              <UserCircle size={48} className='mx-auto mb-4 text-brand-muted/30' />
              <p className='text-brand-muted'>{search ? 'No people match your search.' : 'No people listed yet.'}</p>
            </div>
          ) : (
            <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {filtered.map((person, idx) => (
                <motion.div key={person.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.03 }}>
                  <Link to={`/people/${person.slug}`} className='block card group hover:border-brand-primary/30 transition-colors'>
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
          )}
        </Container>
      </Section>
    </>
  )
}
