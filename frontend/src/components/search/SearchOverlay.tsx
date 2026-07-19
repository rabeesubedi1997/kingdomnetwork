import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search as SearchIcon, X, Film, Newspaper, UserCircle, Users, ExternalLink, ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { cn } from '@/lib/utils'

interface SearchResult {
  type: 'film' | 'news' | 'person' | 'team'
  id: number
  title: string
  slug: string
  url: string
  image?: string
  subtitle?: string
}

const typeIcon: Record<string, any> = { film: Film, news: Newspaper, person: UserCircle, team: Users }
const typeColors: Record<string, string> = { film: 'text-blue-400', news: 'text-green-400', person: 'text-purple-400', team: 'text-amber-400' }
const typeLabels: Record<string, string> = { film: 'Film', news: 'News', person: 'People', team: 'Team' }

export const SearchOverlay: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) { setTimeout(() => inputRef.current?.focus(), 100) } else { setQuery('') }
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) { document.addEventListener('keydown', handler); document.body.style.overflow = 'hidden' }
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = '' }
  }, [open, onClose])

  const { data, isFetching } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      const res = await api.get<{ data: SearchResult[] }>(`/search?q=${encodeURIComponent(query)}`)
      return res.data.data
    },
    enabled: query.length >= 2,
    staleTime: 30000,
  })

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            className="w-full max-w-3xl mx-4 bg-brand-dark border border-brand-surface/50 rounded-2xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-6 py-5 border-b border-brand-surface/50">
              <SearchIcon size={22} className="text-brand-muted/60 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search films, news, people, team..."
                className="flex-1 bg-transparent text-white text-lg outline-none placeholder:text-brand-muted/40"
              />
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-brand-surface/50 text-brand-muted hover:text-brand-primary transition-colors">
                <X size={22} />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {query.length < 2 && (
                <div className="px-6 py-10 text-center">
                  <SearchIcon size={48} className="mx-auto text-brand-muted/30 mb-4" />
                  <p className="text-brand-muted text-sm">Type at least 2 characters to search</p>
                </div>
              )}
              {isFetching && query.length >= 2 && (
                <div className="px-6 py-10 text-center">
                  <div className="inline-flex items-center gap-3 text-brand-muted text-sm">
                    <div className="w-6 h-6 border-2 border-brand-primary/50 border-t-brand-primary rounded-full animate-spin" />
                    <span>Searching...</span>
                  </div>
                </div>
              )}
              {data && data.length === 0 && query.length >= 2 && !isFetching && (
                <div className="px-6 py-10 text-center">
                  <SearchIcon size={48} className="mx-auto text-brand-muted/30 mb-4" />
                  <p className="text-brand-muted text-sm">No results found for &ldquo;{query}&rdquo;</p>
                </div>
              )}
              {data && data.length > 0 && (
                <div className="divide-y divide-brand-surface/30">
                  {data.map((result) => {
                    const Icon = typeIcon[result.type] || ExternalLink
                    return (
                      <Link
                        key={`${result.type}-${result.id}`}
                        to={result.url}
                        onClick={onClose}
                        className="flex items-center gap-4 px-6 py-4 hover:bg-brand-surface/50 transition-colors group"
                      >
                        {result.image ? (
                          <img src={result.image} alt="" className="w-14 h-14 rounded-lg object-cover bg-brand-surface flex-shrink-0" />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-brand-surface flex items-center justify-center flex-shrink-0">
                            <Icon size={22} className={cn('text-brand-muted', typeColors[result.type])} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium truncate group-hover:text-brand-primary transition-colors">{result.title}</p>
                            <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', typeColors[result.type])}>
                              {typeLabels[result.type]}
                            </span>
                          </div>
                          {result.subtitle && <p className="text-brand-muted text-sm truncate mt-0.5">{result.subtitle}</p>}
                        </div>
                        <ChevronRight size={18} className="text-brand-muted/50 group-hover:text-brand-primary transition-colors flex-shrink-0" />
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}