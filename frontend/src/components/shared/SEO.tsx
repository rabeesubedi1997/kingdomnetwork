interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'movie' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  jsonLd?: object
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags,
  twitterCard = 'summary_large_image',
  jsonLd,
}) => {
  const siteName = 'Kingdom Network'
  const defaultTitle = 'Kingdom Network - Redefining Nepali Cinema'
  const defaultDescription = 'Kingdom Network is a leading film production company in Nepal, creating world-class movies that blend authentic local storytelling with global filmmaking collaborations.'
  const defaultImage = '/storage/seo/default-og.jpg'
  const siteUrl = 'https://kingdomnetwork.com.np'

  const fullTitle = title ? `${title} | ${siteName}` : defaultTitle
  const fullDescription = description || defaultDescription
  const fullImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : `${siteUrl}${defaultImage}`
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl

  // JSON-LD structured data
  const structuredData = jsonLd || (type === 'movie' ? {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: title,
    description: fullDescription,
    image: fullImage,
    url: fullUrl,
  } : type === 'article' ? {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description: fullDescription,
    image: fullImage,
    url: fullUrl,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    author: author ? { '@type': 'Person', name: author } : undefined,
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/storage/logos/logo-light.png` },
    },
  } : {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  })

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="theme-color" content="#09333f" />

      {/* Open Graph */}
      <meta property="og:type" content={type === 'movie' ? 'video.movie' : type === 'article' ? 'article' : 'website'} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title || siteName} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      {section && <meta property="article:section" content={section} />}
      {tags?.map(tag => <meta key={tag} property="article:tag" content={tag} />)}
      {type === 'movie' && <meta property="og:video:release_date" content={publishedTime} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content="@kingdomnetwork" />
      <meta name="twitter:creator" content="@kingdomnetwork" />
      <meta name="twitter:title" content={title || siteName} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={title || siteName} />

      {/* Additional Meta */}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={fullUrl} />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  )
}

export const MovieSchema: React.FC<{ film: any }> = ({ film }) => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: film.title,
    description: film.short_description || film.synopsis,
    image: film.banner_url || film.poster_url,
    datePublished: film.release_date,
    duration: film.runtime_minutes ? `PT${film.runtime_minutes}M` : undefined,
    contentRating: film.rating,
    genre: film.genres?.map((g: any) => g.name),
    director: film.director ? { '@type': 'Person', name: film.director.name } : undefined,
    producer: film.producer ? { '@type': 'Person', name: film.producer.name } : undefined,
    actor: film.cast?.filter((c: any) => c.is_lead).map((c: any) => ({ '@type': 'Person', name: c.person.name, characterName: c.role_name })),
    productionCompany: { '@type': 'Organization', name: 'Kingdom Network', url: 'https://kingdomnetwork.com.np' },
    trailer: film.trailer_embed_url ? { '@type': 'VideoObject', embedUrl: film.trailer_embed_url } : undefined,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export const ArticleSchema: React.FC<{ post: any }> = ({ post }) => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.excerpt,
    image: post.featured_image?.url,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: post.author ? { '@type': 'Person', name: post.author.name } : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Kingdom Network',
      logo: { '@type': 'ImageObject', url: 'https://kingdomnetwork.com.np/storage/logos/logo-light.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://kingdomnetwork.com.np/news/${post.slug}` },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export const OrganizationSchema: React.FC = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Kingdom Network',
    url: 'https://kingdomnetwork.com.np',
    logo: 'https://kingdomnetwork.com.np/storage/logos/logo-light.png',
    sameAs: [
      'https://www.facebook.com/Kingdomntwork',
      'https://instagram.com/kingdomnetwork',
      'https://twitter.com/kingdomnetwork',
      'https://youtube.com/@kingdomnetwork',
      'https://linkedin.com/company/kingdomnetwork',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+977-1-1234567',
      contactType: 'customer service',
      availableLanguage: ['English', 'Nepali'],
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kathmandu',
      addressCountry: 'NP',
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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Kingdom Network',
    url: 'https://kingdomnetwork.com.np',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: 'https://kingdomnetwork.com.np/search?q={search_term_string}' },
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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}