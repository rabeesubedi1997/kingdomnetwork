import { Job } from '@/types'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Briefcase, MapPin, Clock, DollarSign, ExternalLink } from 'lucide-react'

interface CareerCardProps {
  job: Job
  index?: number
}

export const CareerCard: React.FC<CareerCardProps> = ({ job, index = 0 }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className='card group'
    >
      <div className='p-6'>
        <div className='flex items-start justify-between gap-4 mb-4'>
          <div className='flex-1'>
            <span className='inline-flex items-center gap-1 px-2 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-medium mb-2'>
              <Briefcase className='w-3 h-3' />
              {job.department}
            </span>
            <Link to={'/careers/' + job.slug} className='block'>
              <h3 className='heading-3 text-brand-primary mb-2 group-hover:text-brand-secondary transition-colors'>
                {job.title}
              </h3>
            </Link>
            <p className='text-brand-muted text-sm line-clamp-2'>{job.description}</p>
          </div>
          <span className={cn(
            'px-2 py-1 rounded-full text-xs font-medium flex-shrink-0',
            job.is_open ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          )}>
            {job.is_open ? 'Open' : 'Closed'}
          </span>
        </div>

        <div className='flex flex-wrap items-center gap-4 text-sm text-brand-muted mb-4'>
          <span className='flex items-center gap-1'>
            <MapPin className='w-4 h-4' />
            {job.location}
          </span>
          <span className='flex items-center gap-1'>
            <Clock className='w-4 h-4' />
            {job.type.replace('_', ' ')}
          </span>
          {job.is_remote && (
            <span className='flex items-center gap-1 px-2 py-1 bg-brand-primary/10 text-brand-primary rounded-full'>
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

        <div className='flex flex-wrap gap-2 pt-4 border-t border-brand-surface/50'>
          <Link to={'/careers/' + job.slug} className='btn-primary flex-1 sm:flex-none text-center'>
            View Details
          </Link>
          <Link to={'/careers/' + job.slug} className='btn-secondary flex-1 sm:flex-none text-center'>
            Apply Now
          </Link>
        </div>
      </div>
    </motion.article>
  )
}