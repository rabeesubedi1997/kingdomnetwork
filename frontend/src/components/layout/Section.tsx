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
  sm: 'py-3 md:py-5',
  md: 'py-5 md:py-6 lg:py-8',
  lg: 'py-6 md:py-8 lg:py-10',
  xl: 'py-8 md:py-10 lg:py-12',
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