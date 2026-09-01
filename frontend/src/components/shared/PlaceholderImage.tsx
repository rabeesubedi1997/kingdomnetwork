import { cn } from '@/lib/utils'
import { Film, Image, User, Building2, Camera, Users } from 'lucide-react'

/**
 * Every missing/broken image in the app falls back to one of these.
 * They previously used six unrelated hues (blue/emerald/violet/amber/
 * slate/rose) that didn't exist anywhere else in the brand palette, so
 * missing photos looked like they belonged to a different product.
 * All variants now build from the same brand teal + gold family.
 */
const typeConfig = {
  film: { icon: Film, bg: 'from-brand-primary/50 to-brand-dark/70', text: 'text-white/60' },
  banner: { icon: Image, bg: 'from-brand-dark/80 to-brand-primary/50', text: 'text-white/60' },
  person: { icon: User, bg: 'from-brand-secondary/50 to-brand-dark/70', text: 'text-white/60' },
  team: { icon: Users, bg: 'from-brand-accent/40 to-brand-secondary/60', text: 'text-white/70' },
  partner: { icon: Building2, bg: 'from-brand-muted/20 to-brand-surface', text: 'text-brand-muted' },
  gallery: { icon: Camera, bg: 'from-brand-gold/25 to-brand-primary/60', text: 'text-white/70' },
}

export const PlaceholderImage: React.FC<{
  type?: keyof typeof typeConfig
  text?: string
  className?: string
  aspectRatio?: string
}> = ({ type = 'film', text, className, aspectRatio }) => {
  const config = typeConfig[type] || typeConfig.film
  const Icon = config.icon

  return (
    <div className={cn(
      'flex items-center justify-center bg-gradient-to-br overflow-hidden',
      config.bg,
      aspectRatio || 'aspect-[2/3]',
      className,
    )}>
      <div className="flex flex-col items-center gap-2 p-4">
        <Icon size={32} className={config.text} />
        {text && (
          <span className={cn('text-xs font-medium text-center leading-tight', config.text)}>
            {text}
          </span>
        )}
      </div>
    </div>
  )
}
