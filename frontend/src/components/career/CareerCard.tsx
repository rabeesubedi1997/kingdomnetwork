import { Job } from '@/types'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Briefcase, MapPin, Clock, DollarSign, ArrowRight } from 'lucide-react'
import { statusStyles, jobStatusKind } from '@/lib/status'

interface CareerCardProps {
  job: Job
  index?: number
}

export const CareerCard: React.FC<CareerCardProps> = ({ job }) => {
  return (
    <article className='card group h-full flex flex-col'>
      <div className='p-6 flex flex-col flex-1'>
        <div className='flex items-start justify-between gap-4 mb-4'>
          <div className='flex-1'>
            <span className='inline-flex items-center gap-1 px-2 py-1 bg-brand-primary/10 dark:bg-white/10 text-brand-primary dark:text-brand-white rounded-full text-xs font-medium mb-2'>
              <Briefcase className='w-3 h-3' />
              {job.department}
            </span>
            <Link to={'/careers/' + job.slug} className='block'>
              <h3 className='heading-3 text-brand-primary dark:text-brand-white mb-2 group-hover:text-brand-secondary dark:group-hover:text-brand-gold transition-colors'>
                {job.title}
              </h3>
            </Link>
            <p className='text-brand-muted dark:text-brand-white/60 text-sm line-clamp-2'>{job.description}</p>
          </div>
          <span className={cn(
            'px-2 py-1 rounded-full text-xs font-medium flex-shrink-0',
            statusStyles[jobStatusKind[job.is_open ? 'open' : 'closed']].soft
          )}>
            {job.is_open ? 'Open' : 'Closed'}
          </span>
        </div>

        <div className='flex flex-wrap items-center gap-4 text-sm text-brand-muted dark:text-brand-white/60 mb-4'>
          <span className='flex items-center gap-1'>
            <MapPin className='w-4 h-4' />
            {job.location}
          </span>
          <span className='flex items-center gap-1'>
            <Clock className='w-4 h-4' />
            {job.type.replace('_', ' ')}
          </span>
          {job.is_remote && (
            <span className='flex items-center gap-1 px-2 py-1 bg-brand-primary/10 dark:bg-white/10 text-brand-primary dark:text-brand-white rounded-full'>
              Remote
            </span>
          )}
          {job.salary_range && (
            <span className='flex items-center gap-1'>
              <DollarSign className='w-4 h-4' />
              {job.salary_range}
            </span>
          )}
        </div>

        <div className='mt-auto flex flex-wrap gap-2 pt-4 border-t border-brand-surface/50 dark:border-white/10'>
          <Link to={'/careers/' + job.slug} className='btn-secondary flex-1 sm:flex-none text-center'>
            View Details
          </Link>
          <Link to={'/careers/' + job.slug} className='btn-primary flex-1 sm:flex-none text-center inline-flex items-center justify-center gap-1.5 group/apply'>
            Apply Now
            <ArrowRight className='w-4 h-4 transition-transform group-hover/apply:translate-x-1' />
          </Link>
        </div>
      </div>
    </article>
  )
}
