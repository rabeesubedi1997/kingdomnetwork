import { motion } from 'framer-motion'
import { useFilm, useFilms } from '@/hooks/useData'
import { useParams, Link } from 'react-router-dom'
import { Section, Container } from '@/components/layout/Section'
import { FilmHero } from '@/components/film/FilmHero'
import { FilmInfo } from '@/components/film/FilmInfo'
import { FilmCastCrew } from '@/components/film/FilmCastCrew'
import { FilmGallery } from '@/components/film/FilmGallery'
import { FilmAwards } from '@/components/film/FilmAwards'
import { FilmSchema } from '@/components/film/FilmSchema'
import { FilmCard } from '@/components/film/FilmCard'
import { Loading } from '@/components/ui/Loading'
import { FilmReactions } from '@/components/film/FilmReactions'
import { SEOHead } from '@/components/seo/SEOHead'
import { ArrowLeft, TrendingUp, Film as FilmIcon, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

export const FilmDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data: film, isLoading, error } = useFilm(slug!)
  const genreSlug = film?.genres?.[0]?.slug
  const { data: relatedData } = useFilms({ genre: genreSlug, per_page: 5 }, { enabled: !!genreSlug })
  const relatedFilms = relatedData?.data?.filter(f => f.slug !== slug)?.slice(0, 4) || []

  if (isLoading) {
    return (
      <Section padding="xl">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Loading text="Loading film details..." />
          </div>
        </Container>
      </Section>
    )
  }

  if (error || !film) {
    return (
      <Section padding="xl">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="heading-2 text-brand-primary mb-4">Film Not Found</h1>
            <p className="text-brand-muted mb-5">The film you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Link to="/films">
              <button className="btn-primary">Back to Films</button>
            </Link>
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <>
      <SEOHead title={film.title} description={film.synopsis || film.short_description} ogImage={film.poster_url} ogType="video.movie" schemaType="Movie" />
      <FilmSchema film={film} />
      <FilmHero film={film} />
      
      <Section id="synopsis" padding="xl">
        <Container>
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <FilmInfo film={film} />
              <FilmCastCrew film={film} />
              <FilmGallery film={film} />
              <FilmAwards film={film} />

              <div className="mt-8">
                <FilmReactions film={film} />
              </div>

              {film.budget || film.box_office ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-8 bg-brand-surface/50 rounded-xl p-5 border border-brand-surface"
                >
                  <h3 className="heading-3 text-brand-primary mb-4 flex items-center gap-2">
                    <TrendingUp size={20} />
                    Box Office Performance
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {film.budget && (
                      <div className="p-4 bg-brand-dark rounded-lg border border-brand-surface">
                        <p className="text-xs font-medium text-brand-muted uppercase tracking-wide mb-1">Budget</p>
                        <p className="text-xl font-bold text-brand-text">${Number(film.budget).toLocaleString()}</p>
                      </div>
                    )}
                    {film.box_office && (
                      <div className="p-4 bg-brand-dark rounded-lg border border-brand-surface">
                        <p className="text-xs font-medium text-brand-muted uppercase tracking-wide mb-1">Box Office</p>
                        <p className="text-xl font-bold text-green-500">${Number(film.box_office).toLocaleString()}</p>
                      </div>
                    )}
                    {film.budget && film.box_office && (
                      <div className="p-4 bg-brand-dark rounded-lg border border-brand-surface sm:col-span-2">
                        <p className="text-xs font-medium text-brand-muted uppercase tracking-wide mb-1">ROI</p>
                        <p className="text-xl font-bold text-brand-gold">
                          {((Number(film.box_office) - Number(film.budget)) / Number(film.budget) * 100).toFixed(0)}%
                          <span className="text-sm font-normal text-brand-muted ml-2">return on investment</span>
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : null}
            </div>
            <div className="space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="sticky top-24"
              >
                <div className="bg-brand-surface/50 rounded-xl p-5 border border-brand-surface">
                  <h3 className="heading-3 text-brand-primary mb-4">Quick Facts</h3>
                  <dl className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-brand-muted">Status</dt>
                      <dd className="font-medium text-brand-text">
                        <span className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium',
                          film.status_config?.color === 'green' && 'bg-green-100 text-green-800',
                          film.status_config?.color === 'blue' && 'bg-blue-100 text-blue-800',
                          film.status_config?.color === 'yellow' && 'bg-yellow-100 text-yellow-800',
                          film.status_config?.color === 'purple' && 'bg-purple-100 text-purple-800',
                          film.status_config?.color === 'gray' && 'bg-gray-100 text-gray-800',
                          film.status_config?.color === 'red' && 'bg-red-100 text-red-800',
                        )}>
                          {film.status_config?.label || film.status}
                        </span>
                      </dd>
                    </div>
                    {film.release_date && (
                      <div className="flex justify-between">
                        <dt className="text-brand-muted">Release Date</dt>
                        <dd className="font-medium text-brand-text">
                          {new Date(film.release_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </dd>
                      </div>
                    )}
                    {film.runtime_minutes && (
                      <div className="flex justify-between">
                        <dt className="text-brand-muted">Runtime</dt>
                        <dd className="font-medium text-brand-text">
                          {film.runtime_minutes} minutes
                        </dd>
                      </div>
                    )}
                    {film.rating && (
                      <div className="flex justify-between">
                        <dt className="text-brand-muted">Rating</dt>
                        <dd className="font-medium text-brand-text">{film.rating}</dd>
                      </div>
                    )}
                    {film.language && (
                      <div className="flex justify-between">
                        <dt className="text-brand-muted">Language</dt>
                        <dd className="font-medium text-brand-text">{film.language}</dd>
                      </div>
                    )}
                    {film.country && (
                      <div className="flex justify-between">
                        <dt className="text-brand-muted">Country</dt>
                        <dd className="font-medium text-brand-text">{film.country}</dd>
                      </div>
                    )}
                    {film.genres?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        <dt className="text-brand-muted w-full">Genres</dt>
                        {film.genres.map(genre => (
                          <dd key={genre.id} className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-medium">
                            {genre.name}
                          </dd>
                        ))}
                      </div>
                    )}
                    {film.budget && (
                      <div className="flex justify-between">
                        <dt className="text-brand-muted">Budget</dt>
                        <dd className="font-medium text-brand-text">${Number(film.budget).toLocaleString()}</dd>
                      </div>
                    )}
                    {film.box_office && (
                      <div className="flex justify-between">
                        <dt className="text-brand-muted">Box Office</dt>
                        <dd className="font-medium text-green-500">${Number(film.box_office).toLocaleString()}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                {film.trailer_embed_url && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-6"
                  >
                    <div className="aspect-video bg-brand-dark rounded-xl overflow-hidden">
                      <iframe
                        src={film.trailer_embed_url}
                        title={`${film.title} Trailer`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="related" padding="xl" background="surface">
        <Container>
          <div className="flex items-center justify-between mb-5">
            <h2 className="heading-2 text-brand-primary">More Films</h2>
            <Link to="/films" className="text-brand-primary hover:text-brand-secondary font-medium flex items-center gap-1">
              View All <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedFilms.length > 0 ? relatedFilms.map((relatedFilm, index) => (
              <FilmCard key={relatedFilm.id} film={relatedFilm} index={index} />
            )) : (
              <p className="col-span-full text-brand-muted text-center py-8">More films coming soon.</p>
            )}
          </div>
        </Container>
      </Section>
    </>
  )
}