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
          Verification <span class="text-red-500">Portal</span>
        </h1>
        <div class="flex items-center justify-center gap-3 mt-4">
          <div class="h-[1px] w-8 bg-cyan-500/30"></div>
          <p class="text-cyan-400 text-lg font-bold tracking-[0.4em]">Email Authentication</p>
          <div class="h-[1px] w-8 bg-cyan-500/30"></div>
        </div>
      </div>

      <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl text-center">
        <div v-if="loading">
          <div class="flex justify-center py-8">
            <LoadingSpinner label="Verifying..." />
          </div>
        </div>

        <div v-else-if="success">
          <div class="w-20 h-20 bg-cyan-500/15 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_25px_rgba(6,182,212,0.25)]">
            <svg class="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 class="text-3xl font-black text-white mb-2 italic">Email Verified!</h2>
          <p class="text-lg text-gray-400 mb-8">Your account is now fully active. You can proceed to sign in.</p>
          <router-link
            to="/login"
            class="w-full h-[56px] bg-gradient-to-r from-red-500 to-cyan-500 hover:from-red-400 hover:to-cyan-400 text-white text-xl font-black tracking-[0.2em] rounded-xl hover:opacity-90 transition-all shadow-[0_4px_20px_rgba(239,68,68,0.25)] flex items-center justify-center gap-3 cursor-pointer"
          >
            Proceed to Login
          </router-link>
        </div>

        <div v-else>
          <div class="w-20 h-20 bg-red-500/15 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_25px_rgba(239,68,68,0.25)]">
            <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 class="text-3xl font-black text-white mb-2 italic">Verification Failed</h2>
          <p class="text-lg text-gray-400 mb-8">{{ error || 'Invalid or expired verification token.' }}</p>
          <router-link
            to="/register"
            class="w-full h-[56px] bg-gradient-to-r from-red-500 to-cyan-500 hover:from-red-400 hover:to-cyan-400 text-white text-xl font-black tracking-[0.2em] rounded-xl hover:opacity-90 transition-all shadow-[0_4px_20px_rgba(239,68,68,0.25)] flex items-center justify-center gap-3 cursor-pointer"
          >
            Register Again
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const route = useRoute()
const auth = useAuthStore()
const loading = ref(true)
const success = ref(false)
const error = ref('')

onMounted(async () => {
  const token = route.query.token
  if (!token) {
    error.value = 'No verification token provided.'
    loading.value = false
    return
  }
  try {
    await auth.verifyEmail(token)
    success.value = true
  } catch (e) {
    error.value = e.response?.data?.message || 'Invalid or expired token.'
  } finally {
    loading.value = false
  }
})
</script>
