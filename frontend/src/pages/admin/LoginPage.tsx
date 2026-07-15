import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAdminStore } from '@/lib/admin-store'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { LogIn } from 'lucide-react'
import { toast } from 'react-hot-toast'

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated, isLoading: authLoading } = useAdminStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin')
    }
  }, [isAuthenticated, navigate])

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-brand-surface">
        <div className="w-10 h-10 rounded-full border-3 border-brand-primary/20 border-t-brand-primary animate-spin" />
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Welcome back!')
      navigate('/admin')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid credentials'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-surface flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-brand-surface/50">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-brand-primary flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-display font-bold text-xl">K</span>
            </div>
            <h1 className="text-2xl font-display font-semibold text-brand-text">
              Admin Login
            </h1>
            <p className="text-brand-muted text-sm mt-1">
              Sign in to manage your site
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={loading}
            >
              <LogIn size={18} className="mr-2" />
              Sign In
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
