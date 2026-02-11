import { getToken } from '@/utils/token'

export default async function authMiddleware(to, _from, next) {
  const token = await getToken()

  if (to.path === '/login' || to.path === '/register') {
    // Already authenticated — send to dashboard
    if (token) {
      next({ path: '/auth/dashboard' })
    } else {
      next()
    }
    return
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!token) {
      // No token — redirect to login, preserve intended destination
      next({ path: '/login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
    return
  }

  next()
}
