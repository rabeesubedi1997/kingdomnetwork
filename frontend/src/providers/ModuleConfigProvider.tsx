import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface ModuleConfig {
  modules: Record<string, boolean>
  brand: Record<string, any>
}

const ModuleConfigContext = createContext<ModuleConfig>({
  modules: {},
  brand: {},
})

export const ModuleConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<ModuleConfig>({
    modules: {},
    brand: {},
  })

  useEffect(() => {
    fetch('/api/v1/site')
      .then((res) => res.json())
      .then((data) => {
        if (data.modules || data.brand) {
          setConfig({
            modules: { ...data.modules },
            brand: { ...data.brand },
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
