import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

export interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, hover = false, padding = 'md', ...props }, ref) => {
    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'bg-white dark:bg-brand-dark rounded-xl border border-brand-surface/50',
          hover && 'transition-shadow hover:shadow-lg cursor-pointer',
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export const CardHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('mb-4', className)}>{children}</div>
)

export const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h3 className={cn('text-xl font-semibold text-brand-text', className)}>{children}</h3>
)

export const CardDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={cn('text-brand-muted text-sm mt-1', className)}>{children}</p>
)

export const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn(className)}>{children}</div>
)

export const CardFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('mt-4 pt-4 border-t border-brand-surface/50', className)}>{children}</div>
)