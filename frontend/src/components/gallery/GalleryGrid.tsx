import { Album } from '@/types'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Image, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

interface GalleryGridProps {
  albums: Album[]
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ albums }) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {albums.map((album, index) => (
        <motion.article
          key={album.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}
        >
          <Link
            to={'/gallery/' + album.slug}
            className='card group overflow-hidden'
            aria-label={'View ' + album.title + ' album'}
          >
            <div className='relative aspect-[4/3] overflow-hidden'>
              {album.cover_url ? (
                <img
                  src={album.cover_url}
                  alt={album.title}
                  className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                  loading='lazy'
                />
              ) : (
                <div className='w-full h-full bg-brand-primary/10 flex items-center justify-center'>
                  <Image className='w-12 h-12 text-brand-primary/50' />
                </div>
              )}
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
              <div className='absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300'>
                <span className='inline-flex items-center gap-2 px-3 py-1.5 bg-brand-white/90 text-brand-dark rounded-full text-sm font-medium'>
                  <Maximize2 className='w-4 h-4' />
                  View Album
                </span>
              </div>
            </div>
            <div className='p-4'>
              <span className='inline-block px-2 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-medium mb-2'>
                {album.category.replace('_', ' ')}
              </span>
              <h3 className='font-semibold text-brand-primary mb-1 group-hover:text-brand-secondary transition-colors'>
                {album.title}
              </h3>
              {album.description && (
                <p className='text-brand-muted text-sm line-clamp-2'>{album.description}</p>
              )}
              <p className='text-brand-muted text-xs mt-2'>
                {album.images?.length || 0} images
                {album.film && ' \u00B7 ' + album.film.title}
              </p>
            </div>
          </Link>
        </motion.article>
      ))}
    </div>
  )
}