import { useState } from 'react'
import { motion } from 'framer-motion'
import { Filter, X } from 'lucide-react'

interface NewsFiltersProps {
  onCategoryChange?: (category: string) => void
  onSearch?: (query: string) => void
}

const categories = ['All', 'Film Updates', 'Behind the Scenes', 'Announcements', 'Awards', 'Interviews']

export const NewsFilters: React.FC<NewsFiltersProps> = ({ onCategoryChange, onSearch }) => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    onCategoryChange?.(category)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className='mb-8'
    >
      <div className='flex flex-wrap items-center gap-3 mb-4'>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category
                ? 'bg-brand-primary text-white'
                : 'bg-brand-surface/50 text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      {onSearch && (
        <div className='relative max-w-md'>
          <input
            type='text'
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value)
              onSearch(e.target.value)
            }}
            placeholder='Search articles...'
            className='w-full px-4 py-2.5 rounded-lg border border-brand-surface/50 bg-white text-brand-text placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-primary'
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('')
                onSearch('')
              }}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-primary'
            >
              <X className='w-4 h-4' />
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}
