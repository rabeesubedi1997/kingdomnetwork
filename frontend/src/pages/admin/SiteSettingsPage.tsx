import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSiteSettings, updateSiteSettings } from '@/lib/admin-api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from 'react-hot-toast'

export const SiteSettingsPage: React.FC = () => {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'site-settings'],
    queryFn: getSiteSettings,
  })

  const [form, setForm] = useState({
    name: '',
    tagline: '',
    email: '',
    phone: '',
    address: '',
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
  })

  useEffect(() => {
    if (data) {
      setForm({
        name: data.brand?.name || '',
        tagline: data.brand?.tagline || '',
        email: data.brand?.contact?.email || '',
        phone: data.brand?.contact?.phone || '',
        address: data.brand?.contact?.address || '',
        facebook: data.brand?.social?.facebook || '',
        twitter: data.brand?.social?.twitter || '',
        instagram: data.brand?.social?.instagram || '',
        youtube: data.brand?.social?.youtube || '',
      })
    }
  }, [data])

  const mutation = useMutation({
    mutationFn: updateSiteSettings,
    onSuccess: () => {
      toast.success('Settings saved')
      queryClient.invalidateQueries({ queryKey: ['admin', 'site-settings'] })
    },
    onError: () => toast.error('Failed to save settings'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({
      brand: {
        name: form.name,
        tagline: form.tagline,
        contact: {
          email: form.email,
          phone: form.phone,
          address: form.address,
        },
        social: {
          facebook: form.facebook,
          twitter: form.twitter,
          instagram: form.instagram,
          youtube: form.youtube,
        },
      },
    })
  }

  const handleChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }))
  }

  if (isLoading) {
    return <div className="h-40 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-3 border-brand-primary/20 border-t-brand-primary animate-spin" /></div>
  }

  const fields = [
    { key: 'name', label: 'Site Name' },
    { key: 'tagline', label: 'Tagline' },
    { key: 'email', label: 'Contact Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'address', label: 'Address' },
    { key: 'facebook', label: 'Facebook URL' },
    { key: 'twitter', label: 'Twitter URL' },
    { key: 'instagram', label: 'Instagram URL' },
    { key: 'youtube', label: 'YouTube URL' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-brand-text">Site Settings</h1>
        <p className="text-brand-muted text-sm mt-1">Manage your site configuration</p>
      </div>

      <div className="max-w-2xl bg-white rounded-xl border border-brand-surface/50 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(f => (
            <Input
              key={f.key}
              label={f.label}
              value={(form as Record<string, string>)[f.key]}
              onChange={handleChange(f.key)}
            />
          ))}
          <div className="pt-2">
            <Button type="submit" loading={mutation.isPending}>
              Save Settings
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
