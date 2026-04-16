<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-[#020202] relative overflow-hidden font-sans">
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div class="absolute -top-24 -left-24 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
    </div>

    <div class="w-full max-w-lg z-10">
      <div class="text-center mb-10">
        <h1 class="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
          Recover <span class="text-red-600">Access</span>
        </h1>
        <div class="flex items-center justify-center gap-3 mt-4">
          <div class="h-[1px] w-8 bg-blue-500/50"></div>
          <p class="text-blue-500 text-xs font-bold uppercase tracking-[0.4em]">Forgot Password</p>
          <div class="h-[1px] w-8 bg-blue-500/50"></div>
        </div>
      </div>

      <div class="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-sm">
        <div v-if="!submitted">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">Reset link</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Enter your email and we'll send you a link to get back into your account.</p>

          <form @submit.prevent="handleForgot" class="space-y-4">
            <div class="space-y-1.5">
              <label for="email" class="text-[13px] font-medium text-gray-600 dark:text-gray-400">Email address</label>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="you@example.com"
                class="w-full h-[42px] px-3 text-sm rounded-lg border bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white border-gray-200 dark:border-white/10 focus:border-blue-500 focus:outline-none transition-all"
                required
              />
            </div>

            <p v-if="error" class="text-xs text-red-500 font-medium">{{ error }}</p>

            <button
              type="submit"
              :disabled="loading"
              class="w-full h-[42px] bg-gray-900 dark:bg-blue-700 text-white text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center"
            >
              <span v-if="!loading">Send Reset Link</span>
              <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </button>
          </form>
        </div>

        <div v-else class="text-center py-4">
          <div class="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-white mb-2">Check your email</h2>
          <p class="text-sm text-gray-400 mb-6">We've sent a password reset link to <span class="text-white font-medium">{{ email }}</span></p>
          <button @click="submitted = false" class="text-sm text-blue-500 hover:underline">Try another email</button>
        </div>
      </div>

      <div class="mt-8 text-center">
        <router-link to="/login" class="text-gray-400 hover:text-white text-sm font-medium transition-colors">
          ← Back to login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const email = ref('')
const loading = ref(false)
const submitted = ref(false)
const error = ref('')

async function handleForgot() {
  loading.value = true
  error.value = ''
  try {
    await auth.forgotPassword(email.value)
    submitted.value = true
  } catch (e) {
    error.value = e.message || 'Failed to send reset link.'
  } finally {
    loading.value = false
  }
}
</script>