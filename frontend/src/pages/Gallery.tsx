import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import { Image } from 'lucide-react'
import { Section, Container } from '@/components/layout/Section'
import { GalleryGrid } from '@/components/gallery/GalleryGrid'
import { AlbumViewer } from '@/components/gallery/AlbumViewer'
import { useGallery, useAlbum } from '@/hooks/useData'
import { Loading, GridSkeleton } from '@/components/ui/Loading'
import { SEOHead } from '@/components/seo/SEOHead'

export const Gallery = () => {
  const { data: albums, isLoading } = useGallery({ per_page: 20 })

  return (
    <>
      <SEOHead title="Gallery" description="Photo & Video Gallery" />
      <Section id="gallery-hero" background="dark" padding="2xl" className="relative overflow-hidden">
        <Container>
          <div className='mx-auto max-w-3xl text-center'>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='inline-flex items-center gap-2 bg-brand-white/10 px-4 py-2 rounded-full text-brand-gold text-sm font-medium mb-6'>
              <Image className='w-4 h-4' />
              Behind the Scenes
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className='heading-1 text-brand-white mb-4'>
              Gallery & Archives
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='text-brand-white/70 text-lg max-w-2xl mx-auto'>
              Explore behind-the-scenes moments, production stills, poster art, and exclusive content from our film productions.
            </motion.p>
          </div>
        </Container>
      </Section>

      <Section id="albums" padding="2xl">
        <Container>
          <div className="section-divider mb-5" />
          {isLoading ? (
            <GridSkeleton count={6} />
          ) : albums && albums.length > 0 ? (
            <GalleryGrid albums={albums} />
          ) : (
            <div className='py-12 text-center'>
              <p className='text-brand-muted'>No albums available yet. Check back soon!</p>
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}

export const AlbumDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data: album, isLoading } = useAlbum(slug!)

  if (isLoading) {
    return <Section padding="2xl"><Container><Loading text="Loading album..." /></Container></Section>
  }

  if (!album) {
    return (
      <Section padding="2xl">
        <Container>
          <div className='max-w-2xl mx-auto text-center'>
            <h1 className='heading-2 text-brand-primary mb-4'>Album Not Found</h1>
            <Link to='/gallery' className='btn-primary'>Back to Gallery</Link>
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <>
      <SEOHead title={album.title} description={album.description || 'Photo & Video Gallery'} />
      <AlbumViewer album={album} />
    </>
  )
}
