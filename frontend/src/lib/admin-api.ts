import axios from 'axios'

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1/admin',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
})

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

adminApi.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

export async function adminLogin(email: string, password: string) {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL || '/api/v1'}/admin/login`,
    { email, password }
  )
  return response.data
}

export async function adminVerifyToken() {
  const response = await adminApi.get('me')
  return response.data
}

export async function getStats() {
  const response = await adminApi.get('dashboard')
  return response.data
}

export async function getSiteSettings() {
  const response = await adminApi.get('site-settings')
  return response.data
}

export async function updateSiteSettings(data: Record<string, unknown>) {
  const response = await adminApi.put('site-settings', data)
  return response.data
}

export async function getFilms(params?: Record<string, unknown>) {
  const response = await adminApi.get('films', { params })
  return response.data
}

export async function getFilm(id: number) {
  const response = await adminApi.get(`films/${id}`)
  return response.data
}

export async function createFilm(data: Record<string, unknown>) {
  const response = await adminApi.post('films', data)
  return response.data
}

export async function updateFilm(id: number, data: Record<string, unknown>) {
  const response = await adminApi.put(`films/${id}`, data)
  return response.data
}

export async function deleteFilm(id: number) {
  const response = await adminApi.delete(`films/${id}`)
  return response.data
}

export async function getNews(params?: Record<string, unknown>) {
  const response = await adminApi.get('news', { params })
  return response.data
}

export async function getNewsItem(id: number) {
  const response = await adminApi.get(`news/${id}`)
  return response.data
}

export async function createNews(data: Record<string, unknown>) {
  const response = await adminApi.post('news', data)
  return response.data
}

export async function updateNews(id: number, data: Record<string, unknown>) {
  const response = await adminApi.put(`news/${id}`, data)
  return response.data
}

export async function deleteNews(id: number) {
  const response = await adminApi.delete(`news/${id}`)
  return response.data
}

export async function getJobs(params?: Record<string, unknown>) {
  const response = await adminApi.get('jobs', { params })
  return response.data
}

export async function getJob(id: number) {
  const response = await adminApi.get(`jobs/${id}`)
  return response.data
}

export async function createJob(data: Record<string, unknown>) {
  const response = await adminApi.post('jobs', data)
  return response.data
}

export async function updateJob(id: number, data: Record<string, unknown>) {
  const response = await adminApi.put(`jobs/${id}`, data)
  return response.data
}

export async function deleteJob(id: number) {
  const response = await adminApi.delete(`jobs/${id}`)
  return response.data
}

export async function getAlbums(params?: Record<string, unknown>) {
  const response = await adminApi.get('albums', { params })
  return response.data
}

export async function getAlbum(id: number) {
  const response = await adminApi.get(`albums/${id}`)
  return response.data
}

export async function createAlbum(data: Record<string, unknown>) {
  const response = await adminApi.post('albums', data)
  return response.data
}

export async function updateAlbum(id: number, data: Record<string, unknown>) {
  const response = await adminApi.put(`albums/${id}`, data)
  return response.data
}

export async function deleteAlbum(id: number) {
  const response = await adminApi.delete(`albums/${id}`)
  return response.data
}

export async function getPressKits(params?: Record<string, unknown>) {
  const response = await adminApi.get('press-kits', { params })
  return response.data
}

export async function getPressKit(id: number) {
  const response = await adminApi.get(`press-kits/${id}`)
  return response.data
}

export async function createPressKit(data: Record<string, unknown>) {
  const response = await adminApi.post('press-kits', data)
  return response.data
}

export async function updatePressKit(id: number, data: Record<string, unknown>) {
  const response = await adminApi.put(`press-kits/${id}`, data)
  return response.data
}

export async function deletePressKit(id: number) {
  const response = await adminApi.delete(`press-kits/${id}`)
  return response.data
}

export async function getTeamMembers(params?: Record<string, unknown>) {
  const response = await adminApi.get('team', { params })
  return response.data
}

export async function getTeamMember(id: number) {
  const response = await adminApi.get(`team/${id}`)
  return response.data
}

export async function createTeamMember(data: Record<string, unknown>) {
  const response = await adminApi.post('team', data)
  return response.data
}

export async function updateTeamMember(id: number, data: Record<string, unknown>) {
  const response = await adminApi.put(`team/${id}`, data)
  return response.data
}

export async function deleteTeamMember(id: number) {
  const response = await adminApi.delete(`team/${id}`)
  return response.data
}

export async function getPeople(params?: Record<string, unknown>) {
  const response = await adminApi.get('people', { params })
  return response.data
}

export async function getPerson(id: number) {
  const response = await adminApi.get(`people/${id}`)
  return response.data
}

export async function createPerson(data: Record<string, unknown>) {
  const response = await adminApi.post('people', data)
  return response.data
}

export async function updatePerson(id: number, data: Record<string, unknown>) {
  const response = await adminApi.put(`people/${id}`, data)
  return response.data
}

export async function deletePerson(id: number) {
  const response = await adminApi.delete(`people/${id}`)
  return response.data
}

export async function getGenres(params?: Record<string, unknown>) {
  const response = await adminApi.get('genres', { params })
  return response.data
}

export async function getGenre(id: number) {
  const response = await adminApi.get(`genres/${id}`)
  return response.data
}

export async function createGenre(data: Record<string, unknown>) {
  const response = await adminApi.post('genres', data)
  return response.data
}

export async function updateGenre(id: number, data: Record<string, unknown>) {
  const response = await adminApi.put(`genres/${id}`, data)
  return response.data
}

export async function deleteGenre(id: number) {
  const response = await adminApi.delete(`genres/${id}`)
  return response.data
}

export default adminApi
