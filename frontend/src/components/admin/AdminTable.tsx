import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'

export interface Column<T> {
  key: string
  label: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
  className?: string
}

interface AdminTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string | number
  isLoading?: boolean
  currentPage?: number
  lastPage?: number
  total?: number
  onPageChange?: (page: number) => void
  onSearch?: (query: string) => void
  searchPlaceholder?: string
  actions?: (item: T) => React.ReactNode
}

export function AdminTable<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  isLoading,
  currentPage = 1,
  lastPage = 1,
  total = 0,
  onPageChange,
  onSearch,
  searchPlaceholder = 'Search...',
  actions,
}: AdminTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0
    const aVal = a[sortKey]
    const bVal = b[sortKey]
    if (aVal == null) return 1
    if (bVal == null) return -1
    const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true })
    return sortDir === 'asc' ? cmp : -cmp
  })

  return (
    <div>
      {onSearch && (
        <div className="mb-4 max-w-xs">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
            <Input
              placeholder={searchPlaceholder}
              onChange={e => onSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-brand-surface/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-brand-primary/5 border-b border-brand-surface/50">
              {columns.map(col => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-left font-medium text-brand-muted',
                    col.sortable && 'cursor-pointer select-none hover:text-brand-text',
                    col.className
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="px-4 py-3 text-right font-medium text-brand-muted">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-brand-surface/30 last:border-0">
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="h-4 bg-brand-primary/10 rounded animate-pulse w-3/4" />
                    </td>
                  ))}
                  {actions && <td className="px-4 py-3"><div className="h-4 bg-brand-primary/10 rounded animate-pulse w-16 ml-auto" /></td>}
                </tr>
              ))
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-12 text-center text-brand-muted">
                  No results found
                </td>
              </tr>
            ) : (
              sortedData.map((item, idx) => (
                <motion.tr
                  key={keyExtractor(item)}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="border-b border-brand-surface/30 last:border-0 hover:bg-brand-primary/[0.02] transition-colors"
                >
                  {columns.map(col => (
                    <td key={col.key} className={cn('px-4 py-3 text-brand-text', col.className)}>
                      {col.render ? col.render(item) : String(item[col.key] ?? '')}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3 text-right">
                      {actions(item)}
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {lastPage > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-brand-muted">
          <p>
            Page {currentPage} of {lastPage} ({total} total)
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg hover:bg-brand-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: Math.min(lastPage, 5) }, (_, i) => {
              const start = Math.max(1, currentPage - 2)
              const page = start + i
              if (page > lastPage) return null
              return (
                <button
                  key={page}
                  onClick={() => onPageChange?.(page)}
                  className={cn(
                    'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
                    page === currentPage
                      ? 'bg-brand-primary text-white'
                      : 'hover:bg-brand-primary/10 text-brand-muted'
                  )}
                >
                  {page}
                </button>
              )
            })}
            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage >= lastPage}
              className="p-1.5 rounded-lg hover:bg-brand-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
