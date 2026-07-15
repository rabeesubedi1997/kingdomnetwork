import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSiteSettings, updateSiteSettings } from '@/lib/admin-api'
import { motion } from 'framer-motion'
import { Save, Settings, Palette, Globe, Share2 } from 'lucide-react'
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
    { id: 'brand', label: 'Brand', icon: Palette },
    { id: 'contact', label: 'Contact', icon: Globe },
    { id: 'social', label: 'Social', icon: Share2 },
  ]

  const handleSave = () => updateMut.mutate(form)
  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-bold text-white">Site Settings</h1><p className="text-sm mt-1" style={{ color: '#94a3b8' }}>Manage your site configuration</p></div>
        <Button onClick={handleSave} loading={updateMut.isPending} style={{ background: '#09333f' }}><Save size={16} className="mr-1.5" /> Save Changes</Button>
      </div>

      <div className="rounded-xl border" style={{ background: '#111820', borderColor: '#1e3040' }}>
        <div className="border-b" style={{ borderColor: '#1e3040' }}>
          <div className="flex">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={cn('flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id ? 'border-[#ffcd57] text-[#ffcd57]' : 'border-transparent text-gray-500 hover:text-gray-300')}>
                <tab.icon size={16} />{tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="p-5 space-y-4">
          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-10 rounded animate-pulse" style={{ background: '#1c2a38' }} />)}</div>
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
          {!isLoading && (groups[activeTab] || []).length === 0 && (
            <p className="text-center py-8" style={{ color: '#64748b' }}>No settings in this group</p>
          )}
        </div>
      </div>
    </div>
  )
}
