import { useState, ImgHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { PlaceholderImage } from './PlaceholderImage'

interface SafeImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null
  placeholderType?: 'film' | 'banner' | 'person' | 'team' | 'partner' | 'gallery'
  placeholderText?: string
  aspectRatio?: string
  wrapperClassName?: string
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  placeholderType = 'film',
  placeholderText,
  aspectRatio,
  wrapperClassName,
  className,
  ...imgProps
}) => {
  const [error, setError] = useState(false)

  if (!src || error) {
    return (
      <PlaceholderImage
        type={placeholderType}
        text={placeholderText || alt}
        className={cn('w-full h-full', className)}
        aspectRatio={aspectRatio}
      />
    )
  }

  return (
    <div className={cn('overflow-hidden', wrapperClassName)} style={aspectRatio ? { aspectRatio } : undefined}>
      <img
        src={src}
        alt={alt || ''}
        className={cn('w-full h-full object-cover', className)}
        onError={() => setError(true)}
        {...imgProps}
      />
    </div>
  )
}
