<template>
  <nav class="fixed top-0 left-0 right-0 z-50 h-16"
    :class="scrolled ? 'bg-dark-900/95 backdrop-blur-md shadow-neon-red/10' : 'bg-transparent'">
    <div class="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">

      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-3 group">
        <div class="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center">
          <img src="@/assets/logo.png" alt="Logo" class="w-full h-full object-cover" />
        </div>

        <span class="font-display text-lg font-bold tracking-widest hidden sm:block">
          <span class="text-white">RMEDU</span>
          <span class="glow-text-red">Robotics Society</span>
        </span>
      </router-link>

      <!-- Desktop Nav -->
      <div class="hidden md:flex items-center gap-1">
        <router-link to="/" class="nav-link">Home</router-link>

        <!-- Contests Dropdown -->
        <div class="relative" @mouseenter="showContestsMenu = true" @mouseleave="showContestsMenu = false">
          <button class="nav-link flex items-center gap-1">
            Contests
            <svg class="w-3 h-3 transition-transform" :class="showContestsMenu ? 'rotate-180' : ''" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <transition name="fade">
            <div v-if="showContestsMenu"
              class="absolute top-full left-0 mt-2 w-72 glass-panel neon-border-red py-2 shadow-neon-red/20 shadow-lg">
              <div
                class="px-3 py-1.5 text-xs font-display tracking-widest text-white/40 uppercase border-b border-white/5 mb-1">
                Recent Contests</div>
              <div v-for="contest in latestContests.slice(0, 10)" :key="contest.id">
                <router-link :to="`/contests/${contest.id}`"
                  class="flex items-center justify-between px-4 py-2.5 hover:bg-white/5 transition-colors group">
                  <span class="text-sm text-white/80 group-hover:text-white truncate font-body">{{ contest.name
                    }}</span>
                  <StatusBadge :status="contest.status" size="xs" />
                </router-link>
              </div>
              <div class="border-t border-white/5 mt-1 pt-1">
                <router-link to="/contests"
                  class="flex items-center gap-2 px-4 py-2.5 text-neon-blue text-sm font-display tracking-wider hover:bg-neon-blue/5 transition-colors">
                  View All Contests <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </router-link>
              </div>
            </div>
          </transition>
        </div>

        <router-link to="/leaderboard" class="nav-link">Leaderboard</router-link>
        <router-link to="/rules" class="nav-link">Rules</router-link>
        <router-link to="/about" class="nav-link hidden">About</router-link>
      </div>

      <!-- Auth Section -->
      <div class="hidden md:flex items-center gap-3">
        <template v-if="!auth.isLoggedIn">
          <router-link to="/login" class="btn-ghost rounded-full py-1.5 text-xs text-white">Login</router-link>
          <router-link to="/register" class="btn-secondary rounded-full py-1.5 text-xs">Create Account</router-link>
        </template>
        <template v-else>
          <!-- Admin badge -->
          <router-link v-if="auth.isAdmin" to="/admin"
            class="group relative flex items-center gap-2.5 px-5 py-2 rounded-xl transition-all duration-500 overflow-hidden">
            <div
              class="absolute inset-0 bg-gradient-to-r from-red-600/20 via-blue-600/20 to-red-600/20 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
            </div>

            <div class="absolute inset-[1px] bg-[#050505]/90 rounded-[11px] backdrop-blur-2xl z-10"></div>

            <div
              class="absolute inset-0 z-0 bg-gradient-to-r from-red-500 via-blue-500 to-red-500 animate-gradient-x opacity-40 group-hover:opacity-100">
            </div>

            <div class="relative z-20 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                class="text-red-500 group-hover:text-blue-400 transition-colors duration-500">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                <path d="m9 12 2 2 4-4" />
              </svg>

              <span
                class="text-[11px] font-black uppercase tracking-[0.2em] text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-400 group-hover:to-blue-400 transition-all duration-500">
                Admin Panel
              </span>

              <div class="flex h-1.5 w-1.5 rounded-full bg-red-600 shadow-[0_0_8px_#dc2626]"></div>
            </div>

            <div
              class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[inset_0_0_20px_rgba(220,38,38,0.2)]">
            </div>
          </router-link>

          <!-- User dropdown -->
          <div class="relative" @mouseenter="showUserMenu = true" @mouseleave="showUserMenu = false">
            <button class="flex items-center gap-2 group">
              <div
                class="w-8 h-8 rounded-full border border-neon-red/50 overflow-hidden bg-dark-700 flex items-center justify-center">
                <img v-if="avatarFullUrl" :src="avatarFullUrl" :key="avatarFullUrl"
                  class="w-full h-full object-cover" />
                <span v-else class="font-display text-xs text-neon-red font-bold">{{
                  auth.username?.charAt(0)?.toUpperCase() }}</span>
              </div>
              <span class="text-sm font-body text-white/80 group-hover:text-white">{{ auth.username }}</span>
            </button>
            <transition name="fade">
              <div v-if="showUserMenu"
                class="absolute top-full right-0 mt-2 w-48 glass-panel neon-border-red py-2 shadow-lg">
                <router-link to="/dashboard" class="user-menu-item">Dashboard</router-link>
                <router-link to="/profile" class="user-menu-item">Profile</router-link>
                <div class="border-t border-white/5 mt-1 pt-1">
                  <button @click="logout" class="user-menu-item text-neon-red w-full text-left">Logout</button>
                </div>
              </div>
            </transition>
          </div>
        </template>
      </div>

      <!-- Mobile menu button -->
      <button @click="mobileOpen = !mobileOpen" class="md:hidden p-2 text-white/70 hover:text-white">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Mobile menu -->
    <transition name="fade">
      <div v-if="mobileOpen" class="md:hidden bg-dark-800/98 backdrop-blur-md border-b border-neon-red/20 px-4 pb-4">
        <div class="flex flex-col gap-1 pt-2">
          <router-link to="/" @click="mobileOpen = false" class="mobile-nav-link">Home</router-link>
          <router-link to="/contests" @click="mobileOpen = false" class="mobile-nav-link">Contests</router-link>
          <router-link to="/leaderboard" @click="mobileOpen = false" class="mobile-nav-link">Leaderboard</router-link>
          <router-link to="/rules" @click="mobileOpen = false" class="mobile-nav-link">Rules</router-link>
          <router-link to="/about" @click="mobileOpen = false" class="mobile-nav-link hidden">About</router-link>
          <template v-if="auth.isLoggedIn">
            <router-link to="/dashboard" @click="mobileOpen = false" class="mobile-nav-link">Dashboard</router-link>
            <router-link to="/profile" @click="mobileOpen = false" class="mobile-nav-link">Profile</router-link>
            <router-link v-if="auth.isAdmin" to="/admin" @click="mobileOpen = false"
              class="mobile-nav-link text-neon-red">Admin Panel</router-link>
            <button @click="logout" class="mobile-nav-link text-left text-neon-red">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login" @click="mobileOpen = false" class="mobile-nav-link">Login</router-link>
            <router-link to="/register" @click="mobileOpen = false"
              class="btn-primary text-center mt-2">Register</router-link>
          </template>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useContestStore } from '@/stores/contest'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { BACKEND_URL } from '@/config'


const auth = useAuthStore()
const contestStore = useContestStore()
const router = useRouter()

const scrolled = ref(false)
const showContestsMenu = ref(false)
const showUserMenu = ref(false)
const mobileOpen = ref(false)
const latestContests = ref([])


const avatarFullUrl = computed(() => {
  const path = auth.avatar
  if (!path) return null
  if (path.startsWith('http')) return path
  return BACKEND_URL + path
})

const handleScroll = () => { scrolled.value = window.scrollY > 20 }
onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
  try { latestContests.value = await contestStore.fetchLatestContests() } catch { }
})

onUnmounted(() => window.removeEventListener('scroll', handleScroll))

function logout() {
  auth.logout()
  mobileOpen.value = false
  router.push('/')
}
</script>

<style scoped>
.nav-link {
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-size: 1.25rem;
  font-family: var(--font-body, inherit);
  color: rgba(255, 255, 255, 0.7);
  border-radius: 0.25rem;
  transition: all 0.2s;
  letter-spacing: 0.05em;
  position: relative;
}

.nav-link:hover {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.05);
}

.nav-link.router-link-active {
  color: var(--color-neon-red, #ff1744);
}

.user-menu-item {
  display: block;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
  font-size: 0.875rem;
  font-family: var(--font-body, inherit);
  color: rgba(255, 255, 255, 0.8);
  transition: background 0.2s, color 0.2s;
}

.user-menu-item:hover {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.05);
}

.mobile-nav-link {
  display: block;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
  font-size: 0.875rem;
  font-family: var(--font-body, inherit);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 0.25rem;
  transition: background 0.2s, color 0.2s;
}

.mobile-nav-link:hover {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.05);
}
</style>
