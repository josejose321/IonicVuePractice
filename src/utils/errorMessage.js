/**
 * Extracts a user-friendly error message from any caught error.
 *
 * Priority:
 *  1. No response at all      → network / server unreachable
 *  2. Server-provided message → err.response.data.message
 *  3. Axios default message   → err.message
 *  4. Caller-supplied fallback
 */
export function getErrorMessage(err, fallback = 'An unexpected error occurred') {
  if (!err?.response) {
    return 'Network error: Unable to connect to the server'
  }
  return err.response?.data?.message || err.message || fallback
}
