<template>
  <div class="min-h-screen pt-8 pb-12 bg-transparent text-white font-sans relative overflow-hidden">
    <!-- Ambient background glows -->
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
      <div class="absolute -top-48 -left-48 w-[600px] h-[600px] bg-neon-red/5 rounded-full blur-[140px]"></div>
      <div class="absolute bottom-12 right-0 w-[600px] h-[600px] bg-neon-blue/5 rounded-full blur-[140px]"></div>
    </div>

    <!-- PERSISTENT LEFT SIDEBAR (Desktop) -->
    <aside class="hidden lg:flex flex-col justify-between fixed top-0 left-0 w-64 bottom-0 bg-dark-950/90 border-r border-white/10 p-6 z-25 backdrop-blur-xl">
      <div class="space-y-6">
        <!-- Logo Branding Segment -->
        <div class="flex items-center gap-3 pb-5 border-b border-white/10">
          <span class="text-2xl">🤖</span>
          <div>
            <span class="text-sm font-semibold tracking-wide text-white font-display">RoboTest</span>
            <span class="text-[10px] font-mono text-neon-red font-medium tracking-wider block leading-none mt-1">Admin Panel</span>
          </div>
        </div>
        
        <!-- Sidebar Title Context -->
        <div>
          <div class="flex items-center gap-2 mb-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-neon-red animate-pulse"></span>
            <span class="text-[10px] font-mono font-medium tracking-wider text-slate-400">Control center</span>
          </div>
        </div>
        
        <!-- Sidebar Navigation Menu -->
        <nav class="space-y-1.5">
          <router-link 
            to="/admin" 
            exact-active-class="bg-neon-red/10 border-neon-red/25 text-neon-red shadow-[0_0_15px_rgba(255,0,51,0.08)]"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-slate-350 hover:text-white hover:bg-white/5 border border-transparent font-display transition-all"
          >
            <LayoutDashboard class="w-4 h-4" /> Dashboard
          </router-link>
          
          <router-link 
            to="/admin/contests" 
            active-class="bg-neon-red/10 border-neon-red/25 text-neon-red shadow-[0_0_15px_rgba(255,0,51,0.08)]"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-slate-350 hover:text-white hover:bg-white/5 border border-transparent font-display transition-all"
          >
            <Trophy class="w-4 h-4" /> Manage contests
          </router-link>
          
          <router-link 
            to="/admin/users" 
            active-class="bg-neon-red/10 border-neon-red/25 text-neon-red shadow-[0_0_15px_rgba(255,0,51,0.08)]"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-slate-350 hover:text-white hover:bg-white/5 border border-transparent font-display transition-all"
          >
            <Users class="w-4 h-4" /> Manage users
          </router-link>

          <router-link 
            to="/contests" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-slate-350 hover:text-white hover:bg-white/5 border border-transparent font-display transition-all"
          >
            <Globe class="w-4 h-4" /> Public site
          </router-link>
        </nav>
      </div>
      
      <!-- Admin Profile Segment -->
      <div class="pt-4 border-t border-white/10 flex items-center gap-3">
        <div class="w-9 h-9 rounded-full bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
          <img v-if="auth.avatar" :src="toFullUrl(auth.avatar)" referrerpolicy="no-referrer" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center text-neon-red font-bold text-xs bg-neon-red/5">
            {{ auth.username?.charAt(0).toUpperCase() || 'A' }}
          </div>
        </div>
        <div class="min-w-0">
          <p class="text-xs font-semibold text-white truncate">{{ auth.fullName || 'Administrator' }}</p>
          <p class="text-[9px] text-white/40 font-medium tracking-wider font-mono">System admin</p>
        </div>
      </div>
    </aside>

    <!-- MAIN DASHBOARD CONTENT AREA -->
    <main class="lg:pl-72 px-4 md:px-6 relative z-10">
      
      <!-- Top header bar / Context breadcrumb -->
      <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-white/5">
        <div>
          <div class="flex items-center gap-2 text-xs font-mono font-medium text-white/30 tracking-wider mb-1">
            <span>Admin</span>
            <span>/</span>
            <span class="text-neon-red">{{ route.meta.title }}</span>
          </div>
          <h1 class="text-2xl font-bold text-white tracking-wide font-display">
            {{ route.meta.title }}
          </h1>
        </div>
        
        <!-- Public site bridge link -->
        <div>
          <router-link 
            to="/contests" 
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all active:scale-95"
          >
            <span>View public site</span>
            <ExternalLink class="w-3.5 h-3.5 text-cyan-400" />
          </router-link>
        </div>
      </div>

      <!-- Child router view -->
      <RouterView />

    </main>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { BACKEND_URL } from '@/config'
import { LayoutDashboard, Trophy, Users, Globe, ExternalLink } from '@lucide/vue'

const route = useRoute()
const auth = useAuthStore()

function toFullUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return BACKEND_URL + path
}
</script>
