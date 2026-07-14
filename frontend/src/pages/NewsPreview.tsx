import { useNews, useFeaturedNews } from '@/hooks/useData'
import { NewsCard } from '@/components/news/NewsCard'
import { GridSkeleton } from '@/components/ui/Loading'
import { Section, Container } from '@/components/layout/Section'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export const NewsPreview = () => {
  const { data: news, isLoading } = useNews({ per_page: 6 })
  const { data: featured } = useFeaturedNews()

  return (
    <Section id='news-preview' padding='xl' background='surface'>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className='mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
            <div>
              <h2 className='heading-2 mb-2 text-brand-primary'>Latest News</h2>
              <p className='text-brand-muted'>Stay updated with our latest film releases, announcements, and behind-the-scenes stories.</p>
            </div>
            <Link to='/news' className='btn-secondary mt-4 md:mt-0'>
              View All News
              <ArrowRight className='ml-2 h-5 w-5' />
            </Link>
          </div>
        </motion.div>

        {featured && featured.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className='mb-6 font-semibold text-brand-primary'>Featured Story</h3>
            <div className='mb-12 grid gap-8 lg:grid-cols-2'>
              {featured.slice(0, 2).map((post: any, index: number) => (
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h3 className='mb-6 font-semibold text-brand-primary'>Recent Updates</h3>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {isLoading ? (
              <GridSkeleton count={6} />
            ) : (
              news?.data?.map((post: any, index: number) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <NewsCard post={post} index={index} />
                </motion.div>
              ))
            )}

            {news && news.data && news.data.length < news.total && (
              <div className='col-span-full pt-8 text-center'>
                <button className='btn-secondary'>Load More Articles</button>
              </div>
            )}
          </div>
        </motion.div>
      </Container>
    </Section>
  )
}
