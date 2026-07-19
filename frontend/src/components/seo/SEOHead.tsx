import { Helmet } from 'react-helmet-async'
import { useModuleConfig } from '@/providers/ModuleConfigProvider'

interface SEOHeadProps {
  title: string
  description?: string
  ogImage?: string
  ogType?: string
  schemaType?: string
  noTemplate?: boolean
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  ogImage,
  ogType = 'website',
  schemaType = 'WebPage',
  noTemplate = false,
}) => {
  const { seo, favicon_url } = useModuleConfig()

  const fullTitle = noTemplate ? title : (seo.title_template || '%s | Kingdom Network').replace('%s', title)
  const metaDescription = description || seo.default_description || ''

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {metaDescription && <meta name="description" content={metaDescription} />}
      <meta property="og:title" content={fullTitle} />
      {metaDescription && <meta property="og:description" content={metaDescription} />}
      <meta property="og:type" content={ogType} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {metaDescription && <meta name="twitter:description" content={metaDescription} />}
      {seo.twitter_handle && <meta name="twitter:site" content={seo.twitter_handle} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      {favicon_url && <link rel="icon" type="image/svg+xml" href={favicon_url} />}
      <script type="application/ld+json">{JSON.stringify({
        '@context': 'https://schema.org',
        '@type': schemaType,
        name: fullTitle,
        description: metaDescription,
        image: ogImage,
      })}</script>
    </Helmet>
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