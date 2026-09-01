import { motion } from 'framer-motion'
import { useNews, useFeaturedNews } from '@/hooks/useData'
import { Section, Container } from '@/components/layout/Section'
import { NewsCard } from '@/components/news/NewsCard'
import { NewsFilters } from '@/components/news/NewsFilters'
import { Loading, GridSkeleton } from '@/components/ui/Loading'
import { SEOHead } from '@/components/seo/SEOHead'
import { Newspaper } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Post } from '@/types'
import { heroTitle, heroChild, staggerContainer, staggerItem, fadeUpViewport, buttonTap } from '@/lib/motion'

export const News: React.FC = () => {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [articles, setArticles] = useState<Post[]>([])
  const { data: news, isLoading, isFetching } = useNews({ per_page: 12, page, category: category !== 'All' ? category.toLowerCase().replace(/\s+/g, '_') : undefined, search: search || undefined })
  const { data: featured } = useFeaturedNews()

  // Reset to page 1 whenever the filters change.
  useEffect(() => { setPage(1) }, [category, search])

  // Accumulate pages so "Load More" appends instead of replacing the grid.
  useEffect(() => {
    if (!news?.data) return
    setArticles(prev => (page === 1 ? news.data : [...prev, ...news.data.filter(a => !prev.some(p => p.id === a.id))]))
  }, [news, page])

  const hasMore = news ? articles.length < news.total : false

  return (
    <>
      <SEOHead title="News" description="Latest News & Updates" />
      <Section id='news-hero' background='dark' padding='2xl' className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-brand-primary/20 to-transparent' />
        <Container>
          <div className='max-w-3xl mx-auto text-center'>
            <motion.span initial="initial" animate="animate" variants={heroTitle} className='eyebrow-pill'>
              <Newspaper className='w-4 h-4' />
              Latest Updates
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={heroChild(0.1)}
              className='heading-1 text-brand-white mt-6 mb-6'
            >
              News & Announcements
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={heroChild(0.2)}
              className='text-brand-white/70 text-lg max-w-2xl mx-auto'
            >
              Stay updated with our latest film releases, announcements, and behind-the-scenes stories.
            </motion.p>
          </div>
        </Container>
      </Section>

      <Section id='featured-news' padding='2xl'>
        <Container>
          {featured && featured.length > 0 && (
            <motion.div
              initial='initial'
              whileInView='whileInView'
              viewport={fadeUpViewport}
              variants={staggerContainer}
            >
              <span className='eyebrow text-brand-primary dark:text-brand-gold'>Don't Miss</span>
              <h2 className='heading-2 text-brand-primary dark:text-brand-white mt-3 mb-6'>Featured Stories</h2>
              <div className='grid lg:grid-cols-2 gap-6 mb-5'>
                {featured.slice(0, 2).map((post, index) => (
                  <motion.div key={post.id} variants={staggerItem}>
                    <NewsCard post={post} featured index={index} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <NewsFilters onCategoryChange={setCategory} onSearch={setSearch} />

          <motion.div
            initial='initial'
            whileInView='whileInView'
            viewport={fadeUpViewport}
            variants={staggerContainer}
          >
            <span className='eyebrow text-brand-primary dark:text-brand-gold mt-8 block'>Stay In The Loop</span>
            <h3 className='heading-3 text-brand-primary dark:text-brand-white mt-3 mb-6'>Recent Updates</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {isLoading && page === 1 ? (
                <GridSkeleton count={6} />
              ) : articles.map((post) => (
                <motion.div key={post.id} variants={staggerItem}>
                  <NewsCard post={post} />
                </motion.div>
              ))}

              {hasMore && (
                <div className='col-span-full text-center pt-8'>
                  <motion.button {...buttonTap} className='btn-secondary' disabled={isFetching} onClick={() => setPage(p => p + 1)}>
                    {isFetching ? 'Loading…' : 'Load More Articles'}
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </Container>
      </Section>
    </>
  )
}
