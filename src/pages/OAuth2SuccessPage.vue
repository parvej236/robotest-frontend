<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-transparent relative overflow-hidden">
    <!-- Background glows -->
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div class="absolute -top-24 -left-24 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
      <div class="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px]"></div>
    </div>

    <div class="w-full max-w-xl z-10 text-center">
      <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-12 shadow-2xl">
        
        <!-- Loading State -->
        <div v-if="!errorDetails">
          <div class="w-20 h-20 bg-cyan-500/15 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <div class="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 class="text-3xl font-black text-white mb-2 italic">Syncing Session...</h2>
          <p class="text-lg text-gray-400">Authenticating secure credentials...</p>
        </div>

        <!-- Error State -->
        <div v-else>
          <div class="w-20 h-20 bg-red-500/15 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <h2 class="text-3xl font-black text-red-400 mb-2 italic">Sync Failed</h2>
          <p class="text-lg text-gray-300 mb-6">{{ errorDetails }}</p>
          
          <div class="flex flex-col gap-3">
            <button @click="retry" class="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:brightness-110 transition-all shadow-lg shadow-cyan-500/25">
              Try Again
            </button>
            <router-link to="/login" class="text-gray-400 hover:text-white transition-all text-sm underline decoration-gray-600">
              Return to Login
            </router-link>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const errorDetails = ref(null)

const syncSession = async () => {
  const token = route.query.token
  const refreshToken = route.query.refreshToken

  if (token && refreshToken) {
    try {
      // Save access & refresh tokens
      authStore.saveSession({
        accessToken: token,
        refreshToken: refreshToken,
        user: {}
      })

      // Fetch full user details from backend
      await authStore.fetchMe()

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (e) {
      console.error('OAuth token synchronization failed', e)
      errorDetails.value = e.message || (e.data && e.data.message) || 'Request failed (401 / Network Error)'
    }
  } else {
    errorDetails.value = 'Missing authentication tokens in callback URL parameters.'
  }
}

const retry = () => {
  errorDetails.value = null
  syncSession()
}

onMounted(syncSession)
</script>
