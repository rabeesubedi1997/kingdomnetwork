import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search as SearchIcon, X, Film, Newspaper, UserCircle, Users, ExternalLink, ChevronRight, TrendingUp, Clock, ArrowRight } from 'lucide-react'
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
const typeColors: Record<string, string> = { film: 'from-blue-500/20 to-blue-600/10 text-blue-400 border-blue-500/20', news: 'from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/20', person: 'from-violet-500/20 to-violet-600/10 text-violet-400 border-violet-500/20', team: 'from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/20' }
const typeBadgeColors: Record<string, string> = { film: 'bg-blue-500/10 text-blue-400 border-blue-500/20', news: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', person: 'bg-violet-500/10 text-violet-400 border-violet-500/20', team: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
const typeLabels: Record<string, string> = { film: 'Film', news: 'News', person: 'People', team: 'Team' }

export const SearchOverlay: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(-1)

  useEffect(() => {
    if (open) { setTimeout(() => inputRef.current?.focus(), 100) } else { setQuery(''); setActiveIndex(-1) }
  }, [open])

  const { data, isFetching } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      const res = await api.get<{ data: SearchResult[] }>(`/search?q=${encodeURIComponent(query)}`)
      return res.data.data
    },
    enabled: query.length >= 2,
    staleTime: 30000,
  })

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, (data?.length || 1) - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, -1)) }
      if (e.key === 'Enter' && activeIndex >= 0 && data?.[activeIndex]) {
        window.location.href = data[activeIndex].url
        onClose()
      }
    }
    if (open) { document.addEventListener('keydown', handler); document.body.style.overflow = 'hidden' }
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = '' }
  }, [open, onClose, data, activeIndex])

  const { grouped } = useMemo(() => {
    if (!data) return { grouped: null }
    const groups: Record<string, SearchResult[]> = {}
    data.forEach(r => { if (!groups[r.type]) groups[r.type] = []; groups[r.type].push(r) })
    return { grouped: groups }
  }, [data])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[15vh] bg-black/60 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: -24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl mx-4 bg-[#0f1a24]/95 backdrop-blur-xl border border-white/[0.06] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
              <SearchIcon size={20} className="text-white/30 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search films, news, people, team..."
                className="flex-1 bg-transparent text-white/90 text-base outline-none placeholder:text-white/25 tracking-wide"
              />
              {query && (
                <button onClick={() => setQuery('')} className="p-1 rounded-lg hover:bg-white/10 text-white/30 hover:text-white/70 transition-colors">
                  <X size={16} />
                </button>
              )}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[10px] font-medium text-white/20 tracking-widest uppercase">
                <kbd className="px-1">Esc</kbd>
              </div>
            </div>

            <div ref={containerRef} className="max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {query.length < 2 && (
                <div className="px-5 py-12 text-center">
                  <div className="relative inline-flex mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-brand-primary/5 rounded-full blur-xl" />
                    <SearchIcon size={56} className="relative text-white/15" />
                  </div>
                  <p className="text-white/30 text-sm font-medium tracking-wide">Type at least 2 characters to search</p>
                </div>
              )}

              {isFetching && query.length >= 2 && (
                <div className="px-5 py-16 text-center space-y-4">
                  <div className="relative inline-flex">
                    <div className="w-8 h-8 border-[1.5px] border-white/10 border-t-brand-primary rounded-full animate-spin" />
                  </div>
                  <p className="text-white/30 text-sm">Searching<span className="animate-pulse">.</span><span className="animate-pulse delay-150">.</span><span className="animate-pulse delay-300">.</span></p>
                </div>
              )}

              {data && data.length === 0 && query.length >= 2 && !isFetching && (
                <div className="px-5 py-16 text-center space-y-2">
                  <div className="relative inline-flex mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-amber-500/5 rounded-full blur-xl" />
                    <SearchIcon size={44} className="relative text-white/15" />
                  </div>
                  <p className="text-white/60 font-medium">No results found</p>
                  <p className="text-white/25 text-sm">Try adjusting your search for &ldquo;{query}&rdquo;</p>
                </div>
              )}

              {data && data.length > 0 && grouped && (
                <div className="py-2">
                  {Object.entries(grouped).map(([type, results]) => {
                    const Icon = typeIcon[type] || ExternalLink
                    return (
                      <div key={type}>
                        <div className="flex items-center gap-2 px-5 py-2.5">
                          <div className={cn('flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase', typeColors[type])}>
                            <Icon size={12} />
                            <span>{typeLabels[type] || type}</span>
                          </div>
                          <div className="h-px flex-1 bg-white/[0.04]" />
                          <span className="text-[10px] text-white/15 font-mono">{results.length}</span>
                        </div>
                        {results.map((result, idx) => {
                          const globalIdx = data.indexOf(result)
                          const isActive = globalIdx === activeIndex
                          return (
                            <Link
                              key={`${result.type}-${result.id}`}
                              to={result.url}
                              onClick={onClose}
                              onMouseEnter={() => setActiveIndex(globalIdx)}
                              className={cn(
                                'flex items-center gap-3.5 px-5 py-3 mx-2 rounded-xl transition-all duration-150 group',
                                isActive
                                  ? 'bg-white/[0.06] shadow-sm shadow-black/20 scale-[1.01]'
                                  : 'hover:bg-white/[0.03]'
                              )}
                            >
                              {result.image ? (
                                <div className="relative flex-shrink-0">
                                  <img src={result.image} alt="" className="w-11 h-11 rounded-lg object-cover ring-1 ring-white/[0.06]" />
                                </div>
                              ) : (
                                <div className={cn(
                                  'w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br border shadow-sm',
                                  typeColors[result.type]
                                )}>
                                  <Icon size={18} />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className={cn(
                                    'text-sm font-medium truncate transition-colors',
                                    isActive ? 'text-white' : 'text-white/80 group-hover:text-white'
                                  )}>
                                    {result.title}
                                  </p>
                                  <span className={cn(
                                    'text-[10px] font-semibold px-1.5 py-0.5 rounded-md border',
                                    typeBadgeColors[result.type]
                                  )}>
                                    {typeLabels[result.type]}
                                  </span>
                                </div>
                                {result.subtitle && (
                                  <p className="text-xs text-white/30 truncate mt-0.5">{result.subtitle}</p>
                                )}
                              </div>
                              <div className={cn(
                                'flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200 flex-shrink-0',
                                isActive
                                  ? 'bg-brand-primary/20 text-brand-primary translate-x-0 opacity-100'
                                  : 'text-white/20 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0'
                              )}>
                                <ArrowRight size={14} />
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              )}

              {!data && !isFetching && query.length >= 2 && (
                <div className="px-5 py-10 text-center">
                  <SearchIcon size={36} className="mx-auto text-white/10 mb-3" />
                  <p className="text-white/25 text-sm">Press Enter to search</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-5 py-2.5 border-t border-white/[0.04] bg-white/[0.015]">
              <div className="flex items-center gap-3 text-[11px] text-white/20">
                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-white/[0.06] border border-white/[0.06] font-mono">↑</kbd><kbd className="px-1 py-0.5 rounded bg-white/[0.06] border border-white/[0.06] font-mono">↓</kbd> navigate</span>
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.06] font-mono">↵</kbd> open</span>
              </div>
              <span className="text-[11px] text-white/15">Kingdom Network</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}