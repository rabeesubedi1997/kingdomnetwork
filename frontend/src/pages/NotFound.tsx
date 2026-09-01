import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Section, Container } from '@/components/layout/Section'
import { Button } from '@/components/ui/Button'
import { SEOHead } from '@/components/seo/SEOHead'
import { SearchOverlay } from '@/components/search/SearchOverlay'
import { Home, Search, Film } from 'lucide-react'
import { heroChild } from '@/lib/motion'

export const NotFound: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <SEOHead title="Page Not Found" description="The page you are looking for does not exist or has been moved." noTemplate />
      <Section id='not-found' padding='xl' className='min-h-[calc(100vh-200px)] flex items-center justify-center px-4'>
      <Container>
        <div className='max-w-md mx-auto text-center'>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className='mb-5'
          >
            <div className='w-24 h-24 mx-auto mb-6 bg-brand-primary/10 rounded-2xl flex items-center justify-center'>
              <Film className='w-12 h-12 text-brand-primary dark:text-brand-white' />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-6xl md:text-8xl font-display font-bold text-brand-primary dark:text-brand-white mb-4 tracking-tight'
          >
            404
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={heroChild(0.1)}
            className='heading-2 text-brand-primary dark:text-brand-white mb-4'
          >
            Scene Not Found
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='text-brand-muted dark:text-brand-white/60 text-lg mb-5 max-w-sm mx-auto'
          >
            The page you're looking for doesn't exist or has been moved.
            Maybe it's in post-production?
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className='flex flex-col sm:flex-row gap-4 justify-center'
          >
            <Link to='/'>
              <Button size='lg'>
                <Home className='w-5 h-5 mr-2' />
                Back to Home
              </Button>
            </Link>
            <Link to='/films'>
              <Button variant='secondary' size='lg'>
                <Film className='w-5 h-5 mr-2' />
                Browse Films
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className='mt-8 pt-8 border-t border-brand-surface/50'
          >
            <p className='text-brand-muted dark:text-brand-white/60 text-sm mb-4'>Or search for what you need:</p>
            <button
              type='button'
              onClick={() => setSearchOpen(true)}
              className='flex items-center gap-2 mx-auto px-4 py-2.5 rounded-lg border border-brand-surface/50 bg-brand-surface/50 text-brand-muted dark:text-brand-white/60 hover:text-brand-primary dark:hover:text-brand-white hover:border-brand-primary/30 transition-colors max-w-sm w-full justify-center'
            >
              <Search className='w-4 h-4' />
              Search films, news, people…
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className='mt-8 flex items-center justify-center gap-6 text-brand-muted/50 dark:text-brand-white/30'
          >
            <span className='text-xs'>Kingdom Network</span>
            <span className='w-4 h-4'>·</span>
            <span className='text-xs'>Redefining Nepali Cinema</span>
          </motion.div>
        </div>
      </Container>
    </Section>
    <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

