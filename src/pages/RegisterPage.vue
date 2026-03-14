<template>
  <div class="min-h-screen pt-20 flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-2 mb-4">
          <div class="w-6 h-px bg-neon-red"></div>
          <span class="text-xs font-display tracking-widest text-neon-red uppercase">Create Account</span>
          <div class="w-6 h-px bg-neon-red"></div>
        </div>
        <h1 class="font-display text-3xl font-black text-white tracking-wider uppercase">Join the Arena</h1>
        <p class="text-white/40 font-body text-sm mt-2">Create your account and start competing</p>
      </div>

      <div v-if="success" class="glass-card neon-border-blue p-8 text-center">
        <div class="text-5xl mb-4">📧</div>
        <h2 class="font-display text-xl font-bold text-neon-blue mb-2">Check Your Email</h2>
        <p class="text-white/60 font-body text-sm">We've sent a verification link to <strong class="text-white">{{ form.email }}</strong></p>
        <p class="text-white/40 font-body text-xs mt-2">Click the link to activate your account</p>
        <router-link to="/login" class="btn-primary inline-flex mt-6">Go to Login</router-link>
      </div>

      <div v-else class="glass-card neon-border-red p-8 relative">
        <div class="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-neon-red"></div>
        <div class="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-neon-red"></div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="label-text">Full Name</label>
            <input v-model="form.fullName" type="text" placeholder="M Parvej Alam" class="input-field" required />
          </div>
          <div>
            <label class="label-text">Username</label>
            <input v-model="form.username" type="text" placeholder="robotmaster" class="input-field" required />
          </div>
          <div>
            <label class="label-text">Email Address</label>
            <input v-model="form.email" type="email" placeholder="your@gmail.com" class="input-field" required />
          </div>
          <div>
            <label class="label-text">Password</label>
            <input v-model="form.password" type="password" placeholder="Min 6 characters" class="input-field" required minlength="6" />
          </div>
          <div>
            <label class="label-text">Confirm Password</label>
            <input v-model="form.confirmPassword" type="password" placeholder="Repeat password" class="input-field" required />
            <p v-if="form.password && form.confirmPassword && form.password !== form.confirmPassword"
               class="text-neon-red text-xs mt-1 font-body">Passwords do not match</p>
          </div>

          <div v-if="errors.length" class="px-3 py-2.5 bg-neon-red/10 border border-neon-red/30 rounded space-y-1">
            <p v-for="e in errors" :key="e" class="text-neon-red text-xs font-body flex items-center gap-1">
              <span>•</span> {{ e }}
            </p>
          </div>

          <button type="submit" class="btn-primary w-full justify-center flex items-center gap-2 mt-2" :disabled="loading">
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm font-body text-white/40">
            Already have an account?
            <router-link to="/login" class="text-neon-blue hover:text-white ml-1 transition-colors">Login</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const form = ref({ fullName: '', username: '', email: '', password: '', confirmPassword: '' })
const loading = ref(false)
const errors = ref([])
const success = ref(false)

async function handleRegister() {
  errors.value = []
  if (form.value.password !== form.value.confirmPassword) {
    errors.value = ['Passwords do not match']; return
  }
  loading.value = true
  try {
    await auth.register(form.value)
    success.value = true
  } catch (e) {
    const msg = e.response?.data?.message || 'Registration failed'
    const data = e.response?.data?.data
    if (data && typeof data === 'object') {
      errors.value = Object.values(data)
    } else {
      errors.value = [msg]
    }
  } finally {
    loading.value = false
  }
}
</script>
