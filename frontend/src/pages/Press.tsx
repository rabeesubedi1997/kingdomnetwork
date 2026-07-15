import { motion } from 'framer-motion'
import { usePressKits } from '@/hooks/useData'
import { Section, Container } from '@/components/layout/Section'
import { PressKitCard } from '@/components/press/PressKitCard'
import { GridSkeleton } from '@/components/ui/Loading'
import { SEOHead } from '@/components/seo/SEOHead'
import { FileText } from 'lucide-react'

export const Press = () => {
  const { data: pressKits, isLoading } = usePressKits()

  return (
    <>
      <SEOHead title="Press" description="Press & Media Kit" />
      <Section id='press-hero' background='dark' padding='2xl' className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-brand-primary/20 to-transparent' />
        <Container>
          <div className='mx-auto max-w-3xl text-center'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='mb-6 inline-flex items-center gap-2 rounded-full bg-brand-white/10 px-4 py-2 text-sm font-medium text-brand-gold'
            >
              <FileText className='h-4 w-4' />
              Press Center
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className='heading-1 mb-4 text-brand-white'
            >
              Press Center
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className='text-lg text-brand-white/70 max-w-2xl mx-auto'
            >
              Access press kits, high-resolution assets, and media resources for our film productions. All materials are cleared for editorial use.
            </motion.p>
          </div>
        </Container>
      </Section>

      <Section id='press-kits' padding='2xl'>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="section-divider mb-5" />
            <div className='mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
              <div>
                <h2 className='heading-2 mb-2 text-brand-primary'>Press Kits</h2>
                <p className='text-brand-muted'>Download official press materials for our film productions.</p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              {isLoading ? (
                <GridSkeleton count={6} />
              ) : (
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                  {pressKits?.map((kit: any, index: number) => (
                    <div key={kit.id} className="card card-hover">
                      <PressKitCard kit={kit} index={index} />
                    </div>
                  ))}
                </div>
              )}

              {pressKits && pressKits.length === 0 && (
                <div className='col-span-full py-12 text-center'>
                  <p className='text-brand-muted'>No press kits available at the moment.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        </Container>
      </Section>
    </>
  )
}
