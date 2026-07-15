import { motion } from 'framer-motion'
import { useFilms, useFilmByStatus } from '@/hooks/useData'
import { Section, Container } from '@/components/layout/Section'
import { FilmCard } from '@/components/film/FilmCard'
import { FilmStatusTabs } from '@/components/film/FilmStatusTabs'
import { Loading, GridSkeleton } from '@/components/ui/Loading'
import { Button } from '@/components/ui/Button'
import { SEOHead } from '@/components/seo/SEOHead'
import { Film as FilmIcon } from 'lucide-react'

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
      <Section id="films-hero" background="dark" padding="xl" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-brand-primary/20 to-transparent" />
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-brand-white/10 px-4 py-2 rounded-full text-brand-gold text-sm font-medium mb-6"
            >
              <FilmIcon className="w-4 h-4" />
              Our Cinematic Journey
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="heading-1 text-brand-white mb-4"
            >
              Films That Move You
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-brand-white/70 text-lg max-w-2xl mx-auto"
            >
              From critically acclaimed social dramas to international co-productions,
              explore our portfolio of stories that challenge, inspire, and entertain.
            </motion.p>
          </div>
        </Container>
      </Section>

      <Section id="timeline" padding="xl" background="surface">
        <Container>
          <FilmStatusTabs filmsByStatus={statusData} loading={isLoading} />
        </Container>
      </Section>

      <Section id="all-films" padding="xl">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-5">
            <div>
              <h2 className="heading-2 text-brand-primary">All Films</h2>
              <p className="text-brand-muted mt-2">
                Browse our complete filmography organized by production status.
              </p>
            </div>
          </div>

          {isLoading ? (
            <GridSkeleton count={8} />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-5">
                {allFilms?.data?.slice(0, 8).map((film, index) => (
                  <FilmCard key={film.id} film={film} index={index} />
                ))}
              </div>

              {allFilms && allFilms.data && allFilms.data.length > 8 && (
                <div className="text-center">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Load More Films
                  </Button>
                </div>
              )}
            </>
          )}
        </Container>
      </Section>
    </>
  )
}