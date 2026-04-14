// src/utils/api.js
import { API_URL, BACKEND_URL } from '@/config'

let isRefreshing   = false
let refreshPromise = null

async function request(method, endpoint, body = null, requiresAuth = true) {
  const headers = { 'Content-Type': 'application/json' }
  const token   = localStorage.getItem('accessToken')
  
  // UPDATED: Always send token if available, even for public routes.
  // This helps backend identify user status (e.g. is-registered) on public lists.
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const fetchConfig = { method, headers }
  if (body !== null) fetchConfig.body = JSON.stringify(body)

  const url = `${API_URL}${endpoint}`

  let response
  try {
    response = await fetch(url, fetchConfig)
  } catch {
    throw { isNetworkError: true, message: `Cannot reach server at ${API_URL}.` }
  }

  // UPDATED: Only trigger refresh/logout if the route strictly REQUIRES auth
  if (response.status === 401 && requiresAuth && !endpoint.includes('/auth/')) {
    const newToken = await refreshAccessToken()

    if (!newToken) {
      throw { isNetworkError: false, status: 401, message: 'Session expired. Please login again.' }
    }

    fetchConfig.headers['Authorization'] = `Bearer ${newToken}`
    try {
      response = await fetch(url, fetchConfig)
    } catch {
      throw { isNetworkError: true, message: `Cannot reach server at ${API_URL}.` }
    }
  }

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

async function refreshAccessToken() {
  if (isRefreshing) return refreshPromise

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
      forceLogout()
      return null
    }

    const data = await response.json()
    const newAccessToken  = data?.data?.accessToken
    const newRefreshToken = data?.data?.refreshToken

    if (!newAccessToken) {
      forceLogout()
      return null
    }

    localStorage.setItem('accessToken',  newAccessToken)
    localStorage.setItem('refreshToken', newRefreshToken)

    if (data?.data?.user) {
      localStorage.setItem('user', JSON.stringify(data.data.user))
      try {
        const { useAuthStore } = await import('@/stores/auth')
        const authStore = useAuthStore()
        if (authStore.user) authStore.user = data.data.user
      } catch {}
    }

    return newAccessToken
  } catch {
    forceLogout()
    return null
  }
}

function forceLogout() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  const path = window.location.pathname
  if (!path.includes('/login') && !path.includes('/register')) {
    window.location.href = '/login'
  }
}

const api = {
  get:    (endpoint, auth = true)        => request('GET',    endpoint, null, auth),
  post:   (endpoint, body, auth = true)  => request('POST',   endpoint, body, auth),
  put:    (endpoint, body, auth = true)  => request('PUT',    endpoint, body, auth),
  patch:  (endpoint, body, auth = true)  => request('PATCH',  endpoint, body, auth),
  delete: (endpoint, auth = true)        => request('DELETE', endpoint, null, auth),
}

export { BACKEND_URL }
export default api