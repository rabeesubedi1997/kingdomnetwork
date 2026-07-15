import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Settings,
  Film,
  Newspaper,
  Briefcase,
  Images,
  FileText,
  Users,
  UserCircle,
  Tags,
  X,
} from 'lucide-react'

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/site-settings', icon: Settings, label: 'Site Settings' },
  { to: '/admin/films', icon: Film, label: 'Films' },
  { to: '/admin/news', icon: Newspaper, label: 'News' },
  { to: '/admin/jobs', icon: Briefcase, label: 'Jobs' },
  { to: '/admin/gallery', icon: Images, label: 'Gallery' },
  { to: '/admin/press-kits', icon: FileText, label: 'Press Kit' },
  { to: '/admin/team', icon: Users, label: 'Team' },
  { to: '/admin/people', icon: UserCircle, label: 'People' },
  { to: '/admin/genres', icon: Tags, label: 'Genres' },
]

interface AdminSidebarProps {
  open: boolean
  onClose: () => void
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ open, onClose }) => {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-brand-dark text-white flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-gold flex items-center justify-center">
              <span className="text-brand-dark font-bold text-sm">K</span>
            </div>
            <span className="font-display font-semibold text-lg">Admin</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                )
              }
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-white/10">
          <p className="text-xs text-white/50">Kingdom Network</p>
          <p className="text-xs text-white/30">Admin Panel v1.0</p>
        </div>
      </aside>
    </>
  )
}
