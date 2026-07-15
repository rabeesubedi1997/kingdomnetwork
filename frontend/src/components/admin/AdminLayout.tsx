import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAdminStore } from '@/lib/admin-store'
import { AdminSidebar } from './AdminSidebar'
import { Menu, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { toast } from 'react-hot-toast'

export const AdminLayout: React.FC = () => {
  const { isAuthenticated, isLoading, user, logout, checkAuth } = useAdminStore()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login')
    }
  }, [isLoading, isAuthenticated, navigate])

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-brand-surface">
        <div className="w-10 h-10 rounded-full border-3 border-brand-primary/20 border-t-brand-primary animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-brand-surface flex">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-brand-surface/50 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-brand-primary/10 transition-colors"
          >
            <Menu size={20} className="text-brand-text" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-brand-muted">
              <User size={16} />
              <span>{user?.name || 'Admin'}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-1.5" />
              Logout
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
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
