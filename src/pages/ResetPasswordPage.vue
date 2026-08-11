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
          Reset <span class="text-red-500">Password</span>
        </h1>
        <div class="flex items-center justify-center gap-3 mt-4">
          <div class="h-[1px] w-8 bg-cyan-500/30"></div>
          <p class="text-cyan-400 text-lg font-bold tracking-[0.4em]">New Credentials</p>
          <div class="h-[1px] w-8 bg-cyan-500/30"></div>
        </div>
      </div>

      <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <h2 class="text-3xl font-black text-white mb-1 italic">Set new password</h2>
        <p class="text-lg text-gray-400 mb-6">Ensure your new password is at least 6 characters long.</p>

        <form @submit.prevent="handleReset" class="space-y-4">
          <div class="space-y-1.5">
            <label class="text-lg font-bold text-gray-400 tracking-wider ml-1">New Password</label>
            <input
              v-model="form.newPassword"
              type="password"
              placeholder="••••••••"
              class="w-full h-[56px] px-4 text-xl rounded-xl border bg-white/5 text-white border-white/10 focus:border-red-500 focus:outline-none transition-all"
              required
            />
            <p v-if="passwordLengthError" class="text-base text-red-400 font-bold italic ml-1">
              {{ passwordLengthError }}
            </p>
          </div>

          <div class="space-y-1.5">
            <label class="text-lg font-bold text-gray-400 tracking-wider ml-1">Confirm Password</label>
            <input
              v-model="form.confirmPassword"
              type="password"
              placeholder="••••••••"
              class="w-full h-[56px] px-4 text-xl rounded-xl border bg-white/5 text-white border-white/10 focus:border-red-500 focus:outline-none transition-all"
              required
            />
            <p v-if="confirmPasswordMismatchError" class="text-base text-red-400 font-bold italic ml-1">
              {{ confirmPasswordMismatchError }}
            </p>
          </div>

          <p v-if="error" class="text-base text-red-400 font-bold italic ml-1">{{ error }}</p>

          <button
            type="submit"
            :disabled="loading || !!passwordLengthError || form.newPassword !== form.confirmPassword || !form.token"
            class="w-full h-[56px] bg-gradient-to-r from-red-500 to-cyan-500 hover:from-red-400 hover:to-cyan-400 text-xl font-black tracking-[0.2em] rounded-xl hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_4px_20px_rgba(239,68,68,0.25)] flex items-center justify-center gap-3 cursor-pointer mt-2"
          >
            <span v-if="!loading">Update Password</span>
            <div v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const loading = ref(false)
const error = ref('')
const passwordLengthError = ref('')
const confirmPasswordMismatchError = ref('')
const form = ref({
  token: '',
  newPassword: '',
  confirmPassword: ''
})

onMounted(() => {
  // Extract token from URL query: ?token=xyz
  form.value.token = route.query.token
  if (!form.value.token) {
    error.value = 'Invalid or missing reset token.'
  }
})

// Instant password length validation (>= 6)
watch(() => form.value.newPassword, (val) => {
  if (!val) {
    passwordLengthError.value = ''
    confirmPasswordMismatchError.value = ''
    return
  }
  if (val.length < 6) {
    passwordLengthError.value = 'Password must be at least 6 characters.'
    // Still allow confirm mismatch message to show independently
  }

  if (form.value.confirmPassword && val !== form.value.confirmPassword) {
    confirmPasswordMismatchError.value = 'Passwords do not match.'
  } else {
    confirmPasswordMismatchError.value = ''
  }

  passwordLengthError.value = val.length < 6 ? 'Password must be at least 6 characters.' : ''
})

// Instant confirmPassword mismatch validation
watch(
  () => form.value.confirmPassword,
  (val) => {
    if (!val) {
      confirmPasswordMismatchError.value = ''
      return
    }
    confirmPasswordMismatchError.value =
      form.value.newPassword !== val ? 'Passwords do not match.' : ''
  }
)

async function handleReset() {
  if (form.value.newPassword !== form.value.confirmPassword) {
    error.value = 'Passwords do not match.'
    return
  }
  if (form.value.newPassword.length < 6) {
    error.value = 'Password must be at least 6 characters.'
    return
  }

  loading.value = true
  error.value = ''
  try {
    await auth.resetPassword(form.value)
    // Optional: show a success message then redirect
    router.push({ path: '/login', query: { reset: 'success' }})
  } catch (e) {
    error.value = e.message || 'Failed to reset password.'
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