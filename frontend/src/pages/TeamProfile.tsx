import { useParams, Link } from 'react-router-dom'
import { useTeamMember } from '@/hooks/useData'
import { Section, Container } from '@/components/layout/Section'
import { SEOHead } from '@/components/seo/SEOHead'
import { Loading } from '@/components/ui/Loading'
import { ExternalLink, Mail, Phone, MapPin, Cake, Linkedin, Twitter, Instagram, Globe, Facebook, Youtube } from 'lucide-react'
import { ProfileLayout, ProfileSocialLink } from '@/components/shared/ProfileLayout'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem, fadeUpViewport } from '@/lib/motion'

const SOCIAL_ICON_NO_BG_HOVER = 'p-2 rounded-lg bg-brand-surface/50 dark:bg-brand-dark/50 border border-brand-surface/60 dark:border-white/10 hover:text-brand-primary transition-all'

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

  const social = member.social_links || {}

  const socialLinks: ProfileSocialLink[] = [
    (member.linkedin_url || social.linkedin) && { key: 'linkedin', href: member.linkedin_url || social.linkedin!, label: 'LinkedIn', icon: Linkedin },
    (member.twitter_url || social.twitter) && { key: 'twitter', href: member.twitter_url || social.twitter!, label: 'Twitter', icon: Twitter },
    (member.instagram_url || social.instagram) && { key: 'instagram', href: member.instagram_url || social.instagram!, label: 'Instagram', icon: Instagram },
    social.facebook && { key: 'facebook', href: social.facebook, label: 'Facebook', icon: Facebook },
    social.youtube && { key: 'youtube', href: social.youtube, label: 'Youtube', icon: Youtube },
    (member.website_url || social.website) && { key: 'website', href: member.website_url || social.website!, label: 'Website', icon: Globe },
    member.imdb_url && { key: 'imdb', href: member.imdb_url, label: 'IMDb', icon: ExternalLink, className: SOCIAL_ICON_NO_BG_HOVER },
  ].filter(Boolean) as ProfileSocialLink[]

  return (
    <>
      <SEOHead title={member.name} description={member.bio || `Meet ${member.name}, ${member.role} at Kingdom Network`} ogImage={member.photo_url} />
      <ProfileLayout
        backTo="/team"
        backLabel="Back to Team"
        photoSrc={member.photo_url}
        photoAlt={member.name}
        placeholderType="team"
        photoAspectClassName="aspect-square"
        name={member.name}
        role={member.role}
        socialLinks={socialLinks}
        bioLabel="About"
        bio={member.bio}
      >
        <div className="card p-5">
          <span className="eyebrow text-brand-primary dark:text-brand-gold">Get in Touch</span>
          <h2 className="text-sm font-semibold text-brand-primary dark:text-brand-white uppercase tracking-wider mt-2 mb-3">Contact</h2>
          <motion.div initial="initial" whileInView="whileInView" viewport={fadeUpViewport} variants={staggerContainer} className="grid sm:grid-cols-2 gap-3">
            {member.email && (
              <motion.a variants={staggerItem} href={`mailto:${member.email}`} className="flex items-center gap-3 p-3 rounded-lg bg-brand-surface/50 dark:bg-brand-dark/50 border border-brand-surface/60 dark:border-white/10 hover:border-brand-primary/40 hover:-translate-y-0.5 transition-all group">
                <Mail size={16} className="text-brand-muted dark:text-brand-white/60 group-hover:text-brand-primary dark:group-hover:text-brand-gold shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] text-brand-muted dark:text-brand-white/60 uppercase tracking-wider">Email</p>
                  <p className="text-sm text-brand-text dark:text-brand-white/90 truncate">{member.email}</p>
                </div>
              </motion.a>
            )}
            {member.phone && (
              <motion.a variants={staggerItem} href={`tel:${member.phone}`} className="flex items-center gap-3 p-3 rounded-lg bg-brand-surface/50 dark:bg-brand-dark/50 border border-brand-surface/60 dark:border-white/10 hover:border-brand-primary/40 hover:-translate-y-0.5 transition-all group">
                <Phone size={16} className="text-brand-muted dark:text-brand-white/60 group-hover:text-brand-primary dark:group-hover:text-brand-gold shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] text-brand-muted dark:text-brand-white/60 uppercase tracking-wider">Phone</p>
                  <p className="text-sm text-brand-text dark:text-brand-white/90">{member.phone}</p>
                </div>
              </motion.a>
            )}
            {member.birth_date && (
              <motion.div variants={staggerItem} className="flex items-center gap-3 p-3 rounded-lg bg-brand-surface/50 dark:bg-brand-dark/50 border border-brand-surface/60 dark:border-white/10">
                <Cake size={16} className="text-brand-muted dark:text-brand-white/60 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] text-brand-muted dark:text-brand-white/60 uppercase tracking-wider">Born</p>
                  <p className="text-sm text-brand-text dark:text-brand-white/90">{new Date(member.birth_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </motion.div>
            )}
            {member.birth_place && (
              <motion.div variants={staggerItem} className="flex items-center gap-3 p-3 rounded-lg bg-brand-surface/50 dark:bg-brand-dark/50 border border-brand-surface/60 dark:border-white/10">
                <MapPin size={16} className="text-brand-muted dark:text-brand-white/60 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] text-brand-muted dark:text-brand-white/60 uppercase tracking-wider">Place</p>
                  <p className="text-sm text-brand-text dark:text-brand-white/90">{member.birth_place}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </ProfileLayout>
    </>
  )
}
