import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Section, Container } from '@/components/layout/Section'
import { SEOHead } from '@/components/seo/SEOHead'
import { Loading } from '@/components/ui/Loading'
import api from '@/lib/api'
import { ArrowLeft, ExternalLink, Film, Calendar, MapPin, Award, Instagram, Twitter, Globe } from 'lucide-react'

interface PersonFilm {
  film_id: number
  title: string
  slug: string
  role: string
  character_name?: string
  department?: string
  poster_url?: string
}

interface PersonData {
  id: number
  name: string
  slug: string
  role: string
  bio?: string
  photo_url?: string
  birth_date?: string
  birth_place?: string
  imdb_url?: string
  social_links?: Record<string, string>
  films: PersonFilm[]
}

export const PersonProfile = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data: person, isLoading, error } = useQuery<PersonData>({
    queryKey: ['person', slug],
    queryFn: async () => {
      const res = await api.get(`/people/${slug}`)
      return res.data
    },
    enabled: !!slug,
  })

  if (isLoading) {
    return (
      <Section padding="xl">
        <Container>
          <Loading text="Loading profile..." />
        </Container>
      </Section>
    )
  }

  if (error || !person) {
    return (
      <Section padding="xl">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="heading-2 text-brand-primary mb-4">Profile Not Found</h1>
            <p className="text-brand-muted mb-5">This person doesn't exist or has been removed.</p>
            <Link to="/films" className="btn-primary">Browse Films</Link>
          </div>
        </Container>
      </Section>
    )
  }

  const social = person.social_links || {}

  return (
    <>
      <SEOHead title={person.name} description={person.bio || `${person.name} - ${person.role} at Kingdom Network`} ogImage={person.photo_url} />
      <Section id="person-profile" padding="xl" className="relative overflow-hidden">
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-from)_0%,_transparent_70%)] from-brand-primary/10 to-transparent' />
        <Container>
          <Link to="/films" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-primary transition-colors mb-5">
            <ArrowLeft size={16} />
            Back to Films
          </Link>
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-1">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="sticky top-24 space-y-5">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-brand-surface/50 border border-brand-surface">
                  <img src={person.photo_url || '/images/placeholder-person.jpg'} alt={person.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h1 className="heading-2 text-brand-primary">{person.name}</h1>
                  <p className="text-brand-gold font-medium text-lg">{person.role}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {social.instagram && <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-brand-surface/50 rounded-lg hover:bg-brand-primary/10 hover:text-brand-primary transition-colors border border-brand-surface"><Instagram size={18} /></a>}
                  {social.twitter && <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-brand-surface/50 rounded-lg hover:bg-brand-primary/10 hover:text-brand-primary transition-colors border border-brand-surface"><Twitter size={18} /></a>}
                  {social.website && <a href={social.website} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-brand-surface/50 rounded-lg hover:bg-brand-primary/10 hover:text-brand-primary transition-colors border border-brand-surface"><Globe size={18} /></a>}
                  {person.imdb_url && (
                    <a href={person.imdb_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-primary transition-colors">
                      <ExternalLink size={14} /> IMDb
                    </a>
                  )}
                </div>
                {person.birth_date && (
                  <div className="flex items-center gap-2 text-sm text-brand-muted">
                    <Calendar size={14} />
                    {new Date(person.birth_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    {person.birth_place && <> • <MapPin size={14} />{person.birth_place}</>}
                  </div>
                )}
              </motion.div>
            </div>
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-5">
                {person.bio && (
                  <div className="bg-brand-surface/50 rounded-xl p-5 border border-brand-surface">
                    <h2 className="heading-3 text-brand-primary mb-4">Biography</h2>
                    <p className="text-brand-text leading-relaxed whitespace-pre-line">{person.bio}</p>
                  </div>
                )}
                <div className="bg-brand-surface/50 rounded-xl p-5 border border-brand-surface">
                  <h2 className="heading-3 text-brand-primary mb-6">Filmography</h2>
                  {person.films.length === 0 ? (
                    <p className="text-brand-muted">No films listed yet.</p>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {person.films.map((f) => (
                        <Link key={`${f.film_id}-${f.role}`} to={`/films/${f.slug}`} className="flex items-center gap-4 p-4 bg-brand-dark rounded-lg border border-brand-surface hover:border-brand-primary/50 transition-colors group">
                          {f.poster_url ? (
                            <img src={f.poster_url} alt={f.title} className="w-16 h-20 rounded-lg object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-16 h-20 rounded-lg bg-brand-surface flex items-center justify-center flex-shrink-0">
                              <Film size={24} className="text-brand-muted" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-brand-text font-medium truncate group-hover:text-brand-primary transition-colors">{f.title}</p>
                            <p className="text-brand-muted text-sm">{f.role}{f.character_name ? ` as ${f.character_name}` : ''}</p>
                            {f.department && <p className="text-brand-muted text-xs capitalize">{f.department}</p>}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
