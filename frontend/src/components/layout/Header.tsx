import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Menu, X, ChevronDown, Search as SearchIcon, Sun, Moon } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMenus } from '@/lib/public-api'
import api from '@/lib/api'
import { useModuleConfig } from '@/providers/ModuleConfigProvider'
import { useTheme } from '@/providers/ThemeProvider'
import { SearchOverlay } from '@/components/search/SearchOverlay'

const navItemVariants = {
  hidden: { opacity: 0, y: -4 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.2 } }),
}

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const { modules, logo_url, favicon_url, dark_logo_url, brand } = useModuleConfig()
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

  const { data: siteData } = useQuery({
    queryKey: ['site'],
    queryFn: async () => (await api.get('/site')).data,
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

  useEffect(() => {
    if (mobileMenuOpen) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
      return () => {
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.left = ''
        document.body.style.right = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [mobileMenuOpen])

  const siteName = siteData?.settings?.site_name || brand?.name || 'Kingdom Network'
  const siteLogo = theme === 'dark' && dark_logo_url ? dark_logo_url : (siteData?.logo_url || logo_url)

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
        'fixed top-0 left-0 right-0 z-40 transition-all duration-500',
        scrolled
          ? 'bg-white/90 dark:bg-brand-dark/90 backdrop-blur-xl shadow-sm shadow-black/5 border-b border-brand-surface/50'
          : 'bg-transparent'
      )}
    >
      <nav className='container mx-auto px-4 sm:px-6 lg:px-8' aria-label='Main navigation'>
        <div className='flex items-center justify-between h-16 md:h-20'>
          <Link to='/' className='flex items-center gap-2.5 group' aria-label={`${siteName} Home`}>
            {siteLogo ? (
              <img src={siteLogo} alt={siteName} className='h-9 w-auto' />
            ) : (
              <>
                <div className='w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20 group-hover:shadow-brand-primary/40 transition-shadow duration-300'>
                  <span className='text-brand-white font-display font-bold text-xl tracking-tight'>KN</span>
                </div>
                <span className='font-display font-bold text-xl text-brand-primary hidden sm:block tracking-tight'>
                  {siteName}
                </span>
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex md:items-center md:gap-0.5' ref={dropdownRef}>
            {filteredNavigation.map((item: any, i: number) =>
              item.children?.length > 0 ? (
                <motion.div key={item.name} custom={i} initial="hidden" animate="visible" variants={navItemVariants} className='relative'>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                      className={cn(
                        'flex items-center gap-1 px-3.5 py-2 text-sm font-medium transition-colors rounded-lg',
                        openDropdown === item.name || location.pathname.startsWith(item.href)
                          ? 'text-brand-primary'
                          : scrolled
                            ? 'text-brand-text/70 hover:text-brand-primary hover:bg-brand-primary/5'
                            : 'text-white/80 hover:text-white hover:bg-white/10'
                        )}
                    >
                      {item.name}
                      <ChevronDown size={14} className={cn('transition-transform duration-200', openDropdown === item.name && 'rotate-180')} />
                    </button>
                  <AnimatePresence>
                    {openDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className='absolute top-full left-0 mt-1.5 w-48 bg-white dark:bg-brand-dark rounded-xl shadow-xl shadow-black/10 border border-brand-surface/80 dark:border-brand-white/10 py-1.5 z-50'
                      >
                        {item.children.map((child: any) => (
                          <NavLink
                            key={child.label || child.name}
                            to={child.url}
                            className={({ isActive }) =>
                              cn(
                                'block px-4 py-2.5 text-sm transition-colors mx-1.5 rounded-lg',
                                isActive
                                  ? 'text-brand-primary bg-brand-primary/5 font-medium'
                                  : 'text-brand-text/70 hover:text-brand-primary hover:bg-brand-primary/5'
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
                </motion.div>
              ) : (
                <motion.div key={item.name} custom={i} initial="hidden" animate="visible" variants={navItemVariants}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        'relative px-3.5 py-2 text-sm font-medium transition-colors rounded-lg',
                        isActive
                          ? 'text-brand-primary'
                          : scrolled
                            ? 'text-brand-text/70 hover:text-brand-primary hover:bg-brand-primary/5'
                            : 'text-white/80 hover:text-white hover:bg-white/10'
                      )
                    }
                    end={item.href === '/'}
                  >
                    {({ isActive }) => (
                      <>
                        {item.name}
                        {isActive && (
                          <motion.span
                            layoutId="nav-underline"
                            className='absolute -bottom-0.5 left-2 right-2 h-0.5 bg-brand-primary rounded-full'
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </motion.div>
              )
            )}
          </div>

          {/* Desktop Right Actions */}
          <div className='hidden lg:flex lg:items-center lg:gap-2'>
            {modules.search !== false && (
              <button onClick={() => setSearchOpen(true)}
                className={cn('p-2.5 rounded-xl transition-colors', scrolled ? 'text-brand-text/60 hover:text-brand-primary hover:bg-brand-primary/5' : 'text-white/70 hover:text-white hover:bg-white/10')}
                aria-label='Search'>
                <SearchIcon size={18} />
              </button>
            )}
            <button onClick={toggleTheme}
              className={cn('p-2.5 rounded-xl transition-colors', scrolled ? 'text-brand-text/60 hover:text-brand-primary hover:bg-brand-primary/5' : 'text-white/70 hover:text-white hover:bg-white/10')}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to='/contact' className='btn-primary text-sm px-5 py-2.5 ml-2'>
              Get in Touch
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className='flex items-center gap-2 md:hidden'>
            <button onClick={toggleTheme}
              className='p-2.5 text-brand-text/60 hover:text-brand-primary rounded-xl transition-colors'
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='p-2.5 rounded-xl text-brand-text hover:bg-brand-primary/5 transition-colors'
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}>
              {mobileMenuOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black/60 z-50 md:hidden'
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className='fixed inset-y-0 right-0 w-72 max-w-[85vw] bg-white dark:bg-brand-dark z-[60] shadow-2xl md:hidden flex flex-col'
            >
              <div className='flex items-center justify-between px-5 h-16 shrink-0 border-b border-brand-surface/50'>
                <span className='font-display font-bold text-brand-primary'>Menu</span>
                <button onClick={() => setMobileMenuOpen(false)}
                  className='p-2 rounded-xl hover:bg-brand-primary/5 transition-colors'>
                  <X className='w-5 h-5' />
                </button>
              </div>
              <div className='p-4 overflow-y-auto flex-1 min-h-0'>
                <div className='flex flex-col gap-1'>
                  {filteredNavigation.map((item: any) => (
                    <div key={item.name}>
                      {item.children?.length > 0 ? (
                        <>
                          <span className='block px-3 py-2 text-xs font-semibold uppercase tracking-widest text-brand-muted'>
                            {item.name}
                          </span>
                          {item.children.map((child: any) => (
                            <NavLink key={child.label || child.name} to={child.url}
                              className={({ isActive }) =>
                                cn('block px-5 py-2.5 rounded-xl text-sm font-medium transition-colors',
                                  isActive ? 'bg-brand-primary/10 text-brand-primary' : 'text-brand-text/70 hover:bg-brand-primary/5 hover:text-brand-primary'
                                )}
                              onClick={() => setMobileMenuOpen(false)}>
                              {child.label || child.name}
                            </NavLink>
                          ))}
                        </>
                      ) : (
                        <NavLink to={item.href} end={item.href === '/'}
                          className={({ isActive }) =>
                            cn('block px-4 py-3 rounded-xl text-base font-medium transition-colors',
                              isActive ? 'bg-brand-primary/10 text-brand-primary' : 'text-brand-text/70 hover:bg-brand-primary/5 hover:text-brand-primary'
                            )}
                          onClick={() => setMobileMenuOpen(false)}>
                          {item.name}
                        </NavLink>
                      )}
                    </div>
                  ))}
                </div>
                <div className='mt-6 pt-6 border-t border-brand-surface/50 space-y-3'>
                  <Link to='/contact' className='btn-primary w-full text-center' onClick={() => setMobileMenuOpen(false)}>
                    Get in Touch
                  </Link>
                  {modules.search !== false && (
                    <button onClick={() => { setSearchOpen(true); setMobileMenuOpen(false) }}
                      className='btn-secondary w-full text-center'>
                      Search
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {modules.search !== false && <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />}
    </header>
  )
}