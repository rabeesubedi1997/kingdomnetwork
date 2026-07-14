import { useState } from 'react'
import { Job } from '@/types'
import { Select } from '@/components/ui/Select'
import { cn } from '@/lib/utils'
import { Filter, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'

interface CareerFiltersProps {
  onClose: () => void
  onFilterChange?: (filters: { department: string; type: string; search: string }) => void
}

const departments = ['All', 'Production', 'Development', 'Marketing', 'Finance', 'Operations', 'Creative', 'Technical']
const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance']

export const CareerFilters: React.FC<CareerFiltersProps> = ({ onClose, onFilterChange }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('All')
  const [selectedType, setSelectedType] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const applyFilters = () => {
    onFilterChange?.({ department: selectedDepartment, type: selectedType, search: searchQuery })
    onClose()
  }

  const clearFilters = () => {
    setSelectedDepartment('All')
    setSelectedType('All')
    setSearchQuery('')
    onFilterChange?.({ department: 'All', type: 'All', search: '' })
  }

  const hasFilters = selectedDepartment !== 'All' || selectedType !== 'All' || searchQuery

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='font-semibold text-brand-primary'>Filter Positions</h3>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className='text-sm text-brand-primary hover:text-brand-secondary font-medium flex items-center gap-1'
          >
            <X className='w-4 h-4' />
            Clear All
          </button>
        )}
      </div>

      <Input
        label='Search'
        placeholder='Search by title, keyword...'
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className='mb-2'
      />

      <Select
        label='Department'
        value={selectedDepartment}
        onChange={e => setSelectedDepartment(e.target.value)}
        options={departments.map(d => ({ value: d, label: d }))}
        className='mb-2'
      />

      <Select
        label='Job Type'
        value={selectedType}
        onChange={e => setSelectedType(e.target.value)}
        options={jobTypes.map(t => ({ value: t, label: t }))}
      />

      <div className='flex gap-2 pt-2'>
        <button
          onClick={applyFilters}
          className='btn-primary flex-1'
        >
          <Filter className='w-4 h-4 mr-2' />
          Apply Filters
        </button>
        <button
          onClick={clearFilters}
          className='btn-secondary'
        >
          Reset
        </button>
      </div>
    </div>
  )
}