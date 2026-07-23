import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, LayoutDashboard, Library, Settings, Puzzle, Film, Newspaper, Briefcase, Images, FileText, Users, UserCircle, Tags, Image as ImageIcon, DollarSign, MenuSquare, Globe, Trophy, Mail, Award, MessageSquare, UserPlus, ExternalLink, ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { adminSearch } from '@/lib/admin-api'
import { cn } from '@/lib/utils'

const iconMap: Record<string, any> = {
  admin_page: LayoutDashboard, film: Film, news: Newspaper, menu: MenuSquare,
  menu_item: ExternalLink, page: Globe, setting: Settings, module: Puzzle,
}

const defaultResults = [
  { type: 'admin_page', id: 0, title: 'Dashboard', url: '/admin', subtitle: 'Admin dashboard' },
  { type: 'admin_page', id: 1, title: 'Media Library', url: '/admin/media-library', subtitle: 'Upload and manage media' },
  { type: 'admin_page', id: 2, title: 'Site Settings', url: '/admin/site-settings', subtitle: 'Site configuration' },
  { type: 'admin_page', id: 3, title: 'Modules', url: '/admin/modules', subtitle: 'Feature toggles' },
  { type: 'admin_page', id: 4, title: 'Films', url: '/admin/films', subtitle: 'Film catalog' },
  { type: 'admin_page', id: 5, title: 'News', url: '/admin/news', subtitle: 'News posts' },
  { type: 'admin_page', id: 6, title: 'Menus', url: '/admin/menus', subtitle: 'Navigation menus' },
  { type: 'admin_page', id: 7, title: 'Pages', url: '/admin/pages', subtitle: 'Custom pages' },
]

export const AdminSearchOverlay: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(-1)
  const navigate = useNavigate()

  useEffect(() => {
    if (open) { setTimeout(() => inputRef.current?.focus(), 80); setQuery(''); setActiveIndex(-1) }
  }, [open])

  const { data, isFetching } = useQuery({
    queryKey: ['admin', 'search', query],
    queryFn: async () => {
      const res = await adminSearch(query)
      return res.data
    },
    enabled: query.length >= 2,
    staleTime: 30000,
  })

  const results = query.length >= 2 ? (data || []) : defaultResults

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose() }
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, -1)) }
      if (e.key === 'Enter' && activeIndex >= 0 && results[activeIndex]) {
        navigate(results[activeIndex].url); onClose()
      }
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = '' }
  }, [open, onClose, results, activeIndex, navigate])

  useEffect(() => {
    setActiveIndex(-1)
  }, [query])

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex])

  const showNoInput = query.length === 0
  const showLoading = isFetching && query.length >= 2
  const showEmpty = !isFetching && data?.length === 0 && query.length >= 2
  const showResults = results.length > 0

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] sm:pt-[18vh] bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg mx-4 bg-[#111820]/95 backdrop-blur-xl border border-[#1e3040] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#1e3040]">
              <Search size={18} className="text-[#64748b] flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search admin pages, menus, settings..."
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-[#64748b]"
              />
              {query && (
                <button onClick={() => setQuery('')} className="p-0.5 rounded hover:bg-white/10 text-[#64748b] hover:text-white transition-colors">
                  <X size={14} />
                </button>
              )}
              <kbd className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#0a0f14] text-[#64748b] border border-[#1e3040]">esc</kbd>
            </div>

            <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
              {showNoInput && (
                <div className="px-3 pb-1">
                  <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Quick Navigation</div>
                  {defaultResults.map((item, idx) => {
                    const Icon = iconMap[item.type] || LayoutDashboard
                    const isActive = idx === activeIndex
                    return (
                      <button
                        key={idx}
                        onClick={() => { navigate(item.url); onClose() }}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={cn(
                          'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left transition-all duration-150',
                          isActive ? 'bg-[#1c2a38]' : 'hover:bg-white/[0.03]'
                        )}
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#1c2a38] flex items-center justify-center flex-shrink-0">
                          <Icon size={13} className="text-[#94a3b8]" />
                        </div>
                        <span className="flex-1 text-sm text-white/80 truncate">{item.title}</span>
                        <ChevronRight size={12} className="text-[#64748b] flex-shrink-0" />
                      </button>
                    )
                  })}
                </div>
              )}

              {showLoading && (
                <div className="flex items-center justify-center gap-2.5 py-10">
                  <div className="w-4 h-4 rounded-full border-2 border-[#1e3040] border-t-[#09333f] animate-spin" />
                  <span className="text-sm text-[#64748b]">Searching...</span>
                </div>
              )}

              {showEmpty && (
                <div className="py-10 text-center">
                  <Search size={28} className="mx-auto mb-2 text-[#1e3040]" />
                  <p className="text-sm text-[#64748b]">No results for &ldquo;{query}&rdquo;</p>
                </div>
              )}

              {showResults && query.length >= 2 && (
                <div className="px-1">
                  {results.map((item: any, idx: number) => {
                    const Icon = iconMap[item.type] || ExternalLink
                    const isActive = idx === activeIndex
                    return (
                      <button
                        key={`${item.type}-${item.id}-${idx}`}
                        onClick={() => { navigate(item.url); onClose() }}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={cn(
                          'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left transition-all duration-150',
                          isActive ? 'bg-[#1c2a38]' : 'hover:bg-white/[0.03]'
                        )}
                      >
                        <div className={cn(
                          'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0',
                          isActive ? 'bg-[#09333f]' : 'bg-[#1c2a38]'
                        )}>
                          <Icon size={13} className={isActive ? 'text-white' : 'text-[#94a3b8]'} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              'text-sm truncate',
                              isActive ? 'text-white font-medium' : 'text-white/80'
                            )}>{item.title}</span>
                            <span className={cn(
                              'text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0',
                              isActive ? 'bg-white/10 text-white/70' : 'bg-[#1c2a38] text-[#64748b]'
                            )}>{item.type.replace('_', ' ')}</span>
                          </div>
                          {item.subtitle && (
                            <p className="text-[11px] text-[#64748b] truncate mt-0.5">{item.subtitle}</p>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 px-4 py-2 border-t border-[#1e3040] bg-[#0a0f14]/50">
              <div className="flex items-center gap-2 text-[11px] text-[#64748b]">
                <span><kbd className="px-1 py-0.5 rounded bg-[#1c2a38] text-[#94a3b8] font-mono text-[10px]">↑↓</kbd> navigate</span>
                <span><kbd className="px-1.5 py-0.5 rounded bg-[#1c2a38] text-[#94a3b8] font-mono text-[10px]">↵</kbd> open</span>
              </div>
              <span className="ml-auto text-[11px] text-[#64748b]">Admin Search</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}