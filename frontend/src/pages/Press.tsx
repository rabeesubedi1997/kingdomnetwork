import { motion } from 'framer-motion'
import { usePressKits } from '@/hooks/useData'
import { Section, Container } from '@/components/layout/Section'
import { PressKitCard } from '@/components/press/PressKitCard'
import { GridSkeleton } from '@/components/ui/Loading'
import { SEOHead } from '@/components/seo/SEOHead'
import { FileText } from 'lucide-react'
import type { PressKit } from '@/types'
import { heroTitle, heroChild, staggerContainer, staggerItem, fadeUpViewport } from '@/lib/motion'

export const Press = () => {
  const { data: pressKits, isLoading } = usePressKits()

  return (
    <>
      <SEOHead title="Press" description="Press kits, media assets, and resources for journalists covering Kingdom Network films and productions." />
      <Section id='press-hero' background='dark' padding='2xl' className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-brand-primary/20 to-transparent' />
        <Container>
          <div className='mx-auto max-w-3xl text-center'>
            <motion.span initial='initial' animate='animate' variants={heroTitle} className='eyebrow-pill'>
              <FileText className='h-4 w-4' />
              Press Center
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={heroChild(0.1)}
              className='heading-1 mt-6 mb-4 text-brand-white'
            >
              Press Center
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={heroChild(0.2)}
              className='text-lg text-brand-white/70 max-w-2xl mx-auto'
            >
              Access press kits, high-resolution assets, and media resources for our film productions. All materials are cleared for editorial use.
            </motion.p>
          </div>
        </Container>
      </Section>

      <Section id='press-kits' padding='2xl'>
        <Container>
          <div className='mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
            <div>
              <span className='eyebrow text-brand-primary dark:text-brand-gold'>Media Resources</span>
              <h2 className='heading-2 mt-3 mb-2 text-brand-primary dark:text-brand-white'>Press Kits</h2>
              <p className='text-brand-muted dark:text-brand-white/60'>Download official press materials for our film productions.</p>
            </div>
          </div>

          <motion.div
            initial='initial'
            whileInView='whileInView'
            viewport={fadeUpViewport}
            variants={staggerContainer}
          >
            {isLoading ? (
              <GridSkeleton count={6} />
            ) : (
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {pressKits?.map((kit: PressKit) => (
                  <motion.div key={kit.id} variants={staggerItem}>
                    <PressKitCard kit={kit} />
                  </motion.div>
                ))}
              </div>
            )}

            {pressKits && pressKits.length === 0 && (
              <div className='col-span-full py-12 text-center'>
                <p className='text-brand-muted dark:text-brand-white/60'>No press kits available at the moment.</p>
              </div>
            )}
          </motion.div>
        </Container>
      </Section>
    </>
  )
}
