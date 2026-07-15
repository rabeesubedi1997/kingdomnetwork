import { motion } from 'framer-motion'
import { useFilms, useFilmByStatus } from '@/hooks/useData'
import { Section, Container } from '@/components/layout/Section'
import { FilmCard } from '@/components/film/FilmCard'
import { FilmStatusTabs } from '@/components/film/FilmStatusTabs'
import { GridSkeleton } from '@/components/ui/Loading'
import { Button } from '@/components/ui/Button'
import { SEOHead } from '@/components/seo/SEOHead'
import { Film as FilmIcon, ArrowRight } from 'lucide-react'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

export const Films: React.FC = () => {
  const { data: allFilms, isLoading } = useFilms({ per_page: 20 })
  const statuses = ['released', 'post_production', 'pre_production', 'development', 'announced']

  const released = useFilmByStatus('released')
  const postProduction = useFilmByStatus('post_production')
  const preProduction = useFilmByStatus('pre_production')
  const development = useFilmByStatus('development')
  const announced = useFilmByStatus('announced')

  const statusData = [
    { status: 'released', data: released.data, isLoading: released.isLoading },
    { status: 'post_production', data: postProduction.data, isLoading: postProduction.isLoading },
    { status: 'pre_production', data: preProduction.data, isLoading: preProduction.isLoading },
    { status: 'development', data: development.data, isLoading: development.isLoading },
    { status: 'announced', data: announced.data, isLoading: announced.isLoading },
  ]

  return (
    <>
      <SEOHead title="Films" description="Our Film Portfolio" />
      <Section id="films-hero" background="dark" padding="2xl" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-brand-primary/20 to-transparent" />
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-white/10 px-5 py-2 rounded-full text-brand-gold text-sm font-medium mb-6"
            >
              <FilmIcon className="w-4 h-4" />
              Our Cinematic Journey
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="heading-1 text-white mb-4"
            >
              Films That Move You
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed"
            >
              From critically acclaimed social dramas to international co-productions,
              explore our portfolio of stories that challenge, inspire, and entertain.
            </motion.p>
          </div>
        </Container>
      </Section>

      <Section id="timeline" padding="2xl" background="surface">
        <Container>
          <motion.div {...fadeUp}>
            <div className="section-divider" />
            <h2 className="heading-2 text-brand-primary text-center mb-10">Production Timeline</h2>
          </motion.div>
          <FilmStatusTabs filmsByStatus={statusData} loading={isLoading} />
        </Container>
      </Section>

      <Section id="all-films" padding="2xl">
        <Container>
          <motion.div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10" {...fadeUp}>
            <div>
              <div className="section-divider" />
              <h2 className="heading-2 text-brand-primary">All Films</h2>
              <p className="text-brand-muted mt-3 text-lg">
                Browse our complete filmography organized by production status.
              </p>
            </div>
          </motion.div>

          {isLoading ? (
            <GridSkeleton count={8} />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {allFilms?.data?.map((film, index) => (
                  <motion.div key={film.id} {...fadeUp} transition={{ delay: index * 0.03, duration: 0.4 }}>
                    <FilmCard film={film} index={index} />
                  </motion.div>
                ))}
              </div>

              {allFilms && allFilms.data && allFilms.data.length > 8 && (
                <motion.div className="text-center mt-10" {...fadeUp}>
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Load More Films <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </Container>
      </Section>
    </>
  )
}
