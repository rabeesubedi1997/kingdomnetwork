import { Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useFilms, useFeaturedFilms, useSiteSettings } from '@/hooks/useData'
import { Section, Container } from '@/components/layout/Section'
import { FilmCard } from '@/components/film/FilmCard'
import { HeroSlider } from '@/components/film/HeroSlider'
import { Loading, GridSkeleton } from '@/components/ui/Loading'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Film as FilmIcon, Award, Users, Globe } from 'lucide-react'

const AboutPreview = lazy(() => import('./AboutPreview').then(m => ({ default: m.AboutPreview })))
const NewsPreview = lazy(() => import('./NewsPreview').then(m => ({ default: m.NewsPreview })))

export const Home: React.FC = () => {
  const { data: featuredFilms, isLoading: featuredLoading } = useFeaturedFilms()
  const { data: filmsData, isLoading: filmsLoading } = useFilms({ per_page: 8 })
  const { data: site } = useSiteSettings()

  const stats = [
    { icon: FilmIcon, value: '5+', label: 'Films Produced' },
    { icon: Award, value: '12+', label: 'Awards Won' },
    { icon: Users, value: '50+', label: 'Talents Nurtured' },
    { icon: Globe, value: '15+', label: 'International Festivals' },
  ]

  return (
    <>
      <HeroSlider films={featuredFilms?.slice(0, 4) || []} loading={featuredLoading} />

      <Section id="stats" background="brand" padding="md">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 mx-auto mb-3 bg-brand-white/10 rounded-xl flex items-center justify-center">
                  <stat.icon className="w-7 h-7 text-brand-gold" />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-brand-white">{stat.value}</p>
                <p className="text-brand-white/70 text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="films" padding="xl">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <h2 className="heading-2 text-brand-primary">Our Films</h2>
              <p className="text-brand-muted mt-2 max-w-xl">
                From award-winning social dramas to international co-productions,
                discover stories that move audiences worldwide.
              </p>
            </div>
            <Link to="/films" className="mt-4 md:mt-0">
              <Button variant="primary" size="lg">
                View All Films <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          {filmsLoading ? (
            <GridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filmsData?.data?.slice(0, 8).map((film, index) => (
                <FilmCard key={film.id} film={film} index={index} />
              ))}
            </div>
          )}
        </Container>
      </Section>

      <Suspense fallback={<Loading text="Loading..." />}>
        <AboutPreview />
      </Suspense>

      <Suspense fallback={<Loading text="Loading..." />}>
        <NewsPreview />
      </Suspense>

      <Section id="cta" background="brand" padding="xl">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-2 text-brand-white mb-4">
              Have a Story to Tell?
            </h2>
            <p className="text-brand-white/80 text-lg mb-8">
              We&apos;re always looking for compelling stories and talented collaborators.
              Let&apos;s create something extraordinary together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="primary" size="lg">
                  Get in Touch
                </Button>
              </Link>
              <Link to="/careers">
                <Button variant="secondary" size="lg" className="border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-primary">
                  Join Our Team
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}