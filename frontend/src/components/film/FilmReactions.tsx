import { motion } from 'framer-motion'
import { Film } from '@/types'
import { Facebook, Twitter, Linkedin, MessageCircle, ThumbsUp, Star, Share2 } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface FilmReactionsProps {
  film: Film
}

export const FilmReactions: React.FC<FilmReactionsProps> = ({ film }) => {
  const shareUrl = window.location.href
  const shareText = `Check out "${film.title}" by Kingdom Network`
  const [liked, setLiked] = useState(false)
  const [rating, setRating] = useState(0)

  const shareLinks = [
    { name: 'Facebook', icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, color: 'hover:text-blue-500' },
    { name: 'Twitter', icon: Twitter, href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, color: 'hover:text-sky-400' },
    { name: 'LinkedIn', icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, color: 'hover:text-blue-600' },
  ]

  return (
    <div className="space-y-6">
      {film.rating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-brand-surface/50 rounded-xl p-6 border border-brand-surface"
        >
          <h3 className="heading-3 text-brand-primary mb-4">Rating</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
                <Star
                  key={star}
                  size={20}
                  className={cn(
                    'cursor-pointer transition-colors',
                    star <= Math.floor(Number(film.rating || 0))
                      ? 'fill-brand-gold text-brand-gold'
                      : 'text-brand-muted/30 hover:text-brand-gold/50'
                  )}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
            <span className="text-2xl font-bold text-brand-gold">{film.rating}</span>
            <span className="text-sm text-brand-muted">/ 10</span>
          </div>
          {rating > 0 && (
            <p className="text-sm text-brand-muted mt-3">You rated this {rating}/10</p>
          )}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-brand-surface/50 rounded-xl p-6 border border-brand-surface"
      >
        <h3 className="heading-3 text-brand-primary mb-4">Share This Film</h3>
        <p className="text-brand-muted text-sm mb-4">Spread the word about "{film.title}"</p>
        <div className="flex items-center gap-3">
          {shareLinks.map(link => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-10 h-10 rounded-lg bg-brand-dark border border-brand-surface flex items-center justify-center text-brand-muted ${link.color} transition-colors`}
              aria-label={`Share on ${link.name}`}
            >
              <link.icon size={18} />
            </a>
          ))}
          <button
            onClick={() => { navigator.clipboard.writeText(shareUrl) }}
            className="w-10 h-10 rounded-lg bg-brand-dark border border-brand-surface flex items-center justify-center text-brand-muted hover:text-brand-primary transition-colors"
            aria-label="Copy link"
          >
            <Share2 size={18} />
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-brand-surface/50 rounded-xl p-6 border border-brand-surface"
      >
        <h3 className="heading-3 text-brand-primary mb-4">Reactions</h3>
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setLiked(!liked)}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border',
              liked
                ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/30'
                : 'bg-brand-dark text-brand-muted border-brand-surface hover:text-brand-primary hover:border-brand-primary/30'
            )}
          >
            <ThumbsUp size={16} className={cn(liked && 'fill-brand-primary')} />
            {liked ? 'Liked' : 'Like'}
          </button>
        </div>
        <div className="pt-6 border-t border-brand-surface">
          <h4 className="text-sm font-semibold text-brand-primary mb-3">What do you think?</h4>
          <p className="text-brand-muted text-sm mb-4">We'd love to hear your thoughts about this film.</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-lg text-sm font-medium hover:bg-brand-primary/20 transition-colors"
          >
            <MessageCircle size={16} />
            Send Feedback
          </a>
        </div>
      </motion.div>
    </div>
  )
}
