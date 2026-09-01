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
import { TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { statusStyles, filmStatusKind, filmStatusLabel } from '@/lib/status'
import { fadeUp, fadeUpViewport, staggerContainer, staggerItem } from '@/lib/motion'

export const FilmDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data: film, isLoading, error } = useFilm(slug!)
  const genreSlug = film?.genres?.[0]?.slug
  const { data: relatedData } = useFilms({ genre: genreSlug, per_page: 5 }, { enabled: !!genreSlug })
  const relatedFilms = relatedData?.data?.filter(f => f.slug !== slug)?.slice(0, 4) || []

  if (isLoading) {
    return (
      <Section padding="2xl">
        <Container>
          <div className="max-w-lg mx-auto text-center">
            <div className="card p-10">
              <Loading text="Loading film details..." />
            </div>
          </div>
        </Container>
      </Section>
    )
  }

  if (error || !film) {
    return (
      <Section padding="2xl">
        <Container>
          <div className="max-w-lg mx-auto text-center">
            <div className="card p-10">
              <h1 className="heading-2 text-brand-primary dark:text-brand-white mb-4">Film Not Found</h1>
              <p className="text-brand-muted dark:text-brand-white/70 mb-6">The film you&apos;re looking for doesn&apos;t exist or has been removed.</p>
              <Link to="/films">
                <button className="btn-primary">Back to Films</button>
              </Link>
            </div>
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
      
      <Section id="synopsis" padding="2xl">
        <Container>
          <div className="grid lg:grid-cols-3 gap-8">
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
                  {...fadeUp}
                  viewport={fadeUpViewport}
                  className="mt-8 card p-6 md:p-8"
                >
                  <h3 className="heading-3 text-brand-primary dark:text-brand-white mb-4 flex items-center gap-2">
                    <TrendingUp size={20} />
                    Box Office Performance
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {film.budget && (
                      <div className="p-4 bg-brand-surface dark:bg-white/5 rounded-lg border border-brand-surface dark:border-white/10">
                        <p className="text-xs font-medium text-brand-muted dark:text-brand-white/60 uppercase tracking-wide mb-1">Budget</p>
                        <p className="text-xl font-bold text-brand-text dark:text-brand-white/90">${Number(film.budget).toLocaleString()}</p>
                      </div>
                    )}
                    {film.box_office && (
                      <div className="p-4 bg-brand-surface dark:bg-white/5 rounded-lg border border-brand-surface dark:border-white/10">
                        <p className="text-xs font-medium text-brand-muted dark:text-brand-white/60 uppercase tracking-wide mb-1">Box Office</p>
                        <p className={cn('text-xl font-bold', statusStyles.success.text)}>${Number(film.box_office).toLocaleString()}</p>
                      </div>
                    )}
                    {film.budget && film.box_office && (
                      <div className="p-4 bg-brand-surface dark:bg-white/5 rounded-lg border border-brand-surface dark:border-white/10 sm:col-span-2">
                        <p className="text-xs font-medium text-brand-muted dark:text-brand-white/60 uppercase tracking-wide mb-1">ROI</p>
                        <p className="text-xl font-bold text-amber-700 dark:text-brand-gold">
                          {((Number(film.box_office) - Number(film.budget)) / Number(film.budget) * 100).toFixed(0)}%
                          <span className="text-sm font-normal text-brand-muted dark:text-brand-white/60 ml-2">return on investment</span>
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : null}
            </div>
            <div className="space-y-5">
              <motion.div
                {...fadeUp}
                viewport={fadeUpViewport}
                className="sticky top-24"
              >
                <div className="card p-6 md:p-8">
                  <h3 className="heading-3 text-brand-primary dark:text-brand-white mb-4">Quick Facts</h3>
                  <dl className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-brand-muted dark:text-brand-white/60">Status</dt>
                      <dd className="font-medium text-brand-text dark:text-brand-white/90">
                        <span className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium',
                          statusStyles[filmStatusKind[film.status] || 'neutral'].soft,
                        )}>
                          {film.status_config?.label || filmStatusLabel[film.status] || film.status}
                        </span>
                      </dd>
                    </div>
                    {film.release_date && (
                      <div className="flex justify-between">
                        <dt className="text-brand-muted dark:text-brand-white/60">Release Date</dt>
                        <dd className="font-medium text-brand-text dark:text-brand-white/90">
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
                        <dt className="text-brand-muted dark:text-brand-white/60">Runtime</dt>
                        <dd className="font-medium text-brand-text dark:text-brand-white/90">
                          {film.runtime_minutes} minutes
                        </dd>
                      </div>
                    )}
                    {film.rating && (
                      <div className="flex justify-between">
                        <dt className="text-brand-muted dark:text-brand-white/60">Rating</dt>
                        <dd className="font-medium text-brand-text dark:text-brand-white/90">{film.rating}</dd>
                      </div>
                    )}
                    {film.language && (
                      <div className="flex justify-between">
                        <dt className="text-brand-muted dark:text-brand-white/60">Language</dt>
                        <dd className="font-medium text-brand-text dark:text-brand-white/90">{film.language}</dd>
                      </div>
                    )}
                    {film.country && (
                      <div className="flex justify-between">
                        <dt className="text-brand-muted dark:text-brand-white/60">Country</dt>
                        <dd className="font-medium text-brand-text dark:text-brand-white/90">{film.country}</dd>
                      </div>
                    )}
                    {film.genres?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        <dt className="text-brand-muted dark:text-brand-white/60 w-full">Genres</dt>
                        {film.genres.map(genre => (
                          <dd key={genre.id} className="px-3 py-1 bg-brand-primary/10 dark:bg-white/10 text-brand-primary dark:text-brand-white rounded-full text-xs font-medium">
                            {genre.name}
                          </dd>
                        ))}
                      </div>
                    )}
                    {film.budget && (
                      <div className="flex justify-between">
                        <dt className="text-brand-muted dark:text-brand-white/60">Budget</dt>
                        <dd className="font-medium text-brand-text dark:text-brand-white/90">${Number(film.budget).toLocaleString()}</dd>
                      </div>
                    )}
                    {film.box_office && (
                      <div className="flex justify-between">
                        <dt className="text-brand-muted dark:text-brand-white/60">Box Office</dt>
                        <dd className={cn('font-medium', statusStyles.success.text)}>${Number(film.box_office).toLocaleString()}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                {film.trailer_embed_url && (
                  <motion.div
                    {...fadeUp}
                    viewport={fadeUpViewport}
                    className="mt-6"
                  >
                    <div className="aspect-video bg-brand-dark rounded-xl overflow-hidden">
                      <iframe
                        src={film.trailer_embed_url}
                        title={`${film.title} Trailer`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        sandbox="allow-scripts allow-same-origin allow-presentation"
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

      <Section id="related" padding="2xl" background="surface">
        <Container>
          <motion.div {...fadeUp} viewport={fadeUpViewport} className="mb-10">
            <span className="eyebrow text-brand-secondary dark:text-brand-gold">Keep Exploring</span>
            <h2 className="heading-2 text-brand-primary dark:text-brand-white mt-3">More Films</h2>
          </motion.div>
          {relatedFilms.length > 0 ? (
            <motion.div
              initial="initial"
              whileInView="whileInView"
              viewport={fadeUpViewport}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {relatedFilms.map((relatedFilm, index) => (
                <motion.div key={relatedFilm.id} variants={staggerItem}>
                  <FilmCard film={relatedFilm} index={index} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="text-brand-muted dark:text-brand-white/60 text-center py-8">More films coming soon.</p>
          )}
        </Container>
      </Section>
    </>
  )
}
