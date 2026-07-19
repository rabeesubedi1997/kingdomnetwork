import { Outlet } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { ScrollToTop } from '../components/shared/ScrollToTop'
import { CookieConsent } from '../components/shared/CookieConsent'
import { AnalyticsScripts } from '../components/seo/SEOHead'

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AnalyticsScripts />
      <Header />
      <main className="flex-1 pt-16 md:pt-20">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
      <CookieConsent />
    </div>
  )
}