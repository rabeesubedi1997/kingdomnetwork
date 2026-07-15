import { useFilms } from '@/hooks/useData'
import { FilmCard } from '@/components/film/FilmCard'
import { GridSkeleton } from '@/components/ui/Loading'
import { Section, Container } from '@/components/layout/Section'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Film, Trophy, Globe, ArrowRight } from 'lucide-react'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

export const AboutPreview: React.FC = () => {
  const { data: films, isLoading } = useFilms({ per_page: 6, featured: true })

  return (
    <Section id="about-preview" padding="2xl" background="white">
      <Container>
        <motion.div className="text-center mb-12" {...fadeUp}>
          <div className="section-divider" />
          <h2 className="heading-2 text-brand-primary mb-4">Our Story</h2>
          <p className="text-brand-muted text-lg max-w-3xl mx-auto leading-relaxed">
            Kingdom Network is a leading film and media production company in Nepal,
            dedicated to creating world-class movies that blend authentic local storytelling
            with global filmmaking collaborations.
          </p>
        </motion.div>

        <motion.div className="grid md:grid-cols-3 gap-6 mb-16" {...fadeUp} transition={{ delay: 0.1, duration: 0.5 }}>
          <StatCard value="5+" label="Films Produced" icon={Film} />
          <StatCard value="12+" label="Awards Won" icon={Trophy} />
          <StatCard value="15+" label="International Festivals" icon={Globe} />
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.2, duration: 0.5 }}>
          <h3 className="heading-3 text-brand-primary text-center mb-8">Featured Productions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <GridSkeleton count={6} />
            ) : films?.data?.map((film, index) => (
              <motion.div key={film.id} {...fadeUp} transition={{ delay: 0.2 + index * 0.05, duration: 0.4 }}>
                <FilmCard film={film} index={index} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div className="text-center mt-12" {...fadeUp} transition={{ delay: 0.4, duration: 0.5 }}>
          <p className="text-brand-muted mb-5">Discover our complete filmography and upcoming projects.</p>
          <Link to="/films" className="btn-primary inline-flex items-center gap-2">
            View All Films <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </Container>
    </Section>
  )
}

const StatCard: React.FC<{ value: string; label: string; icon: React.ElementType }> = ({ value, label, icon: Icon }) => (
  <div className="text-center p-6 md:p-8 bg-brand-surface rounded-2xl border border-brand-surface/80 hover:shadow-lg hover:shadow-brand-primary/5 hover:border-brand-primary/20 transition-all duration-300 group">
    <div className="w-14 h-14 mx-auto mb-4 bg-brand-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-brand-primary group-hover:scale-110 transition-all duration-300">
      <Icon size={28} className="text-brand-primary group-hover:text-white transition-colors duration-300" />
    </div>
    <div className="text-3xl md:text-4xl font-bold text-brand-primary tracking-tight">{value}</div>
    <div className="text-brand-muted mt-1.5 font-medium">{label}</div>
  </div>
)
