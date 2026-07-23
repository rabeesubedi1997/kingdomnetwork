import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getModules, reorderModules } from '@/lib/admin-api'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Library, Settings, Film, Newspaper, Briefcase, Images,
  FileText, Users, UserCircle, Tags, Puzzle, LogOut, ChevronDown,
  GripVertical, Check, X, Menu as MenuIcon, Image as ImageIcon, DollarSign,
  MenuSquare, Globe, Trophy, Search as SearchIcon, Mail,
  ShoppingBag, Award, Calendar, Radio, Monitor, BookOpen, EyeOff, TrendingUp, MessageSquare, UserPlus,
} from 'lucide-react'
import { useAdminStore } from '@/lib/admin-store'
import { toast } from 'react-hot-toast'

const iconMap: Record<string, any> = {
  dashboard: LayoutDashboard, media: Library, settings: Settings, films: Film,
  news: Newspaper, careers: Briefcase, gallery: Images, press_kit: FileText,
  team: Users, people: UserCircle, genres: Tags, modules: Puzzle,
  banners: ImageIcon, advertisements: DollarSign,
  menus: MenuSquare, pages: Globe,   awards: Trophy, search: SearchIcon, newsletter: Mail, testimonials: MessageSquare,
  partners: Briefcase,
  shop: ShoppingBag, membership: Award, events: Calendar, podcasts: Radio,
  tv: Monitor, comics: BookOpen, screening: EyeOff, investors: TrendingUp,
  users: UserPlus,
}

const adminModules = [
  { key: 'dashboard', label: 'Dashboard', path: '/admin', icon: 'dashboard', end: true },
  { key: 'media', label: 'Media Library', path: '/admin/media-library', icon: 'media', end: false },
  { key: 'settings', label: 'Site Settings', path: '/admin/site-settings', icon: 'settings', end: false },
  { key: 'modules', label: 'Modules', path: '/admin/modules', icon: 'modules', end: false },
  { key: 'films', label: 'Films', path: '/admin/films', icon: 'films', end: false, module: 'films' },
  { key: 'news', label: 'News', path: '/admin/news', icon: 'news', end: false, module: 'news' },
  { key: 'gallery', label: 'Gallery', path: '/admin/gallery', icon: 'gallery', end: false, module: 'gallery' },
  { key: 'careers', label: 'Jobs', path: '/admin/jobs', icon: 'careers', end: false, module: 'careers' },
  { key: 'press_kit', label: 'Press Kits', path: '/admin/press-kits', icon: 'press_kit', end: false, module: 'press_kit' },
  { key: 'team', label: 'Team', path: '/admin/team', icon: 'team', end: false, module: 'core' },
  { key: 'people', label: 'People', path: '/admin/people', icon: 'people', end: false, module: 'people' },
  { key: 'newsletter', label: 'Newsletter', path: '/admin/newsletter', icon: 'newsletter', end: false, module: 'newsletter' },
  { key: 'genres', label: 'Genres', path: '/admin/genres', icon: 'genres', end: false, module: 'films' },
  { key: 'banners', label: 'Banner Slider', path: '/admin/banners', icon: 'banners', end: false },
  { key: 'advertisements', label: 'Advertisements', path: '/admin/advertisements', icon: 'advertisements', end: false },
  { key: 'menus', label: 'Menu Management', path: '/admin/menus', icon: 'menus', end: false },
  { key: 'pages', label: 'Pages', path: '/admin/pages', icon: 'pages', end: false },
  { key: 'awards', label: 'Awards', path: '/admin/awards', icon: 'awards', end: false, module: 'awards' },
  { key: 'search', label: 'Search Settings', path: '/admin/search', icon: 'search', end: false, module: 'search' },
  { key: 'testimonials', label: 'Testimonials', path: '/admin/testimonials', icon: 'testimonials', end: false },
  { key: 'partners', label: 'Partners', path: '/admin/partners', icon: 'partners', end: false },
  { key: 'users', label: 'Admin Users', path: '/admin/users', icon: 'users', end: false, permission: 'manage_users' },
  { key: 'shop', label: 'Shop', path: '/admin/modules', icon: 'shop', end: false, module: 'shop' },
  { key: 'membership', label: 'Membership', path: '/admin/modules', icon: 'membership', end: false, module: 'membership' },
  { key: 'events', label: 'Events', path: '/admin/modules', icon: 'events', end: false, module: 'events' },
  { key: 'podcasts', label: 'Podcasts', path: '/admin/modules', icon: 'podcasts', end: false, module: 'podcasts' },
  { key: 'tv', label: 'TV', path: '/admin/modules', icon: 'tv', end: false, module: 'tv' },
  { key: 'comics', label: 'Comics', path: '/admin/modules', icon: 'comics', end: false, module: 'comics' },
  { key: 'screening', label: 'Screenings', path: '/admin/modules', icon: 'screening', end: false, module: 'screening' },
  { key: 'investors', label: 'Investors', path: '/admin/modules', icon: 'investors', end: false, module: 'investors' },
]

interface AdminSidebarProps {
  open: boolean
  onClose: () => void
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ open, onClose }) => {
  const { user, logout, canManage } = useAdminStore()
  const location = useLocation()
  const queryClient = useQueryClient()
  const [items, setItems] = useState(adminModules)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)

  const { data: modules } = useQuery({
    queryKey: ['admin', 'modules'],
    queryFn: getModules,
  })

  useEffect(() => {
    if (modules) {
      const moduleMap: Record<string, any> = {}
      ;(Array.isArray(modules) ? modules : modules.data || []).forEach((m: any) => {
        moduleMap[m.module_name] = m
      })
    const sorted = [...adminModules].sort((a, b) => {
      const aHasModule = !!a.module
      const bHasModule = !!b.module
      if (!aHasModule && bHasModule) return -1
      if (aHasModule && !bHasModule) return 1
      const ma = moduleMap[a.module || a.key]
      const mb = moduleMap[b.module || b.key]
      const oa = ma?.sort_order ?? 99
      const ob = mb?.sort_order ?? 99
      return oa - ob
    })
      setItems(sorted)
    }
  }, [modules])

  const reorderMut = useMutation({
    mutationFn: reorderModules,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'modules'] }),
  })

  const handleDragStart = (idx: number) => setDragIdx(idx)
  const handleDragOver = (e: React.DragEvent, idx: number) => { e.preventDefault(); setDragOverIdx(idx) }
  const handleDrop = () => {
    if (dragIdx === null || dragOverIdx === null || dragIdx === dragOverIdx) { setDragIdx(null); setDragOverIdx(null); return }
    const newItems = [...items]
    const [removed] = newItems.splice(dragIdx, 1)
    newItems.splice(dragOverIdx, 0, removed)
    setItems(newItems)
    setDragIdx(null)
    setDragOverIdx(null)
    const moduleData = newItems.map((item, i) => {
      const m = (Array.isArray(modules) ? modules : modules?.data || []).find(
        (mod: any) => mod.module_name === (item.module || item.key)
      )
      return m ? { id: m.id, sort_order: i + 1 } : null
    }).filter(Boolean)
    if (moduleData.length > 0) reorderMut.mutate(moduleData as any)
  }

  const isModuleEnabled = (moduleName?: string, permission?: string) => {
    if (!moduleName) return true
    if (permission && !canManage(permission)) return false
    const m = (Array.isArray(modules) ? modules : modules?.data || []).find(
      (mod: any) => mod.module_name === moduleName
    )
    return m ? m.is_enabled : true
  }

  const visibleItems = items.filter(item => isModuleEnabled(item.module, item.permission))

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm" onClick={onClose} />}
      <aside style={{ width: 'var(--sidebar-width)' }} className={cn(
        'fixed top-0 left-0 z-50 h-screen flex flex-col transition-all duration-300 ease-in-out lg:relative',
        'bg-[#0a0f14] border-r border-[#1e3040]',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="flex items-center justify-between px-5 h-16 border-b border-[#1e3040] bg-[#0d1a24]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#09333f] to-[#0d4555] flex items-center justify-center shadow-lg shadow-[#09333f]/30">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <div>
              <span className="font-bold text-sm text-white tracking-wide">KINGDOM</span>
              <span className="text-[#ffcd57] text-[10px] ml-1.5 uppercase tracking-widest font-medium">Admin</span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 text-[#94a3b8]">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 py-3 px-2.5 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {visibleItems.map((item, idx) => {
            const Icon = iconMap[item.icon] || LayoutDashboard
            const isActive = item.end
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path)
            return (
              <div
                key={item.key}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={handleDrop}
                onDragEnd={() => { setDragIdx(null); setDragOverIdx(null) }}
                className={cn(
                  'group flex items-center transition-all duration-150 rounded-lg',
                  dragOverIdx === idx && dragIdx !== idx && 'pt-8',
                  dragIdx === idx && 'opacity-50'
                )}
              >
                <div className="flex items-center justify-center w-5 flex-shrink-0 opacity-0 group-hover:opacity-60 cursor-grab active:cursor-grabbing transition-opacity">
                  <GripVertical size={14} className="text-[#c8d6e5]" />
                </div>
                <NavLink
                  to={item.path}
                  end={item.end}
                  onClick={(e) => { if (dragIdx !== null) e.preventDefault(); onClose() }}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 w-full ml-1',
                    isActive
                      ? 'bg-gradient-to-r from-[#09333f] to-[#0d4555] text-white shadow-md shadow-[#09333f]/20'
                      : 'text-[#c8d6e5] hover:text-white hover:bg-[#1c2a38]'
                  )}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              </div>
            )
          })}
        </div>

        <div className="px-3 py-3 border-t border-[#1e3040] bg-[#0d1a24]/50">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ffcd57] to-[#e6b84d] flex items-center justify-center text-[#09333f] font-bold text-xs shadow-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin'}</p>
              <p className="text-[11px] text-[#64748b] truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); window.location.href = '/admin/login' }}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-[#94a3b8] hover:text-red-400 hover:bg-red-500/5 transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
