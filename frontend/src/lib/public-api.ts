import api from './api'

export const getMenus = async (location: string) => {
  const res = await api.get(`/menus/${location}`)
  return res.data
}

export const getBanners = async () => {
  const res = await api.get('/banners')
  return res.data
}

export const getAdvertisements = async () => {
  const res = await api.get('/advertisements')
  return res.data
}

export const getAdvertisementsByPosition = async (position: string) => {
  const res = await api.get(`/advertisements/position/${position}`)
  return res.data
}

export const getPublicPage = async (slug: string) => {
  const res = await api.get(`/pages/${slug}`)
  return res.data
}
