import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface AdminStatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  color?: 'primary' | 'gold' | 'accent' | 'secondary'
  trend?: { value: number; positive: boolean }
}

const colorMap = {
  primary: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20',
  gold: 'bg-brand-gold/10 text-brand-gold border-brand-gold/20',
  accent: 'bg-brand-accent/10 text-brand-accent border-brand-accent/20',
  secondary: 'bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20',
}

const iconBgMap = {
  primary: 'bg-brand-primary',
  gold: 'bg-brand-gold',
  accent: 'bg-brand-accent',
  secondary: 'bg-brand-secondary',
}

export const AdminStatsCard: React.FC<AdminStatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color = 'primary',
  trend,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-xl border p-6 flex items-start gap-4',
        colorMap[color]
      )}
    >
      <div className={cn('p-3 rounded-lg', iconBgMap[color], 'bg-opacity-15')}>
        <Icon size={24} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium opacity-80">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {trend && (
          <p className={cn(
            'text-xs mt-1',
            trend.positive ? 'text-green-500' : 'text-red-500'
          )}>
            {trend.positive ? '+' : ''}{trend.value}% from last month
          </p>
        )}
      </div>
    </motion.div>
  )
}
