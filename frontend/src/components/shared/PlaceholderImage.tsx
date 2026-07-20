import { cn } from '@/lib/utils'
import { Film, Image, User, Building2, Camera, Users } from 'lucide-react'

const typeConfig = {
  film: { icon: Film, bg: 'from-blue-900/40 to-blue-950/40', text: 'text-blue-300/60' },
  banner: { icon: Image, bg: 'from-emerald-900/40 to-emerald-950/40', text: 'text-emerald-300/60' },
  person: { icon: User, bg: 'from-violet-900/40 to-violet-950/40', text: 'text-violet-300/60' },
  team: { icon: Users, bg: 'from-amber-900/40 to-amber-950/40', text: 'text-amber-300/60' },
  partner: { icon: Building2, bg: 'from-slate-900/40 to-slate-950/40', text: 'text-slate-300/60' },
  gallery: { icon: Camera, bg: 'from-rose-900/40 to-rose-950/40', text: 'text-rose-300/60' },
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
