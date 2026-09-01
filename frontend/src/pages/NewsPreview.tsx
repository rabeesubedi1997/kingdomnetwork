import { useNews, useFeaturedNews } from '@/hooks/useData'
import { NewsCard } from '@/components/news/NewsCard'
import { GridSkeleton } from '@/components/ui/Loading'
import { Section, Container } from '@/components/layout/Section'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { fadeUp, fadeUpViewport, staggerContainer, staggerItem, buttonTap } from '@/lib/motion'

export const NewsPreview = () => {
  const { data: news, isLoading } = useNews({ per_page: 6 })
  const { data: featured } = useFeaturedNews()

  return (
    <Section id='news-preview' padding='xl' background='surface'>
      <Container>
        <motion.div
          initial='initial'
          whileInView='whileInView'
          viewport={fadeUpViewport}
          variants={fadeUp}
        >
          <div className='mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
            <div>
              <span className='eyebrow text-brand-primary dark:text-brand-gold'>From The Studio</span>
              <h2 className='heading-2 mt-3 mb-2 text-brand-primary dark:text-brand-white'>Latest News</h2>
              <p className='text-brand-muted dark:text-brand-white/70'>Stay updated with our latest film releases, announcements, and behind-the-scenes stories.</p>
            </div>
            <motion.div {...buttonTap} className='mt-4 md:mt-0 shrink-0'>
              <Link to='/news' className='btn-secondary inline-flex items-center'>
                View All News
                <ArrowRight className='ml-2 h-5 w-5' />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {featured && featured.length > 0 && (
          <motion.div
            initial='initial'
            whileInView='whileInView'
            viewport={fadeUpViewport}
            variants={staggerContainer}
            className='mb-12'
          >
            <div className='grid gap-6 lg:grid-cols-2'>
              {featured.slice(0, 2).map((post: any, index: number) => (
                <motion.div key={post.id} variants={staggerItem}>
                  <NewsCard post={post} featured index={index} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial='initial'
          whileInView='whileInView'
          viewport={fadeUpViewport}
          variants={staggerContainer}
        >
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {isLoading ? (
              <GridSkeleton count={6} />
            ) : (
              news?.data?.map((post: any) => (
                <motion.div key={post.id} variants={staggerItem}>
                  <NewsCard post={post} />
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </Container>
    </Section>
  )
}
