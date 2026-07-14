import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { Loading } from './components/ui/Loading'

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
    </Routes>
  )
}

export default App
