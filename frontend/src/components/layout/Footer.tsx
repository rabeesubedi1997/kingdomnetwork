import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { useNewsletterSubscribe } from '@/hooks/useForms'
import { useToast } from '@/hooks/useToast'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, Send, Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react'
import { Section, Container } from '@/components/layout/Section'

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('')
  const { toast } = useToast()
  const { data: settings } = useQuery({
    queryKey: ['site'],
    queryFn: async () => (await api.get('/site')).data,
  })

  const subscribeMutation = useNewsletterSubscribe()

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

  const brand = settings?.brand || {
    name: 'Kingdom Network',
    social: {
      facebook: 'https://www.facebook.com/Kingdomntwork',
      instagram: 'https://instagram.com/kingdomnetwork',
      twitter: 'https://twitter.com/kingdomnetwork',
      youtube: 'https://youtube.com/@kingdomnetwork',
      linkedin: 'https://linkedin.com/company/kingdomnetwork',
    },
    contact: {
      address: 'Kathmandu, Nepal',
      phone: '+977-1-1234567',
      email: 'info@kingdomnetwork.com.np',
    },
  }

  const socialLinks = [
    { icon: Facebook, url: brand.social.facebook, label: 'Facebook' },
    { icon: Instagram, url: brand.social.instagram, label: 'Instagram' },
    { icon: Twitter, url: brand.social.twitter, label: 'Twitter' },
    { icon: Youtube, url: brand.social.youtube, label: 'YouTube' },
    { icon: Linkedin, url: brand.social.linkedin, label: 'LinkedIn' },
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
      <Section padding='xl' background='surface'>
        <Container>
          <div className='grid md:grid-cols-3 gap-5 mb-6'>
            {[
              { icon: MapPin, label: 'Visit Us', value: brand.contact.address, href: '#' },
              { icon: Phone, label: 'Call Us', value: brand.contact.phone, href: 'tel:' + brand.contact.phone },
              { icon: Mail, label: 'Email Us', value: brand.contact.email, href: 'mailto:' + brand.contact.email },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className='text-center p-5 bg-brand-surface/50 rounded-xl border border-brand-surface'
              >
                <div className='w-14 h-14 mx-auto mb-4 bg-brand-primary/10 rounded-xl flex items-center justify-center'>
                  <item.icon className='w-7 h-7 text-brand-primary' />
                </div>
                <h3 className='font-semibold text-brand-primary mb-2'>{item.label}</h3>
                <a href={item.href} className='text-brand-text hover:text-brand-primary transition-colors'>
                  {item.value}
                </a>
              </motion.div>
            ))}
          </div>

          <div className='max-w-xl mx-auto text-center'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className='font-semibold text-brand-primary mb-2'>Stay Updated</h3>
              <p className='text-sm text-brand-muted mb-6'>Subscribe to our newsletter for the latest updates.</p>
              <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-3 max-w-md mx-auto'>
                <input
                  type='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder='your@email.com'
                  required
                  className='flex-1 px-4 py-2.5 rounded-lg border border-brand-surface/50 bg-white text-brand-text placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-primary'
                />
                <button
                  type='submit'
                  disabled={subscribeMutation.isPending}
                  className='btn-primary flex items-center gap-2 px-6'
                >
                  <Send className='w-4 h-4' />
                  Subscribe
                </button>
              </form>
            </motion.div>
          </div>
        </Container>
      </Section>

      <Section padding='lg' background='dark'>
        <Container>
          <div className='flex flex-col md:flex-row justify-between items-center gap-5'>
            <div className='flex flex-wrap justify-center gap-5'>
              {footerLinks.map(link => (
                <Link key={link.href} to={link.href} className='text-brand-white/70 hover:text-brand-white text-sm transition-colors'>
                  {link.label}
                </Link>
              ))}
            </div>
            <div className='flex gap-4'>
              {socialLinks.map(({ icon: Icon, url, label }) => (
                <a
                  key={label}
                  href={url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-10 h-10 rounded-lg bg-brand-white/10 flex items-center justify-center text-brand-white/70 hover:bg-brand-primary hover:text-white transition-colors'
                  aria-label={'Follow us on ' + label}
                >
                  <Icon className='w-5 h-5' />
                </a>
              ))}
            </div>
          </div>
          <div className='mt-8 pt-6 border-t border-brand-white/10 flex flex-col md:flex-row justify-between items-center gap-4'>
            <p className='text-brand-white/50 text-sm'>&copy; {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
            <div className='flex gap-4'>
              {legalLinks.map(link => (
                <Link key={link.href} to={link.href} className='text-brand-white/50 hover:text-brand-white text-sm transition-colors'>
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
