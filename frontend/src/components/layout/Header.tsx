import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Menu, X, ChevronDown, Search as SearchIcon, Sun, Moon } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMenus } from '@/lib/public-api'
import { useModuleConfig } from '@/providers/ModuleConfigProvider'
import { useTheme } from '@/providers/ThemeProvider'
import { SearchOverlay } from '@/components/search/SearchOverlay'

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const { modules } = useModuleConfig()
  const { theme, toggleTheme } = useTheme()

  const { data: headerData } = useQuery({
    queryKey: ['menu', 'header'],
    queryFn: () => getMenus('header'),
    staleTime: 60000,
  })

  const { data: mainData } = useQuery({
    queryKey: ['menu', 'main'],
    queryFn: () => getMenus('main'),
    staleTime: 60000,
  })

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setOpenDropdown(null)
  }, [location.pathname])

  const defaultNav = [
    { name: 'Home', href: '/', module: null },
    { name: 'About', href: '/about', module: null },
    { name: 'Films', href: '/films', module: 'films' },
    { name: 'Awards', href: '/awards', module: 'awards' },
    { name: 'Team', href: '/team', module: null },
    { name: 'People', href: '/people', module: 'people' },
    { name: 'News', href: '/news', module: 'news' },
    { name: 'Careers', href: '/careers', module: 'careers' },
    { name: 'Gallery', href: '/gallery', module: 'gallery' },
    { name: 'Press', href: '/press', module: 'press_kit' },
    { name: 'Contact', href: '/contact', module: null },
  ]

  const allItems = [...(headerData?.items || []), ...(mainData?.items || [])]
  const seen = new Set<string>()
  const mergedItems = allItems.filter(item => {
    const key = item.url || item.label
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  const apiNavigation = mergedItems.map((item: any) => ({
    name: item.label,
    href: item.url,
    module: item.module,
    children: item.children?.filter((c: any) => !c.module || modules[c.module] !== false) || [],
  }))

  const apiUrls = new Set(apiNavigation.map((i: any) => i.href))
  const mergedNav = [...apiNavigation, ...defaultNav.filter(d => !apiUrls.has(d.href))]

  const navigation = mergedNav.length > 0 ? mergedNav : defaultNav

  const filteredNavigation = navigation.filter((item: any) => {
    if (!item.module) return true
    return modules[item.module] !== false
  })

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

          <div className='hidden md:flex md:items-center md:gap-1' ref={dropdownRef}>
            {filteredNavigation.map((item: any) =>
              item.children?.length > 0 ? (
                <div key={item.name} className='relative'>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                    className={cn(
                      'flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors rounded-lg',
                      openDropdown === item.name || location.pathname.startsWith(item.href)
                        ? 'text-brand-primary'
                        : 'text-brand-text/70 hover:text-brand-primary hover:bg-brand-surface/50'
                    )}
                  >
                    {item.name}
                    <ChevronDown size={14} className={cn('transition-transform', openDropdown === item.name && 'rotate-180')} />
                  </button>
                  <AnimatePresence>
                    {openDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className='absolute top-full left-0 mt-1 w-48 bg-brand-dark border border-brand-surface rounded-xl shadow-xl py-2 z-50'
                      >
                        {item.children.map((child: any) => (
                          <NavLink
                            key={child.label || child.name}
                            to={child.url}
                            className={({ isActive }) =>
                              cn(
                                'block px-4 py-2 text-sm transition-colors',
                                isActive
                                  ? 'text-brand-primary bg-brand-primary/5'
                                  : 'text-brand-text/70 hover:text-brand-primary hover:bg-brand-surface/50'
                              )
                            }
                            onClick={() => setOpenDropdown(null)}
                          >
                            {child.label || child.name}
                          </NavLink>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'px-3 py-2 text-sm font-medium transition-colors rounded-lg',
                      isActive
                        ? 'text-brand-primary bg-brand-primary/5'
                        : 'text-brand-text/70 hover:text-brand-primary hover:bg-brand-surface/50'
                    )
                  }
                  end={item.href === '/'}
                >
                  {item.name}
                </NavLink>
              )
            )}
          </div>

          <div className='hidden lg:flex lg:items-center lg:gap-4'>
            {modules.search !== false && (
              <button onClick={() => setSearchOpen(true)} className='p-2 text-brand-text/70 hover:text-brand-primary hover:bg-brand-surface/50 rounded-lg transition-colors' aria-label='Search'>
                <SearchIcon size={20} />
              </button>
            )}
            <button
              onClick={toggleTheme}
              className='p-2 text-brand-text/70 hover:text-brand-primary hover:bg-brand-surface/50 rounded-lg transition-colors'
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
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
              <div className='flex flex-col gap-1'>
                {filteredNavigation.map((item: any) => (
                  <div key={item.name}>
                    {item.children?.length > 0 ? (
                      <>
                        <span className='px-3 py-2 text-xs font-semibold uppercase tracking-wider text-brand-muted'>{item.name}</span>
                        {item.children.map((child: any) => (
                          <NavLink
                            key={child.label || child.name}
                            to={child.url}
                            className={({ isActive }) =>
                              cn(
                                'block px-6 py-2.5 rounded-lg text-sm font-medium transition-colors',
                                isActive
                                  ? 'bg-brand-primary/10 text-brand-primary'
                                  : 'text-brand-text/70 hover:bg-brand-surface hover:text-brand-primary'
                              )
                            }
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {child.label || child.name}
                          </NavLink>
                        ))}
                      </>
                    ) : (
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          cn(
                            'block px-3 py-3 rounded-lg text-base font-medium transition-colors',
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
                    )}
                  </div>
                ))}
                <Link to='/contact' className='btn-primary mt-4 w-full text-center'>Get in Touch</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      {modules.search !== false && <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />}
      </header>
  )
}