import { useParams, Link } from 'react-router-dom'
import { usePerson } from '@/hooks/useData'
import { Section, Container } from '@/components/layout/Section'
import { SEOHead } from '@/components/seo/SEOHead'
import { Loading } from '@/components/ui/Loading'
import { ExternalLink, Instagram, Twitter, Globe, Facebook, Youtube, Calendar, MapPin } from 'lucide-react'
import { SafeImage } from '@/components/shared/SafeImage'
import { ProfileLayout, ProfileSocialLink } from '@/components/shared/ProfileLayout'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem, fadeUpViewport } from '@/lib/motion'

export const PersonProfile = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data: person, isLoading, error } = usePerson(slug!)

  if (isLoading) {
    return (
      <Section padding="2xl">
        <Container>
          <Loading text="Loading profile..." />
        </Container>
      </Section>
    )
  }

  if (error || !person) {
    return (
      <Section padding="2xl">
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

  const socialLinks: ProfileSocialLink[] = [
    social.instagram && { key: 'instagram', href: social.instagram, label: 'Instagram', icon: Instagram },
    social.twitter && { key: 'twitter', href: social.twitter, label: 'Twitter', icon: Twitter },
    social.facebook && { key: 'facebook', href: social.facebook, label: 'Facebook', icon: Facebook },
    social.youtube && { key: 'youtube', href: social.youtube, label: 'Youtube', icon: Youtube },
    social.website && { key: 'website', href: social.website, label: 'Website', icon: Globe },
    person.imdb_url && { key: 'imdb', href: person.imdb_url, label: 'IMDb', icon: ExternalLink },
  ].filter(Boolean) as ProfileSocialLink[]

  return (
    <>
      <SEOHead title={person.name} description={person.bio || `${person.name} - ${person.role} at Kingdom Network`} ogImage={person.photo_url} />
      <ProfileLayout
        backTo="/films"
        backLabel="Back to Films"
        photoSrc={person.photo_url}
        photoAlt={person.name}
        placeholderType="person"
        photoAspectClassName="aspect-[3/4]"
        name={person.name}
        role={person.role}
        socialLinks={socialLinks}
        bioLabel="Biography"
        bio={person.bio}
        sidebarExtra={
          (person.birth_date || person.birth_place) && (
            <div className="space-y-2">
              {person.birth_date && (
                <div className="flex items-center gap-2 text-sm text-brand-muted dark:text-brand-white/60">
                  <Calendar size={14} className="shrink-0" />
                  {new Date(person.birth_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              )}
              {person.birth_place && (
                <div className="flex items-center gap-2 text-sm text-brand-muted dark:text-brand-white/60">
                  <MapPin size={14} className="shrink-0" />
                  {person.birth_place}
                </div>
              )}
            </div>
          )
        }
      >
        <div className="card p-5">
          <span className="eyebrow text-brand-primary dark:text-brand-gold">Credits</span>
          <h2 className="text-sm font-semibold text-brand-primary dark:text-brand-white uppercase tracking-wider mt-2 mb-3">Filmography ({person.films.length})</h2>
          {person.films.length === 0 ? (
            <p className="text-sm text-brand-muted dark:text-brand-white/60">No films listed yet.</p>
          ) : (
            <motion.div initial="initial" whileInView="whileInView" viewport={fadeUpViewport} variants={staggerContainer} className="grid sm:grid-cols-2 gap-3">
              {person.films.map((f) => (
                <motion.div key={`${f.film_id}-${f.role}`} variants={staggerItem}>
                  <Link to={`/films/${f.slug}`} className="flex items-center gap-3 p-3 rounded-lg border border-brand-surface/60 dark:border-white/10 hover:border-brand-primary/40 bg-brand-surface/50 dark:bg-brand-dark/50 transition-all group">
                    <SafeImage
                      src={f.poster_url}
                      alt={f.title}
                      placeholderType='film'
                      wrapperClassName='w-12 h-16 rounded-lg overflow-hidden shrink-0'
                      className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-brand-text dark:text-brand-white/90 truncate group-hover:text-brand-primary dark:group-hover:text-brand-gold transition-colors">{f.title}</p>
                      <p className="text-xs text-brand-muted dark:text-brand-white/60">{f.role}{f.character_name ? ` as ${f.character_name}` : ''}</p>
                      {f.department && <p className="text-xs text-brand-muted dark:text-brand-white/60 capitalize">{f.department}</p>}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </ProfileLayout>
    </>
  )
}
