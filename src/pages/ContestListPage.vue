<template>
  <div class="min-h-screen pt-18 px-6 pb-16 bg-transparent bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent">
    <div class="max-w-7xl mx-auto">
          <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div class="absolute -top-48 -left-48 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
    </div>
      
      <div class="mb-6 flex flex-col items-center text-center">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-8 h-[2px] bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
          <span class="text-sm font-semibold tracking-[0.2em] text-red-500 uppercase">Discover Competitions</span>
        </div>
        <div class="text-4xl md:text-5xl font-bold text-white tracking-tight">
          Current <span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">Contests</span>
        </div>
      </div>

      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div class="flex flex-wrap gap-3">
          <button 
            v-for="f in filters" 
            :key="f.value" 
            @click="activeFilter = f.value"
            :class="[
              'px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border',
              activeFilter === f.value 
                ? 'bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)]' 
                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
            ]"
          >
            {{ f.label }}
          </button>
        </div>

        <div class="relative group">
          <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-white/30 group-focus-within:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <input 
            v-model="search" 
            type="text" 
            placeholder="Search contests..."
            class="w-full md:w-80 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-base text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600/50 transition-all" 
          />
        </div>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center py-32">
        <LoadingSpinner label="Fetching challenges..." />
      </div>

      <div v-else-if="filteredContests.length === 0" class="text-center py-32 bg-white/5 rounded-3xl border border-dashed border-white/10">
        <div class="text-6xl mb-6 opacity-50">🔭</div>
        <h3 class="text-xl text-white font-medium">No results found</h3>
        <p class="text-white/40 mt-2">Try adjusting your filters or search terms.</p>
      </div>

      <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
        <ContestCard 
          v-for="contest in filteredContests" 
          :key="contest.id"
          :contest="contest" 
          @register="handleRegister(contest)" 
          class="hover:translate-y-[-4px] transition-transform duration-300"
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

const router = useRouter()
const auth = useAuthStore()
const contestStore = useContestStore()

const loading = ref(true)
const search = ref('')
const activeFilter = ref('ALL')

const filters = [
  { label: 'All', value: 'ALL' },
  { label: 'Registration Open', value: 'REGISTRATION_OPEN' },
  { label: 'Live Now', value: 'RUNNING' },
  { label: 'Upcoming', value: 'UPCOMING' },
  { label: 'Finished', value: 'FINISHED' },
]

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
