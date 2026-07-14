import { useState } from 'react'
import { Album } from '@/types'
import { cn } from '@/lib/utils'
import { Filter, X } from 'lucide-react'

interface CategoryFilterProps {}

const categories = ['All', 'Behind the Scenes', 'Posters', 'Stills', 'Events', 'Concept Art', 'Marketing']

export const CategoryFilter: React.FC<CategoryFilterProps> = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')

  return (
    <div className='mb-8'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='font-semibold text-brand-primary'>Filter by Category</h3>
        {selectedCategory !== 'All' && (
          <button
            onClick={() => setSelectedCategory('All')}
            className='text-sm text-brand-primary hover:text-brand-secondary font-medium flex items-center gap-1'
          >
            <X className='w-4 h-4' />
            Clear Filter
          </button>
        )}
      </div>

      <div className='flex flex-wrap gap-2'>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all',
              selectedCategory === category
                ? 'bg-brand-primary text-white shadow-md'
                : 'bg-brand-surface/50 text-brand-text hover:bg-brand-primary/10 hover:text-brand-primary border border-brand-surface'
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}