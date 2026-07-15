import { motion } from 'framer-motion'
import { useNews, useFeaturedNews } from '@/hooks/useData'
import { Section, Container } from '@/components/layout/Section'
import { NewsCard } from '@/components/news/NewsCard'
import { NewsFilters } from '@/components/news/NewsFilters'
import { Loading, GridSkeleton } from '@/components/ui/Loading'
import { SEOHead } from '@/components/seo/SEOHead'
import { Newspaper, ArrowRight } from 'lucide-react'
import { useState } from 'react'

export const News: React.FC = () => {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const { data: news, isLoading } = useNews({ per_page: 12, category: category !== 'All' ? category.toLowerCase().replace(/\s+/g, '_') : undefined, search: search || undefined })
  const { data: featured } = useFeaturedNews()

  return (
    <>
      <SEOHead title="News" description="Latest News & Updates" />
      <Section id='news-hero' background='dark' padding='xl' className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-brand-primary/20 to-transparent' />
        <Container>
          <div className='max-w-3xl mx-auto text-center'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='inline-flex items-center gap-2 bg-brand-white/10 px-4 py-2 rounded-full text-brand-gold text-sm font-medium mb-6'
            >
              <Newspaper className='w-4 h-4' />
              Latest Updates
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className='heading-1 text-brand-white mb-4'
            >
              News & Announcements
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className='text-brand-white/70 text-lg max-w-2xl mx-auto'
            >
              Stay updated with our latest film releases, announcements, and behind-the-scenes stories.
            </motion.p>
          </div>
        </Container>
      </Section>

      <Section id='featured-news' padding='xl'>
        <Container>
          {featured && featured.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h2 className='heading-2 text-brand-primary mb-5'>Featured Stories</h2>
              <div className='grid lg:grid-cols-2 gap-6 mb-5'>
                {featured.slice(0, 2).map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <NewsCard post={post} featured index={index} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <NewsFilters onCategoryChange={setCategory} onSearch={setSearch} />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className='font-semibold text-brand-primary mb-6'>Recent Updates</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {isLoading ? (
                <GridSkeleton count={6} />
              ) : news?.data?.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <NewsCard post={post} index={index} />
                </motion.div>
              ))}

              {news && news.data && news.data.length < news.total && (
                <div className='col-span-full text-center pt-8'>
                  <button className='btn-secondary'>
                    Load More Articles
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </Container>
      </Section>
    </>
  )
}
