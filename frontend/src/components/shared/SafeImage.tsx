import { useState, ImgHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { PlaceholderImage } from './PlaceholderImage'

interface SafeImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null
  placeholderType?: 'film' | 'banner' | 'person' | 'team' | 'partner' | 'gallery'
  placeholderText?: string
  aspectRatio?: string
  wrapperClassName?: string
  className?: string
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
  const hasWrapper = Boolean(aspectRatio || wrapperClassName)

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

  const imgClasses = cn('w-full h-full object-cover', className)

  if (hasWrapper) {
    return (
      <div className={cn('overflow-hidden', wrapperClassName)} style={aspectRatio ? { aspectRatio } : undefined}>
        <img src={src} alt={alt || ''} className={imgClasses} onError={() => setError(true)} {...imgProps} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt || ''}
      className={imgClasses}
      onError={() => setError(true)}
      {...imgProps}
    />
  )
}
