import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { useModuleConfig } from '@/providers/ModuleConfigProvider'
import { useContactInfo } from '@/hooks/useData'
import { useNewsletterSubscribe } from '@/hooks/useForms'
import { useToast } from '@/hooks/useToast'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, Send, Facebook, Instagram, Twitter, Youtube, Linkedin, ArrowUpRight } from 'lucide-react'
import { Section, Container } from '@/components/layout/Section'
import { reveal, staggerContainer, staggerItem, fadeUpViewport } from '@/lib/motion'

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('')
  const { toast } = useToast()
  const { footer_logo_url } = useModuleConfig()
  const { data: settings } = useQuery({
    queryKey: ['site'],
    queryFn: async () => (await api.get('/site')).data,
  })

  const subscribeMutation = useNewsletterSubscribe()
  const contactInfo = useContactInfo()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    subscribeMutation.mutate({ email, tags: ['footer'] }, {
      onSuccess: () => {
        toast({ type: 'success', message: 'Subscribed successfully! Check your email to confirm.' })
        setEmail('')
      },
      onError: (error: Error) => {
        toast({ type: 'error', message: error.message || 'Failed to subscribe' })
      },
    })
  }

  const siteSettings = settings?.settings || {}
  const allSettings = settings?.all_settings || {}
  const siteName = siteSettings.site_name || 'Kingdom Network'
  const logoUrl = settings?.logo_url
  const footerLogo = footer_logo_url || settings?.logo_url
  const footerTagline = allSettings.footer_tagline || ''
  const footerDescription = allSettings.footer_description || 'Redefining Nepali Cinema through compelling storytelling and world-class production.'
  const footerCopyright = allSettings.footer_copyright || ''

  const brand = settings?.brand || {
    name: 'Kingdom Network',
    social: {
      facebook: 'https://www.facebook.com/Kingdomntwork',
      instagram: 'https://instagram.com/kingdomnetwork',
      twitter: 'https://twitter.com/kingdomnetwork',
      youtube: 'https://youtube.com/@kingdomnetwork',
      linkedin: 'https://linkedin.com/company/kingdomnetwork',
    },
  }

  const socialLinks = [
    { icon: Facebook, url: siteSettings.social_facebook || brand.social.facebook, label: 'Facebook' },
    { icon: Instagram, url: siteSettings.social_instagram || brand.social.instagram, label: 'Instagram' },
    { icon: Twitter, url: siteSettings.social_twitter || brand.social.twitter, label: 'Twitter' },
    { icon: Youtube, url: siteSettings.social_youtube || brand.social.youtube, label: 'YouTube' },
    { icon: Linkedin, url: siteSettings.social_linkedin || brand.social.linkedin, label: 'LinkedIn' },
  ]

  const footerLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Films', href: '/films' },
    { label: 'News', href: '/news' },
    { label: 'Careers', href: '/careers' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Press', href: '/press' },
    { label: 'Contact', href: '/contact' },
  ]

  const legalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ]

  return (
    <footer>
      {/* Contact & Newsletter Section */}
      <Section padding="2xl" background="surface">
        <Container>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={fadeUpViewport}
            className="grid md:grid-cols-3 gap-6 mb-16"
          >
            {[
              { icon: MapPin, label: 'Visit Us', value: contactInfo.address, href: '#' },
              { icon: Phone, label: 'Call Us', value: contactInfo.phone, href: 'tel:' + contactInfo.phone },
              { icon: Mail, label: 'Email Us', value: contactInfo.email, href: 'mailto:' + contactInfo.email },
            ].map((item) => (
              <motion.div key={item.label} variants={staggerItem}
                className="text-center p-6 md:p-8 bg-white dark:bg-brand-dark rounded-2xl border border-brand-surface/80 hover:shadow-lg hover:shadow-brand-primary/5 hover:border-brand-primary/20 transition-all duration-300 group"
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-2xl flex items-center justify-center group-hover:bg-brand-primary group-hover:scale-110 transition-all duration-300">
                  <item.icon className="w-7 h-7 text-brand-primary dark:text-brand-white group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-semibold text-brand-primary dark:text-brand-white mb-2">{item.label}</h3>
                <a href={item.href} className="text-brand-text/70 dark:text-brand-white/60 hover:text-brand-primary dark:hover:text-brand-white transition-colors text-sm">
                  {item.value}
                </a>
              </motion.div>
            ))}
          </motion.div>

          {/* Newsletter */}
          <motion.div className="max-w-2xl mx-auto text-center" {...reveal(0)}>
            <div className="section-divider" />
            <h3 className="heading-3 text-brand-primary mb-3">Stay Updated</h3>
            <p className="text-brand-muted mb-8 max-w-md mx-auto">
              Subscribe to our newsletter for the latest film releases, behind-the-scenes content, and exclusive updates.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" required
                className="input-field flex-1"
              />
              <button type="submit" disabled={subscribeMutation.isPending} className="btn-primary flex items-center gap-2 px-8">
                <Send className="w-4 h-4" /> Subscribe
              </button>
            </form>
          </motion.div>
        </Container>
      </Section>

      {/* Bottom Bar */}
      <Section padding="lg" background="dark">
        <Container>
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            {/* Brand */}
            <div className="text-center lg:text-left max-w-sm">
              <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
                {footerLogo || logoUrl ? (
                  // Same flat-JPG-with-white-canvas issue as the header —
                  // wrap in an explicit white chip instead of a stray white
                  // rectangle (and instead of `invert`, which would turn a
                  // white-background logo fully white-on-white/invisible).
                  <span className="bg-white rounded-lg px-2.5 py-1.5 shadow-sm shadow-black/20">
                    <img src={footerLogo || logoUrl} alt={siteName} className="h-7 w-auto block" />
                  </span>
                ) : (
                  <>
                    <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
                      <span className="text-white font-display font-bold text-lg">KN</span>
                    </div>
                    <span className="font-display font-bold text-xl tracking-tight text-white">{siteName}</span>
                  </>
                )}
              </Link>
              {footerTagline && <p className="text-brand-gold/90 text-xs font-semibold uppercase tracking-[0.2em] mb-3">{footerTagline}</p>}
              <p className="text-white/70 text-base md:text-lg leading-relaxed font-medium">
                {footerDescription}
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
              {footerLinks.map(link => (
                <Link key={link.href} to={link.href}
                  className="text-white/70 hover:text-white text-sm transition-colors flex items-center gap-1 group">
                  {link.label}
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200" />
                </Link>
              ))}
            </div>

            {/* Social */}
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, url, label }) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/80 hover:bg-brand-primary hover:text-white hover:scale-110 transition-all duration-200"
                  aria-label={'Follow us on ' + label}>
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">&copy; {new Date().getFullYear()} {footerCopyright || siteName}. {!footerCopyright && 'All rights reserved.'}</p>
            <div className="flex gap-6">
              {legalLinks.map(link => (
                <Link key={link.href} to={link.href}
                  className="text-white/40 hover:text-white/70 text-sm transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </footer>
  )
}