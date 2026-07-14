import { useFilms } from '@/hooks/useData'
import { FilmCard } from '@/components/film/FilmCard'
import { Loading, GridSkeleton } from '@/components/ui/Loading'
import { Section, Container } from '@/components/layout/Section'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export const AboutPreview: React.FC = () => {
  const { data: films, isLoading } = useFilms({ per_page: 6, featured: true })

  return (
    <Section id="about-preview" padding="xl" background="surface">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="heading-2 text-brand-primary mb-4">Our Story</h2>
            <p className="text-brand-muted text-lg max-w-2xl mx-auto">
              Kingdom Network is a leading film and media production company in Nepal,
              dedicated to creating world-class movies that blend authentic local storytelling
              with global filmmaking collaborations.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <StatCard value="5+" label="Films Produced" icon="🎬" />
            <StatCard value="12+" label="Awards Won" icon="🏆" />
            <StatCard value="15+" label="International Festivals" icon="🌍" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="heading-3 text-brand-primary text-center mb-8">Featured Productions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <GridSkeleton count={6} />
            ) : films?.data?.map((film, index) => (
              <FilmCard key={film.id} film={film} index={index} />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-brand-muted mb-4">Discover our complete filmography and upcoming projects.</p>
          <Link to="/films" className="btn-primary inline-flex items-center gap-2">
            View All Films
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </Link>
        </motion.div>
      </Container>
    </Section>
  )
}

const StatCard: React.FC<{ value: string; label: string; icon: string }> = ({ value, label, icon }) => (
  <div className="text-center p-6 bg-brand-white dark:bg-brand-dark rounded-xl border border-brand-surface/50">
    <div className="text-4xl mb-2">{icon}</div>
    <div className="text-3xl font-bold text-brand-primary">{value}</div>
    <div className="text-brand-muted mt-1">{label}</div>
  </div>
)