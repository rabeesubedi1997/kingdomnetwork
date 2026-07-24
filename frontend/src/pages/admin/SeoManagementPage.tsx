import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSeoPages, bulkUpdateSeoPages } from '@/lib/admin-api'
import { motion } from 'framer-motion'
import { Search, Save, RefreshCw, Eye, EyeOff, ExternalLink, Globe, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface SeoEntry {
  route: string
  label: string
  group: string
  default_title: string
  default_description: string
  seo: {
    id: number | null
    title: string | null
    description: string | null
    og_title: string | null
    og_description: string | null
    og_image: string | null
    noindex: boolean
    canonical_url: string | null
    schema_type: string | null
  } | null
}

interface EditState {
  [route: string]: {
    title: string
    description: string
    og_title: string
    og_description: string
    og_image: string
    noindex: boolean
    canonical_url: string
    schema_type: string
  }
}

const defaultEdit = (page: SeoEntry) => ({
  title: page.seo?.title ?? page.default_title,
  description: page.seo?.description ?? page.default_description,
  og_title: page.seo?.og_title ?? '',
  og_description: page.seo?.og_description ?? '',
  og_image: page.seo?.og_image ?? '',
  noindex: page.seo?.noindex ?? false,
  canonical_url: page.seo?.canonical_url ?? '',
  schema_type: page.seo?.schema_type ?? '',
})

export const SeoManagementPage: React.FC = () => {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [groupFilter, setGroupFilter] = useState('all')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [edits, setEdits] = useState<EditState>({})
  const [dirtyRoutes, setDirtyRoutes] = useState<Set<string>>(new Set())

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'seo', 'pages'],
    queryFn: getSeoPages,
  })

  const pages: SeoEntry[] = data?.data || []

  const groups = ['all', ...new Set(pages.map(p => p.group))]

  const filtered = pages.filter(p => {
    if (groupFilter !== 'all' && p.group !== groupFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return p.label.toLowerCase().includes(q) || p.route.toLowerCase().includes(q)
    }
    return true
  })

  const initEdit = useCallback((page: SeoEntry) => {
    const route = page.route
    setEdits(prev => {
      if (prev[route]) return prev
      return { ...prev, [route]: defaultEdit(page) }
    })
  }, [])

  useEffect(() => {
    filtered.forEach(initEdit)
  }, [filtered, initEdit])

  const toggleExpand = (route: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(route)) next.delete(route)
      else next.add(route)
      return next
    })
  }

  const update = (route: string, field: string, value: any) => {
    setEdits(prev => ({ ...prev, [route]: { ...prev[route], [field]: value } }))
    setDirtyRoutes(prev => new Set(prev).add(route))
  }

  const hasChanges = (route: string) => {
    const page = pages.find(p => p.route === route)
    if (!page || !edits[route]) return false
    const e = edits[route]
    const orig = page.seo ? {
      title: page.seo.title ?? page.default_title,
      description: page.seo.description ?? page.default_description,
      og_title: page.seo.og_title ?? '',
      og_description: page.seo.og_description ?? '',
      og_image: page.seo.og_image ?? '',
      noindex: page.seo.noindex ?? false,
      canonical_url: page.seo.canonical_url ?? '',
      schema_type: page.seo.schema_type ?? '',
    } : defaultEdit(page)
    return JSON.stringify(e) !== JSON.stringify(orig)
  }

  const bulkMut = useMutation({
    mutationFn: bulkUpdateSeoPages,
    onSuccess: () => {
      toast.success('SEO settings saved')
      qc.invalidateQueries({ queryKey: ['admin', 'seo', 'pages'] })
      setDirtyRoutes(new Set())
    },
    onError: () => toast.error('Failed to save SEO settings'),
  })

  const handleSaveAll = () => {
    const entries = Array.from(dirtyRoutes)
      .filter((r: string) => edits[r])
      .map((route: string) => ({ route, ...edits[route] }))
    if (entries.length === 0) {
      toast('No changes to save')
      return
    }
    bulkMut.mutate(entries)
  }

  const dirtyCount = dirtyRoutes.size
  const hasAnyDirty = dirtyCount > 0

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">SEO Management</h1>
          <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>Manage SEO meta data for all pages</p>
        </div>
        <div className="flex items-center gap-2">
          {hasAnyDirty && (
            <Button onClick={handleSaveAll} loading={bulkMut.isPending} style={{ background: '#09333f' }}>
              <Save size={16} className="mr-1.5" /> Save Changes {dirtyCount > 0 && <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded bg-white/20">{dirtyCount}</span>}
            </Button>
          )}
          <Button variant="outline" onClick={() => qc.invalidateQueries({ queryKey: ['admin', 'seo', 'pages'] })} className="text-gray-400 border-gray-600">
            <RefreshCw size={16} className="mr-1.5" /> Refresh
          </Button>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: '#111820', borderColor: '#1e3040' }}>
        <div className="p-4 border-b flex flex-wrap items-center gap-3" style={{ borderColor: '#1e3040' }}>
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748b' }} />
            <Input placeholder="Search pages..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9', paddingLeft: '2.25rem' }} />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {groups.map(g => (
              <button key={g} onClick={() => setGroupFilter(g)}
                className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  groupFilter === g ? 'text-white' : 'text-gray-500 hover:text-gray-300')}
                style={groupFilter === g ? { background: '#09333f' } : {}}>
                {g === 'all' ? 'All' : g}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y" style={{ borderColor: '#1e3040' }}>
          {isLoading ? (
            <div className="p-8 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 rounded animate-pulse" style={{ background: '#1c2a38' }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12" style={{ color: '#64748b' }}>No pages found</div>
          ) : (
            filtered.map((page) => {
              const isExpanded = expanded.has(page.route)
              const edit = edits[page.route]
              const changed = hasChanges(page.route)

              return (
                <div key={page.route}>
                  <button
                    onClick={() => toggleExpand(page.route)}
                    className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(9,51,63,0.3)' }}>
                      <Globe size={14} style={{ color: '#4a9ea0' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{page.label}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(9,51,63,0.3)', color: '#4a9ea0' }}>{page.group}</span>
                        {changed && <span className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" title="Unsaved changes" />}
                      </div>
                      <p className="text-xs truncate mt-0.5" style={{ color: '#64748b' }}>{page.route}{edit?.title ? ` — ${edit.title}` : ''}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a href={page.route} target="_blank" onClick={e => e.stopPropagation()}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-colors" title="View page">
                        <ExternalLink size={14} />
                      </a>
                      <div className="transition-transform duration-200" style={{ color: '#64748b', transform: isExpanded ? 'rotate(180deg)' : '' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                      </div>
                    </div>
                  </button>

                  {isExpanded && edit && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      className="overflow-hidden border-t" style={{ borderColor: '#1e3040' }}>
                      <div className="px-5 py-4 space-y-4" style={{ background: '#0a0f14' }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>Meta Title</label>
                            <Input value={edit.title} onChange={e => update(page.route, 'title', e.target.value)}
                              placeholder={page.default_title}
                              style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9', fontSize: '13px' }} />
                            <p className="text-[10px] mt-1" style={{ color: '#64748b' }}>Default: {page.default_title}</p>
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>Canonical URL <span className="text-gray-600">(optional)</span></label>
                            <Input value={edit.canonical_url} onChange={e => update(page.route, 'canonical_url', e.target.value)}
                              style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9', fontSize: '13px' }} />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>Meta Description</label>
                          <Textarea value={edit.description} onChange={e => update(page.route, 'description', e.target.value)}
                            rows={2} placeholder={page.default_description}
                            style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9', fontSize: '13px' }} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>OG Title <span className="text-gray-600">(optional)</span></label>
                            <Input value={edit.og_title} onChange={e => update(page.route, 'og_title', e.target.value)}
                              style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9', fontSize: '13px' }} />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>OG Image URL <span className="text-gray-600">(optional)</span></label>
                            <div className="flex gap-2 items-center">
                              <Input value={edit.og_image} onChange={e => update(page.route, 'og_image', e.target.value)}
                                style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9', fontSize: '13px' }} />
                              {edit.og_image && (
                                <div className="w-8 h-8 rounded border overflow-hidden flex-shrink-0" style={{ borderColor: '#1e3040' }}>
                                  <img src={edit.og_image} className="w-full h-full object-cover" onError={e => (e.target as HTMLImageElement).style.display = 'none'} />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>OG Description <span className="text-gray-600">(optional)</span></label>
                          <Textarea value={edit.og_description} onChange={e => update(page.route, 'og_description', e.target.value)}
                            rows={2}
                            style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9', fontSize: '13px' }} />
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <label className="text-xs font-medium" style={{ color: '#94a3b8' }}>Schema Type</label>
                            <select value={edit.schema_type} onChange={e => update(page.route, 'schema_type', e.target.value)}
                              className="rounded-lg px-2 py-1.5 text-xs border" style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }}>
                              <option value="">Inherit from default</option>
                              <option value="WebPage">WebPage</option>
                              <option value="AboutPage">AboutPage</option>
                              <option value="ContactPage">ContactPage</option>
                              <option value="CollectionPage">CollectionPage</option>
                              <option value="Blog">Blog</option>
                              <option value="Article">Article</option>
                              <option value="Product">Product</option>
                              <option value="Movie">Movie</option>
                              <option value="Profile">Profile</option>
                              <option value="ItemPage">ItemPage</option>
                            </select>
                          </div>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <button onClick={() => update(page.route, 'noindex', !edit.noindex)}
                              className={cn('p-1 rounded transition-colors', edit.noindex ? 'text-red-400' : 'text-gray-500')}>
                              {edit.noindex ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            <span className="text-xs font-medium" style={{ color: '#94a3b8' }}>
                              {edit.noindex ? 'No Index (hidden from search)' : 'Index (visible to search)'}
                            </span>
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
