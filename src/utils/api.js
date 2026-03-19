// src/utils/api.js
import { API_URL, BACKEND_URL } from '@/config'

// ── Refresh state — module level (shared across all requests) ──
let isRefreshing   = false
let refreshPromise = null   // single shared promise while refreshing

// ── Core request function ──────────────────────────────────────
async function request(method, endpoint, body = null, requiresAuth = true) {
  // Build request
  const headers = { 'Content-Type': 'application/json' }
  const token   = localStorage.getItem('accessToken')
  if (requiresAuth && token) headers['Authorization'] = `Bearer ${token}`

  const fetchConfig = { method, headers }
  if (body !== null) fetchConfig.body = JSON.stringify(body)

  const url = `${API_URL}${endpoint}`

  // ── Execute request ────────────────────────────────────────
  let response
  try {
    response = await fetch(url, fetchConfig)
  } catch {
    throw { isNetworkError: true, message: `Cannot reach server at ${API_URL}. Check your IP.` }
  }

  // ── Handle 401: refresh then retry ONCE ──────────────────
  if (response.status === 401 && requiresAuth && !endpoint.includes('/auth/')) {
    const newToken = await refreshAccessToken()

    if (!newToken) {
      // Refresh failed → already redirected to login by refreshAccessToken()
      throw { isNetworkError: false, status: 401, message: 'Session expired. Please login again.' }
    }

    // Retry original request with new token — only once, no recursion
    fetchConfig.headers['Authorization'] = `Bearer ${newToken}`
    try {
      response = await fetch(url, fetchConfig)
    } catch {
      throw { isNetworkError: true, message: `Cannot reach server at ${API_URL}.` }
    }
  }

  // ── Parse response ─────────────────────────────────────────
  let data
  try {
    data = await response.json()
  } catch {
    data = { success: false, message: 'Invalid server response' }
  }

  if (!response.ok) {
    throw {
      isNetworkError: false,
      status:  response.status,
      message: data?.message || `Request failed (${response.status})`,
      data
    }
  }

  return data
}

// ── Token refresh — only ONE refresh at a time ─────────────────
// All concurrent requests that hit 401 wait for the SAME refresh promise.
// No request races, no duplicate refresh calls, no infinite loops.
async function refreshAccessToken() {
  // If already refreshing, wait for the same promise
  if (isRefreshing) {
    return refreshPromise
  }

  const storedRefreshToken = localStorage.getItem('refreshToken')
  if (!storedRefreshToken) {
    forceLogout()
    return null
  }

  isRefreshing   = true
  refreshPromise = doRefresh(storedRefreshToken).finally(() => {
    isRefreshing   = false
    refreshPromise = null
  })

  return refreshPromise
}

async function doRefresh(refreshToken) {
  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ refreshToken })
    })

    if (!response.ok) {
      // 401/403 from refresh endpoint — token invalid or expired
      forceLogout()
      return null
    }

    const data = await response.json()

    // Backend returns: { success, message, data: { accessToken, refreshToken, user } }
    const newAccessToken  = data?.data?.accessToken
    const newRefreshToken = data?.data?.refreshToken

    if (!newAccessToken) {
      forceLogout()
      return null
    }

    // Save new tokens
    localStorage.setItem('accessToken',  newAccessToken)
    localStorage.setItem('refreshToken', newRefreshToken)

    // Update user in auth store if returned
    if (data?.data?.user) {
      localStorage.setItem('user', JSON.stringify(data.data.user))
      // Sync Pinia store if available
      try {
        const { useAuthStore } = await import('@/stores/auth')
        const authStore = useAuthStore()
        if (authStore.user) {
          authStore.user = data.data.user
        }
      } catch {}
    }

    return newAccessToken

  } catch {
    // Network error during refresh
    forceLogout()
    return null
  }
}

function forceLogout() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  // Only redirect if not already on auth pages
  const path = window.location.pathname
  if (!path.includes('/login') && !path.includes('/register')) {
    window.location.href = '/login'
  }
}

// ── Public API ─────────────────────────────────────────────────
const api = {
  get:    (endpoint, auth = true)        => request('GET',    endpoint, null, auth),
  post:   (endpoint, body, auth = true)  => request('POST',   endpoint, body, auth),
  put:    (endpoint, body, auth = true)  => request('PUT',    endpoint, body, auth),
  patch:  (endpoint, body, auth = true)  => request('PATCH',  endpoint, body, auth),
  delete: (endpoint, auth = true)        => request('DELETE', endpoint, null, auth),
}

export { BACKEND_URL }
export default api