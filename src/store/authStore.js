import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import router from '@/router'
import axios from '@/axios'
import { getToken, setToken, removeToken } from '@/utils/token'

const INITIAL_USER = Object.freeze({
  id: null,
  name: null,
  email: null,
  avatar: null,
  created_at: null,
  updated_at: null,
})

const useAuthStore = defineStore('auth', () => {
  const toast = useToast()

  // ── State ──────────────────────────────────────────────────────────
  const user = ref({ ...INITIAL_USER })
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const errors = ref({})

  // ── Actions ────────────────────────────────────────────────────────

  /** Sync isAuthenticated with what is actually stored on device. */
  async function checkAuth() {
    const token = await getToken()
    isAuthenticated.value = !!token
  }

  /** Verify the stored token with the server and load the user profile. */
  async function refresh() {
    isLoading.value = true
    try {
      const { data } = await axios.post('api/auth')
      user.value = data
      isAuthenticated.value = true
    } catch {
      await removeToken()
      router.push('/login')
    } finally {
      isLoading.value = false
    }
  }

  async function login(credentials) {
    isLoading.value = true
    errors.value = {}
    try {
      const { data } = await axios.post('api/login', credentials)
      await setToken(data)
      isAuthenticated.value = true
      toast.success('Welcome back!')
      router.push('/auth/dashboard')
    } catch (err) {
      const status = err.response?.status
      if (status === 422) {
        errors.value = err.response.data.errors
        toast.error('The given data was invalid')
      } else if (status === 401) {
        toast.error('Invalid Credentials')
      } else {
        toast.error('Internal Server Error')
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Local state is always cleared regardless of the server response,
   * so the user is never stuck in a logged-in state.
   */
  async function logout() {
    isLoading.value = true
    try {
      await axios.post('api/logout')
    } catch {
      // Server-side logout failed — still clear locally
    } finally {
      await removeToken()
      user.value = { ...INITIAL_USER }
      isAuthenticated.value = false
      errors.value = {}
      isLoading.value = false
      toast.success('Successfully logged out')
      router.push('/login')
    }
  }

  // ── Expose ─────────────────────────────────────────────────────────
  return { user, isAuthenticated, isLoading, errors, checkAuth, refresh, login, logout }
})

export default useAuthStore
