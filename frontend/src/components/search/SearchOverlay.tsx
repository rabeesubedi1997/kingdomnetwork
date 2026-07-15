import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search as SearchIcon, X, Film, Newspaper, UserCircle, Users, ExternalLink } from 'lucide-react'
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

interface SearchOverlayProps {
  open: boolean
  onClose: () => void
}

const typeIcon: Record<string, any> = { film: Film, news: Newspaper, person: UserCircle, team: Users }
const typeColors: Record<string, string> = { film: 'text-blue-400', news: 'text-green-400', person: 'text-purple-400', team: 'text-amber-400' }

export const SearchOverlay = ({ open, onClose }: SearchOverlayProps) => {
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/80 backdrop-blur-sm'>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className='w-full max-w-2xl mx-4 bg-brand-dark border border-brand-surface rounded-2xl shadow-2xl overflow-hidden'>
            <div className='flex items-center gap-3 px-5 py-4 border-b border-brand-surface'>
              <SearchIcon size={20} className='text-brand-muted flex-shrink-0' />
              <input ref={inputRef} type='text' value={query} onChange={e => setQuery(e.target.value)} placeholder='Search films, news, people...' className='flex-1 bg-transparent text-brand-text text-lg outline-none placeholder:text-brand-muted/50' />
              <button onClick={onClose} className='p-1.5 rounded-lg hover:bg-brand-surface/50 text-brand-muted hover:text-brand-primary transition-colors'>
                <X size={20} />
              </button>
            </div>
            <div className='max-h-[50vh] overflow-y-auto'>
              {query.length < 2 && (
                <div className='p-8 text-center text-brand-muted text-sm'>
                  Type at least 2 characters to search
                </div>
              )}
              {isFetching && query.length >= 2 && (
                <div className='p-8 text-center text-brand-muted text-sm'>
                  <div className='animate-pulse h-4 w-32 mx-auto rounded bg-brand-surface' />
                </div>
              )}
              {data && data.length === 0 && query.length >= 2 && !isFetching && (
                <div className='p-8 text-center text-brand-muted text-sm'>
                  No results found for "{query}"
                </div>
              )}
              {data && data.length > 0 && (
                <div className='py-2'>
                  {data.map((result) => {
                    const Icon = typeIcon[result.type] || ExternalLink
                    return (
                      <Link key={`${result.type}-${result.id}`} to={result.url} onClick={onClose} className='flex items-center gap-4 px-5 py-3 hover:bg-brand-surface/50 transition-colors group'>
                        {result.image ? (
                          <img src={result.image} alt='' className='w-12 h-12 rounded-lg object-cover bg-brand-surface flex-shrink-0' />
                        ) : (
                          <div className='w-12 h-12 rounded-lg bg-brand-surface flex items-center justify-center flex-shrink-0'>
                            <Icon size={20} className={cn('text-brand-muted', typeColors[result.type])} />
                          </div>
                        )}
                        <div className='flex-1 min-w-0'>
                          <p className='text-brand-text font-medium truncate group-hover:text-brand-primary transition-colors'>{result.title}</p>
                          {result.subtitle && <p className='text-brand-muted text-sm truncate'>{result.subtitle}</p>}
                        </div>
                        <span className={cn('text-xs font-medium capitalize flex-shrink-0', typeColors[result.type])}>{result.type}</span>
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
