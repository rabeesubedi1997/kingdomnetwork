import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useAdminStore } from '@/lib/admin-store'
import { AdminSidebar } from './AdminSidebar'
import { useModuleConfig } from '@/providers/ModuleConfigProvider'
import { AdminSearchOverlay } from '@/components/admin/AdminSearchOverlay'
import { NotificationDropdown } from '@/components/admin/NotificationDropdown'
import { Menu, Search, Maximize2 } from 'lucide-react'

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard', '/admin/media-library': 'Media Library',
  '/admin/site-settings': 'Site Settings', '/admin/modules': 'Modules',
  '/admin/films': 'Films', '/admin/news': 'News', '/admin/jobs': 'Jobs',
  '/admin/gallery': 'Gallery Albums', '/admin/press-kits': 'Press Kits',
  '/admin/team': 'Team Members', '/admin/people': 'People', '/admin/genres': 'Genres',
  '/admin/banners': 'Banner Slider', '/admin/advertisements': 'Advertisements',
  '/admin/menus': 'Menu Management', '/admin/newsletter': 'Newsletter',
  '/admin/awards': 'Awards',   '/admin/seo': 'SEO Management', '/admin/search': 'Search Settings',
  '/admin/pages': 'Pages', '/admin/testimonials': 'Testimonials', '/admin/partners': 'Partners',
}

export const AdminLayout: React.FC = () => {
  const { isAuthenticated, isLoading, checkAuth } = useAdminStore()
  const { favicon_url } = useModuleConfig()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => { checkAuth() }, [])
  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate('/admin/login')
  }, [isLoading, isAuthenticated])

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center" style={{ background: '#0a0f14' }}>
      <div className="w-10 h-10 rounded-full border-3 border-[#09333f]/30 border-t-[#09333f] animate-spin" />
    </div>
  )
  if (!isAuthenticated) return null

  const currentTitle = Object.entries(pageTitles).find(([path]) =>
    location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path))
  )?.[1] || 'Admin'

  return (
    <div className="admin-dark h-screen flex overflow-hidden" style={{ background: '#0a0f14', color: '#f1f5f9' }}>
      <Helmet>
        {favicon_url && <link rel="icon" href={favicon_url} />}
        <title>{currentTitle} | Kingdom Admin</title>
      </Helmet>
      <AdminSearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <header
          className="h-16 flex-shrink-0 flex items-center justify-between px-4 lg:px-6 border-b"
          style={{ background: '#0d1a24', borderColor: '#1e3040' }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Menu size={20} className="text-[#c8d6e5]" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">{currentTitle}</h1>
              <p className="text-[11px] text-[#64748b] hidden sm:block font-mono">{location.pathname}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-colors hover:bg-white/10"
              style={{ background: '#1c2a38' }}
            >
              <Search size={14} className="text-[#94a3b8]" />
              <span className="text-xs text-[#94a3b8]">Search admin...</span>
              <kbd className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: '#0a0f14', color: '#94a3b8' }}>⌘K</kbd>
            </button>
            <NotificationDropdown />
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors hidden sm:block" title="Toggle fullscreen" onClick={() => { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen() }}>
              <Maximize2 size={16} className="text-[#94a3b8]" />
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto min-h-0">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
