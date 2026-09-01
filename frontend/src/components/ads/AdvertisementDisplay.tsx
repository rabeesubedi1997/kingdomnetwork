import { useQuery } from '@tanstack/react-query'
import { getAdvertisementsByPosition } from '@/lib/public-api'
import { cn } from '@/lib/utils'
import { SafeImage } from '@/components/shared/SafeImage'
import { sanitizeHtml } from '@/lib/sanitize'

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
        <div key={ad.id} className="rounded-lg overflow-hidden border border-brand-surface/50 dark:border-white/10">
          <span className="block px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-brand-muted bg-brand-surface/60 dark:bg-white/5">
            Advertisement
          </span>
          {ad.type === 'code' ? (
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(ad.code) }} />
          ) : ad.image_url ? (
            <a href={ad.link_url || '#'} target="_blank" rel="noopener noreferrer">
              <SafeImage src={ad.image_url} alt={ad.title || 'Advertisement'} placeholderType='gallery' className="w-full h-auto object-cover" />
            </a>
          ) : null}
        </div>
      ))}
    </div>
  )
}
