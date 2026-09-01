import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useFilms, useFilmByStatus } from '@/hooks/useData'
import { Section, Container } from '@/components/layout/Section'
import { FilmCard } from '@/components/film/FilmCard'
import { FilmStatusTabs } from '@/components/film/FilmStatusTabs'
import { GridSkeleton } from '@/components/ui/Loading'
import { Button } from '@/components/ui/Button'
import { SEOHead } from '@/components/seo/SEOHead'
import { Film as FilmIcon, ArrowRight } from 'lucide-react'
import type { Film } from '@/types'
import { fadeUp, fadeUpViewport, heroChild, staggerContainer, staggerItem } from '@/lib/motion'

export const Films: React.FC = () => {
  const [page, setPage] = useState(1)
  const [films, setFilms] = useState<Film[]>([])
  const { data: allFilms, isLoading, isFetching } = useFilms({ per_page: 12, page })

  // Accumulate pages so "Load More" appends instead of replacing the grid.
  useEffect(() => {
    if (!allFilms?.data) return
    setFilms(prev => (page === 1 ? allFilms.data : [...prev, ...allFilms.data.filter(f => !prev.some(p => p.id === f.id))]))
  }, [allFilms, page])

  const statuses = ['released', 'post_production', 'pre_production', 'development', 'announced']

  const released = useFilmByStatus('released')
  const postProduction = useFilmByStatus('post_production')
  const preProduction = useFilmByStatus('pre_production')
  const development = useFilmByStatus('development')
  const announced = useFilmByStatus('announced')

  const statusData = [
    { status: 'released', data: released.data ? ('data' in released.data ? released.data.data : released.data) : undefined, isLoading: released.isLoading },
    { status: 'post_production', data: postProduction.data ? ('data' in postProduction.data ? postProduction.data.data : postProduction.data) : undefined, isLoading: postProduction.isLoading },
    { status: 'pre_production', data: preProduction.data ? ('data' in preProduction.data ? preProduction.data.data : preProduction.data) : undefined, isLoading: preProduction.isLoading },
    { status: 'development', data: development.data ? ('data' in development.data ? development.data.data : development.data) : undefined, isLoading: development.isLoading },
    { status: 'announced', data: announced.data ? ('data' in announced.data ? announced.data.data : announced.data) : undefined, isLoading: announced.isLoading },
  ]

  const totalPages = allFilms ? Math.ceil((allFilms.total ?? 0) / 12) : 0
  const hasMore = page < totalPages

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
              transition={heroChild(0)}
              className="eyebrow-pill mb-6"
            >
              <FilmIcon className="w-4 h-4" />
              Our Cinematic Journey
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={heroChild(0.1)}
              className="heading-1 text-white mb-4 text-shadow-sm"
            >
              Films That Move You
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={heroChild(0.2)}
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
          <motion.div {...fadeUp} viewport={fadeUpViewport} className="text-center mb-10">
            <span className="eyebrow text-brand-secondary dark:text-brand-gold justify-center">From Development to Release</span>
            <h2 className="heading-2 text-brand-primary dark:text-brand-white mt-3">Production Timeline</h2>
          </motion.div>
          <FilmStatusTabs filmsByStatus={statusData} loading={isLoading} />
        </Container>
      </Section>

      <Section id="all-films" padding="2xl">
        <Container>
          <motion.div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10" {...fadeUp} viewport={fadeUpViewport}>
            <div>
              <span className="eyebrow text-brand-secondary dark:text-brand-gold">The Complete Filmography</span>
              <h2 className="heading-2 text-brand-primary dark:text-brand-white mt-3">All Films</h2>
              <p className="text-brand-muted dark:text-brand-white/70 mt-3 text-lg">
                Browse our complete filmography organized by production status.
              </p>
            </div>
          </motion.div>

          {isLoading && page === 1 ? (
            <GridSkeleton count={8} />
          ) : (
            <>
              <motion.div
                initial="initial"
                whileInView="whileInView"
                viewport={fadeUpViewport}
                variants={staggerContainer}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {films.map((film, index) => (
                  <motion.div key={film.id} variants={staggerItem}>
                    <FilmCard film={film} index={index} />
                  </motion.div>
                ))}
              </motion.div>

              {hasMore && (
                <motion.div className="text-center mt-10" {...fadeUp} viewport={fadeUpViewport}>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto"
                    loading={isFetching}
                    onClick={() => setPage(p => p + 1)}
                  >
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
