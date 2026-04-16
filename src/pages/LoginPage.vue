<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-transparent relative overflow-hidden font-sans">

    <!-- Background glows -->
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div class="absolute -top-24 -left-24 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px]"></div>
      <div class="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
    </div>

    <div class="w-full max-w-lg z-10">

      <!-- Page heading -->
      <div class="text-center mb-10">
        <h1 class="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
          Welcome <span class="text-blue-600">Back</span>
        </h1>
        <div class="flex items-center justify-center gap-3 mt-4">
          <div class="h-[1px] w-8 bg-red-500/50"></div>
          <p class="text-red-500 text-xs font-bold uppercase tracking-[0.4em]">Login Account</p>
          <div class="h-[1px] w-8 bg-red-500/50"></div>
        </div>
      </div>

      <!-- Card -->
      <div class="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-sm">

        <!-- Brand header -->
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 dark:bg-white/10 flex items-center justify-center">
            <img src="@/assets/logo.png" alt="RMEDU Logo" class="w-full h-full object-cover" />
          </div>
          <span class="text-sm font-semibold text-gray-900 dark:text-white">RMEDU Portal</span>
        </div>

        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">Sign in</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Enter your credentials to access your account</p>

        <form @submit.prevent="handleLogin" novalidate class="space-y-4">

          <!-- Email field -->
          <div class="space-y-1.5">
            <label for="email" class="text-[13px] font-medium text-gray-600 dark:text-gray-400">
              Email address
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="you@example.com"
              :class="[
                'w-full h-[42px] px-3 text-sm rounded-lg border transition-all focus:outline-none',
                'bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600',
                fieldError === 'email'
                  ? 'border-red-400 dark:border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
                  : 'border-gray-200 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
              ]"
              @input="clearErrors"
              required
            />
          </div>

          <!-- Password field -->
          <div class="space-y-1.5">
            <div class="flex justify-between items-center">
              <label for="password" class="text-[13px] font-medium text-gray-600 dark:text-gray-400">
                Password
              </label>
              <router-link
                to="/forgot-password"
                class="text-[13px] font-medium text-blue-500 hover:text-blue-400 hover:underline transition-colors"
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
                  'w-full h-[42px] px-3 pr-10 text-sm rounded-lg border transition-all focus:outline-none',
                  'bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600',
                  fieldError === 'password'
                    ? 'border-red-400 dark:border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
                    : 'border-gray-200 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                ]"
                @input="clearErrors"
                required
              />
              <button
                type="button"
                @click="showPass = !showPass"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                :aria-label="showPass ? 'Hide password' : 'Show password'"
              >
                <!-- Eye open -->
                <svg v-if="!showPass" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <!-- Eye off -->
                <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
                'flex items-start gap-2.5 p-3 rounded-lg border',
                error.type === 'success'
                  ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20'
                  : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20'
              ]"
            >
              <!-- Success icon -->
              <svg v-if="error.type === 'success'" class="w-4 h-4 text-green-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <!-- Error icon -->
              <svg v-else class="w-4 h-4 text-red-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>

              <div class="min-w-0">
                <p :class="[
                  'text-[13px] font-medium leading-snug',
                  error.type === 'success'
                    ? 'text-green-700 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                ]">
                  {{ error.text }}
                </p>

                <!-- Contextual action: wrong password → forgot password -->
                <router-link
                  v-if="error.action === 'forgot'"
                  to="/forgot-password"
                  class="text-[12px] text-red-500 dark:text-red-400 underline underline-offset-2 mt-1 inline-block hover:text-red-600 transition-colors"
                >
                  Reset your password →
                </router-link>

                <!-- Contextual action: unverified → resend email -->
                <button
                  v-if="error.action === 'resend'"
                  type="button"
                  @click="resendVerification"
                  :disabled="resendLoading"
                  class="text-[12px] text-red-500 dark:text-red-400 underline underline-offset-2 mt-1 inline-block hover:text-red-600 transition-colors disabled:opacity-50"
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
            class="w-full h-[42px] bg-gray-900 dark:bg-gradient-to-r dark:from-blue-800 dark:to-red-900 text-white text-sm font-semibold rounded-lg hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity mt-1 flex items-center justify-center"
          >
            <span v-if="!loading">Sign in</span>
            <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </button>

        </form>
      </div>

      <!-- Sign up link -->
      <div class="mt-10 text-center">
        <p class="text-gray-500 text-lg font-medium tracking-wide">
          Don't have an account?
          <router-link
            to="/register"
            class="text-white hover:text-red-500 font-black transition-colors ml-2 underline underline-offset-8 decoration-blue-600"
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

const router = useRouter()
const auth = useAuthStore()

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
  color: #94a3b8;
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
</style>