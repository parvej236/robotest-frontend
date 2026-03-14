<template>
  <div class="min-h-screen pt-20 flex items-center justify-center px-4">
    <div class="w-full max-w-md text-center glass-card neon-border-blue p-10">
      <div v-if="loading">
        <div class="flex justify-center mb-6"><LoadingSpinner label="Verifying..." /></div>
      </div>
      <div v-else-if="success">
        <div class="text-5xl mb-4">✅</div>
        <h2 class="font-display text-2xl font-bold text-neon-blue mb-2 uppercase tracking-wider">Email Verified!</h2>
        <p class="text-white/60 font-body text-sm mb-6">Your account is now active. You can login.</p>
        <router-link to="/login" class="btn-primary inline-flex">Proceed to Login</router-link>
      </div>
      <div v-else>
        <div class="text-5xl mb-4">❌</div>
        <h2 class="font-display text-2xl font-bold text-neon-red mb-2 uppercase tracking-wider">Verification Failed</h2>
        <p class="text-white/60 font-body text-sm mb-6">{{ error }}</p>
        <router-link to="/register" class="btn-secondary inline-flex">Register Again</router-link>
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
  if (!token) { error.value = 'No token provided'; loading.value = false; return }
  try {
    await auth.verifyEmail(token)
    success.value = true
  } catch (e) {
    error.value = e.response?.data?.message || 'Invalid or expired token'
  } finally {
    loading.value = false
  }
})
</script>
