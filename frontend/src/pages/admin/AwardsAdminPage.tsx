import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Trophy, Film, ExternalLink, Award, ThumbsUp, Medal } from 'lucide-react'
import { Loading } from '@/components/ui/Loading'

interface FilmAward {
  id: number
  award_name: string
  category: string | null
  year: number
  result: string
  film_title?: string
  film_slug?: string
}

interface AwardGroup {
  film_title: string
  film_slug: string
  awards: FilmAward[]
}

const resultIcon: Record<string, any> = { won: Trophy, nominated: ThumbsUp, shortlisted: Medal }
const resultColor: Record<string, string> = { won: 'text-yellow-400', nominated: 'text-blue-400', shortlisted: 'text-purple-400' }

export const AwardsAdminPage = () => {
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'awards'],
    queryFn: async () => {
      const res = await axios.get('/api/v1/awards')
      return res.data
    },
  })

  const groups: AwardGroup[] = data?.awards_by_film || []

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Awards</h1>
          <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>Awards and accolades across all films</p>
        </div>
      </div>

      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Awards', value: data.total_awards ?? 0, icon: Award, color: 'text-blue-400' },
            { label: 'Won', value: data.won ?? 0, icon: Trophy, color: 'text-yellow-400' },
            { label: 'Nominated', value: data.nominated ?? 0, icon: ThumbsUp, color: 'text-blue-400' },
            { label: 'Shortlisted', value: data.shortlisted ?? 0, icon: Medal, color: 'text-purple-400' },
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
      )}

      {isLoading ? (
        <Loading text="Loading awards..." />
      ) : groups.length === 0 ? (
        <div className="text-center py-12" style={{ color: '#64748b' }}>
          <Trophy size={48} className="mx-auto mb-3 opacity-30" />
          <p>No awards yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map(group => (
            <div key={group.film_slug} className="rounded-xl border overflow-hidden" style={{ background: '#111820', borderColor: '#1e3040' }}>
              <div className="flex items-center justify-between px-4 py-3 border-b cursor-pointer hover:bg-white/[0.02] transition-colors" style={{ borderColor: '#1e3040' }}
                onClick={() => navigate('/admin/films')}>
                <div className="flex items-center gap-2">
                  <Film size={16} style={{ color: '#94a3b8' }} />
                  <span className="font-medium text-white">{group.film_title}</span>
                </div>
                <ExternalLink size={14} style={{ color: '#64748b' }} />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b" style={{ borderColor: '#1e3040' }}>
                      <th className="text-left px-4 py-2.5 font-medium" style={{ color: '#94a3b8' }}>Award</th>
                      <th className="text-left px-4 py-2.5 font-medium" style={{ color: '#94a3b8' }}>Category</th>
                      <th className="text-left px-4 py-2.5 font-medium" style={{ color: '#94a3b8' }}>Year</th>
                      <th className="text-left px-4 py-2.5 font-medium" style={{ color: '#94a3b8' }}>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.awards.map((a: FilmAward) => {
                      const Icon = resultIcon[a.result] || Award
                      return (
                        <tr key={a.id} className="border-b hover:bg-white/[0.02] transition-colors" style={{ borderColor: '#1e3040' }}>
                          <td className="px-4 py-2.5 text-white">{a.award_name}</td>
                          <td className="px-4 py-2.5" style={{ color: '#94a3b8' }}>{a.category || '-'}</td>
                          <td className="px-4 py-2.5" style={{ color: '#94a3b8' }}>{a.year}</td>
                          <td className="px-4 py-2.5">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${resultColor[a.result] || ''}`}>
                              <Icon size={12} />
                              {a.result}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}