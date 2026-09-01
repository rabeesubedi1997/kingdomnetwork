import { useState } from 'react'
import { motion } from 'framer-motion'
import { FilterBar } from '@/components/shared/FilterBar'

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

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className='mb-8'
    >
      <FilterBar
        pills={categories}
        activePill={activeCategory}
        onPillChange={handleCategoryChange}
        search={onSearch ? { value: searchQuery, onChange: handleSearchChange, placeholder: 'Search articles...' } : undefined}
      />
    </motion.div>
  )
}
