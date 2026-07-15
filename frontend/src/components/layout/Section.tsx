import { cn } from '@/lib/utils'

interface SectionProps {
  children: React.ReactNode
  className?: string
  id?: string
  background?: 'surface' | 'white' | 'dark' | 'brand' | 'gradient-brand'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

const backgroundClasses = {
  surface: 'bg-brand-surface',
  white: 'bg-white dark:bg-brand-dark',
  dark: 'bg-brand-dark text-brand-white',
  brand: 'bg-brand-primary text-brand-white',
  'gradient-brand': 'bg-gradient-to-br from-brand-primary via-brand-dark to-brand-primary text-brand-white',
}

const paddingClasses = {
  none: '',
  sm: 'py-8 md:py-10',
  md: 'py-10 md:py-14 lg:py-16',
  lg: 'py-14 md:py-18 lg:py-20',
  xl: 'py-16 md:py-20 lg:py-24',
  '2xl': 'py-20 md:py-28 lg:py-32',
}

export const Section: React.FC<SectionProps> = ({
  children, className, id,
  background = 'white',
  padding = 'lg',
}) => (
  <section id={id} className={cn('w-full', backgroundClasses[background], paddingClasses[padding], className)}
    aria-labelledby={id ? `${id}-heading` : undefined}>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  </section>
)

export const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children, className,
}) => (
  <div className={cn('container mx-auto px-4 sm:px-6 lg:px-8', className)}>
    {children}
  </div>
)
