import { Film } from '@/types'
import { motion } from 'framer-motion'
import { StatusBadge } from './StatusBadge'
import { FilmCard } from './FilmCard'
import { GridSkeleton } from '@/components/ui/Loading'
import { fadeUpViewport } from '@/lib/motion'

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
            viewport={fadeUpViewport}
            className='space-y-8'
          >
            <div className='flex flex-wrap items-center gap-4'>
              <StatusBadge status={status as Film['status']} large />
              <h2 className='heading-2 text-brand-primary dark:text-brand-white'>
                {statusLabels[status] || status}
                <span className='ml-3 text-base font-normal text-brand-muted dark:text-brand-white/50'>
                  ({films.length})
                </span>
              </h2>
            </div>

            {isLoading ? (
              <GridSkeleton count={4} />
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
