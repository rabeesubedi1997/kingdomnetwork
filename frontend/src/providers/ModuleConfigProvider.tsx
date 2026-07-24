import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface PageSeoEntry {
  id: number | null
  route: string
  title: string | null
  description: string | null
  og_title: string | null
  og_description: string | null
  og_image: string | null
  noindex: boolean
  canonical_url: string | null
  schema_type: string | null
}

interface ModuleConfig {
  modules: Record<string, boolean>
  brand: Record<string, any>
  logo_url: string | null
  favicon_url: string | null
  dark_logo_url: string | null
  footer_logo_url: string | null
  seo: {
    default_title: string
    title_template: string
    default_description: string
    twitter_handle: string
  }
  page_seo: Record<string, PageSeoEntry>
  analytics: {
    ga4_id: string
    gtm_id: string
  }
}

const ModuleConfigContext = createContext<ModuleConfig>({
  modules: {},
  brand: {},
  logo_url: null,
  favicon_url: null,
  dark_logo_url: null,
  footer_logo_url: null,
  seo: {
    default_title: 'Kingdom Network - Redefining Nepali Cinema',
    title_template: '%s | Kingdom Network',
    default_description: '',
    twitter_handle: '@kingdomnetwork',
  },
  page_seo: {},
  analytics: {
    ga4_id: '',
    gtm_id: '',
  },
})

export const ModuleConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<ModuleConfig>({
    modules: {},
    brand: {},
    logo_url: null,
    favicon_url: null,
    dark_logo_url: null,
    footer_logo_url: null,
    seo: {
      default_title: 'Kingdom Network - Redefining Nepali Cinema',
      title_template: '%s | Kingdom Network',
      default_description: '',
      twitter_handle: '@kingdomnetwork',
    },
    page_seo: {},
    analytics: {
      ga4_id: '',
      gtm_id: '',
    },
  })

  useEffect(() => {
    fetch('/api/v1/site')
      .then((res) => res.json())
      .then((data) => {
        if (data.modules || data.brand) {
          setConfig({
            modules: { ...data.modules },
            brand: { ...data.brand },
logo_url: data.logo_url || null,
          favicon_url: data.favicon_url || null,
          dark_logo_url: data.logo_dark_url || null,
          footer_logo_url: data.footer_logo_url || null,
    seo: data.seo || {
      default_title: 'Kingdom Network - Redefining Nepali Cinema',
      title_template: '%s | Kingdom Network',
      default_description: '',
      twitter_handle: '@kingdomnetwork',
    },
    page_seo: data.page_seo || {},
    analytics: data.analytics || { ga4_id: '', gtm_id: '' },
          })
        }
      })
      .catch(() => {
        setConfig({
          modules: {
            core: true,
            films: true,
            news: true,
            careers: true,
            gallery: true,
            press_kit: true,
            newsletter: true,
            shop: false,
            membership: false,
            events: false,
            podcasts: false,
            tv: false,
            comics: false,
            screening: false,
            investors: false,
            seo_sitemap: true,
            awards: true,
            people: true,
            search: true,
          },
          brand: {
            name: 'Kingdom Network',
            tagline: 'Redefining Nepali Cinema',
            colors: {
              primary: '#09333f',
              secondary: '#516f78',
              accent: '#7fa0a1',
              gold: '#ffcd57',
              dark: '#08313c',
              surface: '#f9f6fe',
              white: '#ffffff',
              text: '#1e293b',
              muted: '#67768e',
            },
            fonts: {
              sans: 'Inter',
              display: 'Plus Jakarta Sans',
            },
          },
          logo_url: null,
          favicon_url: null,
          dark_logo_url: null,
          footer_logo_url: null,
          seo: {
            default_title: 'Kingdom Network - Redefining Nepali Cinema',
            title_template: '%s | Kingdom Network',
            default_description: '',
            twitter_handle: '@kingdomnetwork',
          },
          page_seo: {},
          analytics: { ga4_id: '', gtm_id: '' },
        })
      })
  }, [])

  return (
    <ModuleConfigContext.Provider value={config}>
      {children}
    </ModuleConfigContext.Provider>
  )
}

export const useModuleConfig = () => useContext(ModuleConfigContext)