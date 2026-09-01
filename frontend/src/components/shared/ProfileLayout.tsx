import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Section, Container } from '@/components/layout/Section'
import { SafeImage } from '@/components/shared/SafeImage'
import { cn } from '@/lib/utils'
import { heroChild } from '@/lib/motion'

export interface ProfileSocialLink {
  key: string
  href: string
  label: string
  icon: LucideIcon
  className?: string
}

export interface ProfileLayoutProps {
  backTo: string
  backLabel: string
  photoSrc?: string
  photoAlt: string
  placeholderType: 'person' | 'team'
  photoAspectClassName?: string
  name: string
  role?: string
  socialLinks: ProfileSocialLink[]
  sidebarExtra?: ReactNode
  bioLabel: string
  bio?: string
  children?: ReactNode
  /** Adds a slow hover zoom to the profile photo. Defaults to true. */
  photoHover?: boolean
}

const SOCIAL_ICON_CLASSNAME = 'p-2 rounded-lg bg-brand-surface/50 dark:bg-brand-dark/50 border border-brand-surface/60 dark:border-white/10 hover:bg-brand-primary/10 hover:text-brand-primary transition-all'

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({
  backTo,
  backLabel,
  photoSrc,
  photoAlt,
  placeholderType,
  photoAspectClassName = 'aspect-[3/4]',
  name,
  role,
  socialLinks,
  sidebarExtra,
  bioLabel,
  bio,
  children,
  photoHover = true,
}) => {
  const navigate = useNavigate()

  return (
    <Section padding="lg">
      <Container>
        <button onClick={() => navigate(backTo)} className="inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-primary transition-colors mb-5">
          <ArrowLeft size={14} />
          {backLabel}
        </button>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="md:sticky md:top-24 space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={heroChild(0)}
                className={cn(photoAspectClassName, 'group relative rounded-xl overflow-hidden border border-brand-surface/60 dark:border-white/10')}
              >
                <SafeImage
                  src={photoSrc}
                  alt={photoAlt}
                  placeholderType={placeholderType}
                  placeholderText={photoAlt}
                  wrapperClassName='absolute inset-0'
                  className={cn('w-full h-full object-cover', photoHover && 'transition-transform duration-700 group-hover:scale-110')}
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={heroChild(0.1)}>
                <h1 className="text-xl font-bold text-brand-primary dark:text-brand-white">{name}</h1>
                {role && <p className="text-sm text-brand-gold font-medium">{role}</p>}
              </motion.div>
              {socialLinks.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={heroChild(0.15)} className="flex flex-wrap gap-2">
                  {socialLinks.map(({ key, href, label, icon: Icon, className }) => (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={className || SOCIAL_ICON_CLASSNAME}
                      aria-label={label}
                    >
                      <Icon size={16} />
                    </a>
                  ))}
                </motion.div>
              )}
              {sidebarExtra}
            </div>
          </div>
          <div className="md:col-span-2 space-y-5">
            {bio && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={heroChild(0.15)} className="card p-5">
                <h2 className="text-sm font-semibold text-brand-primary dark:text-brand-white uppercase tracking-wider mb-3">{bioLabel}</h2>
                <p className="text-sm text-brand-text dark:text-brand-white/90 leading-relaxed whitespace-pre-line">{bio}</p>
              </motion.div>
            )}
            {children}
          </div>
        </div>
      </Container>
    </Section>
  )
}
