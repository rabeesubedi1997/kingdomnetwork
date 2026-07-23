import axios from 'axios'

const adminApi = axios.create({
  baseURL: '/api/v1/admin',
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
  const response = await adminApi.post('login', { email, password })
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
  const response = await adminApi.post('site-settings/bulk-update', data)
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
  const response = await adminApi.get('posts', { params })
  return response.data
}

export async function getNewsItem(id: number) {
  const response = await adminApi.get(`posts/${id}`)
  return response.data
}

export async function createNews(data: Record<string, unknown>) {
  const response = await adminApi.post('posts', data)
  return response.data
}

export async function updateNews(id: number, data: Record<string, unknown>) {
  const response = await adminApi.put(`posts/${id}`, data)
  return response.data
}

export async function deleteNews(id: number) {
  const response = await adminApi.delete(`posts/${id}`)
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
  const response = await adminApi.get('team-members', { params })
  return response.data
}

export async function getTeamMember(id: number) {
  const response = await adminApi.get(`team-members/${id}`)
  return response.data
}

export async function createTeamMember(data: Record<string, unknown>) {
  const response = await adminApi.post('team-members', data)
  return response.data
}

export async function updateTeamMember(id: number, data: Record<string, unknown>) {
  const response = await adminApi.put(`team-members/${id}`, data)
  return response.data
}

export async function deleteTeamMember(id: number) {
  const response = await adminApi.delete(`team-members/${id}`)
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

export async function getMedia(params?: Record<string, unknown>) {
  const response = await adminApi.get('media-library', { params })
  return response.data
}

export async function uploadMedia(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  const response = await adminApi.post('media-library/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export async function uploadMultipleMedia(files: File[]) {
  const formData = new FormData()
  files.forEach(f => formData.append('files[]', f))
  const response = await adminApi.post('media-library/upload-multiple', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export async function deleteMedia(id: number) {
  const response = await adminApi.delete(`media-library/${id}`)
  return response.data
}

export async function bulkDeleteMedia(ids: number[]) {
  const response = await adminApi.post('media-library/bulk-delete', { ids })
  return response.data
}

export async function getModules() {
  const response = await adminApi.get('modules')
  return response.data
}

export async function updateModule(id: number, data: Record<string, unknown>) {
  const response = await adminApi.put(`modules/${id}`, data)
  return response.data
}

export async function reorderModules(modules: { id: number; sort_order: number }[]) {
  const response = await adminApi.post('modules/reorder', { modules })
  return response.data
}

export async function bulkUpdateModules(modules: { id: number; is_enabled: boolean }[]) {
  const response = await adminApi.post('modules/bulk-update', { modules })
  return response.data
}

export async function getBanners() {
  const response = await adminApi.get('banners')
  return response.data
}

export async function getBanner(id: number) {
  const response = await adminApi.get(`banners/${id}`)
  return response.data
}

export async function createBanner(data: Record<string, unknown>) {
  const response = await adminApi.post('banners', data)
  return response.data
}

export async function updateBanner(id: number, data: Record<string, unknown>) {
  const response = await adminApi.put(`banners/${id}`, data)
  return response.data
}

export async function deleteBanner(id: number) {
  const response = await adminApi.delete(`banners/${id}`)
  return response.data
}

export async function reorderBanners(banners: { id: number; sort_order: number }[]) {
  const response = await adminApi.post('banners/reorder', { banners })
  return response.data
}

export async function getAdvertisements() {
  const response = await adminApi.get('advertisements')
  return response.data
}

export async function getAdvertisement(id: number) {
  const response = await adminApi.get(`advertisements/${id}`)
  return response.data
}

export async function createAdvertisement(data: Record<string, unknown>) {
  const response = await adminApi.post('advertisements', data)
  return response.data
}

export async function updateAdvertisement(id: number, data: Record<string, unknown>) {
  const response = await adminApi.put(`advertisements/${id}`, data)
  return response.data
}

export async function deleteAdvertisement(id: number) {
  const response = await adminApi.delete(`advertisements/${id}`)
  return response.data
}

export async function getMenus() {
  const response = await adminApi.get('menus')
  return response.data
}

export async function getMenu(id: number) {
  const response = await adminApi.get(`menus/${id}`)
  return response.data
}

export async function createMenu(data: Record<string, unknown>) {
  const response = await adminApi.post('menus', data)
  return response.data
}

export async function updateMenu(id: number, data: Record<string, unknown>) {
  const response = await adminApi.put(`menus/${id}`, data)
  return response.data
}

export async function deleteMenu(id: number) {
  const response = await adminApi.delete(`menus/${id}`)
  return response.data
}

export async function getMenuItems(menuId: number) {
  const response = await adminApi.get(`menus/${menuId}/items`)
  return response.data
}

export async function createMenuItem(data: Record<string, unknown>) {
  const response = await adminApi.post('menu-items', data)
  return response.data
}

export async function updateMenuItem(id: number, data: Record<string, unknown>) {
  const response = await adminApi.put(`menu-items/${id}`, data)
  return response.data
}

export async function deleteMenuItem(id: number) {
  const response = await adminApi.delete(`menu-items/${id}`)
  return response.data
}

export async function reorderMenuItems(items: { id: number; sort_order: number }[]) {
  const response = await adminApi.post('menu-items/reorder', { items })
  return response.data
}

export async function getPages() {
  const response = await adminApi.get('pages')
  return response.data
}

export async function getPage(id: number) {
  const response = await adminApi.get(`pages/${id}`)
  return response.data
}

export async function createPage(data: Record<string, unknown>) {
  const response = await adminApi.post('pages', data)
  return response.data
}

export async function updatePage(id: number, data: Record<string, unknown>) {
  const response = await adminApi.put(`pages/${id}`, data)
  return response.data
}

export async function deletePage(id: number) {
  const response = await adminApi.delete(`pages/${id}`)
  return response.data
}

export async function getPageSections(pageId: number) {
  const response = await adminApi.get(`pages/${pageId}/sections`)
  return response.data
}

export async function createPageSection(pageId: number, data: Record<string, unknown>) {
  const response = await adminApi.post(`pages/${pageId}/sections`, data)
  return response.data
}

export async function updatePageSection(pageId: number, sectionId: number, data: Record<string, unknown>) {
  const response = await adminApi.put(`pages/${pageId}/sections/${sectionId}`, data)
  return response.data
}

export async function deletePageSection(pageId: number, sectionId: number) {
  const response = await adminApi.delete(`pages/${pageId}/sections/${sectionId}`)
  return response.data
}

export async function reorderPageSections(pageId: number, sections: { id: number; sort_order: number }[]) {
  const response = await adminApi.post(`pages/${pageId}/sections/reorder`, { sections })
  return response.data
}

export async function getContactSubmissions(params?: Record<string, unknown>) {
  const response = await adminApi.get('contact-submissions', { params })
  return response.data
}

export async function updateContactSubmission(id: number, data: Record<string, unknown>) {
  const response = await adminApi.put(`contact-submissions/${id}`, data)
  return response.data
}

export async function deleteContactSubmission(id: number) {
  const response = await adminApi.delete(`contact-submissions/${id}`)
  return response.data
}

export async function getJobApplications(params?: Record<string, unknown>) {
  const response = await adminApi.get('job-applications', { params })
  return response.data
}

export async function updateJobApplication(id: number, data: Record<string, unknown>) {
  const response = await adminApi.put(`job-applications/${id}`, data)
  return response.data
}

export async function deleteJobApplication(id: number) {
  const response = await adminApi.delete(`job-applications/${id}`)
  return response.data
}

export async function getTestimonials() {
  const response = await adminApi.get('testimonials')
  return response.data
}

export async function createTestimonial(data: Record<string, unknown>) {
  const response = await adminApi.post('testimonials', data)
  return response.data
}

export async function updateTestimonial(id: number, data: Record<string, unknown>) {
  const response = await adminApi.put(`testimonials/${id}`, data)
  return response.data
}

export async function deleteTestimonial(id: number) {
  const response = await adminApi.delete(`testimonials/${id}`)
  return response.data
}

export async function getPartners() {
  const response = await adminApi.get('partners')
  return response.data
}

export async function createPartner(data: Record<string, unknown>) {
  const response = await adminApi.post('partners', data)
  return response.data
}

export async function updatePartner(id: number, data: Record<string, unknown>) {
  const response = await adminApi.put(`partners/${id}`, data)
  return response.data
}

export async function deletePartner(id: number) {
  const response = await adminApi.delete(`partners/${id}`)
  return response.data
}

export async function getUsers() {
  const response = await adminApi.get('users')
  return response.data
}

export async function createUser(data: Record<string, unknown>) {
  const response = await adminApi.post('users', data)
  return response.data
}

export async function updateUser(id: number, data: Record<string, unknown>) {
  const response = await adminApi.put(`users/${id}`, data)
  return response.data
}

export async function deleteUser(id: number) {
  const response = await adminApi.delete(`users/${id}`)
  return response.data
}

export async function getRoles() {
  const response = await adminApi.get('roles')
  return response.data
}

export async function getNotifications() {
  const response = await adminApi.get('dashboard/notifications')
  return response.data
}

export async function uploadSiteLogo(file: File, type: 'logo' | 'favicon' | 'dark_logo' | 'footer_logo') {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', type)
  const response = await adminApi.post('site-settings/upload-logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export default adminApi
