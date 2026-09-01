import { Film } from '@/types'
import { cn } from '@/lib/utils'
import { statusStyles, filmStatusKind, filmStatusLabel } from '@/lib/status'

interface StatusBadgeProps {
  status: Film['status']
  large?: boolean
  showLabel?: boolean
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, large = false, showLabel = true }) => {
  const kind = filmStatusKind[status] || 'neutral'
  const label = filmStatusLabel[status] || status
  const style = statusStyles[kind]
  const textColor = kind === 'pending' ? 'text-brand-dark' : 'text-white'

  if (large) {
    return (
      <div className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium',
        style.solid,
        textColor
      )}>
        <span className={cn('w-2 h-2 rounded-full', style.dot)} />
        {showLabel && <span>{label}</span>}
      </div>
    )
  }

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
      style.solid,
      textColor
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full', style.dot)} />
      {showLabel && <span>{label}</span>}
    </span>
  )
}
