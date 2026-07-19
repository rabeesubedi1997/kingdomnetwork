import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getModules, updateModule, bulkUpdateModules } from '@/lib/admin-api'
import { motion } from 'framer-motion'
import { ToggleLeft, ToggleRight, Save, Search, Puzzle, Film, Newspaper, Briefcase, Images, FileText, ShoppingBag, Users, Radio, Monitor, BookOpen, Mail, Globe, EyeOff, Calendar, Award, TrendingUp, Trophy, X, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import { toast } from 'react-hot-toast'

const moduleIcons: Record<string, any> = {
  core: Globe, films: Film, news: Newspaper, careers: Briefcase, gallery: Images,
  press_kit: FileText, newsletter: Mail, shop: ShoppingBag, membership: Award,
  events: Calendar, podcasts: Radio, tv: Monitor, comics: BookOpen,
  screening: EyeOff, investors: TrendingUp, seo_sitemap: Globe,
  awards: Trophy, people: Users, search: Search,
}

const moduleDescriptions: Record<string, string> = {
  core: 'Home, About, Contact, Team pages',
  films: 'Film catalog, detail pages, timeline',
  news: 'Press releases, blog, categories',
  careers: 'Job board, applications',
  gallery: 'Photo albums, behind-the-scenes',
  press_kit: 'Press kits with downloadable assets',
  newsletter: 'Email capture, campaigns',
  shop: 'Merchandise & e-commerce',
  membership: 'Tiered membership program',
  events: 'Premieres, festivals, screenings',
  podcasts: 'Audio content with RSS',
  tv: 'Television division',
  comics: 'Comic/IP division',
  screening: 'Private screening requests',
  investors: 'Investor relations portal',
  seo_sitemap: 'Auto sitemap, robots.txt',
  awards: 'Awards & accolades page with wins/nominations',
  people: 'Individual cast/crew profile pages with filmography',
  search: 'Global search across all content types',
}

export const ModulesPage: React.FC = () => {
  const qc = useQueryClient()
  const [localModules, setLocalModules] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [dirty, setDirty] = useState(false)
  const [selectedModule, setSelectedModule] = useState<any | null>(null)
  const [configEntries, setConfigEntries] = useState<[string, string][]>([])

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'modules'],
    queryFn: getModules,
  })

  useEffect(() => {
    if (data) {
      const modules = Array.isArray(data) ? data : data.data || []
      setLocalModules(modules.sort((a: any, b: any) => (a.sort_order || 99) - (b.sort_order || 99)))
    }
  }, [data])

  const bulkMut = useMutation({
    mutationFn: bulkUpdateModules,
    onSuccess: () => { toast.success('Modules updated'); qc.invalidateQueries({ queryKey: ['admin', 'modules'] }); setDirty(false) },
    onError: () => toast.error('Failed to update'),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => updateModule(id, data),
    onSuccess: () => {
      toast.success('Module config saved')
      qc.invalidateQueries({ queryKey: ['admin', 'modules'] })
      setSelectedModule(null)
    },
    onError: () => toast.error('Failed to save config'),
  })

  const toggleModule = (id: number) => {
    setLocalModules(prev => prev.map(m => m.id === id ? { ...m, is_enabled: !m.is_enabled } : m))
    setDirty(true)
  }

  const filtered = localModules.filter((m: any) =>
    m.module_name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = () => {
    const updates = localModules.map(m => ({ id: m.id, is_enabled: m.is_enabled }))
    bulkMut.mutate(updates)
  }

  const openConfig = (module: any) => {
    setSelectedModule(module)
    const config = module.config || {}
    setConfigEntries(Object.entries(config).map(([k, v]) => [k, String(v)]))
    if (Object.keys(config).length === 0) {
      setConfigEntries([['', '']])
    }
  }

  const addConfigRow = () => {
    setConfigEntries(prev => [...prev, ['', '']])
  }

  const removeConfigRow = (idx: number) => {
    setConfigEntries(prev => prev.filter((_, i) => i !== idx))
  }

  const updateConfigKey = (idx: number, key: string) => {
    setConfigEntries(prev => prev.map((e, i) => i === idx ? [key, e[1]] : e))
  }

  const updateConfigValue = (idx: number, value: string) => {
    setConfigEntries(prev => prev.map((e, i) => i === idx ? [e[0], value] : e))
  }

  const saveConfig = () => {
    if (!selectedModule) return
    const config: Record<string, any> = {}
    configEntries.forEach(([k, v]) => {
      if (k.trim()) {
        config[k.trim()] = v
      }
    })
    updateMut.mutate({ id: selectedModule.id, data: { config } })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Modules</h1>
          <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>Enable or disable features across the site</p>
        </div>
        {dirty && (
          <Button onClick={handleSave} loading={bulkMut.isPending} style={{ background: '#09333f' }}>
            <Save size={16} className="mr-1.5" /> Save Changes
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl p-5 animate-pulse" style={{ background: '#111820' }}>
              <div className="h-5 w-32 rounded mb-3" style={{ background: '#1c2a38' }} />
              <div className="h-3 w-48 rounded" style={{ background: '#1c2a38' }} />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="relative max-w-xs mb-2">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748b' }} />
            <Input placeholder="Search modules..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9', paddingLeft: '2.25rem' }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((module: any, idx: number) => {
              const Icon = moduleIcons[module.module_name] || Puzzle
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => openConfig(module)}
                  className="rounded-xl border p-5 transition-all hover:shadow-lg cursor-pointer"
                  style={{
                    background: '#111820',
                    borderColor: module.is_enabled ? '#1e3040' : '#1a1a2e',
                    opacity: module.is_enabled ? 1 : 0.6,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                      module.is_enabled ? 'bg-[#09333f] text-white' : 'bg-[#1c2a38] text-gray-500'
                    )}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white capitalize">{module.module_name.replace(/_/g, ' ')}</h3>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleModule(module.id) }}
                          className={cn(
                            'p-1.5 rounded-lg transition-all',
                            module.is_enabled ? 'text-[#ffcd57]' : 'text-gray-600'
                          )}
                        >
                          {module.is_enabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                        </button>
                      </div>
                      <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>
                        {moduleDescriptions[module.module_name] || ''}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className={cn(
                          'px-2 py-0.5 rounded text-[11px] font-medium',
                          module.is_enabled
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-gray-500/10 text-gray-500'
                        )}>
                          {module.is_enabled ? 'Enabled' : 'Disabled'}
                        </span>
                        {module.config && Object.keys(module.config).length > 0 && (
                          <span className="text-[11px]" style={{ color: '#64748b' }}>
                            {Object.keys(module.config).length} config(s)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12" style={{ color: '#64748b' }}>
              <Puzzle size={48} className="mx-auto mb-3 opacity-30" />
              <p>No modules found</p>
            </div>
          )}
        </>
      )}

      {selectedModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSelectedModule(null)}>
          <div className="bg-[#111820] border border-[#1e3040] rounded-xl w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                {(() => { const Icon = moduleIcons[selectedModule.module_name] || Puzzle; return <Icon size={22} className="text-[#ffcd57]" /> })()}
                <h2 className="text-lg font-bold text-white capitalize">{selectedModule.module_name.replace(/_/g, ' ')}</h2>
              </div>
              <button onClick={() => setSelectedModule(null)} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500">
                <X size={18} />
              </button>
            </div>

            <p className="text-sm mb-4" style={{ color: '#94a3b8' }}>
              {moduleDescriptions[selectedModule.module_name] || 'Configure module settings'}
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium" style={{ color: '#cbd5e1' }}>Status</label>
                <span className={cn(
                  'px-2.5 py-1 rounded text-xs font-medium',
                  selectedModule.is_enabled ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-500'
                )}>
                  {selectedModule.is_enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>Configuration</label>
                {configEntries.map(([key, value], idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-2">
                    <Input
                      placeholder="Key"
                      value={key}
                      onChange={e => updateConfigKey(idx, e.target.value)}
                      style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9', flex: 1 }}
                    />
                    <Input
                      placeholder="Value"
                      value={value}
                      onChange={e => updateConfigValue(idx, e.target.value)}
                      style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9', flex: 1 }}
                    />
                    <button onClick={() => removeConfigRow(idx)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button onClick={addConfigRow} className="flex items-center gap-1.5 text-sm mt-1 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors" style={{ color: '#64748b' }}>
                  <Plus size={14} /> Add Config
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#1e3040]">
              <Button variant="ghost" onClick={() => setSelectedModule(null)}>Cancel</Button>
              <Button onClick={saveConfig} loading={updateMut.isPending} style={{ background: '#09333f' }}>
                <Save size={16} className="mr-1.5" /> Save Config
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}