import { useFilms, useSiteSettings } from '@/hooks/useData'
import { FilmCard } from '@/components/film/FilmCard'
import { GridSkeleton } from '@/components/ui/Loading'
import { Section, Container } from '@/components/layout/Section'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Film, Trophy, Globe, ArrowRight, type LucideIcon } from 'lucide-react'
import { IconTile } from '@/components/ui/IconTile'
import { fadeUp, fadeUpViewport, staggerContainer, staggerItem, buttonTap } from '@/lib/motion'

export const AboutPreview: React.FC = () => {
  const { data: films, isLoading } = useFilms({ per_page: 6, featured: true })
  const { data: site } = useSiteSettings()
  const stats = site?.stats

  return (
    <Section id="about-preview" padding="2xl" background="white">
      <Container>
        <motion.div className="text-center mb-12" initial="initial" whileInView="whileInView" viewport={fadeUpViewport} variants={fadeUp}>
          <span className="eyebrow text-brand-primary dark:text-brand-gold">Our Story</span>
          <h2 className="heading-2 text-brand-primary dark:text-brand-white mt-3 mb-4">Kingdom Network</h2>
          <p className="text-brand-muted dark:text-brand-white/70 text-lg max-w-3xl mx-auto leading-relaxed">
            Kingdom Network is a leading film and media production company in Nepal,
            dedicated to creating world-class movies that blend authentic local storytelling
            with global filmmaking collaborations.
          </p>
        </motion.div>

        <motion.div className="grid md:grid-cols-3 gap-6 mb-16" initial="initial" whileInView="whileInView" viewport={fadeUpViewport} variants={staggerContainer}>
          <motion.div variants={staggerItem}><StatCard value={stats ? String(stats.films) : '—'} label="Films Produced" icon={Film} /></motion.div>
          <motion.div variants={staggerItem}><StatCard value={stats ? String(stats.awards_won) : '—'} label="Awards Won" icon={Trophy} /></motion.div>
          <motion.div variants={staggerItem}><StatCard value={stats ? String(stats.recognitions) : '—'} label="Award Ceremonies" icon={Globe} /></motion.div>
        </motion.div>

        <motion.div initial="initial" whileInView="whileInView" viewport={fadeUpViewport} variants={fadeUp}>
          <h3 className="heading-3 text-brand-primary dark:text-brand-white text-center mb-8">Featured Productions</h3>
          <motion.div initial="initial" whileInView="whileInView" viewport={fadeUpViewport} variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <GridSkeleton count={6} />
            ) : films?.data?.map((film, index) => (
              <motion.div key={film.id} variants={staggerItem}>
                <FilmCard film={film} index={index} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div className="text-center mt-12" initial="initial" whileInView="whileInView" viewport={fadeUpViewport} variants={fadeUp}>
          <p className="text-brand-muted dark:text-brand-white/70 mb-5">Discover our complete filmography and upcoming projects.</p>
          <motion.div {...buttonTap} className="inline-block">
            <Link to="/films" className="btn-primary inline-flex items-center gap-2">
              View All Films <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  )
}

const StatCard: React.FC<{ value: string; label: string; icon: LucideIcon }> = ({ value, label, icon }) => (
  <div className="text-center p-6 md:p-8 bg-brand-surface dark:bg-brand-dark/50 rounded-2xl border border-brand-surface/80 hover:shadow-lg hover:shadow-brand-primary/5 hover:border-brand-primary/20 transition-all duration-300 group">
    <IconTile icon={icon} size="lg" hover value={value} label={label} />
  </div>
)
