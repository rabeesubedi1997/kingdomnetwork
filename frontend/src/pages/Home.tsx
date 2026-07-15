import { Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useFilms, useSiteSettings } from '@/hooks/useData'
import { Section, Container } from '@/components/layout/Section'
import { FilmCard } from '@/components/film/FilmCard'
import { BannerSlider } from '@/components/banner/BannerSlider'
import { Loading, GridSkeleton } from '@/components/ui/Loading'
import { Button } from '@/components/ui/Button'
import { SEOHead } from '@/components/seo/SEOHead'
import { ArrowRight, Film as FilmIcon, Award, Users, Globe, Sparkles } from 'lucide-react'

const AboutPreview = lazy(() => import('./AboutPreview').then(m => ({ default: m.AboutPreview })))
const NewsPreview = lazy(() => import('./NewsPreview').then(m => ({ default: m.NewsPreview })))

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

export const Home: React.FC = () => {
  const { data: filmsData, isLoading: filmsLoading } = useFilms({ per_page: 8 })
  const { data: site } = useSiteSettings()

  const stats = [
    { icon: FilmIcon, value: '5+', label: 'Films Produced' },
    { icon: Award, value: '12+', label: 'Awards Won' },
    { icon: Users, value: '50+', label: 'Talents Nurtured' },
    { icon: Globe, value: '15+', label: 'International Festivals' },
  ]

  const aboutShort = (site as any)?.brand?.tagline

  return (
    <>
      <SEOHead title="Home" description={aboutShort || "Kingdom Network is a leading film and media production company in Nepal, dedicated to creating world-class stories that inspire and connect audiences worldwide."} />
      <BannerSlider />

      {/* Stats Section */}
      <Section id="stats" background="gradient-brand" padding="lg">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="text-center group"
              >
                <div className="w-14 h-14 mx-auto mb-3 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                  <stat.icon className="w-7 h-7 text-brand-gold" />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-white tracking-tight">{stat.value}</p>
                <p className="text-white/70 text-sm mt-1 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Films Section */}
      <Section id="films" padding="2xl">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <div className="section-divider" />
              <h2 className="heading-2 text-brand-primary">Our Films</h2>
              <p className="text-brand-muted mt-3 max-w-xl text-lg">
                From award-winning social dramas to international co-productions,
                discover stories that move audiences worldwide.
              </p>
            </div>
            <Link to="/films">
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
                <motion.div key={film.id} {...fadeUp} transition={{ delay: index * 0.05, duration: 0.4 }}>
                  <FilmCard film={film} index={index} />
                </motion.div>
              ))}
            </div>
          )}

          {filmsData?.data && filmsData.data.length > 0 && (
            <motion.div className="text-center mt-10" {...fadeUp}>
              <Link to="/films">
                <Button variant="secondary" size="lg">
                  Browse Complete Filmography <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          )}
        </Container>
      </Section>

      {/* Featured Productions / About Preview */}
      <Suspense fallback={<div className="py-16 text-center"><Loading text="Loading..." /></div>}>
        <AboutPreview />
      </Suspense>

      {/* News Preview */}
      <Suspense fallback={<div className="py-16 text-center"><Loading text="Loading..." /></div>}>
        <NewsPreview />
      </Suspense>

      {/* CTA Section */}
      <Section id="cta" background="gradient-brand" padding="2xl">
        <Container>
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 mx-auto mb-6 bg-white/10 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-brand-gold" />
            </div>
            <h2 className="heading-2 text-white mb-4">
              Have a Story to Tell?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              We&apos;re always looking for compelling stories and talented collaborators.
              Let&apos;s create something extraordinary together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="primary" size="lg" className="bg-white text-brand-primary hover:bg-white/90 hover:shadow-xl hover:shadow-white/20 min-w-[180px]">
                  Get in Touch
                </Button>
              </Link>
              <Link to="/careers">
                <Button variant="secondary" size="lg" className="border-white text-white hover:bg-white hover:text-brand-primary min-w-[180px]">
                  Join Our Team
                </Button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </Section>
    </>
  )
}
