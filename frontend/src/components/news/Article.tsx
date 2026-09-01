import { Post } from '@/types'
import { Link } from 'react-router-dom'
import { formatDate } from '@/lib/utils'
import { sanitizeHtml } from '@/lib/sanitize'
import { Calendar, Clock, User, ArrowLeft, Twitter, Facebook, Linkedin } from 'lucide-react'
import { SafeImage } from '@/components/shared/SafeImage'

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
        <Link to={'/news/category/' + post.category.slug} className='inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-brand-primary dark:text-brand-gold bg-brand-primary/10 dark:bg-white/10 px-4 py-2 rounded-full mb-4 no-underline hover:bg-brand-primary/20 dark:hover:bg-white/20 transition-colors'>
          {post.category.name}
        </Link>
      )}

      <h1 className='heading-1 text-brand-primary dark:text-brand-white mb-4'>{post.title}</h1>

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
        <SafeImage
          src={post.featured_image.url}
          alt={post.title}
          placeholderType='gallery'
          wrapperClassName='aspect-video rounded-xl mb-8 shadow-lg shadow-brand-primary/5'
        />
      )}

      {post.excerpt && (
        <div className='prose prose-brand dark:prose-invert max-w-none mb-8'>
          <p className='lead text-brand-muted'>{post.excerpt}</p>
        </div>
      )}

      <div className='prose prose-brand dark:prose-invert max-w-none' dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content || '') }} />

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
            <Twitter className='w-5 h-5' />
          </button>
          <button onClick={() => handleShare('facebook')} className='p-2 rounded-lg bg-brand-surface/50 hover:bg-blue-600 hover:text-white transition-colors' aria-label='Share on Facebook'>
            <Facebook className='w-5 h-5' />
          </button>
          <button onClick={() => handleShare('linkedin')} className='p-2 rounded-lg bg-brand-surface/50 hover:bg-blue-700 hover:text-white transition-colors' aria-label='Share on LinkedIn'>
            <Linkedin className='w-5 h-5' />
          </button>
        </div>
      </div>
    </article>
  )
}