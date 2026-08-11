<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-transparent relative overflow-hidden">
    <!-- Background glows -->
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div class="absolute -top-24 -left-24 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
      <div class="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px]"></div>
    </div>

    <div class="w-full max-w-xl z-10">
      <div class="text-center mb-10">
        <h1 class="text-4xl md:text-6xl font-black text-white tracking-tighter italic leading-none">
          Recover <span class="text-red-500">Access</span>
        </h1>
        <div class="flex items-center justify-center gap-3 mt-4">
          <div class="h-[1px] w-8 bg-cyan-500/30"></div>
          <p class="text-cyan-400 text-lg font-bold tracking-[0.4em]">Forgot Password</p>
          <div class="h-[1px] w-8 bg-cyan-500/30"></div>
        </div>
      </div>

      <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div v-if="!submitted">
          <h2 class="text-3xl font-black text-white mb-1 italic">Reset Link</h2>
          <p class="text-lg text-gray-400 mb-6">Enter your email and we'll send you a link to get back into your account.</p>

          <form @submit.prevent="handleForgot" class="space-y-4">
            <div class="space-y-1.5">
              <label for="email" class="text-lg font-bold text-gray-400 tracking-wider ml-1">Email Address</label>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="you@arena.com"
                class="w-full h-[56px] px-4 text-xl rounded-xl border bg-white/5 text-white border-white/10 focus:border-red-500 focus:outline-none transition-all"
                required
              />
            </div>

            <p v-if="error" class="text-base text-red-400 font-bold italic ml-1">{{ error }}</p>

            <button
              type="submit"
              :disabled="loading"
              class="w-full h-[56px] bg-gradient-to-r from-red-500 to-cyan-500 hover:from-red-400 hover:to-cyan-400 text-xl font-black tracking-[0.2em] rounded-xl hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_4px_20px_rgba(239,68,68,0.25)] flex items-center justify-center gap-3 cursor-pointer mt-2"
            >
              <span v-if="!loading">Send Reset Link</span>
              <div v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </button>
          </form>
        </div>

        <div v-else class="text-center py-4">
          <div class="w-16 h-16 bg-cyan-500/15 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <svg class="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 class="text-3xl font-black text-white mb-2 italic">Check your email</h2>
          <p class="text-lg text-gray-400 mb-6">We've sent a password reset link to <span class="text-cyan-400 font-bold">{{ email }}</span></p>

          <button @click="submitted = false" class="text-lg text-cyan-400 hover:text-cyan-300 font-bold hover:underline transition-colors mt-6">Try another email</button>
        </div>
      </div>

      <div class="mt-8 text-center">
        <router-link to="/login" class="text-gray-400 hover:text-white text-xl font-bold transition-colors flex items-center justify-center gap-2">
          <span>←</span> Back to login
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

<style scoped>
::placeholder {
  font-weight: 400;
  color: #6b7280;
}

/* Glassmorphism focus effect */
input:focus {
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.2);
}
</style>