import { useQuery } from '@tanstack/react-query'
import { getAdvertisementsByPosition } from '@/lib/public-api'
import { cn } from '@/lib/utils'

interface AdvertisementDisplayProps {
  position: string
  className?: string
}

export const AdvertisementDisplay: React.FC<AdvertisementDisplayProps> = ({ position, className }) => {
  const { data: ads } = useQuery({
    queryKey: ['ads', position],
    queryFn: () => getAdvertisementsByPosition(position),
    staleTime: 120000,
  })

  if (!ads?.length) return null

  return (
    <div className={cn('space-y-3', className)}>
      {ads.map((ad: any) => (
        <div key={ad.id} className="rounded-lg overflow-hidden">
          {ad.type === 'code' ? (
            <div dangerouslySetInnerHTML={{ __html: ad.code }} />
          ) : ad.image_url ? (
            <a href={ad.link_url || '#'} target="_blank" rel="noopener noreferrer">
              <img src={ad.image_url} alt={ad.title || 'Advertisement'} className="w-full h-auto object-cover" />
            </a>
          ) : null}
        </div>
      ))}
    </div>
  )
}
