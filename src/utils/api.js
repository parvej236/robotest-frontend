// src/utils/api.js
// Pure fetch-based API client — no axios dependency

const BASE_URL = 'http://localhost:8080/api'

// ── Core fetch wrapper ─────────────────────────────────────────
async function request(method, endpoint, body = null, requiresAuth = true) {
  const headers = {
    'Content-Type': 'application/json'
  }

  // Attach JWT if available
  if (requiresAuth) {
    const token = localStorage.getItem('accessToken')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  const config = {
    method,
    headers
  }

  if (body !== null) {
    config.body = JSON.stringify(body)
  }

  let response
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, config)
  } catch (networkError) {
    // fetch() itself throws only on network failure (no internet, backend down)
    throw {
      isNetworkError: true,
      message: 'Cannot connect to server. Make sure the backend is running on port 8080.'
    }
  }

  // Parse JSON body
  let data
  try {
    data = await response.json()
  } catch {
    data = { success: false, message: 'Invalid response from server' }
  }

  // Handle 401 globally — session expired
  if (response.status === 401) {
    // Only auto-redirect if it's not a login attempt itself
    if (!endpoint.includes('/auth/login')) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
  }

  // If response is not OK, throw so catch blocks in stores/components handle it
  if (!response.ok) {
    throw {
      isNetworkError: false,
      status: response.status,
      message: data?.message || `Request failed with status ${response.status}`,
      data
    }
  }

  return data
}

// ── Convenience methods ────────────────────────────────────────
const api = {
  get:    (endpoint, requiresAuth = true)         => request('GET',    endpoint, null, requiresAuth),
  post:   (endpoint, body, requiresAuth = true)   => request('POST',   endpoint, body, requiresAuth),
  put:    (endpoint, body, requiresAuth = true)   => request('PUT',    endpoint, body, requiresAuth),
  patch:  (endpoint, body, requiresAuth = true)   => request('PATCH',  endpoint, body, requiresAuth),
  delete: (endpoint, requiresAuth = true)         => request('DELETE', endpoint, null, requiresAuth),
}

export default api