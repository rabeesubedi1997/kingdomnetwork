import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Section, Container } from '@/components/layout/Section'
import { Button } from '@/components/ui/Button'
import { SEOHead } from '@/components/seo/SEOHead'
import { Home, ArrowLeft } from 'lucide-react'

export const Privacy: React.FC = () => (
  <>
    <SEOHead title="Privacy Policy" />
    <Section id='privacy-hero' background='dark' padding='xl' className='relative overflow-hidden'>
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-brand-primary/20 to-transparent' />
      <Container>
        <div className='max-w-3xl mx-auto text-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='inline-flex items-center gap-2 bg-brand-white/10 px-4 py-2 rounded-full text-brand-gold text-sm font-medium mb-6'
          >
            Privacy Policy
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='heading-1 text-brand-white mb-4'
          >
            Privacy Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='text-brand-white/70 text-lg max-w-2xl mx-auto'
          >
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </motion.p>
        </div>
      </Container>
    </Section>

    <Section id='privacy-content' padding='xl'>
      <Container>
        <div className='max-w-3xl mx-auto space-y-12'>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className='heading-2 text-brand-primary mb-4'>1. Information We Collect</h2>
            <p className='text-brand-text leading-relaxed mb-4'>
              We collect information you provide directly to us, such as when you fill out contact forms, subscribe to our newsletter, apply for careers, or request screening access. This may include your name, email address, phone number, organization, and any message content.
            </p>
            <p className='text-brand-text leading-relaxed mb-4'>
              We also collect certain information automatically when you visit our website, including your IP address, browser type, operating system, referring URLs, pages visited, and time spent on pages. We use cookies and similar technologies to collect this information.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <h2 className='heading-2 text-brand-primary mb-4'>2. How We Use Your Information</h2>
            <p className='text-brand-text leading-relaxed mb-4'>
              We use the information we collect to:
            </p>
            <ul className='list-disc pl-6 space-y-2 text-brand-text'>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Send you newsletters and updates (with your consent)</li>
              <li>Process job applications and screening requests</li>
              <li>Improve our website and services</li>
              <li>Analyze usage patterns and trends</li>
              <li>Comply with legal obligations</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <h2 className='heading-2 text-brand-primary mb-4'>3. Information Sharing</h2>
            <p className='text-brand-text leading-relaxed mb-4'>
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className='list-disc pl-6 space-y-2 text-brand-text'>
              <li>Service providers who perform services on our behalf (hosting, analytics, email)</li>
              <li>Legal authorities when required by law</li>
              <li>Partners for screening events (with your consent)</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <h2 className='heading-2 text-brand-primary mb-4'>4. Data Security</h2>
            <p className='text-brand-text leading-relaxed mb-4'>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
            <h2 className='heading-2 text-brand-primary mb-4'>5. Your Rights</h2>
            <p className='text-brand-text leading-relaxed mb-4'>
              Depending on your location, you may have the right to:
            </p>
            <ul className='list-disc pl-6 space-y-2 text-brand-text'>
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Request data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className='text-brand-text leading-relaxed mt-4'>
              To exercise these rights, please contact us at <a href='mailto:privacy@kingdomnetwork.com.np' className='text-brand-primary hover:text-brand-secondary'>privacy@kingdomnetwork.com.np</a>
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
            <h2 className='heading-2 text-brand-primary mb-4'>6. Cookies</h2>
            <p className='text-brand-text leading-relaxed mb-4'>
              Our website uses cookies to enhance your experience, analyze traffic, and enable certain functionality. You can control cookies through your browser settings. Disabling cookies may affect website functionality.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}>
            <h2 className='heading-2 text-brand-primary mb-4'>7. Changes to This Policy</h2>
            <p className='text-brand-text leading-relaxed mb-4'>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated effective date.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.7 }}>
            <h2 className='heading-2 text-brand-primary mb-4'>8. Contact Us</h2>
            <p className='text-brand-text leading-relaxed mb-4'>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <address className='not-italic text-brand-text leading-relaxed'>
              <p>Kingdom Network</p>
              <p>Kathmandu, Nepal</p>
              <p>Email: <a href='mailto:privacy@kingdomnetwork.com.np' className='text-brand-primary hover:text-brand-secondary'>privacy@kingdomnetwork.com.np</a></p>
              <p>Phone: +977-1-1234567</p>
            </address>
            <p className='text-brand-muted text-sm mt-6'>
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>
        </div>
      </Container>
    </Section>

    <Section id='privacy-cta' background='brand' padding='xl'>
      <Container>
        <div className='max-w-3xl mx-auto text-center'>
          <h2 className='heading-2 text-brand-white mb-4'>Have Questions?</h2>
          <p className='text-brand-white/80 text-lg mb-5'>
            We're here to help. Contact our privacy team for any concerns.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link to='/contact'>
              <Button variant='primary' size='lg'>
                Contact Us
              </Button>
            </Link>
            <Link to='/'>
              <Button variant='secondary' size='lg' className='border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-primary'>
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  </>
)