import { useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useContactForm } from '@/hooks/useForms'
import { useContactInfo } from '@/hooks/useData'
import { useToast } from '@/hooks/useToast'
import { Section, Container } from '@/components/layout/Section'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { IconTile } from '@/components/ui/IconTile'
import { SEOHead } from '@/components/seo/SEOHead'
import { Mail, MapPin, Phone, Send, Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, type ContactFormData } from '@/lib/validations'
import { heroTitle, heroChild, staggerContainer, staggerItem, fadeUpViewport, cardHover } from '@/lib/motion'

const SUBMIT_COOLDOWN = 30000

export const Contact: React.FC = () => {
  const { toast } = useToast()
  const lastSubmitRef = useRef(0)
  const contact = useContactInfo()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const contactMutation = useContactForm()

  const onSubmit = useCallback((data: ContactFormData) => {
    const now = Date.now()
    if (now - lastSubmitRef.current < SUBMIT_COOLDOWN) {
      toast({ type: 'error', message: 'Please wait before sending another message.' })
      return
    }
    lastSubmitRef.current = now
    contactMutation.mutate(data, {
      onSuccess: () => {
        toast({ type: 'success', message: 'Message sent successfully!' })
        reset()
      },
      onError: (error: any) => {
        toast({ type: 'error', message: error?.message || 'Failed to send message' })
      },
    })
  }, [contactMutation, reset, toast])

  return (
    <>
      <SEOHead title="Contact" description="Get in Touch" />
      <Section id='contact-hero' background='dark' padding='2xl' className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-brand-primary/20 to-transparent' />
        <Container>
          <div className='max-w-3xl mx-auto text-center'>
            <motion.span initial='initial' animate='animate' variants={heroTitle} className='eyebrow-pill'>
              <Mail className='w-4 h-4' />
              Get in Touch
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={heroChild(0.1)}
              className='heading-1 text-brand-white mt-6 mb-4'
            >
              Let's Create Together
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={heroChild(0.2)}
              className='text-brand-white/70 text-lg max-w-2xl mx-auto'
            >
              Have a project in mind? Want to collaborate? Or just want to say hello?
              We'd love to hear from you.
            </motion.p>
          </div>
        </Container>
      </Section>

      <Section id='contact-info' padding='xl' background='surface'>
        <Container>
          <motion.div
            initial='initial'
            whileInView='whileInView'
            viewport={fadeUpViewport}
            variants={staggerContainer}
            className='grid md:grid-cols-3 gap-5 mb-10'
          >
            {[
              { icon: MapPin, label: 'Visit Us', value: contact.address, href: '#' },
              { icon: Phone, label: 'Call Us', value: contact.phone, href: 'tel:' + contact.phone },
              { icon: Mail, label: 'Email Us', value: contact.email, href: 'mailto:' + contact.email },
            ].map((item) => (
              <motion.div
                key={item.label}
                variants={staggerItem}
                {...cardHover}
                className='card group text-center p-6'
              >
                <IconTile icon={item.icon} size='lg' hover title={item.label} titleClassName='font-semibold mb-2'>
                  <a href={item.href} className='text-brand-text dark:text-brand-white/90 hover:text-brand-primary dark:hover:text-brand-white transition-colors'>
                    {item.value}
                  </a>
                </IconTile>
              </motion.div>
            ))}
          </motion.div>

          <div className='max-w-2xl mx-auto'>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={fadeUpViewport}
              transition={{ duration: 0.6 }}
              className='card p-6 md:p-10'
            >
              <span className='eyebrow text-brand-primary dark:text-brand-gold flex justify-center mb-3'>Drop Us a Line</span>
              <h2 className='heading-2 text-brand-primary dark:text-brand-white text-center mb-5'>Send Us a Message</h2>
              <form onSubmit={handleSubmit(onSubmit)} className='space-y-5' noValidate>
                <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden='true'>
                  <label htmlFor='website'>Website</label>
                  <input
                    id='website'
                    type='text'
                    tabIndex={-1}
                    autoComplete='off'
                    {...register('website')}
                  />
                </div>
                <input type='hidden' {...register('_honeypot')} value='' />

                <div className='grid md:grid-cols-2 gap-5'>
                  <Input
                    label='Full Name'
                    placeholder='Your name'
                    error={errors.name?.message}
                    {...register('name')}
                  />
                  <Input
                    label='Email Address'
                    type='email'
                    placeholder='your@email.com'
                    error={errors.email?.message}
                    {...register('email')}
                  />
                </div>
                <Input
                  label='Subject'
                  placeholder='What is this about?'
                  error={errors.subject?.message}
                  {...register('subject')}
                />
                <Textarea
                  label='Message'
                  placeholder='Tell us about your project, idea, or just say hello...'
                  rows={5}
                  error={errors.message?.message}
                  {...register('message')}
                />
                <Button type='submit' className='btn-primary w-full' loading={isSubmitting || contactMutation.isPending}>
                  {isSubmitting || contactMutation.isPending ? (
                    <>
                      <svg className='animate-spin -ml-1 mr-2 h-5 w-5' fill='none' viewBox='0 0 24 24'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className='w-5 h-5 ml-2' />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </Container>
      </Section>

      <Section id='social' padding='xl' background='dark'>
        <Container>
          <span className='eyebrow flex justify-center mb-3'>Stay Connected</span>
          <h2 className='heading-2 text-brand-white text-center mb-8'>Follow Our Journey</h2>
          <motion.div initial='initial' whileInView='whileInView' viewport={fadeUpViewport} variants={staggerContainer} className='flex justify-center gap-5'>
            {[
              { icon: Facebook, label: 'Facebook', href: 'https://facebook.com/Kingdomntwork' },
              { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/kingdomnetwork' },
              { icon: Twitter, label: 'Twitter', href: 'https://twitter.com/kingdomnetwork' },
              { icon: Youtube, label: 'Youtube', href: 'https://youtube.com/@kingdomnetwork' },
              { icon: Linkedin, label: 'Linkedin', href: 'https://linkedin.com/company/kingdomnetwork' },
            ].map(item => (
              <motion.a
                key={item.label}
                href={item.href}
                target='_blank'
                rel='noopener noreferrer'
                variants={staggerItem}
                whileHover={{ y: -4, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='w-12 h-12 rounded-xl bg-brand-white/10 flex items-center justify-center text-brand-white hover:bg-brand-primary hover:text-white transition-colors'
                aria-label={'Follow us on ' + item.label}
              >
                <item.icon className='w-5 h-5' />
              </motion.a>
            ))}
          </motion.div>
        </Container>
      </Section>
    </>
  )
}
