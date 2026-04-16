<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-transparent relative overflow-hidden font-sans">
    
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div class="absolute -top-24 -left-24 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div class="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px]"></div>
    </div>

    <div class="w-full max-w-lg z-10">
      <div class="text-center mb-10">
        <h1 class="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
          Join to <span class="text-red-600">RMEDU</span>
        </h1>
        <div class="flex items-center justify-center gap-3 mt-4">
          <div class="h-[1px] w-8 bg-blue-500/50"></div>
          <p class="text-blue-500 text-xs font-bold uppercase tracking-[0.4em]">Create New Account</p>
          <div class="h-[1px] w-8 bg-blue-500/50"></div>
        </div>
      </div>

      <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
        
        <div class="flex items-center gap-3 mb-8">
          <div class="w-8 h-8 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
            <img src="@/assets/logo.png" alt="Logo" class="w-full h-full object-cover" />
          </div>
          <span class="text-sm font-semibold text-white/70 tracking-widest uppercase">RMEDU Portal</span>
        </div>

        <div v-if="success" class="py-10 text-center animate-in fade-in zoom-in duration-500">
          <div class="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 class="text-2xl font-black text-white mb-2 uppercase italic">Account Created</h2>
          <p class="text-gray-400 mb-8 px-4 text-sm">Check <span class="text-blue-400 font-bold">{{ form.email }}</span> to verify your account.</p>
          <router-link to="/login" class="inline-block w-full py-4 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-all uppercase tracking-widest text-xs">
            Proceed to Login
          </router-link>
        </div>

        <form v-else @submit.prevent="handleRegister" class="space-y-5">
          
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
              <input v-model="form.fullName" type="text" placeholder="John Doe"
                class="w-full h-[48px] px-4 text-sm rounded-xl border border-white/10 bg-white/5 text-white focus:border-blue-500 focus:outline-none transition-all" required />
            </div>

            <div class="space-y-2">
              <div class="flex justify-between items-center px-1">
                <label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Username</label>
                <div v-if="status.username.loading" class="w-3 h-3 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
              <input v-model="form.username" type="text" placeholder="johndoe"
                :class="[
                  'w-full h-[48px] px-4 text-sm rounded-xl border bg-white/5 text-white focus:outline-none transition-all',
                  status.username.type === 'error' ? 'border-red-500 bg-red-500/5' : 
                  status.username.type === 'success' ? 'border-green-500 bg-green-500/5' : 'border-white/10 focus:border-blue-500'
                ]" required />
              <p v-if="status.username.message" :class="status.username.type === 'error' ? 'text-red-500' : 'text-green-500'" class="text-[10px] font-black uppercase italic tracking-tighter ml-1">
                {{ status.username.message }}
              </p>
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between items-center px-1">
              <label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
              <div v-if="status.email.loading" class="w-3 h-3 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
            </div>
            <input v-model="form.email" type="email" placeholder="you@arena.com"
              :class="[
                'w-full h-[48px] px-4 text-sm rounded-xl border bg-white/5 text-white focus:outline-none transition-all',
                status.email.type === 'error' ? 'border-red-500 bg-red-500/5' : 
                status.email.type === 'success' ? 'border-green-500 bg-green-500/5' : 'border-white/10 focus:border-blue-500'
              ]" required />
            <p v-if="status.email.message" :class="status.email.type === 'error' ? 'text-red-500' : 'text-green-500'" class="text-[10px] font-black uppercase italic tracking-tighter ml-1">
              {{ status.email.message }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
              <input v-model="form.password" type="password" placeholder="••••••••"
                :class="[
                  'w-full h-[48px] px-4 text-sm rounded-xl border bg-white/5 text-white focus:outline-none transition-all',
                  status.password.type === 'error' ? 'border-red-500 bg-red-500/5' :
                  status.password.type === 'success' ? 'border-green-500 bg-green-500/5' : 'border-white/10 focus:border-blue-500'
                ]" required />
              <p v-if="status.password.message" :class="status.password.type === 'error' ? 'text-red-500' : 'text-green-500'" class="text-[10px] font-black uppercase italic tracking-tighter ml-1">
                {{ status.password.message }}
              </p>
            </div>
            <div class="space-y-2">
              <label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Confirm</label>
              <input v-model="form.confirmPassword" type="password" placeholder="••••••••"
                :class="[
                  'w-full h-[48px] px-4 text-sm rounded-xl border bg-white/5 text-white focus:outline-none transition-all',
                  form.confirmPassword && form.password !== form.confirmPassword ? 'border-red-500 bg-red-500/5' : 'border-white/10 focus:border-blue-500'
                ]" required />
              <p v-if="form.confirmPassword && form.password !== form.confirmPassword" class="text-red-500 text-[10px] font-black uppercase italic tracking-tighter ml-1">
                Passwords do not match.
              </p>
            </div>
          </div>

          <div v-if="errors.length" class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl space-y-1">
            <p v-for="e in errors" :key="e" class="text-red-500 text-[12px] font-bold uppercase flex items-center gap-2">
              <span class="w-1 h-1 bg-red-500 rounded-full"></span> {{ e }}
            </p>
          </div>

          <button type="submit" 
            class="w-full h-[52px] bg-gradient-to-r from-red-600 to-blue-700 text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-3"
            :disabled="loading || status.username.loading || status.email.loading || status.username.type === 'error' || status.email.type === 'error' || form.password.length < 6 || form.password !== form.confirmPassword">
            <span v-if="!loading">Initialize Account</span>
            <div v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </button>
        </form>
      </div>

      <div class="mt-8 text-center">
        <p class="text-gray-500 text-lg font-medium">
          Already have an account?
          <router-link to="/login" class="text-white hover:text-blue-500 font-black transition-colors ml-2 underline underline-offset-8 decoration-blue-600 tracking-widest text-lg">
            Login
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const form = ref({ fullName: '', username: '', email: '', password: '', confirmPassword: '' })
const loading = ref(false)
const errors = ref([])
const success = ref(false)

// UI Status for real-time validation
const status = reactive({
  username: { type: '', message: '', loading: false },
  email: { type: '', message: '', loading: false },
  password: { type: '', message: '', loading: false }
})

function parseBooleanResponse(res) {
  if (typeof res === 'boolean') return res
  if (typeof res === 'string') return res.toLowerCase() === 'true'
  if (res && typeof res === 'object') {
    if (typeof res.data === 'boolean') return res.data
    if (typeof res.exists === 'boolean') return res.exists
  }
  return null
}

// ── INSTANT USERNAME CHECK (Debounced) ───────────────────
let userTimer
let usernameCheckId = 0
watch(() => form.value.username, (rawVal) => {
  const val = rawVal.trim()
  clearTimeout(userTimer)
  usernameCheckId += 1
  const myCheckId = usernameCheckId

  if (val.length < 1) {
    status.username = { type: '', message: '', loading: false }
    return
  }
  
  // Clear old status while the async check is running.
  status.username.type = ''
  status.username.message = ''
  status.username.loading = true
  userTimer = setTimeout(async () => {
    try {
      const res = await auth.checkUsername(val)
      const exists = parseBooleanResponse(res)

      // If user kept typing, ignore out-of-date responses.
      if (myCheckId !== usernameCheckId) return

      if (exists === null) throw new Error('Unexpected username check response')
      
      if (exists) {
        status.username = { type: 'error', message: '❌ Username already taken', loading: false }
      } else {
        status.username = { type: 'success', message: '✅ Username available', loading: false }
      }
    } catch {
      if (myCheckId !== usernameCheckId) return
      status.username = { type: '', message: '', loading: false }
    }
  }, 500) // 500ms delay after user stops typing
})

// ── INSTANT EMAIL CHECK (Debounced) ──────────────────────
let emailTimer
let emailCheckId = 0
watch(() => form.value.email, (rawVal) => {
  const val = rawVal.trim()
  clearTimeout(emailTimer)
  emailCheckId += 1
  const myCheckId = emailCheckId

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!regex.test(val)) {
    status.email = { type: '', message: '', loading: false }
    return
  }

  // Clear old status while the async check is running.
  status.email.type = ''
  status.email.message = ''
  status.email.loading = true
  emailTimer = setTimeout(async () => {
    try {
      const res = await auth.checkEmail(val)
      const exists = parseBooleanResponse(res)

      // If user kept typing, ignore out-of-date responses.
      if (myCheckId !== emailCheckId) return

      if (exists === null) throw new Error('Unexpected email check response')

      if (exists) {
        status.email = { type: 'error', message: '❌ Email already registered', loading: false }
      } else {
        status.email = { type: 'success', message: '✅ Email is clear', loading: false }
      }
    } catch {
      if (myCheckId !== emailCheckId) return
      status.email = { type: '', message: '', loading: false }
    }
  }, 500)
})

// ── PASSWORD MIN LENGTH VALIDATION ───────────────────────
watch(() => form.value.password, (val) => {
  if (!val) {
    status.password = { type: '', message: '', loading: false }
    return
  }

  if (val.length < 6) {
    status.password = { type: 'error', message: 'Password must be at least 6 characters', loading: false }
    return
  }

  status.password = { type: 'success', message: '✅ Password length OK', loading: false }
})

// ── HANDLE REGISTRATION ──────────────────────────────────
async function handleRegister() {
  errors.value = []
  
  // Guard Clauses
  const username = form.value.username.trim()
  const email = form.value.email.trim()

  if (username.length < 1) {
    errors.value = ['Username is required.']
    return
  }
  if (email.length < 1) {
    errors.value = ['Email is required.']
    return
  }
  if (status.username.type === 'error' || status.email.type === 'error') {
    errors.value = ['Please resolve existing credential errors.']
    return
  }
  if (form.value.password.length < 6) {
    errors.value = ['Password must be at least 6 characters.']
    return
  }
  if (form.value.password !== form.value.confirmPassword) {
    errors.value = ['Passwords do not match.']
    return
  }

  // Final server-side availability checks (prevents success screen
  // if the UI instant checks didn't complete or got overwritten).
  try {
    const [usernameRes, emailRes] = await Promise.all([
      auth.checkUsername(username),
      auth.checkEmail(email)
    ])
    const usernameExists = parseBooleanResponse(usernameRes)
    const emailExists = parseBooleanResponse(emailRes)

    if (usernameExists === null || emailExists === null) {
      errors.value = ['Unable to validate username/email. Please try again.']
      return
    }
    if (usernameExists) errors.value.push('❌ Username already taken')
    if (emailExists) errors.value.push('❌ Email already registered')
    if (errors.value.length) return
  } catch (e) {
    // api.js throws objects like:
    // { isNetworkError, status, message, data }
    const msg = e?.isNetworkError
      ? 'Connectivity lost. Arena server offline.'
      : (e?.message || 'Unable to validate username/email.')
    errors.value = [msg]
    return
  }

  loading.value = true
  try {
    const res = await auth.register(form.value)
    // Spring Boot ApiResponse structure check
    if (res.success || res.status === 201) {
      success.value = true
    }
  } catch (e) {
    const apiData = e.response?.data
    if (apiData) {
      // Main Message
      if (apiData.message) errors.value.push(apiData.message)
      // JSR-303 Field Errors (Map<String, String>)
      if (apiData.data && typeof apiData.data === 'object') {
        Object.values(apiData.data).forEach(msg => {
          if (!errors.value.includes(msg)) errors.value.push(msg)
        })
      }
    } else {
      errors.value = [e?.message || 'Connectivity lost. Arena server offline.']
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Glassmorphism focus effect */
input:focus {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.15);
}
</style>