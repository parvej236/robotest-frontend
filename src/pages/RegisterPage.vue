<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-transparent relative overflow-hidden">
    
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div class="absolute -top-24 -left-24 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
      <div class="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px]"></div>
    </div>

    <div class="w-full max-w-xl z-10">
      <div class="text-center mb-8">
        <h1 class="text-4xl md:text-6xl font-black text-white tracking-tighter italic leading-none">
          Join to <span class="text-red-500">RMEDU</span>
        </h1>
        <div class="flex items-center justify-center gap-3 mt-4">
          <div class="h-[1px] w-8 bg-cyan-500/30"></div>
          <p class="text-cyan-400 text-lg font-bold tracking-[0.4em]">Create New Account</p>
          <div class="h-[1px] w-8 bg-cyan-500/30"></div>
        </div>
      </div>

      <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
        
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
            <img src="@/assets/logo.png" alt="Logo" class="w-full h-full object-cover" />
          </div>
          <span class="text-lg font-bold text-white/80 tracking-widest">RMEDU Portal</span>
        </div>

        <div v-if="success" class="py-12 px-2 text-center animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
          
          <!-- Outer Pulsing Glow -->
          <div class="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
            <div class="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse"></div>
            <div class="absolute inset-0 border border-cyan-500/30 rounded-full scale-110 opacity-50 animate-ping [animation-duration:3s]"></div>
            <div class="relative w-20 h-20 bg-gradient-to-tr from-cyan-500/20 to-blue-500/10 text-cyan-400 rounded-full flex items-center justify-center border-2 border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
              <svg class="w-10 h-10 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h2 class="text-3xl font-black text-white mb-4 tracking-tight italic">
            Welcome to the <span class="text-cyan-400">Arena!</span>
          </h2>
          
          <p class="text-gray-300 text-lg leading-relaxed mb-8 max-w-md mx-auto">
            We've sent a verification link to your email. Click the link inside to activate your account and start competing.
          </p>

          <div class="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8 flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
            <span class="text-xs font-bold text-gray-500 tracking-wider">VERIFICATION SENT TO</span>
            <span class="text-cyan-400 font-mono font-bold text-lg tracking-wide break-all px-3 py-1 rounded bg-cyan-500/5 border border-cyan-500/10">
              {{ form.email }}
            </span>
          </div>

          <router-link to="/login" class="inline-block w-full py-4.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(6,182,212,0.3)] tracking-wider text-xl cursor-pointer text-center">
            Proceed to Login
          </router-link>
        </div>

        <form v-else @submit.prevent="handleRegister" class="space-y-4">
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-lg font-bold text-gray-400 tracking-wider ml-1">Full Name</label>
              <input v-model="form.fullName" type="text" placeholder="John Doe"
                class="w-full h-[56px] px-4 text-xl rounded-xl border border-white/10 bg-white/5 text-white focus:border-red-500 focus:outline-none transition-all" required />
            </div>

            <div class="space-y-1.5">
              <div class="flex justify-between items-center px-1">
                <label class="text-lg font-bold text-gray-400 tracking-wider">Username</label>
                <div v-if="status.username.loading" class="w-3 h-3 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
              </div>
              <input v-model="form.username" type="text" placeholder="johndoe"
                :class="[
                  'w-full h-[56px] px-4 text-xl rounded-xl border bg-white/5 text-white focus:outline-none transition-all',
                  status.username.type === 'error' ? 'border-red-500/50 bg-red-500/5' : 
                  status.username.type === 'success' ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 focus:border-red-500'
                ]" required />
              <p v-if="status.username.message" :class="status.username.type === 'error' ? 'text-red-400' : 'text-emerald-400'" class="text-base font-black italic tracking-tight ml-1">
                {{ status.username.message }}
              </p>
            </div>
          </div>

          <div class="space-y-1.5">
            <div class="flex justify-between items-center px-1">
              <label class="text-lg font-bold text-gray-400 tracking-wider">Email Address</label>
              <div v-if="status.email.loading" class="w-3 h-3 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
            </div>
            <input v-model="form.email" type="email" placeholder="you@arena.com"
              :class="[
                'w-full h-[56px] px-4 text-xl rounded-xl border bg-white/5 text-white focus:outline-none transition-all',
                status.email.type === 'error' ? 'border-red-500/50 bg-red-500/5' : 
                status.email.type === 'success' ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 focus:border-red-500'
              ]" required />
            <p v-if="status.email.message" :class="status.email.type === 'error' ? 'text-red-400' : 'text-emerald-400'" class="text-base font-black italic tracking-tight ml-1">
              {{ status.email.message }}
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-lg font-bold text-gray-400 tracking-wider ml-1">Password</label>
              <input v-model="form.password" type="password" placeholder="••••••••"
                :class="[
                  'w-full h-[56px] px-4 text-xl rounded-xl border bg-white/5 text-white focus:outline-none transition-all',
                  status.password.type === 'error' ? 'border-red-500/50 bg-red-500/5' :
                  status.password.type === 'success' ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 focus:border-red-500'
                ]" required />
              <p v-if="status.password.message" :class="status.password.type === 'error' ? 'text-red-400' : 'text-emerald-400'" class="text-base font-black italic tracking-tight ml-1">
                {{ status.password.message }}
              </p>
            </div>
            <div class="space-y-1.5">
              <label class="text-lg font-bold text-gray-400 tracking-wider ml-1">Confirm</label>
              <input v-model="form.confirmPassword" type="password" placeholder="••••••••"
                :class="[
                  'w-full h-[56px] px-4 text-xl rounded-xl border bg-white/5 text-white focus:outline-none transition-all',
                  form.confirmPassword && form.password !== form.confirmPassword ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 focus:border-red-500'
                ]" required />
              <p v-if="form.confirmPassword && form.password !== form.confirmPassword" class="text-red-400 text-base font-black italic tracking-tight ml-1">
                Passwords do not match.
              </p>
            </div>
          </div>

          <div v-if="errors.length" class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl space-y-1">
            <p v-for="e in errors" :key="e" class="text-red-400 text-base font-bold flex items-center gap-2">
              <span class="w-1 h-1 bg-red-500 rounded-full"></span> {{ e }}
            </p>
          </div>

          <button type="submit" 
            class="w-full h-[56px] bg-gradient-to-r from-red-500 to-cyan-500 hover:from-red-400 hover:to-cyan-400 text-white text-xl font-black tracking-[0.2em] rounded-xl hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_4px_20px_rgba(239,68,68,0.25)] flex items-center justify-center gap-3 cursor-pointer"
            :disabled="loading || status.username.loading || status.email.loading || status.username.type === 'error' || status.email.type === 'error' || form.password.length < 6 || form.password !== form.confirmPassword">
            <span v-if="!loading">Initialize Account</span>
            <div v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </button>
        </form>

        <!-- Divider -->
        <div class="flex items-center my-6">
          <div class="flex-grow h-[1px] bg-white/10"></div>
          <span class="px-4 text-base font-bold text-gray-500 tracking-widest uppercase">or</span>
          <div class="flex-grow h-[1px] bg-white/10"></div>
        </div>

        <!-- Google OAuth Button -->
        <button
          type="button"
          @click="loginWithGoogle"
          class="w-full h-[56px] bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 hover:border-cyan-500/50 hover:bg-cyan-500/5 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] text-white text-lg font-bold tracking-wide cursor-pointer"
        >
          <!-- Google Icon -->
          <svg class="w-6 h-6 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.355 0 3.39 2.673 1.482 6.564l3.784 3.201z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.273c0-.818-.073-1.609-.209-2.373H12v4.582h6.445a5.513 5.513 0 0 1-2.391 3.618l3.727 2.891c2.182-2.009 3.445-4.973 3.445-8.718z"
            />
            <path
              fill="#FBBC05"
              d="M5.266 14.235A7.143 7.143 0 0 1 4.909 12c0-.79.136-1.555.357-2.265L1.482 6.534A11.93 11.93 0 0 0 0 12c0 1.955.473 3.8 1.309 5.436l3.957-3.201z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.245 0 5.973-1.082 7.964-2.927l-3.727-2.891c-1.036.691-2.364 1.109-4.237 1.109-3.255 0-6.018-2.2-7-5.164l-3.955 3.064C3.018 21.055 7.136 24 12 24z"
            />
          </svg>
          <span class="text-xl font-bold tracking-wider">Continue with Google</span>
        </button>
      </div>

      <div class="mt-6 text-center">
        <p class="text-gray-500 text-xl font-medium">
          Already have an account?
          <router-link to="/login" class="text-white hover:text-blue-500 font-black transition-colors ml-2 underline underline-offset-4 decoration-blue-600 tracking-wider text-xl">
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
import { BACKEND_URL } from '@/config'

const auth = useAuthStore()

function loginWithGoogle() {
  window.location.href = `${BACKEND_URL}/oauth2/authorization/google`
}
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
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.2);
}
</style>