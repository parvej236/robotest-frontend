<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-transparent relative overflow-hidden font-sans">
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div class="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px]"></div>
    </div>

    <div class="w-full max-w-lg z-10">
      <div class="text-center mb-10">
        <h1 class="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
          Reset <span class="text-blue-600">Password</span>
        </h1>
      </div>

      <div class="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-sm">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">Set new password</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Ensure your new password is at least 6 characters long.</p>

        <form @submit.prevent="handleReset" class="space-y-4">
          <div class="space-y-1.5">
            <label class="text-[13px] font-medium text-gray-600 dark:text-gray-400">New Password</label>
            <input
              v-model="form.newPassword"
              type="password"
              placeholder="••••••••"
              class="w-full h-[42px] px-3 text-sm rounded-lg border bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white border-gray-200 dark:border-white/10 focus:border-blue-500 focus:outline-none transition-all"
              required
            />
            <p v-if="passwordLengthError" class="text-[12px] text-red-500 font-medium">
              {{ passwordLengthError }}
            </p>
          </div>

          <div class="space-y-1.5">
            <label class="text-[13px] font-medium text-gray-600 dark:text-gray-400">Confirm Password</label>
            <input
              v-model="form.confirmPassword"
              type="password"
              placeholder="••••••••"
              class="w-full h-[42px] px-3 text-sm rounded-lg border bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white border-gray-200 dark:border-white/10 focus:border-blue-500 focus:outline-none transition-all"
              required
            />
            <p v-if="confirmPasswordMismatchError" class="text-[12px] text-red-500 font-medium">
              {{ confirmPasswordMismatchError }}
            </p>
          </div>

          <p v-if="error" class="text-xs text-red-500 font-medium">{{ error }}</p>

          <button
            type="submit"
            :disabled="loading || !!passwordLengthError || form.newPassword !== form.confirmPassword || !form.token"
            class="w-full h-[42px] bg-gray-900 dark:bg-gradient-to-r dark:from-blue-800 dark:to-red-900 text-white text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center"
          >
            <span v-if="!loading">Update Password</span>
            <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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