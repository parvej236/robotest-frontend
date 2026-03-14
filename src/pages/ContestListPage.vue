<template>
  <div class="min-h-screen pt-20 px-4 pb-12">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-4 h-px bg-neon-red"></div>
          <span class="text-xs font-display tracking-widest text-neon-red uppercase">Competitions</span>
        </div>
        <h1 class="page-title">All Contests</h1>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-2 mb-8">
        <button v-for="f in filters" :key="f.value" @click="activeFilter = f.value"
          :class="['px-4 py-1.5 rounded text-xs font-display tracking-wider uppercase transition-all duration-200',
                   activeFilter === f.value ? 'bg-neon-red text-white shadow-neon-red' : 'bg-white/5 text-white/50 border border-white/10 hover:border-white/20 hover:text-white']">
          {{ f.label }}
        </button>
        <div class="flex-1"></div>
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input v-model="search" type="text" placeholder="Search contests..."
                 class="input-field pl-9 py-1.5 text-xs w-48 md:w-64" />
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20"><LoadingSpinner label="Loading contests..." /></div>

      <!-- Grid -->
      <div v-else-if="filteredContests.length === 0" class="text-center py-20">
        <div class="text-4xl mb-3">🤖</div>
        <p class="text-white/40 font-body">No contests found</p>
      </div>
      <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <ContestCard v-for="contest in filteredContests" :key="contest.id"
                     :contest="contest" @register="handleRegister(contest)" />
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
  return list
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
