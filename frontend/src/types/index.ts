export interface Film {
  id: number
  slug: string
  title: string
  tagline?: string
  synopsis?: string
  short_description?: string
  status: 'released' | 'post_production' | 'pre_production' | 'development' | 'announced' | 'cancelled'
  release_date?: string
  runtime_minutes?: number
  rating?: string
  language: string
  country: string
  budget?: number
  box_office?: number
  trailer_url?: string
  trailer_embed_code?: string
  trailer_embed_url?: string
  director?: Person
  producer?: Person
  writer?: Person
  cinematographer?: Person
  editor?: Person
  composer?: Person
  genres: Genre[]
  cast: FilmCast[]
  crew: FilmCrew[]
  awards: FilmAward[]
  locations: FilmLocation[]
  gallery_images: GalleryImage[]
  poster_url?: string
  banner_url?: string
  press_kit?: PressKit
  screenings: Event[]
  is_featured: boolean
  sort_order: number
  published_at?: string
  status_config: StatusConfig
  json_ld?: object
}

export interface Person {
  id: number
  name: string
  slug: string
  role?: string
  bio?: string
  birth_date?: string
  birth_place?: string
  imdb_url?: string
  social_links?: SocialLinks
  is_active: boolean
  photo_url?: string
  json_ld?: object
}

export interface SocialLinks {
  linkedin?: string
  twitter?: string
  instagram?: string
  facebook?: string
  youtube?: string
  website?: string
  email?: string
}

export interface Genre {
  id: number
  name: string
  slug: string
  description?: string
  color?: string
  icon?: string
}

export interface FilmCast {
  id: number
  film_id: number
  person_id: number
  role_name: string
  character_name?: string
  is_lead: boolean
  sort_order: number
  person: Person
}

export interface FilmCrew {
  id: number
  film_id: number
  person_id: number
  department: string
  role: string
  sort_order: number
  person: Person
}

export interface FilmAward {
  id: number
  film_id: number
  award_name: string
  category?: string
  year: number
  result: 'won' | 'nominated' | 'shortlisted'
  notes?: string
}

export interface FilmLocation {
  id: number
  film_id: number
  location_name: string
  country?: string
  lat?: number
  lng?: number
  description?: string
  sort_order: number
}

export interface GalleryImage {
  id: number
  url: string
  thumb?: string
  responsive?: object
  caption?: string
  type: string
}

export interface PressKit {
  id: number
  film_id: number
  title: string
  slug: string
  logline?: string
  synopsis_short?: string
  synopsis_long?: string
  key_cast: Person[]
  key_crew: Person[]
  technical_specs: Record<string, unknown>
  festival_history: unknown[]
  awards: FilmAward[]
  assets: Record<string, unknown>
  contact_email?: string
  contact_phone?: string
  is_public: boolean
}

export interface Event {
  id: number
  slug: string
  title: string
  description?: string
  event_type: 'premiere' | 'festival' | 'screening' | 'panel' | 'workshop' | 'party'
  start_datetime: string
  end_datetime?: string
  venue_name: string
  venue_address?: string
  venue_city?: string
  venue_country?: string
  lat?: number
  lng?: number
  film?: Film
  poster?: Media
  ticket_url?: string
  is_public: boolean
  rsvp_required: boolean
  max_attendees?: number
  rsvps?: EventRsvp[]
}

export interface EventRsvp {
  id: number
  event_id: number
  name: string
  email: string
  phone?: string
  guests: number
  message?: string
  status: 'pending' | 'confirmed' | 'declined' | 'waitlisted'
}

export interface StatusConfig {
  label: string
  color: string
  icon: string
}

export interface Media {
  id: number
  url: string
  thumb?: string
  name?: string
  file_name?: string
  mime_type?: string
  size?: number
  is_image?: boolean
  is_video?: boolean
  created_at?: string
}

export interface Post {
  id: number
  slug: string
  title: string
  excerpt?: string
  content?: string
  featured_image?: Media
  author?: User
  category?: Category
  tags: Tag[]
  status: 'draft' | 'scheduled' | 'published' | 'archived'
  featured: boolean
  reading_time?: number
  published_at?: string
  updated_at?: string
  seo_title?: string
  seo_description?: string
  schema_type: string
}

export interface User {
  id: number
  name: string
  email: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  color?: string
}

export interface Tag {
  id: number
  name: string
  slug: string
}

export interface Job {
  id: number
  slug: string
  title: string
  department: string
  type: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance'
  location: string
  description: string
  requirements: string
  benefits?: string
  salary_range?: string
  is_remote: boolean
  is_open: boolean
  closes_at?: string
  published_at?: string
}

export interface JobApplication {
  id: number
  job_id: number
  name: string
  email: string
  phone?: string
  cover_letter?: string
  resume_id?: number
  portfolio_url?: string
  linkedin_url?: string
  status: 'submitted' | 'reviewing' | 'interviewed' | 'offered' | 'rejected' | 'hired'
  notes?: string
  submitted_at: string
}

export interface Album {
  id: number
  slug: string
  title: string
  description?: string
  cover?: Media
  category: 'behind_the_scenes' | 'posters' | 'stills' | 'events' | 'concept_art' | 'marketing'
  film?: Film
  event?: Event
  is_public: boolean
  sort_order: number
  images: AlbumImage[]
  cover_url?: string
}

export interface AlbumImage {
  id: number
  album_id: number
  media_id: number
  caption?: string
  sort_order: number
  media: Media
}

export interface TeamMember {
  id: number
  name: string
  role: string
  bio?: string
  photo_url?: string
  email?: string
  phone?: string
  birth_date?: string
  birth_place?: string
  imdb_url?: string
  instagram_url?: string
  twitter_url?: string
  linkedin_url?: string
  website_url?: string
  social_links?: SocialLinks
  sort_order: number
  is_active: boolean
}

export interface SiteSettings {
  brand: {
    name: string
    tagline: string
    colors: Record<string, string>
    fonts: Record<string, string>
    social: Record<string, string>
    contact: Record<string, string>
  }
  modules: Record<string, boolean>
}

export interface MenuItem {
  id: number
  label: string
  url?: string
  target: '_self' | '_blank'
  children: MenuItem[]
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}