import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSiteSettings, updateSiteSettings, uploadSiteLogo } from '@/lib/admin-api'
import { motion } from 'framer-motion'
import { Save, Settings, Palette, Globe, Share2, Search, Upload, Image, X, Eye, EyeOff, Monitor, Sun } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

export const SiteSettingsPage: React.FC = () => {
  const qc = useQueryClient()
  const [form, setForm] = useState<Record<string, string>>({})
  const [loaded, setLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  const logoInputRef = useRef<HTMLInputElement>(null)
  const faviconInputRef = useRef<HTMLInputElement>(null)
  const darkLogoInputRef = useRef<HTMLInputElement>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'site-settings'],
    queryFn: async () => {
      const res = await getSiteSettings()
      const settings = res.data || res
      const kv: Record<string, string> = {}
      settings.forEach((s: any) => { kv[s.key] = s.value || '' })
      if (!loaded) { setForm(kv); setLoaded(true) }
      return settings
    },
  })

  const updateMut = useMutation({
    mutationFn: updateSiteSettings,
    onSuccess: () => { toast.success('Settings saved'); qc.invalidateQueries({ queryKey: ['admin', 'site-settings'] }) },
    onError: () => toast.error('Failed to save'),
  })

  const logoMut = useMutation({
    mutationFn: ({ file, type }: { file: File; type: 'logo' | 'favicon' | 'dark_logo' }) => uploadSiteLogo(file, type),
    onSuccess: (data: any) => { toast.success(data.message || 'Uploaded'); qc.invalidateQueries({ queryKey: ['admin', 'site-settings'] }) },
    onError: () => toast.error('Upload failed'),
  })

  const settings = data?.data || data || []

  const groups: Record<string, { key: string; label: string; type?: string }[]> = {
    general: [
      { key: 'site_name', label: 'Site Name' },
      { key: 'site_tagline', label: 'Tagline' },
      { key: 'site_description', label: 'Description', type: 'textarea' },
    ],
    brand: [
      { key: 'brand_primary_color', label: 'Primary Color' },
      { key: 'brand_secondary_color', label: 'Secondary Color' },
      { key: 'brand_accent_color', label: 'Accent Color' },
      { key: 'brand_gold_color', label: 'Gold Color' },
    ],
    seo: [
      { key: 'seo_default_title', label: 'Default Page Title' },
      { key: 'seo_title_template', label: 'Title Template (use %s for page name)' },
      { key: 'seo_default_description', label: 'Default Description', type: 'textarea' },
      { key: 'seo_twitter_handle', label: 'Twitter Handle' },
    ],
    analytics: [
      { key: 'analytics_ga4_id', label: 'Google Analytics 4 ID (G-XXXXXXXXXX)' },
      { key: 'analytics_gtm_id', label: 'Google Tag Manager ID (GTM-XXXXXXX)' },
    ],
    contact: [
      { key: 'contact_address', label: 'Address' },
      { key: 'contact_phone', label: 'Phone' },
      { key: 'contact_email', label: 'Email' },
    ],
    social: [
      { key: 'social_facebook', label: 'Facebook URL' },
      { key: 'social_instagram', label: 'Instagram URL' },
      { key: 'social_twitter', label: 'Twitter URL' },
      { key: 'social_youtube', label: 'YouTube URL' },
      { key: 'social_linkedin', label: 'LinkedIn URL' },
    ],
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'brand', label: 'Brand & Logo', icon: Palette },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'analytics', label: 'Analytics', icon: Share2 },
    { id: 'contact', label: 'Contact', icon: Globe },
    { id: 'social', label: 'Social', icon: Share2 },
  ]

  const handleSave = () => updateMut.mutate(form)
  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }))

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon' | 'dark_logo') => {
    const file = e.target.files?.[0]
    if (file) logoMut.mutate({ file, type })
  }

  const logoUrl = form['logo_url']
  const faviconUrl = form['favicon_url']
  const darkLogoUrl = form['dark_logo_url']

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-white">Site Settings</h1><p className="text-sm mt-1" style={{ color: '#94a3b8' }}>Manage your site configuration</p></div>
        <Button onClick={handleSave} loading={updateMut.isPending} style={{ background: '#09333f' }}><Save size={16} className="mr-1.5" /> Save Changes</Button>
      </div>

      <div className="rounded-xl border" style={{ background: '#111820', borderColor: '#1e3040' }}>
        <div className="border-b" style={{ borderColor: '#1e3040' }}>
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={cn('flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  activeTab === tab.id ? 'border-[#ffcd57] text-[#ffcd57]' : 'border-transparent text-gray-500 hover:text-gray-300')}>
                <tab.icon size={16} />{tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="p-5 space-y-4">
          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-10 rounded animate-pulse" style={{ background: '#1c2a38' }} />)}</div>
          ) : activeTab === 'brand' ? (
            <>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="rounded-xl border p-5" style={{ background: '#1c2a38', borderColor: '#1e3040' }}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Image size={16} /> Light Logo (Default)</h3>
                    </div>
                    {logoUrl && (
                      <div className="mb-3 relative inline-block">
                        <img src={logoUrl} alt="Logo" className="h-20 rounded-lg border" style={{ borderColor: '#1e3040' }} />
                        <span className="absolute -top-2 -right-2 text-xs bg-brand-primary/80 text-white px-1.5 py-0.5 rounded">Active</span>
                      </div>
                    )}
                    <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleLogoUpload(e, 'logo')} />
                    <Button variant="outline" size="sm" onClick={() => logoInputRef.current?.click()} loading={logoMut.isPending && logoMut.variables?.type === 'logo'}>
                      <Upload size={14} className="mr-1.5" /> {logoUrl ? 'Replace' : 'Upload'} Light Logo
                    </Button>
                  </div>
                  <div className="rounded-xl border p-5" style={{ background: '#1c2a38', borderColor: '#1e3040' }}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Monitor size={16} className="text-purple-400" /> Dark Mode Logo</h3>
                    </div>
                    {darkLogoUrl && (
                      <div className="mb-3 relative inline-block">
                        <img src={darkLogoUrl} alt="Dark Logo" className="h-20 rounded-lg border" style={{ borderColor: '#1e3040' }} />
                        <span className="absolute -top-2 -right-2 text-xs bg-brand-primary/80 text-white px-1.5 py-0.5 rounded">Active</span>
                      </div>
                    )}
                    <input ref={darkLogoInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleLogoUpload(e, 'dark_logo')} />
                    <Button variant="outline" size="sm" onClick={() => darkLogoInputRef.current?.click()} loading={logoMut.isPending && logoMut.variables?.type === 'dark_logo'}>
                      <Upload size={14} className="mr-1.5" /> {darkLogoUrl ? 'Replace' : 'Upload'} Dark Logo
                    </Button>
                    <p className="text-xs text-brand-muted mt-2">Optional: Upload a light-colored logo for dark mode. If not provided, the light logo will be used with CSS filter.</p>
                  </div>
                  <div className="rounded-xl border p-5" style={{ background: '#1c2a38', borderColor: '#1e3040' }}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Image size={16} /> Favicon</h3>
                    </div>
                    {faviconUrl && (
                      <div className="mb-3 relative inline-block">
                        <img src={faviconUrl} alt="Favicon" className="h-10 w-10 rounded border" style={{ borderColor: '#1e3040' }} />
                      </div>
                    )}
                    <input ref={faviconInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleLogoUpload(e, 'favicon')} />
                    <Button variant="outline" size="sm" onClick={() => faviconInputRef.current?.click()} loading={logoMut.isPending && logoMut.variables?.type === 'favicon'}>
                      <Upload size={14} className="mr-1.5" /> {faviconUrl ? 'Replace' : 'Upload'} Favicon
                    </Button>
                  </div>
                </div>

                <div className="rounded-xl border p-5" style={{ background: '#1c2a38', borderColor: '#1e3040' }}>
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Sun size={16} className="text-yellow-400" /> Brand Colors</h3>
                  <div className="space-y-4">
                    {(groups[activeTab] || []).map(field => (
                      <div key={field.key}>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>{field.label}</label>
                        <Input value={form[field.key] || ''} onChange={e => update(field.key, e.target.value)} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            (groups[activeTab] || []).map(field => (
              <div key={field.key}>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#cbd5e1' }}>{field.label}</label>
                {field.type === 'textarea' ? (
                  <Textarea value={form[field.key] || ''} onChange={e => update(field.key, e.target.value)} rows={3} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} />
                ) : (
                  <Input value={form[field.key] || ''} onChange={e => update(field.key, e.target.value)} style={{ background: '#1c2a38', borderColor: '#1e3040', color: '#f1f5f9' }} />
                )}
              </div>
            ))
          )}
          {!isLoading && activeTab !== 'brand' && (groups[activeTab] || []).length === 0 && (
            <p className="text-center py-8" style={{ color: '#64748b' }}>No settings in this group</p>
          )}
        </div>
      </div>
    </div>
  )
}