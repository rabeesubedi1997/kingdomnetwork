import { useQuery } from '@tanstack/react-query'
import { getStats } from '@/lib/admin-api'
import { AdminStatsCard } from '@/components/admin/AdminStatsCard'
import { Film, Newspaper, Briefcase, Users, UserCircle, Images, FileText, Tags } from 'lucide-react'

export const DashboardPage: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: getStats,
  })

  const cards = [
    { title: 'Films', value: stats?.films_count ?? 0, icon: Film, color: 'primary' as const },
    { title: 'News Posts', value: stats?.news_count ?? 0, icon: Newspaper, color: 'gold' as const },
    { title: 'Jobs', value: stats?.jobs_count ?? 0, icon: Briefcase, color: 'accent' as const },
    { title: 'Gallery Albums', value: stats?.albums_count ?? 0, icon: Images, color: 'secondary' as const },
    { title: 'Team Members', value: stats?.team_count ?? 0, icon: Users, color: 'primary' as const },
    { title: 'People', value: stats?.people_count ?? 0, icon: UserCircle, color: 'gold' as const },
    { title: 'Press Kits', value: stats?.press_kits_count ?? 0, icon: FileText, color: 'accent' as const },
    { title: 'Genres', value: stats?.genres_count ?? 0, icon: Tags, color: 'secondary' as const },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-brand-text">Dashboard</h1>
        <p className="text-brand-muted text-sm mt-1">Overview of your site</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-brand-surface/50 p-6">
              <div className="h-12 w-12 rounded-lg bg-brand-primary/10 animate-pulse mb-4" />
              <div className="h-4 w-20 bg-brand-primary/10 rounded animate-pulse mb-2" />
              <div className="h-8 w-16 bg-brand-primary/10 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <AdminStatsCard key={card.title} {...card} />
          ))}
        </div>
      )}
    </div>
  )
}
