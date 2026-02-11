import { Preferences } from '@capacitor/preferences'

const TOKEN_KEY = 'auth_token'

/**
 * Get the stored auth token.
 * Returns the token string, or null if not set.
 */
export async function getToken() {
  const { value } = await Preferences.get({ key: TOKEN_KEY })
  return value
}

/**
 * Persist the auth token.
 */
export async function setToken(token) {
  await Preferences.set({ key: TOKEN_KEY, value: String(token) })
}

/**
 * Remove the auth token (on logout / 401).
 */
export async function removeToken() {
  await Preferences.remove({ key: TOKEN_KEY })
}
