import { X } from 'lucide-react'
import { Input } from '@/components/ui/Input'

export interface FilterBarSearchConfig {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  /** When set, renders a labeled form-style input (matches the `Input` component). Omit for the compact search-with-clear-button style. */
  label?: string
  className?: string
}

export interface FilterBarProps {
  pills?: string[]
  activePill?: string
  onPillChange?: (value: string) => void
  pillsClassName?: string
  search?: FilterBarSearchConfig
  className?: string
}

export const FilterBar: React.FC<FilterBarProps> = ({ pills, activePill, onPillChange, pillsClassName, search, className }) => {
  return (
    <div className={className}>
      {pills && pills.length > 0 && (
        <div className={pillsClassName || 'flex flex-wrap items-center gap-3 mb-4'}>
          {pills.map(pill => (
            <button
              key={pill}
              onClick={() => onPillChange?.(pill)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activePill === pill
                  ? 'bg-brand-primary text-white'
                  : 'bg-brand-surface/50 dark:bg-white/10 text-brand-muted dark:text-brand-white/60 hover:text-brand-primary dark:hover:text-brand-white hover:bg-brand-primary/10'
              }`}
            >
              {pill}
            </button>
          ))}
        </div>
      )}

      {search && (
        search.label ? (
          <Input
            label={search.label}
            placeholder={search.placeholder}
            value={search.value}
            onChange={e => search.onChange(e.target.value)}
            className={search.className}
          />
        ) : (
          <div className={`relative max-w-md ${search.className || ''}`}>
            <input
              type='text'
              value={search.value}
              onChange={e => search.onChange(e.target.value)}
              placeholder={search.placeholder}
              className='w-full px-4 py-2.5 rounded-lg border border-brand-surface/50 dark:border-white/15 bg-white dark:bg-brand-dark text-brand-text dark:text-brand-white placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-primary'
            />
            {search.value && (
              <button
                onClick={() => search.onChange('')}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-primary'
              >
                <X className='w-4 h-4' />
              </button>
            )}
          </div>
        )
      )}
    </div>
  )
}
