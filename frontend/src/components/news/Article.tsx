import { Post } from '@/types'
import { Link } from 'react-router-dom'
import { formatDate } from '@/lib/utils'
import { Calendar, Clock, User, ArrowLeft, Share2 } from 'lucide-react'

interface ArticleProps {
  post: Post
}

export const Article: React.FC<ArticleProps> = ({ post }) => {
  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(post.title)
    const urls: Record<string, string> = {
      twitter: 'https://twitter.com/intent/tweet?text=' + text + '&url=' + url,
      facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + url,
      linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + url,
    }
    window.open(urls[platform], '_blank', 'width=600,height=400')
  }

  return (
    <article className='prose prose-brand dark:prose-invert max-w-none'>
      <div className='flex items-center justify-between mb-8'>
        <Link to='/news' className='inline-flex items-center gap-1 text-brand-primary hover:text-brand-secondary text-sm font-medium'>
          <ArrowLeft className='w-4 h-4' />
          Back to News
        </Link>
      </div>

      {post.category && (
        <Link to={'/news/category/' + post.category.slug} className='inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-medium mb-4'>
          {post.category.name}
        </Link>
      )}

      <h1 className='heading-1 text-brand-primary mb-4'>{post.title}</h1>

      <div className='flex flex-wrap items-center gap-4 text-sm text-brand-muted mb-6 pb-6 border-b border-brand-surface/50'>
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
            <Link to={'/author/' + post.author.id} className='hover:text-brand-primary transition-colors'>
              {post.author.name}
            </Link>
          </div>
        )}
      </div>

      {post.featured_image?.url && (
        <div className='aspect-video rounded-xl overflow-hidden mb-8'>
          <img
            src={post.featured_image.url}
            alt={post.title}
            className='w-full h-full object-cover'
          />
        </div>
      )}

      {post.excerpt && (
        <div className='prose prose-brand dark:prose-invert max-w-none mb-8'>
          <p className='lead text-brand-muted'>{post.excerpt}</p>
        </div>
      )}

      <div className='prose prose-brand dark:prose-invert max-w-none' dangerouslySetInnerHTML={{ __html: post.content || '' }} />

      {post.tags?.length > 0 && (
        <div className='mt-12 pt-8 border-t border-brand-surface/50'>
          <h3 className='font-semibold text-brand-primary mb-4'>Tags</h3>
          <div className='flex flex-wrap gap-2'>
            {post.tags.map(tag => (
              <Link key={tag.id} to={'/news/tag/' + tag.slug} className='px-3 py-1 bg-brand-surface/50 rounded-full text-sm text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition-colors'>
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className='mt-12 pt-8 border-t border-brand-surface/50 flex flex-wrap items-center justify-between gap-4'>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-brand-muted'>Share:</span>
          <button onClick={() => handleShare('twitter')} className='p-2 rounded-lg bg-brand-surface/50 hover:bg-brand-primary/10 text-brand-text transition-colors' aria-label='Share on Twitter'>
            <Share2 className='w-5 h-5' />
          </button>
          <button onClick={() => handleShare('facebook')} className='p-2 rounded-lg bg-brand-surface/50 hover:bg-blue-600 hover:text-white transition-colors' aria-label='Share on Facebook'>
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'><path d='M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z'/></svg>
          </button>
          <button onClick={() => handleShare('linkedin')} className='p-2 rounded-lg bg-brand-surface/50 hover:bg-blue-700 hover:text-white transition-colors' aria-label='Share on LinkedIn'>
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'><path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'/></svg>
          </button>
        </div>
      </div>
    </article>
  )
}