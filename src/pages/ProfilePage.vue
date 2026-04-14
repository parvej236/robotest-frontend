<!-- src/pages/ProfilePage.vue -->
<template>
  <div class="min-h-screen pt-20 px-4 pb-12">
    <div class="max-w-3xl mx-auto">
          <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div class="absolute -top-48 -left-48 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
    </div>
      <div class="mb-6">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-4 h-px bg-red-700"></div>
          <span class="text-xs font-display tracking-widest text-neon-red uppercase">Identity</span>
        </div>
        <h1 class="font-display text-2xl font-black text-white tracking-wide uppercase">Edit Profile</h1>
      </div>

      <div class="grid md:grid-cols-3 gap-6">

        <!-- Avatar card -->
        <div class="glass-card p-6 text-center neon-border-red">
          <div class="relative inline-block mb-4">
            <div
              class="w-28 h-28 rounded-full border-2 border-neon-red/50 overflow-hidden bg-dark-700 flex items-center justify-center mx-auto">
              <img v-if="displayAvatarUrl" :src="displayAvatarUrl" :key="displayAvatarUrl"
                class="w-full h-full object-cover" alt="Avatar" @error="onImageError" />
              <span v-else class="font-display text-4xl font-black text-neon-red">
                {{ auth.username?.charAt(0)?.toUpperCase() }}
              </span>
            </div>
            <label
              class="absolute bottom-0 right-0 w-8 h-8 bg-red-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors">
              <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" class="hidden"
                @change="handleAvatarChange" />
            </label>
          </div>

          <p class="font-display font-bold text-white text-sm">{{ auth.fullName }}</p>
          <p class="text-xs font-mono text-white/40 mt-0.5 mb-4">@{{ auth.username }}</p>

          <button v-if="avatarFile" @click="uploadAvatar" :disabled="uploadingAvatar"
            class="btn-primary w-full text-xs py-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <svg v-if="uploadingAvatar" class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {{ uploadingAvatar ? 'Uploading...' : 'Upload Avatar' }}
          </button>

          <p v-if="imgError" class="text-xs text-neon-red mt-2 font-body">
            Image failed to load. Check backend IP in src/config.js
          </p>
        </div>

        <!-- Profile form -->
        <div class="md:col-span-2 glass-card p-6">
          <h2 class="section-title mb-5">Personal Information</h2>
          <form @submit.prevent="handleSave" class="space-y-4">
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label class="label-text">Full Name</label>
                <input v-model="form.fullName" type="text" class="input-field" />
              </div>
              <div>
                <label class="label-text">Gender</label>
                <select v-model="form.gender" class="input-field">
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label class="label-text">Registration Number</label>
                <input v-model="form.registrationNumber" type="text" class="input-field" placeholder="REG-XXXX" />
              </div>
              <div>
                <label class="label-text">Roll Number</label>
                <input v-model="form.rollNumber" type="text" class="input-field" placeholder="ROLL-XXXX" />
              </div>
              <div class="sm:col-span-2">
                <label class="label-text">University / Institution</label>
                <input v-model="form.university" type="text" class="input-field" placeholder="Dhaka University" />
              </div>
              <div class="sm:col-span-2">
                <label class="label-text">Hobby</label>
                <input v-model="form.hobby" type="text" class="input-field"
                  placeholder="Reading, Gardening, Tourism, ..." />
              </div>
              <div class="sm:col-span-2">
                <label class="label-text">Bio</label>
                <textarea v-model="form.bio" class="input-field resize-none" rows="3"
                  placeholder="Tell the world about yourself..."></textarea>
              </div>
            </div>

            <div v-if="msg" :class="['text-xs font-body px-3 py-2 rounded border',
              success
                ? 'text-green-400 border-green-500/30 bg-green-500/10'
                : 'text-neon-red border-neon-red/30 bg-red-700/10']">
              {{ msg }}
            </div>

            <button type="submit" :disabled="saving"
              class="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api, { BACKEND_URL } from '@/utils/api'

const auth = useAuthStore()

const form = ref({
  fullName: '', gender: '', registrationNumber: '',
  rollNumber: '', university: '', hobby: '', bio: ''
})

const avatarFile = ref(null)
const previewUrl = ref(null)
const savedAvatarPath = ref(null)
const saving = ref(false)
const uploadingAvatar = ref(false)
const msg = ref('')
const success = ref(false)
const imgError = ref(false)

// Builds the correct full URL from a relative path like /uploads/profiles/x.jpg
// Uses BACKEND_URL from config.js — works on any IP, not just localhost
function toFullUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return BACKEND_URL + path
}

// Single computed that drives <img :src> — prefers local blob preview, then saved URL
const displayAvatarUrl = computed(() => {
  if (previewUrl.value) return previewUrl.value
  if (savedAvatarPath.value) return toFullUrl(savedAvatarPath.value)
  return null
})

function onImageError() {
  imgError.value = true
  console.error('[Avatar] Failed to load:', displayAvatarUrl.value)
  console.error('[Avatar] Make sure BACKEND_URL in src/config.js is correct:', BACKEND_URL)
}

// ── Load profile ────────────────────────────────────────────
onMounted(async () => {
  try {
    const res = await api.get('/users/me')
    const p = res.data

    form.value = {
      fullName: p.fullName || '',
      gender: p.gender || '',
      registrationNumber: p.registrationNumber || '',
      rollNumber: p.rollNumber || '',
      university: p.university || '',
      hobby: p.hobby || '',
      bio: p.bio || ''
    }

    savedAvatarPath.value = p.profileImageUrl || null

    if (auth.user) {
      auth.user.profileImageUrl = p.profileImageUrl || null
      localStorage.setItem('user', JSON.stringify(auth.user))
    }

  } catch (e) {
    console.error('Failed to load profile:', e.message)
  }
})

// ── Avatar: pick file ────────────────────────────────────────
function handleAvatarChange(e) {
  const file = e.target.files[0]
  if (!file) return
  imgError.value = false
  avatarFile.value = file
  previewUrl.value = URL.createObjectURL(file)
  e.target.value = ''
}

// ── Avatar: upload ───────────────────────────────────────────
async function uploadAvatar() {
  if (!avatarFile.value) return
  uploadingAvatar.value = true
  imgError.value = false
  msg.value = ''

  try {
    const fd = new FormData()
    fd.append('file', avatarFile.value)

    const token = localStorage.getItem('accessToken')

    // Raw fetch — no Content-Type header, browser sets multipart boundary automatically
    const response = await fetch(`${BACKEND_URL}/api/users/me/avatar`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: fd
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data?.message || `Upload failed (${response.status})`)

    // data.data.profileImageUrl = "/uploads/profiles/uuid.jpg"
    savedAvatarPath.value = data.data?.profileImageUrl || null

    // Clear blob preview — displayAvatarUrl computed now uses savedAvatarPath
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
    avatarFile.value = null

    if (auth.user) {
      auth.user.profileImageUrl = savedAvatarPath.value
      localStorage.setItem('user', JSON.stringify(auth.user))
    }

    msg.value = 'Avatar updated successfully!'
    success.value = true

  } catch (e) {
    msg.value = e.message || 'Failed to upload avatar'
    success.value = false
  } finally {
    uploadingAvatar.value = false
  }
}

// ── Save profile ─────────────────────────────────────────────
async function handleSave() {
  saving.value = true
  msg.value = ''

  try {
    const res = await api.put('/users/me', form.value)

    if (auth.user) {
      auth.user.fullName = form.value.fullName
      localStorage.setItem('user', JSON.stringify(auth.user))
    }

    msg.value = res.message || 'Profile saved successfully!'
    success.value = true

  } catch (e) {
    msg.value = e.message || 'Failed to save profile'
    success.value = false
  } finally {
    saving.value = false
  }
}
</script>