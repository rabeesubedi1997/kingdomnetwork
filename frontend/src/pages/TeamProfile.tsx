import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import { useTeamMember } from '@/hooks/useData'
import { Section, Container } from '@/components/layout/Section'
import { SEOHead } from '@/components/seo/SEOHead'
import { Loading } from '@/components/ui/Loading'
import { ArrowLeft, ExternalLink, Mail, Phone, MapPin, Cake, Linkedin, Twitter, Instagram, Globe } from 'lucide-react'

export const TeamProfile = () => {
  const { id } = useParams<{ id: string }>()
  const { data: member, isLoading, error } = useTeamMember(Number(id))

  if (isLoading) {
    return (
      <Section padding="2xl">
        <Container>
          <Loading text="Loading profile..." />
        </Container>
      </Section>
    )
  }

  if (error || !member) {
    return (
      <Section padding="2xl">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="heading-2 text-brand-primary mb-4">Profile Not Found</h1>
            <p className="text-brand-muted mb-5">The team member you're looking for doesn't exist.</p>
            <Link to="/team" className="btn-primary">Back to Team</Link>
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <>
      <SEOHead title={member.name} description={member.bio || `Meet ${member.name}, ${member.role} at Kingdom Network`} ogImage={member.photo_url} />
      <Section id="team-profile" padding="2xl" className="relative overflow-hidden">
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-from)_0%,_transparent_70%)] from-brand-primary/10 to-transparent' />
        <Container>
          <Link to="/team" className="btn-ghost mb-5">
            <ArrowLeft size={16} />
            Back to Team
          </Link>
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-1">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="sticky top-24 space-y-5">
                <div className="aspect-square rounded-2xl overflow-hidden bg-brand-surface/50 border border-brand-surface">
                  <img src={member.photo_url || '/images/placeholder-person.jpg'} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-4">
                  <div>
                    <h1 className="heading-2 text-brand-primary">{member.name}</h1>
                    <p className="text-brand-gold font-medium text-lg">{member.role}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {member.linkedin_url && (
                      <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-brand-surface/50 rounded-lg hover:bg-brand-primary/10 hover:text-brand-primary transition-colors border border-brand-surface" aria-label="LinkedIn">
                        <Linkedin size={18} />
                      </a>
                    )}
                    {member.twitter_url && (
                      <a href={member.twitter_url} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-brand-surface/50 rounded-lg hover:bg-brand-primary/10 hover:text-brand-primary transition-colors border border-brand-surface" aria-label="Twitter">
                        <Twitter size={18} />
                      </a>
                    )}
                    {member.instagram_url && (
                      <a href={member.instagram_url} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-brand-surface/50 rounded-lg hover:bg-brand-primary/10 hover:text-brand-primary transition-colors border border-brand-surface" aria-label="Instagram">
                        <Instagram size={18} />
                      </a>
                    )}
                    {member.website_url && (
                      <a href={member.website_url} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-brand-surface/50 rounded-lg hover:bg-brand-primary/10 hover:text-brand-primary transition-colors border border-brand-surface" aria-label="Website">
                        <Globe size={18} />
                      </a>
                    )}
                  </div>
                  {member.imdb_url && (
                    <a href={member.imdb_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-primary transition-colors">
                      <ExternalLink size={14} />
                      View IMDb Profile
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-5">
                {member.bio && (
                  <div className="card p-6">
                    <div className="section-divider mb-4" />
                    <h2 className="heading-3 text-brand-primary mb-4">About</h2>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-brand-text leading-relaxed whitespace-pre-line">{member.bio}</p>
                    </div>
                  </div>
                )}
                <div className="card p-6">
                  <h2 className="heading-3 text-brand-primary mb-6">Contact Information</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="flex items-center gap-3 p-4 bg-brand-dark rounded-lg border border-brand-surface hover:border-brand-primary/50 transition-colors group">
                        <Mail size={18} className="text-brand-muted group-hover:text-brand-primary transition-colors" />
                        <span className="text-sm text-brand-text group-hover:text-brand-primary transition-colors">{member.email}</span>
                      </a>
                    )}
                    {member.phone && (
                      <a href={`tel:${member.phone}`} className="flex items-center gap-3 p-4 bg-brand-dark rounded-lg border border-brand-surface hover:border-brand-primary/50 transition-colors group">
                        <Phone size={18} className="text-brand-muted group-hover:text-brand-primary transition-colors" />
                        <span className="text-sm text-brand-text group-hover:text-brand-primary transition-colors">{member.phone}</span>
                      </a>
                    )}
                    {member.birth_date && (
                      <div className="flex items-center gap-3 p-4 bg-brand-dark rounded-lg border border-brand-surface">
                        <Cake size={18} className="text-brand-muted" />
                        <span className="text-sm text-brand-text">{new Date(member.birth_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                    )}
                    {member.birth_place && (
                      <div className="flex items-center gap-3 p-4 bg-brand-dark rounded-lg border border-brand-surface">
                        <MapPin size={18} className="text-brand-muted" />
                        <span className="text-sm text-brand-text">{member.birth_place}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
