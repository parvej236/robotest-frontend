<template>
  <div class="min-h-screen pt-28 px-6 pb-20 bg-transparent relative overflow-hidden">
    <!-- Neon radial grid ambient background lights -->
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
      <div class="absolute -top-48 -left-48 w-[600px] h-[600px] bg-neon-red/5 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-24 right-0 w-[600px] h-[600px] bg-neon-blue/5 rounded-full blur-[120px]"></div>
    </div>
    
    <div class="max-w-7xl mx-auto relative z-10">
      <!-- Section Header (Futuristic Esports Scale) -->
      <div class="mb-16 flex flex-col items-center text-center">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-[3px] bg-neon-red shadow-[0_0_12px_rgba(255,0,51,0.9)]"></div>
          <span class="text-xs md:text-sm font-black tracking-[0.3em] text-neon-red uppercase font-display">Tournament Node</span>
          <div class="w-10 h-[3px] bg-neon-red shadow-[0_0_12px_rgba(255,0,51,0.9)]"></div>
        </div>
        <h1 class="text-5xl md:text-7xl font-black text-white tracking-tight uppercase italic leading-none mb-4 font-display">
          Active Contests
        </h1>
        <p class="text-base md:text-lg text-slate-350 max-w-3xl font-body mt-2 leading-relaxed">
          Test your engineering design speed, accuracy, and efficiency under pressure. Register for active contests, review questions, or join ongoing live events.
        </p>
      </div>

      <!-- Filters & Search Toolbar (Enlarged Responsive Controls) -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12 bg-white/[0.02] border border-white/10 p-5 rounded-2xl backdrop-blur-md">
        <!-- Status Filter Tabs (Dynamic Gaming styles, scaled up) -->
        <div class="flex flex-wrap gap-3">
          <button 
            v-for="f in filters" 
            :key="f.value" 
            @click="activeFilter = f.value"
            :class="[
              'px-6 py-3 rounded-xl text-xs md:text-sm font-black uppercase tracking-widest transition-all duration-300 border flex items-center gap-2.5 active:scale-95 cursor-pointer font-display',
              getFilterClass(f.value, activeFilter === f.value)
            ]"
          >
            <span>{{ f.label }}</span>
            <span 
              :class="[
                'text-[10px] md:text-xs px-2.5 py-0.5 rounded-lg font-mono font-black transition-colors',
                getBadgeClass(f.value, activeFilter === f.value)
              ]"
            >
              {{ getFilterCount(f.value) }}
            </span>
          </button>
        </div>

        <!-- Search Input (Enlarged) -->
        <div class="relative group w-full lg:w-96">
          <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-white/30 group-focus-within:text-neon-red transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <input 
            v-model="search" 
            type="text" 
            placeholder="Search contests by name..."
            class="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-base text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-neon-red/50 focus:border-neon-red/50 transition-all font-body" 
          />
          <button v-if="search" @click="search = ''" class="absolute inset-y-0 right-4 flex items-center text-white/30 hover:text-white">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-40">
        <LoadingSpinner label="Synching Contests..." />
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredContests.length === 0" class="text-center py-28 bg-white/[0.01] rounded-3xl border border-dashed border-white/10 backdrop-blur-sm max-w-lg mx-auto">
        <div class="flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 mx-auto mb-6 text-4xl opacity-60">
          🔭
        </div>
        <h3 class="text-xl text-white font-black uppercase tracking-wider font-display">No Contests Found</h3>
        <p class="text-slate-400 text-sm font-body mt-2 max-w-xs mx-auto leading-relaxed">
          No matches found matching your filters. Try adjusting your search query or selecting a different tab.
        </p>
      </div>

      <!-- Contests Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ContestCard 
          v-for="contest in filteredContests" 
          :key="contest.id"
          :contest="contest" 
          @register="handleRegister(contest)" 
          class="hover:-translate-y-1 transition-all duration-300"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useContestStore } from '@/stores/contest'
import { useAuthStore } from '@/stores/auth'
import ContestCard from '@/components/common/ContestCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useHead } from '@vueuse/head'

useHead({
  title: 'CAD Contests - RMEDU Robotics',
  meta: [
    {
      name: 'description',
      content: 'Join CAD robotics contests and compete with students worldwide.'
    }
  ]
})

const router = useRouter()
const auth = useAuthStore()
const contestStore = useContestStore()

const loading = ref(true)
const search = ref('')
const activeFilter = ref('ALL')

const filters = [
  { label: 'All', value: 'ALL' },
  { label: 'Live Now', value: 'RUNNING' },
  { label: 'Reg Open', value: 'REGISTRATION_OPEN' },
  { label: 'Upcoming', value: 'UPCOMING' },
  { label: 'Finished', value: 'FINISHED' },
]

const getFilterCount = (statusValue) => {
  if (statusValue === 'ALL') return contestStore.contests.length
  return contestStore.contests.filter(c => c.status === statusValue).length
}

// Generate specialized gaming HUD classes for the filters based on status
const getFilterClass = (filterValue, isActive) => {
  if (!isActive) {
    return 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white hover:border-white/20'
  }
  if (filterValue === 'RUNNING') {
    return 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
  }
  if (filterValue === 'REGISTRATION_OPEN') {
    return 'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
  }
  if (filterValue === 'UPCOMING') {
    return 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
  }
  if (filterValue === 'FINISHED') {
    return 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
  }
  return 'bg-neon-red/25 border-neon-red text-white shadow-[0_0_20px_rgba(255,0,51,0.4)]'
}

const getBadgeClass = (filterValue, isActive) => {
  if (!isActive) return 'bg-white/10 text-white/40'
  if (filterValue === 'RUNNING') return 'bg-emerald-500/30 text-emerald-300'
  if (filterValue === 'REGISTRATION_OPEN') return 'bg-cyan-500/30 text-cyan-300'
  if (filterValue === 'UPCOMING') return 'bg-amber-500/30 text-amber-300'
  if (filterValue === 'FINISHED') return 'bg-rose-500/30 text-rose-300'
  return 'bg-neon-red/30 text-white'
}

const filteredContests = computed(() => {
  let list = contestStore.contests
  if (activeFilter.value !== 'ALL') list = list.filter(c => c.status === activeFilter.value)
  if (search.value.trim()) list = list.filter(c => c.name.toLowerCase().includes(search.value.toLowerCase()))

  const sortTimestamp = contest => new Date(contest?.createdAt || contest?.created_date || contest?.contestDate || '').getTime() || 0
  return [...list].sort((a, b) => sortTimestamp(b) - sortTimestamp(a))
})

function handleRegister(contest) {
  if (!auth.isLoggedIn) { router.push('/login'); return }
  router.push(`/contests/${contest.id}`)
}

onMounted(async () => {
  try { await contestStore.fetchAllContests() }
  catch (e) { console.error(e) }
  finally { loading.value = false }
})
</script>
