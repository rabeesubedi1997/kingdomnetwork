import { Film } from '@/types'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: Film['status']
  large?: boolean
  showLabel?: boolean
}

const statusStyles: Record<Film['status'], { label: string; color: string; dot: string }> = {
  released: { label: 'Released', color: 'bg-green-500', dot: 'bg-green-400' },
  post_production: { label: 'Post-Production', color: 'bg-blue-500', dot: 'bg-blue-400' },
  pre_production: { label: 'Pre-Production', color: 'bg-yellow-500', dot: 'bg-yellow-400' },
  development: { label: 'Development', color: 'bg-purple-500', dot: 'bg-purple-400' },
  announced: { label: 'Announced', color: 'bg-gray-500', dot: 'bg-gray-400' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500', dot: 'bg-red-400' },
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, large = false, showLabel = true }) => {
  const config = statusStyles[status] || statusStyles.development

  if (large) {
    return (
      <div className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium',
        config.color,
        'text-white'
      )}>
        <span className={cn('w-2 h-2 rounded-full', config.dot)} />
        {showLabel && <span>{config.label}</span>}
      </div>
    )
  }

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
      config.color,
      'text-white'
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {showLabel && <span>{config.label}</span>}
    </span>
  )
}