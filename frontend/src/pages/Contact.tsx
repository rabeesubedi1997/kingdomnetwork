import { motion } from 'framer-motion';
import { useContactForm } from '@/hooks/useForms';
import { useToast } from '@/hooks/useToast';
import { Section, Container } from '@/components/layout/Section';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { SEOHead } from '@/components/seo/SEOHead';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Mail, MapPin, Phone, Send, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactFormData } from '@/lib/validations';
import { cn } from '@/lib/utils';

export const Contact: React.FC = () => {
  const { toast } = useToast();
  const { data: settings } = useQuery({
    queryKey: ['site'],
    queryFn: async () => (await api.get('/site')).data,
  });

  const contact = settings?.brand?.contact || {
    address: 'Kathmandu, Nepal',
    phone: '+977-1-1234567',
    email: 'info@kingdomnetwork.com.np',
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const contactMutation = useContactForm();

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data, {
      onSuccess: () => {
        toast({ type: 'success', message: 'Message sent successfully!' });
        reset();
      },
      onError: (error: Error) => {
        toast({ type: 'error', message: error.message || 'Failed to send message' });
      },
    });
  };

  return (
    <>
      <SEOHead title="Contact" description="Get in Touch" />
      <Section id='contact-hero' background='dark' padding='xl' className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-brand-primary/20 to-transparent' />
        <Container>
          <div className='max-w-3xl mx-auto text-center'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='inline-flex items-center gap-2 bg-brand-white/10 px-4 py-2 rounded-full text-brand-gold text-sm font-medium mb-6'
            >
              <Mail className='w-4 h-4' />
              Get in Touch
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className='heading-1 text-brand-white mb-4'
            >
              Let's Create Together
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
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
          <div className='grid md:grid-cols-3 gap-5 mb-6'>
            {[
              { icon: MapPin, label: 'Visit Us', value: contact.address, href: '#' },
              { icon: Phone, label: 'Call Us', value: contact.phone, href: 'tel:' + contact.phone },
              { icon: Mail, label: 'Email Us', value: contact.email, href: 'mailto:' + contact.email },
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

          <div className='max-w-2xl mx-auto'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className='heading-2 text-brand-primary text-center mb-5'>Send Us a Message</h2>
              <form onSubmit={handleSubmit(onSubmit)} className='space-y-5' noValidate>
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
                <Button type='submit' className='w-full' loading={isSubmitting}>
                  {isSubmitting ? (
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
          <h2 className='heading-2 text-brand-white text-center mb-5'>Follow Our Journey</h2>
          <div className='flex justify-center gap-5'>
            {[
              { icon: 'Facebook', href: 'https://facebook.com/Kingdomntwork' },
              { icon: 'Instagram', href: 'https://instagram.com/kingdomnetwork' },
              { icon: 'Twitter', href: 'https://twitter.com/kingdomnetwork' },
              { icon: 'Youtube', href: 'https://youtube.com/@kingdomnetwork' },
              { icon: 'Linkedin', href: 'https://linkedin.com/company/kingdomnetwork' },
            ].map(item => (
              <motion.a
                key={item.icon}
                href={item.href}
                target='_blank'
                rel='noopener noreferrer'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className='w-12 h-12 rounded-xl bg-brand-white/10 flex items-center justify-center text-brand-white hover:bg-brand-primary hover:text-white transition-colors'
                aria-label={'Follow us on ' + item.icon}
              >
                <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
                  {item.icon === 'Facebook' && <path d='M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' />}
                  {item.icon === 'Instagram' && <> <rect x='2' y='2' width='20' height='20' rx='5' ry='5' /> <path d='M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z' /> <circle cx='17.5' cy='6.5' r='1' /> </>}
                  {item.icon === 'Twitter' && <path d='M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' />}
                  {item.icon === 'Youtube' && <> <path d='M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.33 29 29 0 00-.46-5.33z' /> <polygon points='9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02' /> </>}
                  {item.icon === 'Linkedin' && <> <path d='M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z' /> <rect x='2' y='9' width='4' height='12' /> <circle cx='4' cy='4' r='2' /> </>}
                </svg>
              </motion.a>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}