import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Download, FileText, Image, Film, ExternalLink, Copy } from 'lucide-react'
import { toast } from 'react-hot-toast'
import type { PressKit } from '@/types'

interface PressKitCardProps {
  kit: PressKit
  index?: number
}

export const PressKitCard = ({ kit, index = 0 }: PressKitCardProps) => {
  const [copied, setCopied] = useState<string | null>(null)
  const assets = (kit.assets ?? {}) as Record<string, Array<{ url?: string; name?: string; thumbnail_url?: string }>>

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
    toast.success('Copied to clipboard!')
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className='card group overflow-hidden'
    >
      <div className='relative h-48 overflow-hidden'>
        <img src='/storage/films/poster.jpg' alt={kit.title} className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105' />
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />
        <div className='absolute bottom-4 left-4 right-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='font-semibold text-white'>{kit.title}</h3>
              <p className='text-sm text-white/80'>{kit.logline || 'Press kit available'}</p>
            </div>
            <Link to='/press' className='inline-flex items-center gap-2 px-4 py-2 bg-brand-white/90 text-brand-dark rounded-full text-sm font-medium hover:bg-brand-primary hover:text-white transition-colors'>
              <Download className='w-4 h-4' />
              View Kit
            </Link>
          </div>
        </div>
      </div>

      <div className='p-6'>
        <div className='flex flex-wrap gap-2 mb-4'>
          {(assets.posters?.length ?? 0) > 0 && (
            <span className='px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-sm'>
              {assets.posters?.length} Posters
            </span>
          )}
          {(assets.stills?.length ?? 0) > 0 && (
            <span className='px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-sm'>
              {assets.stills?.length} Stills
            </span>
          )}
          {(assets.clips?.length ?? 0) > 0 && (
            <span className='px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-sm'>
              {assets.clips?.length} Clips
            </span>
          )}
        </div>

        <p className='text-brand-muted text-sm leading-relaxed mb-4'>
          {kit.synopsis_short || kit.logline || 'Download press materials for this production.'}
        </p>

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2 text-brand-primary text-sm'>
            <FileText className='w-4 h-4' />
            Press Assets
          </div>
          <Link to='/press' className='block'>
            <button className='btn-secondary text-sm'>Explore</button>
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
