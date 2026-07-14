import { Film } from '@/types'
import { motion } from 'framer-motion'
import { StatusBadge } from './StatusBadge'
import { FilmCard } from './FilmCard'

interface StatusData {
  status: string
  data: Film[] | undefined
  isLoading: boolean
}

interface FilmStatusTabsProps {
  filmsByStatus: StatusData[]
  loading: boolean
}

const statusOrder = ['released', 'post_production', 'pre_production', 'development', 'announced']

const statusLabels: Record<string, string> = {
  released: 'Released',
  post_production: 'Post-Production',
  pre_production: 'Pre-Production',
  development: 'Development',
  announced: 'Announced',
}

export const FilmStatusTabs: React.FC<FilmStatusTabsProps> = ({ filmsByStatus, loading }) => {
  return (
    <div className='space-y-16'>
      {statusOrder.map(status => {
        const entry = filmsByStatus.find(d => d.status === status)
        const films = entry?.data || []
        const isLoading = entry?.isLoading || loading

        if (films.length === 0 && !isLoading) return null

        return (
          <motion.section
            key={status}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className='space-y-8'
          >
            <div className='flex items-center gap-4'>
              <StatusBadge status={status as Film['status']} large />
              <h2 className='heading-2 text-brand-primary'>
                {statusLabels[status] || status}
                <span className='ml-3 text-sm font-normal text-brand-muted'>
                  ({films.length})
                </span>
              </h2>
            </div>

            {isLoading ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className='card animate-pulse'>
                    <div className='aspect-video bg-brand-primary/10' />
                    <div className='p-4 space-y-3'>
                      <div className='h-6 w-3/4 bg-brand-primary/10 rounded' />
                      <div className='h-4 w-full bg-brand-primary/10 rounded' />
                      <div className='h-4 w-2/3 bg-brand-primary/10 rounded' />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                {films.map((film, index) => (
                  <FilmCard key={film.id} film={film} index={index} />
                ))}
              </div>
            )}
          </motion.section>
        )
      })}
    </div>
  )
}
