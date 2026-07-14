import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Section, Container } from '@/components/layout/Section'
import { Button } from '@/components/ui/Button'
import { Home, Search, Film, ArrowLeft } from 'lucide-react'

export const NotFound: React.FC = () => {
  return (
    <Section id='not-found' padding='xl' className='min-h-[calc(100vh-200px)] flex items-center justify-center px-4'>
      <Container>
        <div className='max-w-md mx-auto text-center'>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className='mb-8'
          >
            <div className='w-24 h-24 mx-auto mb-6 bg-brand-primary/10 rounded-2xl flex items-center justify-center'>
              <Film className='w-12 h-12 text-brand-primary' />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-6xl md:text-8xl font-display font-bold text-brand-primary mb-4'
          >
            404
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='heading-2 text-brand-primary mb-4'
          >
            Scene Not Found
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='text-brand-muted text-lg mb-8 max-w-sm mx-auto'
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
            className='mt-12 pt-8 border-t border-brand-surface/50'
          >
            <p className='text-brand-muted text-sm mb-4'>Or search for what you need:</p>
            <form action='/films' method='GET' className='flex gap-2 max-w-sm mx-auto'>
              <input
                type='search'
                name='search'
                placeholder='Search films...'
                className='flex-1 px-4 py-2.5 rounded-lg border border-brand-surface/50 bg-brand-surface/50 text-brand-text placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-primary'
                aria-label='Search films'
              />
              <button type='submit' className='p-2.5 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors' aria-label='Search'>
                <Search className='w-5 h-5' />
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className='mt-8 flex items-center justify-center gap-6 text-brand-muted/50'
          >
            <span className='text-xs'>Kingdom Network</span>
            <span className='w-4 h-4'>·</span>
            <span className='text-xs'>Redefining Nepali Cinema</span>
          </motion.div>
        </div>
      </Container>
    </Section>
  )
}

