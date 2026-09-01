import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPublicPage } from '@/lib/public-api'
import { SEOHead } from '@/components/seo/SEOHead'
import { Section, Container } from '@/components/layout/Section'
import { Loading } from '@/components/ui/Loading'
import { BannerSlider } from '@/components/banner/BannerSlider'
import { SafeImage } from '@/components/shared/SafeImage'
import { sanitizeHtml } from '@/lib/sanitize'
import api from '@/lib/api'
import { cn } from '@/lib/utils'
import { useSiteSettings } from '@/hooks/useData'
import { useContactForm, useNewsletterSubscribe } from '@/hooks/useForms'
import { statusStyles, awardResultKind } from '@/lib/status'
import { Send } from 'lucide-react'

interface PageSection {
  id: number; section_type: string; title: string | null
  config: Record<string, any> | null; sort_order: number; is_active: boolean
}

const SectionRenderer: React.FC<{ section: PageSection }> = ({ section }) => {
  const { section_type, title, config } = section

  const filmGridQuery = useQuery({
    queryKey: ['sections', 'films', section_type, config],
    queryFn: async () => {
      const params: Record<string, any> = {}
      if (config?.status) params.status = config.status
      if (config?.limit) params.per_page = config.limit
      const res = await api.get('/films', { params })
      return res.data
    },
    enabled: ['film_grid', 'featured_film', 'film_status_tabs', 'film_carousel'].includes(section_type),
  })

  const newsQuery = useQuery({
    queryKey: ['sections', 'news', section_type, config],
    queryFn: async () => {
      const params: Record<string, any> = {}
      if (config?.category) params.category = config.category
      if (config?.limit) params.per_page = config.limit
      const res = await api.get('/news', { params })
      return res.data
    },
    enabled: ['news_feed', 'featured_news'].includes(section_type),
  })

  const galleryQuery = useQuery({
    queryKey: ['sections', 'gallery', section_type, config],
    queryFn: async () => {
      const params: Record<string, any> = {}
      if (config?.limit) params.per_page = config.limit
      const res = await api.get('/gallery', { params })
      return res.data
    },
    enabled: ['gallery_albums'].includes(section_type),
  })

  const teamQuery = useQuery({
    queryKey: ['sections', 'team', section_type],
    queryFn: async () => {
      const res = await api.get('/about')
      return res.data
    },
    enabled: ['team_grid', 'about_preview'].includes(section_type),
  })

  const peopleQuery = useQuery({
    queryKey: ['sections', 'people', section_type, config],
    queryFn: async () => {
      const params: Record<string, any> = {}
      if (config?.limit) params.per_page = config.limit
      const res = await api.get('/people', { params })
      return res.data
    },
    enabled: ['people_grid'].includes(section_type),
  })

  const awardsQuery = useQuery({
    queryKey: ['sections', 'awards', section_type],
    queryFn: async () => {
      const res = await api.get('/awards')
      return res.data
    },
    enabled: ['awards_display'].includes(section_type),
  })

  const careersQuery = useQuery({
    queryKey: ['sections', 'careers', section_type],
    queryFn: async () => {
      const res = await api.get('/careers')
      return res.data
    },
    enabled: ['careers_list'].includes(section_type),
  })

  const testimonialsQuery = useQuery({
    queryKey: ['sections', 'testimonials'],
    queryFn: async () => {
      const res = await api.get('/testimonials')
      return res.data
    },
    enabled: ['testimonials_carousel'].includes(section_type),
  })

  const partnersQuery = useQuery({
    queryKey: ['sections', 'partners'],
    queryFn: async () => {
      const res = await api.get('/partners')
      return res.data
    },
    enabled: ['partners_showcase'].includes(section_type),
  })

  const { data: site } = useSiteSettings()
  const contactMutation = useContactForm()
  const newsletterMutation = useNewsletterSubscribe()
  const [contactData, setContactData] = useState({ name: '', email: '', subject: '', message: '' })
  const [contactSent, setContactSent] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSent, setNewsletterSent] = useState(false)

  const submitContactForm = (e: React.FormEvent) => {
    e.preventDefault()
    contactMutation.mutate(contactData, {
      onSuccess: () => {
        setContactSent(true)
        setContactData({ name: '', email: '', subject: '', message: '' })
      },
    })
  }

  const submitNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    newsletterMutation.mutate({ email: newsletterEmail, tags: ['dynamic_page'] }, {
      onSuccess: () => {
        setNewsletterSent(true)
        setNewsletterEmail('')
      },
    })
  }

  const renderTitle = () => {
    if (!title) return null
    return (
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-primary dark:text-brand-white">{title}</h2>
        <div className="w-16 h-1 bg-brand-primary rounded-full mx-auto mt-4" />
      </div>
    )
  }

  switch (section_type) {
    case 'hero_banner':
      return <BannerSlider />

    case 'film_grid': {
      const films = filmGridQuery.data?.data || []
      if (films.length === 0) return null
      return (
        <Section padding="lg">
          <Container>
            {renderTitle()}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {films.slice(0, config?.limit || 12).map((film: any) => (
                <Link key={film.id} to={`/films/${film.slug}`} className="group block rounded-xl overflow-hidden border border-brand-surface/50 hover:border-brand-primary/30 transition-all duration-300 bg-white dark:bg-brand-dark">
                  <div className="aspect-[2/3] bg-brand-dark/80 overflow-hidden">
                    <SafeImage src={film.poster_url} alt={film.title} placeholderType='film' className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-brand-text dark:text-brand-white truncate">{film.title}</h3>
                    {film.release_year && <p className="text-xs text-brand-muted dark:text-brand-white/60 mt-0.5">{film.release_year}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )
    }

    case 'featured_film': {
      const filmSlug = config?.slug
      if (!filmSlug) return null
      return null
    }

    case 'news_feed':
    case 'featured_news': {
      const articles = newsQuery.data?.data || []
      if (articles.length === 0) return null
      return (
        <Section padding="lg">
          <Container>
            {renderTitle()}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.slice(0, config?.limit || 6).map((article: any) => (
                <Link key={article.id} to={`/news/${article.slug}`} className="group block rounded-xl overflow-hidden border border-brand-surface/50 hover:border-brand-primary/30 transition-all duration-300 bg-white dark:bg-brand-dark">
                  <SafeImage src={article.featured_image_url} alt={article.title} placeholderType='gallery' className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" wrapperClassName='aspect-video overflow-hidden' />
                  <div className="p-4">
                    <h3 className="font-medium text-brand-text dark:text-brand-white group-hover:text-brand-primary dark:group-hover:text-brand-white transition-colors">{article.title}</h3>
                    <p className="text-sm text-brand-muted dark:text-brand-white/60 mt-1 line-clamp-2">{article.excerpt || ''}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )
    }

    case 'gallery_albums': {
      const albums = galleryQuery.data?.data || []
      if (albums.length === 0) return null
      return (
        <Section padding="lg">
          <Container>
            {renderTitle()}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.slice(0, config?.limit || 9).map((album: any) => (
                <Link key={album.id} to={`/gallery/${album.slug}`} className="group block rounded-xl overflow-hidden border border-brand-surface/50 hover:border-brand-primary/30 transition-all duration-300 bg-white dark:bg-brand-dark">
                  <div className="aspect-[4/3] bg-brand-dark/80 overflow-hidden">
                    <SafeImage src={album.cover_url} alt={album.title} placeholderType='gallery' className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-brand-text dark:text-brand-white truncate">{album.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )
    }

    case 'team_grid': {
      const teamData = teamQuery.data
      const members = teamData?.team || teamData?.data || []
      if (members.length === 0) return null
      return (
        <Section padding="lg">
          <Container>
            {renderTitle()}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {members.slice(0, 8).map((member: any) => (
                <div key={member.id} className="text-center group">
                  <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden bg-brand-dark/80 border-2 border-brand-surface/50 group-hover:border-brand-primary/50 transition-colors">
                    <SafeImage src={member.photo_url} alt={member.name} placeholderType='team' className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-medium text-brand-text dark:text-brand-white text-sm">{member.name}</h3>
                  {member.position && <p className="text-xs text-brand-muted dark:text-brand-white/60 mt-0.5">{member.position}</p>}
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )
    }

    case 'people_grid': {
      const people = peopleQuery.data?.data || []
      if (people.length === 0) return null
      return (
        <Section padding="lg">
          <Container>
            {renderTitle()}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {people.slice(0, config?.limit || 12).map((person: any) => (
                <Link key={person.id} to={`/people/${person.slug}`} className="text-center group">
                  <div className="aspect-square rounded-xl overflow-hidden bg-brand-dark/80 border border-brand-surface/50 group-hover:border-brand-primary/30 transition-all mb-2">
                    <SafeImage src={person.photo_url} alt={person.name} placeholderType='person' className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="text-xs font-medium text-brand-text dark:text-brand-white truncate">{person.name}</h3>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )
    }

    case 'awards_display': {
      const awards = awardsQuery.data
      const awardsList = Array.isArray(awards) ? awards : awards?.data || []
      if (awardsList.length === 0) return null
      return (
        <Section padding="lg">
          <Container>
            {renderTitle()}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {awardsList.slice(0, 12).map((award: any) => {
                const kind = awardResultKind[award.result] || 'neutral'
                return (
                  <div key={award.id} className="p-4 rounded-xl border border-brand-surface/50 bg-white dark:bg-brand-dark/50">
                    <div className="text-brand-primary dark:text-brand-white font-semibold">{award.award_name}</div>
                    <div className="text-sm text-brand-muted dark:text-brand-white/60 mt-1">{award.category} {award.year && `· ${award.year}`}</div>
                    <span className={cn('text-xs px-2 py-0.5 rounded mt-2 inline-block', statusStyles[kind].soft)}>{award.result}</span>
                  </div>
                )
              })}
            </div>
          </Container>
        </Section>
      )
    }

    case 'contact_form':
      return (
        <Section padding="lg" background="surface">
          <Container>
            {renderTitle()}
            <div className="max-w-lg mx-auto">
              <p className="text-center text-brand-muted mb-6">Have a question or want to work with us? Send us a message.</p>
              {contactSent ? (
                <p className="text-center text-brand-primary dark:text-brand-white font-medium">Thanks! Your message has been sent.</p>
              ) : (
                <form onSubmit={submitContactForm} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" placeholder="Your Name" required className="input-field" value={contactData.name} onChange={e => setContactData({ ...contactData, name: e.target.value })} />
                    <input type="email" placeholder="Your Email" required className="input-field" value={contactData.email} onChange={e => setContactData({ ...contactData, email: e.target.value })} />
                  </div>
                  <input type="text" placeholder="Subject" required className="input-field" value={contactData.subject} onChange={e => setContactData({ ...contactData, subject: e.target.value })} />
                  <textarea placeholder="Your Message" rows={4} required className="input-field" value={contactData.message} onChange={e => setContactData({ ...contactData, message: e.target.value })} />
                  <button type="submit" className="btn-primary w-full" disabled={contactMutation.isPending}>
                    {contactMutation.isPending ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </Container>
        </Section>
      )

    case 'newsletter_signup':
      return (
        <Section padding="lg">
          <Container>
            <div className="max-w-xl mx-auto text-center">
              {renderTitle()}
              <p className="text-brand-muted dark:text-brand-white/60 mb-6">Subscribe to our newsletter for the latest updates.</p>
              {newsletterSent ? (
                <p className="text-brand-primary dark:text-brand-white font-medium">Thanks for subscribing! Check your email to confirm.</p>
              ) : (
                <form onSubmit={submitNewsletter} className="flex flex-col sm:flex-row gap-3">
                  <input type="email" placeholder="your@email.com" required className="input-field flex-1" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} />
                  <button type="submit" className="btn-primary flex items-center justify-center gap-2" disabled={newsletterMutation.isPending}>
                    <Send className="w-4 h-4" /> {newsletterMutation.isPending ? 'Subscribing…' : 'Subscribe'}
                  </button>
                </form>
              )}
            </div>
          </Container>
        </Section>
      )

    case 'stats_counters': {
      const stats = site?.stats
      const counters = [
        { value: stats?.films, label: 'Films Produced' },
        { value: stats?.awards_won, label: 'Awards Won' },
        { value: stats?.talent, label: 'Team & Talent' },
        { value: stats?.recognitions, label: 'Award Ceremonies' },
      ]
      return (
        <Section padding="lg" background="surface">
          <Container>
            {renderTitle()}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {counters.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-brand-primary mb-2">{stat.value ?? '—'}</div>
                  <div className="text-sm text-brand-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )
    }

    case 'custom_html':
      if (!config?.html) return null
      return (
        <Section padding="lg">
          <Container>
            <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(config.html) }} />
          </Container>
        </Section>
      )

    case 'about_preview': {
      const aboutData = teamQuery.data
      return (
        <Section padding="lg">
          <Container>
            {renderTitle()}
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-lg text-brand-muted dark:text-brand-white/60 leading-relaxed">
                {aboutData?.mission || aboutData?.description || 'We are a leading film production company dedicated to redefining Nepali cinema.'}
              </p>
              <Link to="/about" className="btn-primary inline-block mt-6">Learn More About Us</Link>
            </div>
          </Container>
        </Section>
      )
    }

    case 'careers_list': {
      const jobs = careersQuery.data?.data || []
      if (jobs.length === 0) return null
      return (
        <Section padding="lg">
          <Container>
            {renderTitle()}
            <div className="max-w-2xl mx-auto space-y-3">
              {jobs.map((job: any) => (
                <Link key={job.id} to={`/careers/${job.slug}`} className="block p-4 rounded-xl border border-brand-surface/50 hover:border-brand-primary/30 bg-white dark:bg-brand-dark transition-all group">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-brand-text dark:text-brand-white group-hover:text-brand-primary dark:group-hover:text-brand-white transition-colors">{job.title}</h3>
                      <p className="text-sm text-brand-muted dark:text-brand-white/60">{job.department} · {job.location}</p>
                    </div>
                    <span className="text-brand-primary dark:text-brand-white text-sm font-medium">View →</span>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )
    }

    case 'testimonials_carousel': {
      const testimonials = testimonialsQuery.data || []
      const items = Array.isArray(testimonials) ? testimonials : testimonials.data || []
      if (items.length === 0) return null
      return (
        <Section padding="lg" background="surface">
          <Container>
            {renderTitle()}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.slice(0, config?.limit || 9).map((t: any) => (
                <div key={t.id} className="p-6 rounded-xl bg-white dark:bg-brand-dark border border-brand-surface/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-brand-primary/10 overflow-hidden flex items-center justify-center shrink-0">
                      <SafeImage src={t.photo_url} alt={t.name} placeholderType='person' className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-medium text-brand-text dark:text-brand-white text-sm">{t.name}</div>
                      {t.position && <div className="text-xs text-brand-muted dark:text-brand-white/60">{t.position}{t.company ? ` at ${t.company}` : ''}</div>}
                    </div>
                  </div>
                  <p className="text-brand-muted dark:text-brand-white/60 text-sm italic leading-relaxed mb-3">&ldquo;{t.content}&rdquo;</p>
                  {t.rating && <div className="flex gap-0.5 text-yellow-400">{Array.from({ length: t.rating }).map((_, i) => <span key={i}>★</span>)}</div>}
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )
    }

    case 'partners_showcase': {
      const partners = partnersQuery.data || []
      const items = Array.isArray(partners) ? partners : partners.data || []
      if (items.length === 0) return null
      return (
        <Section padding="lg">
          <Container>
            {renderTitle()}
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {items.map((p: any) => (
                <a key={p.id} href={p.website_url || '#'} target={p.website_url ? '_blank' : undefined} rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-3 opacity-70 hover:opacity-100 transition-opacity">
                  <div className="w-24 h-24 rounded-xl bg-white/5 border border-brand-surface/30 flex items-center justify-center overflow-hidden p-3 group-hover:border-brand-primary/30 transition-colors">
                    <SafeImage src={p.logo_url} alt={p.name} placeholderType='partner' className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300" />
                  </div>
                  <span className="text-xs text-brand-muted dark:text-brand-white/60 group-hover:text-brand-primary dark:group-hover:text-brand-white transition-colors">{p.name}</span>
                </a>
              ))}
            </div>
          </Container>
        </Section>
      )
    }

    case 'film_status_tabs': {
      return null
    }

    default:
      return null
  }
}

export const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()

  const { data: page, isLoading, error } = useQuery({
    queryKey: ['page', slug],
    queryFn: () => getPublicPage(slug!),
    enabled: !!slug,
  })

  if (isLoading) return <Loading text="Loading page..." />
  if (error || !page) return (
    <Section>
      <Container>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-brand-primary dark:text-brand-white mb-2">Page Not Found</h1>
          <p className="text-brand-muted dark:text-brand-white/60">The page you are looking for does not exist.</p>
        </div>
      </Container>
    </Section>
  )

  const sections: PageSection[] = page.active_sections || page.sections || []

  return (
    <>
      <SEOHead
        title={page.title}
        description={page.meta_description}
        ogImage={page.meta_image_url}
        schemaType={page.schema_type || 'WebPage'}
      />
      {sections.length > 0 ? (
        sections.map((section: PageSection) => (
          <SectionRenderer key={section.id} section={section} />
        ))
      ) : (
        <Section padding="lg">
          <Container>
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-brand-primary dark:text-brand-white mb-5 leading-tight">{page.title}</h1>
              <div className="w-16 h-1 bg-brand-primary rounded-full mb-6" />
              {page.content ? (
                <div
                  className="text-brand-text dark:text-brand-white/90 leading-relaxed space-y-5 text-lg [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-brand-primary dark:[&_h1]:text-brand-white [&_h1]:mt-10 [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-brand-primary dark:[&_h2]:text-brand-white [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-brand-primary dark:[&_h3]:text-brand-white [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-4 [&_p]:leading-relaxed [&_a]:text-brand-primary [&_a]:underline [&_a:hover]:text-brand-accent [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1 [&_img]:rounded-xl [&_img]:my-6 [&_img]:max-w-full [&_blockquote]:border-l-4 [&_blockquote]:border-brand-primary [&_blockquote]:pl-5 [&_blockquote]:py-2 [&_blockquote]:my-6 [&_blockquote]:text-brand-muted dark:[&_blockquote]:text-brand-white/60 [&_blockquote]:italic [&_pre]:bg-brand-surface dark:[&_pre]:bg-brand-dark/80 [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:my-6 [&_code]:text-sm [&_code]:bg-brand-primary/10 dark:[&_code]:bg-brand-dark/60 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_hr]:border-brand-surface [&_hr]:my-8"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(page.content) }}
                />
              ) : (
                <p className="text-brand-muted dark:text-brand-white/60 text-lg">This page has no content yet.</p>
              )}
            </div>
          </Container>
        </Section>
      )}
    </>
  )
}


