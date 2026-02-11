import { getToken, removeToken } from '@/utils/token'
import axios from 'axios'
import router from '@/router'
import { toast } from '@/utils/toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      // Server unreachable — network error, timeout, DNS failure, etc.
      toast.error('Network error: Unable to connect to the server')
    } else if (error.response.status === 401) {
      // Token expired or invalid — clear and redirect
      await removeToken()
      router.push('/login')
    }

    return Promise.reject(error)
  }
)

export default api
