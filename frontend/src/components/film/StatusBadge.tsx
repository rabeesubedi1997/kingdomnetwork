import { Film } from '@/types'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: Film['status']
  large?: boolean
  showLabel?: boolean
}

const statusStyles: Record<Film['status'], { label: string; color: string; icon: string }> = {
  released: { label: 'Released', color: 'bg-green-500', icon: '✓' },
  post_production: { label: 'Post-Production', color: 'bg-blue-500', icon: '🎬' },
  pre_production: { label: 'Pre-Production', color: 'bg-yellow-500', icon: '📋' },
  development: { label: 'Development', color: 'bg-purple-500', icon: '✏️' },
  announced: { label: 'Announced', color: 'bg-gray-500', icon: '📢' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500', icon: '✕' },
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
        <span className='text-lg'>{config.icon}</span>
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
      <span>{config.icon}</span>
      {showLabel && <span>{config.label}</span>}
    </span>
  )
}