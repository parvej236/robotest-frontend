<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-[#020202] relative overflow-hidden font-sans">
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div class="absolute -top-24 -left-24 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px]"></div>
      <div class="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
    </div>

    <div class="w-full max-w-lg z-10">
      <div class="text-center mb-10">
        <h1 class="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
          Welcome <span class="text-blue-600">Back</span>
        </h1>
        <div class="flex items-center justify-center gap-3 mt-4">
          <div class="h-[1px] w-8 bg-red-500/50"></div>
          <p class="text-red-500 text-xs font-bold uppercase tracking-[0.4em]">Arena Authentication</p>
          <div class="h-[1px] w-8 bg-red-500/50"></div>
        </div>
      </div>

      <div class="bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative">
        <div class="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none rounded-[2.5rem]"></div>

        <form @submit.prevent="handleLogin" class="relative space-y-6" novalidate>
          
          <div class="space-y-2">
            <label for="email" class="text-xl font-bold text-gray-500 uppercase tracking-widest ml-2">Email Address</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-5 text-white text-2xl font-bold focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-gray-800"
              @input="error = ''"
              required
            />
          </div>

          <div class="space-y-2">
            <div class="flex justify-between items-end px-2">
              <label for="password" class="text-xl font-bold text-gray-500 uppercase tracking-widest">Password</label>
              <router-link to="/forgot-password" class="text-xs font-bold text-blue-400 hover:text-white transition-colors uppercase tracking-tighter">
                Forgot Password ?
              </router-link>
            </div>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPass ? 'text' : 'password'"
                class="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-5 text-white text-2xl tracking-widest focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all placeholder:text-gray-800"
                @input="error = ''"
                required
              />
              <button
                type="button"
                @click="showPass = !showPass"
                class="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/70 transition-colors"
              >
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path v-if="!showPass" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
              </button>
            </div>
          </div>

          <div v-if="error" class="p-4 bg-red-600/10 border border-red-600/20 rounded-2xl flex items-center gap-3">
            <div class="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
            <p class="text-red-500 text-sm font-black uppercase tracking-tight">{{ error }}</p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full py-6 bg-blue-700 hover:bg-red-600 text-white font-black rounded-2xl transition-all duration-500 uppercase tracking-[0.3em] text-xl flex items-center justify-center gap-4 shadow-[0_15px_30px_rgba(37,99,235,0.2)] overflow-hidden"
          >
            <span v-if="!loading" class="z-10">Log In</span>
            <div v-else class="z-10 w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            
            <div class="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>
        </form>
      </div>

      <div class="mt-10 text-center">
        <p class="text-gray-500 text-lg font-medium tracking-wide">
          Don't have an account?
          <router-link to="/register" class="text-white hover:text-red-500 font-black transition-colors ml-2 underline underline-offset-8 decoration-blue-600">Create Account</router-link>
        </p>
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
    error.value = 'Fill all credentials'
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
    if (e.isNetworkError) {
      error.value = e.message
    } else if (e.status === 401) {
      error.value = 'Invalid Credentials'
    } else {
      error.value = 'Auth System Failure'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Chrome/Safari placeholder fix for bold text */
::placeholder {
  font-weight: 900;
  color: #334155;
}
</style>