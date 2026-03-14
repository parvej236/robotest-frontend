import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/utils/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.roles?.includes('ROLE_ADMIN') || false)
  const username = computed(() => user.value?.username || '')
  const fullName = computed(() => user.value?.fullName || '')
  const avatar = computed(() => user.value?.profileImageUrl || null)

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password })
    const data = res.data.data
    token.value = data.token
    user.value = {
      email: data.email,
      username: data.username,
      fullName: data.fullName,
      roles: data.roles,
      profileImageUrl: data.profileImageUrl
    }
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(user.value))
    return data
  }

  async function register(payload) {
    const res = await api.post('/auth/register', payload)
    return res.data
  }

  async function verifyEmail(token_) {
    const res = await api.get(`/auth/verify-email?token=${token_}`)
    return res.data
  }

  async function refreshProfile() {
    const res = await api.get('/users/me')
    const profile = res.data.data
    user.value = {
      ...user.value,
      fullName: profile.fullName,
      profileImageUrl: profile.profileImageUrl,
      university: profile.university,
      bio: profile.bio,
      gender: profile.gender,
      rollNumber: profile.rollNumber,
      registrationNumber: profile.registrationNumber,
      hobby: profile.hobby,
    }
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return { token, user, isLoggedIn, isAdmin, username, fullName, avatar,
           login, register, verifyEmail, refreshProfile, logout }
})
