import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import adminApi from '@/lib/admin-api'
import { AdminTable } from '@/components/admin/AdminTable'
import { Loading } from '@/components/ui/Loading'
import { Mail, Users, CheckCircle, Clock, XCircle, AlertTriangle, Trash2, RefreshCw } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Subscriber {
  id: number
  email: string
  name?: string
  status: string
  source?: string
  tags?: string[]
  confirmed_at?: string
  unsubscribed_at?: string
  created_at: string
}

interface Stats {
  total: number
  confirmed: number
  pending: number
  unsubscribed: number
  bounced: number
}

export const NewsletterPage = () => {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)

  const { data: subscribers, isLoading: subsLoading } = useQuery({
    queryKey: ['admin', 'newsletter', 'subscribers', page],
    queryFn: async () => {
      const res = await adminApi.get(`/newsletter/subscribers?page=${page}`)
      return res.data
    },
  })

  const { data: stats } = useQuery<Stats>({
    queryKey: ['admin', 'newsletter', 'stats'],
    queryFn: async () => {
      const res = await adminApi.get('/newsletter/stats')
      return res.data
    },
  })

  const deleteMut = useMutation({
    mutationFn: (id: number) => adminApi.delete(`/newsletter/subscribers/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'newsletter'] }); toast.success('Subscriber deleted') },
    onError: () => toast.error('Failed to delete'),
  })

  const statusIcon: Record<string, any> = { confirmed: CheckCircle, pending: Clock, unsubscribed: XCircle, bounced: AlertTriangle }
  const statusColor: Record<string, string> = { confirmed: 'text-green-400', pending: 'text-yellow-400', unsubscribed: 'text-gray-500', bounced: 'text-red-400' }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white">Newsletter</h1>
        <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>Manage subscribers and campaigns</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats?.total ?? 0, icon: Users, color: 'text-blue-400' },
          { label: 'Confirmed', value: stats?.confirmed ?? 0, icon: CheckCircle, color: 'text-green-400' },
          { label: 'Pending', value: stats?.pending ?? 0, icon: Clock, color: 'text-yellow-400' },
          { label: 'Unsubscribed', value: stats?.unsubscribed ?? 0, icon: XCircle, color: 'text-gray-500' },
          { label: 'Bounced', value: stats?.bounced ?? 0, icon: AlertTriangle, color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 border" style={{ background: '#111820', borderColor: '#1e3040' }}>
            <div className="flex items-center gap-2 mb-2">
              <s.icon size={16} className={s.color} />
              <span className="text-xs" style={{ color: '#94a3b8' }}>{s.label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {subsLoading ? (
        <Loading text="Loading subscribers..." />
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ background: '#111820', borderColor: '#1e3040' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: '#1e3040' }}>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: '#94a3b8' }}>Email</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: '#94a3b8' }}>Name</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: '#94a3b8' }}>Status</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: '#94a3b8' }}>Source</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: '#94a3b8' }}>Date</th>
                  <th className="text-right px-4 py-3 font-medium" style={{ color: '#94a3b8' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(subscribers?.data || []).length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12" style={{ color: '#64748b' }}>No subscribers yet.</td></tr>
                ) : (subscribers?.data || []).map((sub: Subscriber) => {
                  const StatusIcon = statusIcon[sub.status] || Clock
                  return (
                    <tr key={sub.id} className="border-b hover:bg-white/[0.02] transition-colors" style={{ borderColor: '#1e3040' }}>
                      <td className="px-4 py-3 text-white">{sub.email}</td>
                      <td className="px-4 py-3" style={{ color: '#94a3b8' }}>{sub.name || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${statusColor[sub.status] || ''}`}>
                          <StatusIcon size={12} />
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-4 py-3" style={{ color: '#94a3b8' }}>{sub.source || '-'}</td>
                      <td className="px-4 py-3" style={{ color: '#94a3b8' }}>{new Date(sub.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => { if (confirm('Delete this subscriber?')) deleteMut.mutate(sub.id) }} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {subscribers && (
            <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: '#1e3040' }}>
              <span className="text-xs" style={{ color: '#64748b' }}>
                Page {subscribers.current_page} of {subscribers.last_page} ({subscribers.total} total)
              </span>
              <div className="flex gap-2">
                <button disabled={!subscribers.prev_page_url} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-30" style={{ background: '#1c2a38', color: '#94a3b8' }}>Previous</button>
                <button disabled={!subscribers.next_page_url} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-30" style={{ background: '#1c2a38', color: '#94a3b8' }}>Next</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
