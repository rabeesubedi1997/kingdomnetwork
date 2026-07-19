import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

const labelMap: Record<string, string> = {
  films: 'Films', news: 'News', about: 'About', team: 'Team',
  careers: 'Careers', gallery: 'Gallery', press: 'Press',
  contact: 'Contact', awards: 'Awards', people: 'People',
  privacy: 'Privacy Policy', terms: 'Terms of Service',
}

export const Breadcrumbs: React.FC<{ className?: string }> = ({ className }) => {
  const location = useLocation()
  const paths = location.pathname.split('/').filter(Boolean)

  if (paths.length === 0) return null

  const crumbs = paths.map((segment, i) => {
    const url = '/' + paths.slice(0, i + 1).join('/')
    const label = labelMap[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
    const isLast = i === paths.length - 1
    return { label, url, isLast }
  })

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1.5 text-sm', className)}>
      <Link to="/" className="text-brand-muted hover:text-brand-primary transition-colors">
        <Home size={14} />
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.url} className="flex items-center gap-1.5">
          <ChevronRight size={12} className="text-brand-muted/50" />
          {crumb.isLast ? (
            <span className="text-brand-primary font-medium truncate max-w-[200px]">{crumb.label}</span>
          ) : (
            <Link to={crumb.url} className="text-brand-muted hover:text-brand-primary transition-colors truncate max-w-[150px]">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
