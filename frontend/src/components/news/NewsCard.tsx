import { Post } from '@/types'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { formatDate } from '@/lib/utils'
import { Calendar, Clock, User, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SafeImage } from '@/components/shared/SafeImage'
import { cardHover } from '@/lib/motion'

interface NewsCardProps {
  post: Post
  featured?: boolean
  index?: number
}

export const NewsCard: React.FC<NewsCardProps> = ({ post, featured = false, index = 0 }) => {
  if (featured) {
    return (
      <motion.article {...cardHover} className='card group overflow-hidden'>
        <Link to={'/news/' + post.slug} className='relative block aspect-[4/3] sm:aspect-[16/10] overflow-hidden'>
          <SafeImage
            src={post.featured_image?.url}
            alt={post.title}
            placeholderType='gallery'
            className='transition-transform duration-700 group-hover:scale-105'
            loading={index === 0 ? 'eager' : 'lazy'}
          />
          <div className='hero-scrim' />
          <div className='absolute inset-0 flex flex-col justify-end p-6 md:p-8'>
            {post.category && (
              <span className='eyebrow-pill self-start mb-4'>{post.category.name}</span>
            )}
            <h3 className='font-display font-bold text-white text-2xl md:text-3xl lg:text-4xl leading-tight mb-3 text-shadow-sm'>
              {post.title}
            </h3>
            {post.excerpt && (
              <p className='hidden sm:block text-white/80 text-base md:text-lg mb-4 line-clamp-2 max-w-2xl'>
                {post.excerpt}
              </p>
            )}
            <div className='flex flex-wrap items-center gap-4 text-sm text-white/70'>
              <div className='flex items-center gap-1'>
                <Calendar className='w-4 h-4' />
                <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
              </div>
              {post.reading_time && (
                <div className='flex items-center gap-1'>
                  <Clock className='w-4 h-4' />
                  {post.reading_time} min read
                </div>
              )}
              {post.author && (
                <div className='flex items-center gap-1'>
                  <User className='w-4 h-4' />
                  {post.author.name}
                </div>
              )}
            </div>
          </div>
        </Link>
      </motion.article>
    )
  }

  return (
    <motion.article {...cardHover} className='card group overflow-hidden h-full flex flex-col'>
      <Link to={'/news/' + post.slug} className='block relative aspect-video overflow-hidden'>
        <SafeImage
          src={post.featured_image?.url}
          alt={post.title}
          placeholderType='gallery'
          className='transition-transform duration-500 group-hover:scale-110'
          loading='lazy'
        />
        <div className='hero-scrim' />
        {post.category && (
          <span className='absolute top-3 left-3 eyebrow-pill py-1.5 px-3'>{post.category.name}</span>
        )}
      </Link>

      <div className='p-6 flex flex-col flex-1'>
        {post.tags && post.tags.length > 0 && (
          <div className='flex flex-wrap items-center gap-2 mb-3'>
            {post.tags.map(tag => (
              <Link key={tag.id} to={'/news/tag/' + tag.slug} className='px-2 py-1 bg-brand-surface/50 dark:bg-white/10 text-brand-muted dark:text-brand-white/60 rounded-full text-xs font-medium hover:text-brand-primary dark:hover:text-brand-white hover:bg-brand-primary/10'>
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        <Link to={'/news/' + post.slug} className='block'>
          <h3 className={cn('font-display font-bold text-brand-primary dark:text-brand-white mb-3 group-hover:text-brand-secondary dark:group-hover:text-brand-gold transition-colors', 'text-xl')}>
            {post.title}
          </h3>
        </Link>

        {post.excerpt && (
          <p className='text-brand-muted dark:text-brand-white/60 mb-4 line-clamp-2 text-sm'>
            {post.excerpt}
          </p>
        )}

        <div className='mt-auto flex flex-wrap items-center gap-4 text-sm text-brand-muted dark:text-brand-white/60 border-t border-brand-surface/50 dark:border-white/10 pt-4'>
          <div className='flex items-center gap-1'>
            <Calendar className='w-4 h-4' />
            <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
          </div>
          {post.reading_time && (
            <div className='flex items-center gap-1'>
              <Clock className='w-4 h-4' />
              {post.reading_time} min read
            </div>
          )}
        </div>

        <Link to={'/news/' + post.slug} className='inline-flex items-center gap-1 mt-4 text-brand-primary dark:text-brand-white hover:text-brand-secondary dark:hover:text-brand-gold font-medium text-sm group/link'>
          Read More
          <ExternalLink className='w-4 h-4 transition-transform group-hover/link:translate-x-1' />
        </Link>
      </div>
    </motion.article>
  )
}
