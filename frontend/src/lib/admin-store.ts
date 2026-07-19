import { create } from 'zustand'
import { adminLogin, adminVerifyToken } from './admin-api'

interface AdminUser {
  id: number
  name: string
  email: string
  roles?: { id: number; name: string }[]
  permissions?: { id: number; name: string }[]
}

interface AdminState {
  token: string | null
  user: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
  role: string | null
  permissions: string[]
  can: (permission: string) => boolean
  canManage: (permission: string) => boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

const parseUser = (): AdminUser | null => {
  try { return JSON.parse(localStorage.getItem('admin_user') || 'null') } catch { return null }
}

export const useAdminStore = create<AdminState>()((set, get) => ({
  token: localStorage.getItem('admin_token'),
  user: parseUser(),
  isAuthenticated: !!localStorage.getItem('admin_token'),
  isLoading: false,
  role: parseUser()?.roles?.[0]?.name || null,
  permissions: parseUser()?.permissions?.map((p: any) => p.name) || [],

  canManage: (permission: string) => {
    const p = get().permissions
    const r = get().role
    if (r === 'super_admin') return true
    return p.includes(permission)
  },

  can: (permission: string) => {
    const p = get().permissions
    const r = get().role
    if (r === 'super_admin') return true
    return p.includes(permission)
  },

  login: async (email: string, password: string) => {
    const data = await adminLogin(email, password)
    const token = data.token || data.access_token
    const userData = data.user || { id: data.id, name: data.name, email: data.email }
    const user = {
      id: userData.id, name: userData.name, email: userData.email,
      roles: userData.roles || [],
      permissions: userData.permissions || [],
    }
    localStorage.setItem('admin_token', token)
    localStorage.setItem('admin_user', JSON.stringify(user))
    const perms = user.permissions?.map((p: any) => p.name) || []
    set({
      token, user,
      isAuthenticated: true,
      role: user.roles?.[0]?.name || null,
      permissions: perms,
    })
  },

  logout: () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    set({
      token: null, user: null, isAuthenticated: false, isLoading: false,
      role: null, permissions: [],
    })
  },

  checkAuth: async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      set({ isAuthenticated: false, isLoading: false })
      return
    }
    try {
      const data = await adminVerifyToken()
      const userData = data.user || data
      const user = {
        id: userData.id, name: userData.name, email: userData.email,
        roles: userData.roles || [],
        permissions: userData.permissions || [],
      }
      localStorage.setItem('admin_user', JSON.stringify(user))
      const perms = user.permissions?.map((p: any) => p.name) || []
      set({
        user, token, isAuthenticated: true, isLoading: false,
        role: userData.roles?.[0]?.name || null,
        permissions: perms,
      })
    } catch {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      set({
        token: null, user: null, isAuthenticated: false, isLoading: false,
        role: null, permissions: [],
      })
    }
  },
}))