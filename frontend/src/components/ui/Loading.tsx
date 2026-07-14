import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LoadingProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export const Loading: React.FC<LoadingProps> = ({ className, size = 'md', text }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 py-12', className)}>
      <motion.div
        className={cn(sizes[size], 'rounded-full border-3 border-brand-primary/20 border-t-brand-primary')}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        aria-label='Loading'
      />
      {text && <p className='text-sm text-brand-muted'>{text}</p>}
    </div>
  )
}

export const PageLoading: React.FC = () => (
  <div className='fixed inset-0 z-50 flex items-center justify-center bg-brand-surface'>
    <Loading size='lg' text='Loading...' />
  </div>
)

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <motion.div
    className={cn('animate-pulse rounded bg-brand-primary/10', className)}
    initial={{ opacity: 0.4 }}
    animate={{ opacity: [0.4, 1, 0.4] }}
    transition={{ duration: 1.5, repeat: Infinity }}
  />
)

export const CardSkeleton: React.FC = () => (
  <div className='card'>
    <Skeleton className='mb-4 aspect-video w-full' />
    <div className='space-y-3'>
      <Skeleton className='h-6 w-3/4' />
      <Skeleton className='h-4 w-full' />
      <Skeleton className='h-4 w-2/3' />
    </div>
  </div>
)

export const GridSkeleton: React.FC<{ count?: number; aspectRatio?: string }> = ({ count = 6 }) => (
  <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.05 }}
      >
        <div className='card'>
          <Skeleton className='mb-4 aspect-video w-full' />
          <div className='space-y-3 p-4'>
            <Skeleton className='h-6 w-3/4' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-2/3' />
          </div>
        </div>
      </motion.div>
    ))}
  </div>
)