import { create } from 'zustand'
import { adminLogin, adminVerifyToken } from './admin-api'

interface AdminUser {
  id: number
  name: string
  email: string
  role?: string
}

interface AdminState {
  token: string | null
  user: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

export const useAdminStore = create<AdminState>()((set) => ({
  token: localStorage.getItem('admin_token'),
  user: JSON.parse(localStorage.getItem('admin_user') || 'null'),
  isAuthenticated: !!localStorage.getItem('admin_token'),
  isLoading: true,

  login: async (email: string, password: string) => {
    const data = await adminLogin(email, password)
    const token = data.token || data.access_token
    const user = data.user || { id: data.id, name: data.name, email: data.email }
    localStorage.setItem('admin_token', token)
    localStorage.setItem('admin_user', JSON.stringify(user))
    set({ token, user, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    set({ token: null, user: null, isAuthenticated: false })
  },

  checkAuth: async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      set({ isAuthenticated: false, isLoading: false })
      return
    }
    try {
      const data = await adminVerifyToken()
      const user = data.user || data
      localStorage.setItem('admin_user', JSON.stringify(user))
      set({ user, token, isAuthenticated: true, isLoading: false })
    } catch {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      set({ token: null, user: null, isAuthenticated: false, isLoading: false })
    }
  },
}))
