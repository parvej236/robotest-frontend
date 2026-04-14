<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-[#020202] relative overflow-hidden">
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
      <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-red-600/20 rounded-full blur-[120px]"></div>
    </div>

    <div class="w-full max-w-lg z-10">
      <div class="text-center mb-8">
        <h1 class="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
          Join the <span class="text-red-600">Arena</span>
        </h1>
        <div class="flex items-center justify-center gap-3 mt-3">
          <div class="h-[1px] w-8 bg-blue-500/50"></div>
          <p class="text-blue-400 text-xs font-bold uppercase tracking-[0.3em]">Identity Verification</p>
          <div class="h-[1px] w-8 bg-blue-500/50"></div>
        </div>
      </div>

      <div class="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 md:p-10 shadow-2xl overflow-hidden relative">
        <div class="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none"></div>

        <div v-if="success" class="relative py-8 text-center animate-in fade-in zoom-in duration-500">
          <div class="w-20 h-20 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-[0_0_30px_rgba(59,130,246,0.2)]">
            ✓
          </div>
          <h2 class="text-3xl font-black text-white mb-2 uppercase italic">Success</h2>
          <p class="text-gray-400 text-lg mb-8">Verification sent to <span class="text-white font-semibold">{{ form.email }}</span></p>
          <router-link to="/login" 
            class="inline-block w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all uppercase tracking-widest text-sm">
            Proceed to Login
          </router-link>
        </div>

        <form v-else @submit.prevent="handleRegister" class="relative space-y-5">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-xl font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
              <input v-model="form.fullName" type="text" 
                class="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3.5 text-white text-lg focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all placeholder:text-white" required />
            </div>
            <div class="space-y-1.5">
              <label class="text-xl font-bold text-gray-500 uppercase tracking-widest ml-1">Username</label>
              <input v-model="form.username" type="text" 
                class="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3.5 text-white text-lg focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-white" required />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-xl font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
            <input v-model="form.email" type="email" 
              class="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3.5 text-white text-lg focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all placeholder:text-white" required />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-xl font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
              <input v-model="form.password" type="password"
                class="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3.5 text-white text-lg focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-white" required minlength="6" />
            </div>
            <div class="space-y-1.5">
              <label class="text-xl font-bold text-gray-500 uppercase tracking-widest ml-1">Confirm</label>
              <input v-model="form.confirmPassword" type="password" 
                class="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3.5 text-white text-lg focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-white" required />
            </div>
          </div>

          <div v-if="errors.length" class="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p v-for="e in errors" :key="e" class="text-red-400 text-xs font-bold flex items-center gap-2">
              <span class="w-1 h-1 bg-red-500 rounded-full"></span> {{ e }}
            </p>
          </div>

          <button type="submit" 
            class="w-full relative group overflow-hidden mt-4 py-4 bg-red-600 hover:bg-blue-600 text-white font-black rounded-xl transition-all duration-500 uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(220,38,38,0.2)]"
            :disabled="loading">
            <span v-if="!loading" class="z-10">{{ 'Create Account' }}</span>
            <div v-else class="z-10 w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <div class="absolute inset-0 bg-gradient-to-r from-red-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>
        </form>
      </div>

      <div class="mt-8 text-center">
        <p class="text-gray-500 text-xl font-medium tracking-wide">
          Already have an account?
          <router-link to="/login" class="text-white text-2xl hover:text-blue-400 font-black transition-colors ml-2 underline underline-offset-4 decoration-blue-500/30">Login</router-link>
        </p>
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