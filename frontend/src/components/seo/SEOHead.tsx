import { Helmet } from 'react-helmet-async'
import { useModuleConfig } from '@/providers/ModuleConfigProvider'
import { useLocation } from 'react-router-dom'

interface SEOHeadProps {
  title: string
  description?: string
  ogImage?: string
  ogType?: string
  schemaType?: string
  noTemplate?: boolean
  canonicalUrl?: string
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
  jsonLd?: object
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  ogImage,
  ogType = 'website',
  schemaType = 'WebPage',
  noTemplate = false,
  canonicalUrl,
  publishedTime,
  modifiedTime,
  author,
  section,
  tags,
  jsonLd,
}) => {
  const { seo, favicon_url } = useModuleConfig()
  const location = useLocation()

  const fullTitle = noTemplate ? title : (seo.title_template || '%s | Kingdom Network').replace('%s', title)
  const metaDescription = description || seo.default_description || ''
  const canonical = canonicalUrl || (typeof window !== 'undefined' ? window.location.origin + location.pathname : '')

  const ogTypeMap: Record<string, string> = {
    website: 'website',
    article: 'article',
    movie: 'video.movie',
    profile: 'profile',
  }

  const mappedOgType = ogTypeMap[ogType] || ogType

  const defaultSchema = jsonLd || (() => {
    if (schemaType === 'Movie') return null
    if (schemaType === 'NewsArticle') return null
    return {
      '@context': 'https://schema.org',
      '@type': schemaType,
      name: fullTitle,
      description: metaDescription,
      image: ogImage,
    }
  })()

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {metaDescription && <meta name="description" content={metaDescription} />}
      <meta name="theme-color" content="#09333f" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={fullTitle} />
      {metaDescription && <meta property="og:description" content={metaDescription} />}
      <meta property="og:type" content={mappedOgType} />
      <meta property="og:url" content={canonical} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogImage && <meta property="og:image:width" content="1200" />}
      {ogImage && <meta property="og:image:height" content="630" />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {metaDescription && <meta name="twitter:description" content={metaDescription} />}
      {seo.twitter_handle && <meta name="twitter:site" content={seo.twitter_handle} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      {section && <meta property="article:section" content={section} />}
      {tags?.map(tag => <meta key={tag} property="article:tag" content={tag} />)}

      <link rel="icon" href={favicon_url || '/favicon.svg'} />

      {defaultSchema && (
        <script type="application/ld+json">{JSON.stringify(defaultSchema)}</script>
      )}
    </Helmet>
  )
}

export const OrganizationSchema: React.FC = () => {
  const { brand } = useModuleConfig()
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://kingdomnetwork.com.np'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand.name || 'Kingdom Network',
    url: siteUrl,
    logo: `${siteUrl}/storage/logos/logo-light.png`,
    sameAs: [
      brand.social_facebook && `https://facebook.com/${brand.social_facebook}`,
      brand.social_instagram && `https://instagram.com/${brand.social_instagram}`,
      brand.social_twitter && `https://twitter.com/${brand.social_twitter}`,
      brand.social_youtube && `https://youtube.com/@${brand.social_youtube}`,
      brand.social_linkedin && `https://linkedin.com/company/${brand.social_linkedin}`,
    ].filter(Boolean),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: brand.contact_phone || '+977-1-1234567',
      contactType: 'customer service',
      availableLanguage: ['English', 'Nepali'],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export const WebSiteSchema: React.FC = () => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://kingdomnetwork.com.np'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Kingdom Network',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export const BreadcrumbSchema: React.FC<{ items: { name: string; url: string }[] }> = ({ items }) => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://kingdomnetwork.com.np'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export const AnalyticsScripts: React.FC = () => {
  const { analytics } = useModuleConfig()

  return (
    <Helmet>
      {analytics.ga4_id && (
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${analytics.ga4_id}`} />
      )}
      {analytics.ga4_id && (
        <script>{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${analytics.ga4_id}');
        `}</script>
      )}
      {analytics.gtm_id && (
        <script>{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${analytics.gtm_id}');
        `}</script>
      )}
    </Helmet>
  )
}
