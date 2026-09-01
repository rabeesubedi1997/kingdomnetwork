import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Section, Container } from '@/components/layout/Section'
import { Button } from '@/components/ui/Button'
import { SEOHead } from '@/components/seo/SEOHead'
import { useContactInfo } from '@/hooks/useData'
import { heroTitle, heroChild } from '@/lib/motion'

export const Terms: React.FC = () => {
  const contact = useContactInfo()

  return (
  <>
    <SEOHead title="Terms of Service" description="Terms and conditions for using Kingdom Network's website and services." />
    <Section id='terms-hero' background='dark' padding='xl' className='relative overflow-hidden'>
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-brand-primary/20 to-transparent' />
      <Container>
        <div className='max-w-3xl mx-auto text-center'>
          <motion.span initial='initial' animate='animate' variants={heroTitle} className='eyebrow-pill'>
            Legal
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={heroChild(0.1)}
            className='heading-1 text-brand-white mt-6 mb-4'
          >
            Terms of Service
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={heroChild(0.2)}
            className='text-brand-white/70 text-lg max-w-2xl mx-auto'
          >
            Please read these terms carefully before using our website and services.
          </motion.p>
        </div>
      </Container>
    </Section>

    <Section id='terms-content' padding='xl'>
      <Container>
        <div className='max-w-3xl mx-auto space-y-12'>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className='heading-2 text-brand-primary dark:text-brand-white mb-4'>1. Acceptance of Terms</h2>
            <p className='text-brand-text dark:text-brand-white/90 leading-relaxed mb-4'>
              By accessing and using the Kingdom Network website (<code className='px-1.5 py-0.5 bg-brand-primary/10 text-brand-primary dark:text-brand-white rounded text-sm font-mono'>https://kingdomnetwork.com.np</code>), you accept and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use our website.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <h2 className='heading-2 text-brand-primary dark:text-brand-white mb-4'>2. Use of Website</h2>
            <p className='text-brand-text dark:text-brand-white/90 leading-relaxed mb-4'>
              You agree to use our website only for lawful purposes and in accordance with these Terms. You agree not to:
            </p>
            <ul className='list-disc pl-6 space-y-2 text-brand-text dark:text-brand-white/90'>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Interfere with website security or functionality</li>
              <li>Collect personal data without consent</li>
              <li>Use automated systems to scrape content</li>
              <li>Transmit harmful code or viruses</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <h2 className='heading-2 text-brand-primary dark:text-brand-white mb-4'>3. Intellectual Property</h2>
            <p className='text-brand-text dark:text-brand-white/90 leading-relaxed mb-4'>
              All content on this website, including text, graphics, logos, images, videos, and software, is the property of Kingdom Network or its licensors and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our prior written consent.
            </p>
            <p className='text-brand-text dark:text-brand-white/90 leading-relaxed mb-4'>
              Film posters, trailers, and press materials are provided for promotional and editorial use only. Commercial use requires explicit permission.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <h2 className='heading-2 text-brand-primary dark:text-brand-white mb-4'>4. User Submissions</h2>
            <p className='text-brand-text dark:text-brand-white/90 leading-relaxed mb-4'>
              By submitting content through our contact forms, career applications, or screening requests, you grant us a worldwide, royalty-free, perpetual license to use, reproduce, and process your submission for the purpose for which it was submitted. You represent that you own or have rights to all content you submit.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
            <h2 className='heading-2 text-brand-primary dark:text-brand-white mb-4'>5. Third-Party Links</h2>
            <p className='text-brand-text dark:text-brand-white/90 leading-relaxed mb-4'>
              Our website may contain links to third-party websites (YouTube, Vimeo, social media, etc.). We are not responsible for the content, privacy practices, or terms of these external sites. Your use of third-party sites is at your own risk.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
            <h2 className='heading-2 text-brand-primary dark:text-brand-white mb-4'>6. Disclaimers</h2>
            <p className='text-brand-text dark:text-brand-white/90 leading-relaxed mb-4'>
              The website is provided \"as is\" and \"as available\" without warranties of any kind. We do not warrant that the website will be uninterrupted, error-free, or free of viruses. Information about films, release dates, and cast/crew may change without notice.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}>
            <h2 className='heading-2 text-brand-primary dark:text-brand-white mb-4'>7. Limitation of Liability</h2>
            <p className='text-brand-text dark:text-brand-white/90 leading-relaxed mb-4'>
              To the maximum extent permitted by law, Kingdom Network shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of the website.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.7 }}>
            <h2 className='heading-2 text-brand-primary dark:text-brand-white mb-4'>8. Governing Law</h2>
            <p className='text-brand-text dark:text-brand-white/90 leading-relaxed mb-4'>
              These Terms shall be governed by and construed in accordance with the laws of Nepal. Any disputes shall be resolved in the courts of Kathmandu, Nepal.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.8 }}>
            <h2 className='heading-2 text-brand-primary dark:text-brand-white mb-4'>9. Changes to Terms</h2>
            <p className='text-brand-text dark:text-brand-white/90 leading-relaxed mb-4'>
              We may modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the website constitutes acceptance of the revised Terms.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.9 }}>
            <h2 className='heading-2 text-brand-primary dark:text-brand-white mb-4'>10. Contact Information</h2>
            <p className='text-brand-text dark:text-brand-white/90 leading-relaxed mb-4'>
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <address className='not-italic text-brand-text dark:text-brand-white/90 leading-relaxed'>
              <p>Kingdom Network</p>
              <p>{contact.address}</p>
              <p>Email: <a href='mailto:legal@kingdomnetwork.com.np' className='text-brand-primary dark:text-brand-white hover:text-brand-secondary'>legal@kingdomnetwork.com.np</a></p>
              <p>Phone: {contact.phone}</p>
            </address>
            <p className='text-brand-muted dark:text-brand-white/60 text-sm mt-6'>
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>
        </div>
      </Container>
    </Section>

    <Section id='terms-cta' background='brand' padding='xl'>
      <Container>
        <div className='max-w-3xl mx-auto text-center'>
          <h2 className='heading-2 text-brand-white mb-4'>Ready to Explore?</h2>
          <p className='text-brand-white/80 text-lg mb-5'>
            Now that you're familiar with our terms, dive into our cinematic world.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link to='/films'>
              <Button variant='primary' size='lg'>
                Browse Films
              </Button>
            </Link>
            <Link to='/'>
              <Button variant='secondary' size='lg' className='border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-primary dark:text-brand-white'>
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  </>
  )
}