
<!-- src/pages/LoginPage.vue -->
<template>
  <div class="min-h-screen pt-20 flex items-center justify-center px-4">
    <div class="w-full max-w-md">

      <!-- Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-2 mb-4">
          <div class="w-6 h-px bg-neon-red"></div>
          <span class="text-xs font-display tracking-widest text-neon-red uppercase">Authentication</span>
          <div class="w-6 h-px bg-neon-red"></div>
        </div>
        <h1 class="font-display text-3xl font-black text-white tracking-wider uppercase">Welcome Back</h1>
        <p class="text-white/40 font-body text-sm mt-2">Enter your credentials to access the arena</p>
      </div>

      <!-- Card -->
      <div class="glass-card neon-border-red p-8 relative">
        <div class="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-neon-red"></div>
        <div class="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-neon-red"></div>

        <form @submit.prevent="handleLogin" class="space-y-5" novalidate>

          <!-- Email -->
          <div>
            <label for="email" class="label-text">Email Address</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="your@gmail.com"
              autocomplete="email"
              class="input-field"
              :class="error ? 'border-neon-red/80' : ''"
              @input="error = ''"
              required
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="label-text">Password</label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPass ? 'text' : 'password'"
                placeholder="Type your password"
                autocomplete="current-password"
                class="input-field pr-10"
                @input="error = ''"
                required
              />
              <button
                type="button"
                :aria-label="showPass ? 'Hide password' : 'Show password'"
                @click="showPass = !showPass"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path v-if="!showPass" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Forgot password -->
          <div class="flex justify-end -mt-1">
            <router-link
              to="/forgot-password"
              class="text-xs font-body text-white/40 hover:text-neon-blue transition-colors"
            >
              Forgot password?
            </router-link>
          </div>

          <!-- Error -->
          <div
            v-if="error"
            class="flex items-center gap-2 px-3 py-2.5 bg-neon-red/10 border border-neon-red/30 rounded text-neon-red text-xs font-body"
          >
            <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ error }}
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="btn-primary w-full flex justify-center items-center gap-2
                   disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ loading ? 'Authenticating...' : 'Login' }}
          </button>

        </form>

        <!-- Register link -->
        <div class="mt-6 text-center">
          <p class="text-sm font-body text-white/40">
            No account yet?
            <router-link to="/register" class="text-neon-blue hover:text-white ml-1 transition-colors">
              Register here
            </router-link>
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth   = useAuthStore()

const form     = ref({ email: '', password: '' })
const loading  = ref(false)
const error    = ref('')
const showPass = ref(false)

async function handleLogin() {
  if (!form.value.email.trim() || !form.value.password) {
    error.value = 'Please fill in all fields'
    return
  }

  error.value   = ''
  loading.value = true

  try {
    await auth.login({
      email:    form.value.email.trim(),
      password: form.value.password
    })

    router.push('/dashboard')

  } catch (e) {
    // e is thrown from api.js — has isNetworkError, status, message
    if (e.isNetworkError) {
      error.value = e.message // "Cannot connect to server..."
    } else if (e.status === 401) {
      error.value = e.message || 'Invalid email or password'
    } else if (e.status === 403) {
      error.value = 'Access denied'
    } else {
      error.value = e.message || 'Something went wrong. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>