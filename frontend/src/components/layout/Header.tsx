import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useModuleConfig } from '@/providers/ModuleConfigProvider'

const navigation = [
  { name: 'Home', href: '/', module: 'core' },
  { name: 'Films', href: '/films', module: 'films' },
  { name: 'About', href: '/about', module: 'core' },
  { name: 'News', href: '/news', module: 'news' },
  { name: 'Gallery', href: '/gallery', module: 'gallery' },
  { name: 'Press', href: '/press', module: 'press_kit' },
  { name: 'Careers', href: '/careers', module: 'careers' },
  { name: 'Contact', href: '/contact', module: 'core' },
]

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const location = useLocation()
  const { modules } = useModuleConfig()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const filteredNavigation = navigation.filter(item => modules[item.module])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-brand-white/95 dark:bg-brand-dark/95 backdrop-blur-sm shadow-sm border-b border-brand-surface/50'
          : 'bg-transparent'
      )}
    >
      <nav className='container mx-auto px-4 sm:px-6 lg:px-8' aria-label='Main navigation'>
        <div className='flex items-center justify-between h-16 md:h-20'>
          <Link to='/' className='flex items-center gap-2' aria-label='Kingdom Network Home'>
            <div className='w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center'>
              <span className='text-brand-white font-display font-bold text-xl'>KN</span>
            </div>
            <span className='font-display font-bold text-xl text-brand-primary hidden sm:block'>
              Kingdom Network
            </span>
          </Link>

          <div className='hidden md:flex md:items-center md:gap-8'>
            {filteredNavigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'relative px-2 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'text-brand-primary'
                      : 'text-brand-text/70 hover:text-brand-primary'
                  )
                }
                end={item.href === '/'}
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          <div className='hidden lg:flex lg:items-center lg:gap-4'>
            <Link to='/contact' className='btn-secondary'>Get in Touch</Link>
          </div>

          <div className='flex items-center gap-4 md:hidden'>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='p-2 rounded-lg text-brand-text hover:bg-brand-surface'
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className='md:hidden py-4 border-t border-brand-surface/50 bg-brand-white dark:bg-brand-dark'
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className='flex flex-col gap-2'>
                {filteredNavigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        'px-3 py-3 rounded-lg text-base font-medium transition-colors',
                        isActive
                          ? 'bg-brand-primary/10 text-brand-primary'
                          : 'text-brand-text/70 hover:bg-brand-surface hover:text-brand-primary'
                      )
                    }
                    onClick={() => setMobileMenuOpen(false)}
                    end={item.href === '/'}
                  >
                    {item.name}
                  </NavLink>
                ))}
                <Link to='/contact' className='btn-primary mt-4 w-full text-center'>Get in Touch</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      </header>
  )
}