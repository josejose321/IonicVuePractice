import { getToken, removeToken } from '@/utils/token'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://192.168.254.102:8000',
  withCredentials: true,
})

// Request Interceptor: attach token from Capacitor Preferences
api.interceptors.request.use(
  async (config) => {
    const token = await getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: clear token and redirect on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await removeToken()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
