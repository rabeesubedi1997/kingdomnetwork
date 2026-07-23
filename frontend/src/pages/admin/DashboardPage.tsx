import { useQuery } from '@tanstack/react-query'
import { getStats, getModules, getMedia } from '@/lib/admin-api'
import { motion } from 'framer-motion'
import { Film, Newspaper, Briefcase, Users, UserCircle, Images, FileText, Tags, TrendingUp, Calendar, Activity, Film as FilmIcon, ArrowUpRight, Clock, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const statCards = [
  { key: 'films', label: 'Films', icon: Film, gradient: 'from-[#09333f] to-[#0d4555]' },
  { key: 'posts', label: 'News Posts', icon: Newspaper, gradient: 'from-[#ffcd57] to-[#e6b84d]', textColor: 'text-[#09333f]' },
  { key: 'jobs', label: 'Jobs', icon: Briefcase, gradient: 'from-[#516f78] to-[#3d5a63]' },
  { key: 'albums', label: 'Gallery Albums', icon: Images, gradient: 'from-purple-600 to-indigo-700' },
  { key: 'team_members', label: 'Team', icon: Users, gradient: 'from-emerald-700 to-teal-800' },
  { key: 'people', label: 'People', icon: UserCircle, gradient: 'from-rose-600 to-pink-700' },
  { key: 'press_kits', label: 'Press Kits', icon: FileText, gradient: 'from-amber-600 to-orange-700' },
  { key: 'genres', label: 'Genres', icon: Tags, gradient: 'from-cyan-600 to-blue-700' },
]

export const DashboardPage: React.FC = () => {
  const { data: stats, isLoading } = useQuery({ queryKey: ['admin', 'stats'], queryFn: getStats })
  const { data: media } = useQuery({ queryKey: ['admin', 'media-library-dash'], queryFn: () => getMedia({ per_page: 8 }) })

  const getVal = (key: string) => {
    const v = stats?.[key] ?? stats?.[key + '_count'] ?? 0
    return v
  }

  const recentMedia = media?.data || []

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>Welcome back to Kingdom Network admin</p>
        </div>
        <div className="flex items-center gap-2 text-sm" style={{ color: '#64748b' }}>
          <Calendar size={14} />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl p-5 animate-pulse" style={{ background: '#111820' }}>
            <div className="h-10 w-10 rounded-lg mb-3" style={{ background: '#1c2a38' }} />
            <div className="h-3 w-16 rounded mb-2" style={{ background: '#1c2a38' }} />
            <div className="h-7 w-12 rounded" style={{ background: '#1c2a38' }} />
          </div>
        )) : statCards.map((card, i) => (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-xl border p-5 transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-default"
            style={{ background: '#111820', borderColor: '#1e3040' }}
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg mb-3`}>
              <card.icon size={20} className="text-white" />
            </div>
            <p className="text-sm font-medium" style={{ color: '#94a3b8' }}>{card.label}</p>
            <div className="flex items-end justify-between mt-0.5">
              <p className="text-2xl font-bold text-white">{getVal(card.key)}</p>
              <ArrowUpRight size={16} className="text-green-400" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-xl border p-5" style={{ background: '#111820', borderColor: '#1e3040' }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-[#ffcd57]" />
              <h2 className="font-semibold text-white">Quick Actions</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Add Film', href: '/admin/films', icon: FilmIcon, desc: 'New movie entry' },
              { label: 'Write News', href: '/admin/news', icon: Newspaper, desc: 'Press release' },
              { label: 'Upload Media', href: '/admin/media-library', icon: Images, desc: 'Images & videos' },
              { label: 'Manage Modules', href: '/admin/modules', icon: Activity, desc: 'Feature toggles' },
            ].map(action => (
              <a key={action.label} href={action.href}
                className="flex flex-col items-center gap-2 px-4 py-5 rounded-xl border transition-all group hover:-translate-y-0.5 hover:border-[#2a4a5a]"
                style={{ borderColor: '#1e3040' }}
                onClick={e => { e.preventDefault(); window.location.href = action.href }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#09333f] to-[#0d4555] flex items-center justify-center group-hover:shadow-lg group-hover:shadow-[#09333f]/40 transition-all">
                  <action.icon size={18} className="text-white" />
                </div>
                <span className="text-sm font-medium text-white">{action.label}</span>
                <span className="text-[11px]" style={{ color: '#94a3b8' }}>{action.desc}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="rounded-xl border p-5" style={{ background: '#111820', borderColor: '#1e3040' }}>
          <div className="flex items-center gap-2 mb-5">
            <Clock size={18} className="text-[#ffcd57]" />
            <h2 className="font-semibold text-white">Recent Media</h2>
          </div>
          <div className="space-y-3">
            {recentMedia.length === 0 ? (
              <p className="text-sm" style={{ color: '#64748b' }}>No media uploaded yet</p>
            ) : recentMedia.slice(0, 5).map((m: any) => (
              <div key={m.id} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: '#0a0f14' }}>
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                  {m.is_image ? (
                    <img src={m.url} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: '#1c2a38' }}>
                      <FilmIcon size={14} className="text-[#94a3b8]" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{m.name}</p>
                  <p className="text-xs" style={{ color: '#64748b' }}>{(m.size / 1024).toFixed(0)} KB</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border p-5" style={{ background: '#111820', borderColor: '#1e3040' }}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-[#ffcd57]" />
          <h2 className="font-semibold text-white">System Information</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {[
            { label: 'App', value: 'Kingdom Network v1.0' },
            { label: 'Total Content', value: String(Object.keys(stats || {}).reduce((a, k) => a + (Number(stats?.[k]) || 0), 0)) },
            { label: 'Backend', value: 'Laravel 11 + MySQL' },
            { label: 'Frontend', value: 'React 18 + Vite' },
          ].map(info => (
            <div key={info.label} className="px-4 py-3 rounded-lg" style={{ background: '#0a0f14' }}>
              <p style={{ color: '#64748b' }}>{info.label}</p>
              <p className="font-medium text-white mt-0.5">{info.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
