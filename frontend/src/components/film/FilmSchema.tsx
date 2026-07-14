import { Film } from '@/types'

interface FilmSchemaProps {
  film: Film
}

export const FilmSchema: React.FC<FilmSchemaProps> = ({ film }) => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: film.title,
    description: film.short_description || film.synopsis,
    image: film.banner_url || film.poster_url,
    datePublished: film.release_date,
    duration: film.runtime_minutes ? 'PT' + film.runtime_minutes + 'M' : undefined,
    contentRating: film.rating,
    genre: film.genres?.map(g => g.name),
    director: film.director ? { '@type': 'Person', name: film.director.name } : undefined,
    producer: film.producer ? { '@type': 'Person', name: film.producer.name } : undefined,
    actor: film.cast?.filter(c => c.is_lead).map(c => ({
      '@type': 'Person',
      name: c.person.name,
      characterName: c.role_name,
    })),
    productionCompany: { '@type': 'Organization', name: 'Kingdom Network', url: 'https://kingdomnetwork.com.np' },
    trailer: film.trailer_embed_url ? {
      '@type': 'VideoObject',
      embedUrl: film.trailer_embed_url,
    } : undefined,
  }

  // Remove undefined values
  const cleanJsonLd = Object.fromEntries(
    Object.entries(jsonLd).filter(([, value]) => value !== undefined)
  )

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanJsonLd) }}
    />
  )
}