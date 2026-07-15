import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { Loading } from './components/ui/Loading'
import { AdminLayout } from './components/admin/AdminLayout'
import { LoginPage } from './pages/admin/LoginPage'

const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })))
const Films = lazy(() => import('./pages/Films').then((m) => ({ default: m.Films })))
const FilmDetail = lazy(() => import('./pages/FilmDetail').then((m) => ({ default: m.FilmDetail })))
const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })))
const Team = lazy(() => import('./pages/About').then((m) => ({ default: m.Team })))
const News = lazy(() => import('./pages/News').then((m) => ({ default: m.News })))
const NewsDetail = lazy(() => import('./pages/NewsDetail').then((m) => ({ default: m.NewsDetail })))
const Careers = lazy(() => import('./pages/Careers').then((m) => ({ default: m.Careers })))
const CareerDetail = lazy(() => import('./pages/Careers').then((m) => ({ default: m.CareerDetail })))
const Contact = lazy(() => import('./pages/Contact').then((m) => ({ default: m.Contact })))
const Gallery = lazy(() => import('./pages/Gallery').then((m) => ({ default: m.Gallery })))
const AlbumDetail = lazy(() => import('./pages/Gallery').then((m) => ({ default: m.AlbumDetail })))
const Press = lazy(() => import('./pages/Press').then((m) => ({ default: m.Press })))
const Privacy = lazy(() => import('./pages/Privacy').then((m) => ({ default: m.Privacy })))
const Terms = lazy(() => import('./pages/Terms').then((m) => ({ default: m.Terms })))
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })))

const DashboardPage = lazy(() => import('./pages/admin/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const SiteSettingsPage = lazy(() => import('./pages/admin/SiteSettingsPage').then((m) => ({ default: m.SiteSettingsPage })))
const FilmsPage = lazy(() => import('./pages/admin/FilmsPage').then((m) => ({ default: m.FilmsPage })))
const NewsPage = lazy(() => import('./pages/admin/NewsPage').then((m) => ({ default: m.NewsPage })))
const JobsPage = lazy(() => import('./pages/admin/JobsPage').then((m) => ({ default: m.JobsPage })))
const AlbumsPage = lazy(() => import('./pages/admin/AlbumsPage').then((m) => ({ default: m.AlbumsPage })))
const PressKitsPage = lazy(() => import('./pages/admin/PressKitsPage').then((m) => ({ default: m.PressKitsPage })))
const TeamPage = lazy(() => import('./pages/admin/TeamPage').then((m) => ({ default: m.TeamPage })))
const PeoplePage = lazy(() => import('./pages/admin/PeoplePage').then((m) => ({ default: m.PeoplePage })))
const GenresPage = lazy(() => import('./pages/admin/GenresPage').then((m) => ({ default: m.GenresPage })))

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Suspense fallback={<Loading text="Loading..." />}><Home /></Suspense>} />
        <Route path="films" element={<Suspense fallback={<Loading text="Loading films..." />}><Films /></Suspense>} />
        <Route path="films/:slug" element={<Suspense fallback={<Loading text="Loading film..." />}><FilmDetail /></Suspense>} />
        <Route path="about" element={<Suspense fallback={<Loading text="Loading..." />}><About /></Suspense>} />
        <Route path="team" element={<Suspense fallback={<Loading text="Loading..." />}><Team /></Suspense>} />
        <Route path="news" element={<Suspense fallback={<Loading text="Loading news..." />}><News /></Suspense>} />
        <Route path="news/:slug" element={<Suspense fallback={<Loading text="Loading article..." />}><NewsDetail /></Suspense>} />
        <Route path="careers" element={<Suspense fallback={<Loading text="Loading careers..." />}><Careers /></Suspense>} />
        <Route path="careers/:slug" element={<Suspense fallback={<Loading text="Loading position..." />}><CareerDetail /></Suspense>} />
        <Route path="contact" element={<Suspense fallback={<Loading text="Loading..." />}><Contact /></Suspense>} />
        <Route path="gallery" element={<Suspense fallback={<Loading text="Loading gallery..." />}><Gallery /></Suspense>} />
        <Route path="gallery/:slug" element={<Suspense fallback={<Loading text="Loading album..." />}><AlbumDetail /></Suspense>} />
        <Route path="press" element={<Suspense fallback={<Loading text="Loading press..." />}><Press /></Suspense>} />
        <Route path="privacy" element={<Suspense fallback={<Loading text="Loading..." />}><Privacy /></Suspense>} />
        <Route path="terms" element={<Suspense fallback={<Loading text="Loading..." />}><Terms /></Suspense>} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Suspense fallback={<Loading text="Loading dashboard..." />}><DashboardPage /></Suspense>} />
        <Route path="site-settings" element={<Suspense fallback={<Loading text="Loading..." />}><SiteSettingsPage /></Suspense>} />
        <Route path="films" element={<Suspense fallback={<Loading text="Loading..." />}><FilmsPage /></Suspense>} />
        <Route path="news" element={<Suspense fallback={<Loading text="Loading..." />}><NewsPage /></Suspense>} />
        <Route path="jobs" element={<Suspense fallback={<Loading text="Loading..." />}><JobsPage /></Suspense>} />
        <Route path="gallery" element={<Suspense fallback={<Loading text="Loading..." />}><AlbumsPage /></Suspense>} />
        <Route path="press-kits" element={<Suspense fallback={<Loading text="Loading..." />}><PressKitsPage /></Suspense>} />
        <Route path="team" element={<Suspense fallback={<Loading text="Loading..." />}><TeamPage /></Suspense>} />
        <Route path="people" element={<Suspense fallback={<Loading text="Loading..." />}><PeoplePage /></Suspense>} />
        <Route path="genres" element={<Suspense fallback={<Loading text="Loading..." />}><GenresPage /></Suspense>} />
      </Route>
    </Routes>
  )
}

export default App
