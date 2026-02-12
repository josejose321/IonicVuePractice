import axios from '@/axios'
import router from '@/router'
import { getErrorMessage } from '@/utils/errorMessage'
import { toast } from '@/utils/toast'
import { getToken, removeToken, setToken } from '@/utils/token'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const INITIAL_USER = Object.freeze({
  id: null,
  name: null,
  email: null,
  avatar: null,
  created_at: null,
  updated_at: null,
})

const useAuthStore = defineStore('auth', () => {
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

    } catch (err) {
      // Only notify for network errors — auth failures (401) are handled
      // by the axios interceptor and redirect silently to /login
      if (!err.response) {
        toast.error(getErrorMessage(err))
      }
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
      }
      else if(status === 500) {
        toast.error('Server error: Bypass log in for development purposes.')
        isAuthenticated.value = true
        setTimeout(() => {router.push('/auth/dashboard')}, 1000)
      } 
      else if (status === 401) {
        toast.error('Invalid credentials. Please try again.')
      } else if (!err.response) {
        // Network error already toasted by axios interceptor — skip
      } else {
        toast.error(getErrorMessage(err, 'Login failed. Please try again.'))
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
