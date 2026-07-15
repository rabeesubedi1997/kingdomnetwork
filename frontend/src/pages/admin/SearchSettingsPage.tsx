import { Search, Film, Newspaper, Users, UserCircle, Globe } from 'lucide-react'

const contentTypes = [
  { label: 'Films', icon: Film, color: 'text-blue-400', desc: 'Film titles, synopsis, cast & crew' },
  { label: 'News', icon: Newspaper, color: 'text-green-400', desc: 'Press releases, blog posts, categories' },
  { label: 'People', icon: Users, color: 'text-purple-400', desc: 'Cast, crew, and team member profiles' },
  { label: 'Team', icon: UserCircle, color: 'text-yellow-400', desc: 'Team member profiles and bios' },
  { label: 'Pages', icon: Globe, color: 'text-teal-400', desc: 'Custom page content' },
]

export const SearchSettingsPage = () => {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white">Search Settings</h1>
        <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>Global search configuration across all content types</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border p-5" style={{ background: '#111820', borderColor: '#1e3040' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#09333f] flex items-center justify-center">
              <Search size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Content Types</h3>
              <p className="text-xs" style={{ color: '#94a3b8' }}>Types included in search results</p>
            </div>
          </div>
          <div className="space-y-3">
            {contentTypes.map(ct => (
              <div key={ct.label} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ background: '#0d1a24' }}>
                <ct.icon size={16} className={ct.color} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{ct.label}</p>
                  <p className="text-xs" style={{ color: '#64748b' }}>{ct.desc}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-green-500/10 text-green-400">Active</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border p-5" style={{ background: '#111820', borderColor: '#1e3040' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#09333f] flex items-center justify-center">
              <Globe size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">API Endpoint</h3>
              <p className="text-xs" style={{ color: '#94a3b8' }}>Public search API information</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="p-2.5 rounded-lg text-xs font-mono" style={{ background: '#0d1a24', color: '#94a3b8' }}>
              GET /api/v1/search?q=&#123;query&#125;
            </div>
            <p className="text-xs" style={{ color: '#64748b' }}>
              The search endpoint searches across all enabled content types and returns
              combined results sorted by relevance.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}