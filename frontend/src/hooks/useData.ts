import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Film, Post, Job, Event, Album, PressKit, TeamMember, SiteSettings, MenuItem } from '@/types'

export function useFilms(params?: {
  status?: string
  genre?: string
  year?: number
  search?: string
  page?: number
  per_page?: number
  featured?: boolean
}, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['films', params],
    queryFn: async () => {
      const response = await api.get<{ data: Film[]; total: number }>('/films', { params })
      return response.data
    },
    enabled: options?.enabled,
  })
}

export function useFeaturedFilms() {
  return useQuery({
    queryKey: ['films', 'featured'],
    queryFn: async () => {
      const response = await api.get<Film[]>('/films/featured')
      return response.data
    },
  })
}

export function useFilm(slug: string) {
  return useQuery({
    queryKey: ['film', slug],
    queryFn: async () => {
      const response = await api.get<Film>(`/films/${slug}`)
      return response.data
    },
    enabled: !!slug,
  })
}

export function useFilmByStatus(status: string) {
  return useQuery({
    queryKey: ['films', 'status', status],
    queryFn: async () => {
      const response = await api.get<Film[]>(`/films/status/${status}`)
      return response.data
    },
    enabled: !!status,
  })
}

export function useNews(params?: {
  category?: string
  tag?: string
  search?: string
  featured?: boolean
  page?: number
  per_page?: number
}) {
  return useQuery({
    queryKey: ['news', params],
    queryFn: async () => {
      const response = await api.get<{ data: Post[]; total: number }>('/news', { params })
      return response.data
    },
  })
}

export function useFeaturedNews() {
  return useQuery({
    queryKey: ['news', 'featured'],
    queryFn: async () => {
      const response = await api.get<Post[]>('/news/featured')
      return response.data
    },
  })
}

export function useNewsByCategory(slug: string) {
  return useQuery({
    queryKey: ['news', 'category', slug],
    queryFn: async () => {
      const response = await api.get<{ data: Post[]; total: number }>(`/news/category/${slug}`)
      return response.data
    },
    enabled: !!slug,
  })
}

export function useNewsDetail(slug: string) {
  return useQuery({
    queryKey: ['news', slug],
    queryFn: async () => {
      const response = await api.get<Post>(`/news/${slug}`)
      return response.data
    },
    enabled: !!slug,
  })
}

export function useCareers(params?: {
  department?: string
  type?: string
  location?: string
  page?: number
  per_page?: number
}) {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: async () => {
      const response = await api.get<{ data: Job[]; total: number }>('/careers', { params })
      return response.data
    },
  })
}

export function useJob(slug: string) {
  return useQuery({
    queryKey: ['job', slug],
    queryFn: async () => {
      const response = await api.get<Job>(`/careers/${slug}`)
      return response.data
    },
    enabled: !!slug,
  })
}

export function useEvents(params?: {
  type?: string
  upcoming?: boolean
  film_id?: number
  page?: number
  per_page?: number
}) {
  return useQuery({
    queryKey: ['events', params],
    queryFn: async () => {
      const response = await api.get<{ data: Event[]; total: number }>('/events', { params })
      return response.data
    },
  })
}

export function useEvent(slug: string) {
  return useQuery({
    queryKey: ['event', slug],
    queryFn: async () => {
      const response = await api.get<Event>(`/events/${slug}`)
      return response.data
    },
    enabled: !!slug,
  })
}

export function useGallery(params?: {
  category?: string
  film_id?: number
  event_id?: number
  page?: number
  per_page?: number
}) {
  return useQuery({
    queryKey: ['gallery', params],
    queryFn: async () => {
      const response = await api.get<Album[]>('/gallery', { params })
      return response.data
    },
  })
}

export function useAlbum(slug: string) {
  return useQuery({
    queryKey: ['album', slug],
    queryFn: async () => {
      const response = await api.get<Album>(`/gallery/${slug}`)
      return response.data
    },
    enabled: !!slug,
  })
}

export function usePressKits() {
  return useQuery({
    queryKey: ['press-kits'],
    queryFn: async () => {
      const response = await api.get<PressKit[]>('/press')
      return response.data
    },
  })
}

export function usePressKit(filmSlug: string) {
  return useQuery({
    queryKey: ['press-kit', filmSlug],
    queryFn: async () => {
      const response = await api.get<PressKit>(`/press/${filmSlug}`)
      return response.data
    },
    enabled: !!filmSlug,
  })
}

export function useTeam() {
  return useQuery({
    queryKey: ['team'],
    queryFn: async () => {
      const response = await api.get<TeamMember[]>('/team')
      return response.data
    },
  })
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ['site'],
    queryFn: async () => {
      const response = await api.get<SiteSettings>('/site')
      return response.data
    },
  })
}

export function useMenu(location: string) {
  return useQuery({
    queryKey: ['menu', location],
    queryFn: async () => {
      const response = await api.get<MenuItem[]>(`/menus/${location}`)
      return response.data
    },
    enabled: !!location,
  })
}