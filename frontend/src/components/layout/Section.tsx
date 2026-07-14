import { cn } from '@/lib/utils'

interface SectionProps {
  children: React.ReactNode
  className?: string
  id?: string
  background?: 'surface' | 'white' | 'dark' | 'brand'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

const backgroundClasses = {
  surface: 'bg-brand-surface',
  white: 'bg-white dark:bg-brand-dark',
  dark: 'bg-brand-dark text-brand-white',
  brand: 'bg-brand-primary text-brand-white',
}

const paddingClasses = {
  none: '',
  sm: 'py-8 md:py-12',
  md: 'py-12 md:py-16 lg:py-20',
  lg: 'py-16 md:py-20 lg:py-24 xl:py-28',
  xl: 'py-20 md:py-24 lg:py-28 xl:py-32',
}

export const Section: React.FC<SectionProps> = ({
  children,
  className,
  id,
  background = 'white',
  padding = 'lg',
}) => (
  <section
    id={id}
    className={cn(
      'w-full',
      backgroundClasses[background],
      paddingClasses[padding],
      className
    )}
    aria-labelledby={id ? `${id}-heading` : undefined}
  >
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  </section>
)

export const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={cn('container mx-auto px-4 sm:px-6 lg:px-8', className)}>
    {children}
  </div>
)