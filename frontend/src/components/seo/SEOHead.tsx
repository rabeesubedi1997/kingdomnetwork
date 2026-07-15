import { Helmet } from 'react-helmet-async'

interface SEOHeadProps {
  title: string
  description?: string
  ogImage?: string
  ogType?: string
  schemaType?: string
}

const siteName = 'Kingdom Network'

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  ogImage,
  ogType = 'website',
  schemaType = 'WebPage',
}) => {
  const fullTitle = `${title} | ${siteName}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={ogType} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      <script type="application/ld+json">{JSON.stringify({
        '@context': 'https://schema.org',
        '@type': schemaType,
        name: fullTitle,
        description,
        image: ogImage,
      })}</script>
    </Helmet>
  )
}
