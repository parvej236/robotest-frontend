<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-transparent relative overflow-hidden">

    <!-- Background glows -->
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div class="absolute -top-24 -left-24 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
      <div class="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px]"></div>
    </div>

    <div class="w-full max-w-xl z-10">

      <!-- Page heading -->
      <div class="text-center mb-10">
        <h1 class="text-4xl md:text-6xl font-black text-white tracking-tighter italic leading-none">
          Welcome <span class="text-cyan-400">Back</span>
        </h1>
        <div class="flex items-center justify-center gap-3 mt-4">
          <div class="h-[1px] w-8 bg-cyan-500/30"></div>
          <p class="text-cyan-400 text-lg font-bold tracking-[0.4em]">Login Account</p>
          <div class="h-[1px] w-8 bg-cyan-500/30"></div>
        </div>
      </div>

      <!-- Card -->
      <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">

        <!-- Brand header -->
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
            <img src="@/assets/logo.png" alt="RMEDU Logo" class="w-full h-full object-cover" />
          </div>
          <span class="text-lg font-bold text-white/80 tracking-widest">RMEDU Portal</span>
        </div>

        <h2 class="text-3xl font-black text-white mb-1 italic">Sign in</h2>
        <p class="text-lg text-gray-400 mb-6">Enter your credentials to access your account</p>

        <form @submit.prevent="handleLogin" novalidate class="space-y-4">

          <!-- Email field -->
          <div class="space-y-1.5">
            <label for="email" class="text-lg font-bold text-gray-400 tracking-wider ml-1">
              Email Address
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="you@arena.com"
              :class="[
                'w-full h-[56px] px-4 text-xl rounded-xl border transition-all focus:outline-none focus:border-red-500',
                'bg-white/5 text-white placeholder:text-gray-500',
                fieldError === 'email'
                  ? 'border-red-500/50 bg-red-500/5 focus:border-red-400'
                  : 'border-white/10'
              ]"
              @input="clearErrors"
              required
            />
          </div>

          <!-- Password field -->
          <div class="space-y-1.5">
            <div class="flex justify-between items-center px-1">
              <label for="password" class="text-lg font-bold text-gray-400 tracking-wider">
                Password
              </label>
              <router-link
                to="/forgot-password"
                class="text-lg font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Forgot password?
              </router-link>
            </div>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPass ? 'text' : 'password'"
                placeholder="••••••••"
                :class="[
                  'w-full h-[56px] px-4 pr-12 text-xl rounded-xl border transition-all focus:outline-none focus:border-red-500',
                  'bg-white/5 text-white placeholder:text-gray-500',
                  fieldError === 'password'
                    ? 'border-red-500/50 bg-red-500/5 focus:border-red-400'
                    : 'border-white/10'
                ]"
                @input="clearErrors"
                required
              />
              <button
                type="button"
                @click="showPass = !showPass"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                :aria-label="showPass ? 'Hide password' : 'Show password'"
              >
                <!-- Eye open -->
                <svg v-if="!showPass" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <!-- Eye off -->
                <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Error message -->
          <Transition name="error-fade">
            <div
              v-if="error.text"
              :class="[
                'flex items-start gap-2.5 p-4 rounded-xl border',
                error.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              ]"
            >
              <!-- Success icon -->
              <svg v-if="error.type === 'success'" class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <!-- Error icon -->
              <svg v-else class="w-5 h-5 text-red-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>

              <div class="min-w-0">
                <p class="text-base font-bold leading-snug">
                  {{ error.text }}
                </p>

                <!-- Contextual action: wrong password → forgot password -->
                <router-link
                  v-if="error.action === 'forgot'"
                  to="/forgot-password"
                  class="text-base font-bold text-red-400 underline underline-offset-2 mt-1.5 inline-block hover:text-red-300 transition-colors"
                >
                  Reset your password →
                </router-link>

                <!-- Contextual action: unverified → resend email -->
                <button
                  v-if="error.action === 'resend'"
                  type="button"
                  @click="resendVerification"
                  :disabled="resendLoading"
                  class="text-base font-bold text-red-400 underline underline-offset-2 mt-1.5 inline-block hover:text-red-300 transition-colors disabled:opacity-50"
                >
                  {{ resendLoading ? 'Sending…' : 'Resend verification email →' }}
                </button>
              </div>
            </div>
          </Transition>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full h-[56px] bg-gradient-to-r from-red-500 to-cyan-500 hover:from-red-400 hover:to-cyan-400 text-xl font-black tracking-[0.2em] rounded-xl hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_4px_20px_rgba(239,68,68,0.25)] flex items-center justify-center gap-3 cursor-pointer mt-2"
          >
            <span v-if="!loading">Sign in</span>
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

      <!-- Sign up link -->
      <div class="mt-10 text-center">
        <p class="text-gray-500 text-xl font-medium tracking-wide">
          Don't have an account?
          <router-link
            to="/register"
            class="text-white hover:text-cyan-400 font-black transition-colors ml-2 underline underline-offset-8 decoration-cyan-500 text-xl"
          >
            Create Account
          </router-link>
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { BACKEND_URL } from '@/config'

const router = useRouter()
const auth = useAuthStore()

function loginWithGoogle() {
  window.location.href = `${BACKEND_URL}/oauth2/authorization/google`
}

const form        = ref({ email: '', password: '' })
const loading     = ref(false)
const resendLoading = ref(false)
const showPass    = ref(false)
const fieldError  = ref('') // 'email' | 'password' | ''

// Unified error object: { text, type, action }
// type   → 'error' | 'success'
// action → 'forgot' | 'resend' | null
const error = ref({ text: '', type: 'error', action: null })

function setError(text, action = null) {
  error.value = { text, type: 'error', action }
}

function setSuccess(text) {
  error.value = { text, type: 'success', action: null }
}

function clearErrors() {
  error.value   = { text: '', type: 'error', action: null }
  fieldError.value = ''
}

// ── Validation ─────────────────────────────────────────────
function validate() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!form.value.email.trim() && !form.value.password) {
    setError('Please enter your email address and password.')
    fieldError.value = 'email'
    return false
  }
  if (!form.value.email.trim()) {
    setError('Please enter your email address.')
    fieldError.value = 'email'
    return false
  }
  if (!emailRegex.test(form.value.email.trim())) {
    setError('That doesn\'t look like a valid email address.')
    fieldError.value = 'email'
    return false
  }
  if (!form.value.password) {
    setError('Please enter your password.')
    fieldError.value = 'password'
    return false
  }
  if (form.value.password.length < 6) {
    setError('Password must be at least 6 characters.')
    fieldError.value = 'password'
    return false
  }
  return true
}

// ── Login ──────────────────────────────────────────────────
async function handleLogin() {
  clearErrors()
  if (!validate()) return

  loading.value = true

  try {
    await auth.login({
      email:    form.value.email.trim(),
      password: form.value.password
    })
    router.push('/dashboard')
  } catch (e) {
    handleApiError(e)
  } finally {
    loading.value = false
  }
}

// ── API error mapping ──────────────────────────────────────
function handleApiError(e) {
  if (e.isNetworkError) {
    setError('No internet connection. Please check your network and try again.')
    return
  }

  switch (e.status) {
    case 400:
      setError('Something is wrong with the submitted data. Please check your inputs.')
      break
    case 401:
      setError('Incorrect email or password. Please try again.', 'forgot')
      fieldError.value = 'password'
      break
    case 403:
      setError('Your email hasn\'t been verified yet. Check your inbox for a verification link.', 'resend')
      break
    case 404:
      setError('No account found with this email address.')
      fieldError.value = 'email'
      break
    case 423:
      setError('Your account is temporarily locked due to too many failed attempts. Reset your password to regain access.', 'forgot')
      break
    case 429:
      setError('Too many login attempts. Please wait a few minutes before trying again.')
      break
    default:
      if (e.status >= 500) {
        setError('Our server ran into a problem. Please try again in a moment.')
      } else {
        setError(e.message || 'Login failed. Please try again.')
      }
  }
}

// ── Resend verification ────────────────────────────────────
async function resendVerification() {
  if (!form.value.email.trim()) {
    setError('Enter your email address above so we know where to send it.')
    fieldError.value = 'email'
    return
  }

  resendLoading.value = true
  try {
    await auth.resendVerification(form.value.email.trim())
    setSuccess('Verification email sent! Check your inbox (and spam folder).')
  } catch {
    setError('Could not send the verification email. Please try again.')
  } finally {
    resendLoading.value = false
  }
}
</script>

<style scoped>
::placeholder {
  font-weight: 400;
  color: #6b7280;
}

.error-fade-enter-active,
.error-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.error-fade-enter-from,
.error-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Glassmorphism focus effect */
input:focus {
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.2);
}
</style>