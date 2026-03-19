// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/utils/api'

export const useAuthStore = defineStore('auth', () => {

  // ── State ──────────────────────────────────────────────────
  const accessToken  = ref(localStorage.getItem('accessToken')  || null)
  const refreshToken = ref(localStorage.getItem('refreshToken') || null)
  const user         = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  // ── Getters ────────────────────────────────────────────────
  const isLoggedIn = computed(() => !!accessToken.value)
  const isAdmin    = computed(() => user.value?.roles?.includes('ROLE_ADMIN') ?? false)
  const fullName   = computed(() => user.value?.fullName || '')
  const username   = computed(() => user.value?.username || '')
  const email      = computed(() => user.value?.email    || '')
  const avatar     = computed(() => user.value?.profileImageUrl || null)

  // ── Helpers ────────────────────────────────────────────────
  function saveSession(data) {
    // data = { accessToken, refreshToken, user, ... }
    accessToken.value  = data.accessToken
    refreshToken.value = data.refreshToken
    user.value         = data.user

    localStorage.setItem('accessToken',  data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    localStorage.setItem('user',         JSON.stringify(data.user))
  }

  function clearSession() {
    accessToken.value  = null
    refreshToken.value = null
    user.value         = null

    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  // ── Actions ────────────────────────────────────────────────

  // REGISTER
  async function register(payload) {
    // payload: { fullName, username, email, password, confirmPassword }
    return await api.post('/auth/register', payload, false)
  }

  // VERIFY EMAIL
  async function verifyEmail(token) {
    return await api.get(`/auth/verify-email?token=${token}`, false)
  }

  // RESEND VERIFICATION
  async function resendVerification(emailAddr) {
    return await api.post(`/auth/resend-verification?email=${encodeURIComponent(emailAddr)}`, null, false)
  }

  // LOGIN — accepts { email, password }
  async function login({ email, password }) {
    const res = await api.post('/auth/login', { email, password }, false)
    // res = { success, message, data: { accessToken, refreshToken, user, ... } }
    saveSession(res.data)
    return res
  }

  // REFRESH TOKEN
  async function refresh() {
    if (!refreshToken.value) throw { message: 'No refresh token available' }

    const res = await api.post('/auth/refresh-token', {
      refreshToken: refreshToken.value
    }, false)

    saveSession(res.data)
    return res
  }

  // LOGOUT
  async function logout() {
    try {
      await api.post('/auth/logout', null, true)
    } catch {
      // Still clear locally even if server call fails
    } finally {
      clearSession()
    }
  }

  // FORGOT PASSWORD
  async function forgotPassword(emailAddr) {
    return await api.post('/auth/forgot-password', { email: emailAddr }, false)
  }

  // RESET PASSWORD
  async function resetPassword(payload) {
    // payload: { token, newPassword, confirmPassword }
    return await api.post('/auth/reset-password', payload, false)
  }

  // CHANGE PASSWORD (authenticated)
  async function changePassword(payload) {
    // payload: { currentPassword, newPassword, confirmPassword }
    return await api.post('/auth/change-password', payload, true)
  }

  // GET CURRENT USER (refresh from server)
  async function fetchMe() {
    const res = await api.get('/auth/me', true)
    user.value = res.data
    localStorage.setItem('user', JSON.stringify(res.data))
    return res.data
  }

  return {
    // state
    accessToken, refreshToken, user,
    // getters
    isLoggedIn, isAdmin, fullName, username, email, avatar,
    // actions
    login, register, verifyEmail, resendVerification,
    forgotPassword, resetPassword, changePassword,
    refresh, logout, fetchMe
  }
})