import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type IconTileSize = 'sm' | 'md' | 'lg'

const SIZE_CLASSES: Record<IconTileSize, { box: string; icon: string }> = {
  sm: { box: 'w-10 h-10 rounded-lg', icon: 'w-5 h-5' },
  md: { box: 'w-14 h-14 rounded-xl', icon: 'w-7 h-7' },
  lg: { box: 'w-14 h-14 rounded-2xl', icon: 'w-7 h-7' },
}

export interface IconTileProps {
  /** The lucide icon component to render inside the rounded box. */
  icon: LucideIcon
  /** Icon box dimensions/radius. Defaults to 'md' (w-14 h-14 rounded-xl). */
  size?: IconTileSize
  /** Content alignment for the vertical layout. Defaults to 'center'. */
  align?: 'left' | 'center'
  /** 'vertical' stacks icon above content (stat/benefit cards); 'horizontal' places icon beside content (info rows). */
  layout?: 'vertical' | 'horizontal'
  /** Enables the group-hover fill/scale treatment (requires a `group` class on an ancestor). */
  hover?: boolean
  iconBoxClassName?: string
  iconClassName?: string
  /** "title + description" mode */
  title?: string
  titleAs?: 'h2' | 'h3'
  titleClassName?: string
  description?: string
  descriptionClassName?: string
  /** "value + label" mode (stat cards, info rows) */
  value?: string
  label?: string
  labelClassName?: string
  valueClassName?: string
  className?: string
  children?: React.ReactNode
}

export const IconTile: React.FC<IconTileProps> = ({
  icon: Icon,
  size = 'md',
  align = 'center',
  layout = 'vertical',
  hover = false,
  iconBoxClassName,
  iconClassName,
  title,
  titleAs = 'h3',
  titleClassName,
  description,
  descriptionClassName,
  value,
  label,
  labelClassName,
  valueClassName,
  className,
  children,
}) => {
  const sizeClasses = SIZE_CLASSES[size]

  const iconBox = (
    <div
      className={cn(
        sizeClasses.box,
        'bg-brand-primary/10 dark:bg-white/10 flex items-center justify-center flex-shrink-0',
        layout === 'vertical' && (align === 'center' ? 'mx-auto mb-4' : 'mb-6'),
        hover && 'group-hover:bg-brand-primary group-hover:scale-110 transition-all duration-300',
        iconBoxClassName
      )}
    >
      <Icon
        className={cn(
          sizeClasses.icon,
          'text-brand-primary dark:text-brand-white',
          hover && 'group-hover:text-white transition-colors duration-300',
          iconClassName
        )}
      />
    </div>
  )

  if (layout === 'horizontal') {
    return (
      <div className={cn('flex items-start gap-3', className)}>
        {iconBox}
        <div>
          {label && (
            <p className={cn('text-xs font-medium text-brand-muted dark:text-brand-white/60 uppercase tracking-wide', labelClassName)}>
              {label}
            </p>
          )}
          {value !== undefined && (
            <p className={cn('text-brand-text dark:text-brand-white/90', valueClassName)}>{value}</p>
          )}
          {children}
        </div>
      </div>
    )
  }

  const TitleTag = titleAs

  return (
    <div className={cn(align === 'center' && 'text-center', className)}>
      {iconBox}
      {value !== undefined ? (
        <>
          <div className={cn('text-3xl md:text-4xl font-bold text-brand-primary dark:text-brand-white tracking-tight', valueClassName)}>
            {value}
          </div>
          {label && (
            <div className={cn('text-brand-muted dark:text-brand-white/60 mt-1.5 font-medium', labelClassName)}>
              {label}
            </div>
          )}
        </>
      ) : (
        <>
          {title && (
            <TitleTag className={cn('text-brand-primary dark:text-brand-white mb-2', titleClassName)}>
              {title}
            </TitleTag>
          )}
          {description && (
            <p className={cn('text-brand-muted dark:text-brand-white/60', descriptionClassName)}>{description}</p>
          )}
          {children}
        </>
      )}
    </div>
  )
}
