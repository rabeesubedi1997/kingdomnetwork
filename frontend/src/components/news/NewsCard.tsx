import { Post } from '@/types'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { formatDate } from '@/lib/utils'
import { Calendar, Clock, User, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NewsCardProps {
  post: Post
  featured?: boolean
  index?: number
}

export const NewsCard: React.FC<NewsCardProps> = ({ post, featured = false, index = 0 }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        'card group overflow-hidden',
        featured && 'md:col-span-2'
      )}
    >
      {post.featured_image?.url && (
        <Link to={'/news/' + post.slug} className='block relative aspect-video overflow-hidden'>
          <img
            src={post.featured_image.url}
            alt={post.title}
            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
            loading='lazy'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />
        </Link>
      )}

      <div className={cn('p-6', featured ? 'md:p-8' : '')}>
        <div className='flex flex-wrap items-center gap-2 mb-4'>
          {post.category && (
            <Link to={'/news/category/' + post.category.slug} className='px-2 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-medium hover:bg-brand-primary/20'>
              {post.category.name}
            </Link>
          )}
          {post.tags?.map(tag => (
            <Link key={tag.id} to={'/news/tag/' + tag.slug} className='px-2 py-1 bg-brand-surface/50 text-brand-muted rounded-full text-xs font-medium hover:text-brand-primary hover:bg-brand-primary/10'>
              #{tag.name}
            </Link>
          ))}
        </div>

        <Link to={'/news/' + post.slug} className='block'>
          <h3 className={cn(
            'font-display font-bold text-brand-primary mb-3',
            featured ? 'text-2xl md:text-3xl' : 'text-xl'
          )}>
            {post.title}
          </h3>
        </Link>

        {post.excerpt && (
          <p className={cn('text-brand-muted mb-4 line-clamp-2', featured ? 'text-lg' : 'text-sm')}>
            {post.excerpt}
          </p>
        )}

        <div className='flex flex-wrap items-center gap-4 text-sm text-brand-muted border-t border-brand-surface/50 pt-4'>
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

        {!featured && (
          <Link to={'/news/' + post.slug} className='inline-flex items-center gap-1 mt-4 text-brand-primary hover:text-brand-secondary font-medium text-sm group'>
            Read More
            <ExternalLink className='w-4 h-4 transition-transform group-hover:translate-x-1' />
          </Link>
        )}
      </div>
    </motion.article>
  )
}