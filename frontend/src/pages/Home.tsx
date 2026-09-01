import { Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useFilms, useSiteSettings } from '@/hooks/useData'
import { Section, Container } from '@/components/layout/Section'
import { FilmCard } from '@/components/film/FilmCard'
import { BannerSlider } from '@/components/banner/BannerSlider'
import { Loading, GridSkeleton } from '@/components/ui/Loading'
import { Button } from '@/components/ui/Button'
import { IconTile } from '@/components/ui/IconTile'
import { SEOHead } from '@/components/seo/SEOHead'
import { ArrowRight, Film as FilmIcon, Award, Users, Globe, Sparkles } from 'lucide-react'
import { reveal, fadeUpViewport, staggerContainer, staggerItem, cardHover, buttonTap } from '@/lib/motion'

const AboutPreview = lazy(() => import('./AboutPreview').then(m => ({ default: m.AboutPreview })))
const NewsPreview = lazy(() => import('./NewsPreview').then(m => ({ default: m.NewsPreview })))

export const Home: React.FC = () => {
  const { data: filmsData, isLoading: filmsLoading } = useFilms({ per_page: 8 })
  const { data: site } = useSiteSettings()
  const siteStats = site?.stats

  const stats = [
    { icon: FilmIcon, value: siteStats ? String(siteStats.films) : '—', label: 'Films Produced' },
    { icon: Award, value: siteStats ? String(siteStats.awards_won) : '—', label: 'Awards Won' },
    { icon: Users, value: siteStats ? String(siteStats.talent) : '—', label: 'Talents Nurtured' },
    { icon: Globe, value: siteStats ? String(siteStats.recognitions) : '—', label: 'Award Ceremonies' },
  ]

  const aboutShort = (site as any)?.brand?.tagline

  return (
    <>
      <SEOHead title="Home" description={aboutShort || "Kingdom Network is a leading film and media production company in Nepal, dedicated to creating world-class stories that inspire and connect audiences worldwide."} />
      <BannerSlider />

      {/* Stats Section */}
      <Section id="stats" background="gradient-brand" padding="lg">
        <Container>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={fadeUpViewport}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={staggerItem} className="group">
                <IconTile
                  icon={stat.icon}
                  value={stat.value}
                  label={stat.label}
                  hover
                  iconBoxClassName="bg-white/10"
                  iconClassName="text-brand-gold"
                  valueClassName="text-white"
                  labelClassName="text-white/70 text-sm mt-1.5 font-medium"
                />
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>

      {/* Films Section */}
      <Section id="films" padding="2xl">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <span className="eyebrow text-brand-primary dark:text-brand-gold mb-3">Filmography</span>
              <h2 className="heading-1 text-brand-primary dark:text-brand-white mt-2">Our Films</h2>
              <p className="text-brand-muted dark:text-brand-white/70 mt-4 max-w-xl text-lg">
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
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={fadeUpViewport}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filmsData?.data?.slice(0, 8).map((film, index) => (
                <motion.div key={film.id} variants={staggerItem} {...cardHover}>
                  <FilmCard film={film} index={index} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {filmsData?.data && filmsData.data.length > 0 && (
            <motion.div className="text-center mt-10" {...reveal(0)}>
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
          <motion.div className="max-w-3xl mx-auto text-center" {...reveal(0)}>
            <IconTile
              icon={Sparkles}
              size="lg"
              className="mb-8"
              iconBoxClassName="bg-white/10"
              iconClassName="text-brand-gold"
            />
            <span className="eyebrow-pill mb-6">Let&apos;s Collaborate</span>
            <h2 className="heading-1 text-white mt-6 mb-6">
              Have a Story to Tell?
            </h2>
            <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              We&apos;re always looking for compelling stories and talented collaborators.
              Let&apos;s create something extraordinary together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div {...buttonTap}>
                <Link to="/contact">
                  <Button variant="primary" size="lg" className="bg-white text-brand-primary hover:bg-white/90 hover:shadow-xl hover:shadow-white/20 min-w-[180px]">
                    Get in Touch
                  </Button>
                </Link>
              </motion.div>
              <motion.div {...buttonTap}>
                <Link to="/careers">
                  <Button variant="secondary" size="lg" className="border-white text-white hover:bg-white hover:text-brand-primary min-w-[180px]">
                    Join Our Team
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </Container>
      </Section>
    </>
  )
}
