import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Film, Newspaper, MessageSquare, Briefcase, ExternalLink } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getNotifications } from '@/lib/admin-api'
import { cn } from '@/lib/utils'

const iconMap: Record<string, any> = {
  film_published: Film,
  news_published: Newspaper,
  contact_message: MessageSquare,
  job_application: Briefcase,
}

export const NotificationDropdown: React.FC = () => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'notifications'],
    queryFn: getNotifications,
    refetchInterval: 60000,
  })

  const notifications = data?.notifications || []
  const unreadCount = data?.unread_count || 0

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
        title="Notifications"
      >
        <Bell size={18} className="text-[#c8d6e5]" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center shadow-lg shadow-red-500/30">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 rounded-xl border shadow-2xl shadow-black/30 overflow-hidden z-50"
            style={{ background: '#111820', borderColor: '#1e3040' }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: '#1e3040' }}>
              <h3 className="text-sm font-semibold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="max-h-72 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3 animate-pulse">
                      <div className="w-8 h-8 rounded-lg" style={{ background: '#1c2a38' }} />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 rounded w-3/4" style={{ background: '#1c2a38' }} />
                        <div className="h-2 rounded w-1/4" style={{ background: '#1c2a38' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell size={24} className="mx-auto mb-2 text-[#64748b]" />
                  <p className="text-sm text-[#64748b]">No notifications</p>
                </div>
              ) : (
                <div className="py-1">
                  {notifications.map((n: any, i: number) => {
                    const Icon = iconMap[n.type] || ExternalLink
                    return (
                      <Link
                        key={i}
                        to={n.link || '#'}
                        onClick={() => setOpen(false)}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors mx-1 rounded-lg group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-brand-primary/20 flex items-center justify-center flex-shrink-0">
                          <Icon size={14} className="text-brand-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white/80 truncate">{n.message}</p>
                          <p className="text-[11px] text-[#64748b] mt-0.5">{n.time}</p>
                        </div>
                        <ExternalLink size={12} className="text-[#64748b] mt-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}