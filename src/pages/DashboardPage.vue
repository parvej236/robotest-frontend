<template>
  <div class="min-h-screen pt-24 px-6 pb-12 bg-transparent relative overflow-hidden font-sans">
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div class="absolute -top-48 -left-48 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px]"></div>
    </div>

    <div class="max-w-7xl mx-auto z-10 relative">
      <div class="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 class="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
            Welcome, <span class="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 pe-2">{{ auth.username }}</span>
          </h1>
          <p class="text-blue-400/80 font-bold uppercase tracking-[0.3em] text-xs mt-3">
            {{ greeting }} • {{ todayDate }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div v-for="stat in statCards" :key="stat.label"
             class="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 rounded-3xl relative overflow-hidden group">
          <div class="absolute -top-4 -right-4 text-5xl opacity-10 group-hover:scale-125 transition-transform duration-500">{{ stat.icon }}</div>
          <div class="text-4xl font-black mb-1 italic tracking-tighter" :style="`color: ${stat.color}`">
            {{ stat.value }}
          </div>
          <div class="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{{ stat.label }}</div>
        </div>
      </div>

      <div class="grid lg:grid-cols-12 gap-8">
        <div class="lg:col-span-8 space-y-8">
          
          <div class="bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 shadow-2xl">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <h2 class="text-2xl font-black text-white uppercase italic tracking-tight underline decoration-red-600 underline-offset-8">My History</h2>
              
              <div class="flex items-center gap-3 bg-white/5 p-1 rounded-xl border border-white/10">
                <span class="pl-3 text-xs font-black text-white/40 uppercase">Filter</span>
                <select v-model="selectedHistoryId" class="bg-transparent text-lg font-bold text-white border-none outline-none pr-4">
                  <option value="" class="bg-[#0a0a0a]">All History</option>
                  <option v-for="res in sortedHistory" :key="res.id" :value="res.id" class="bg-[#0a0a0a] text-xs font-bold text-white">
                    {{ res.contestName }}
                  </option>
                </select>
              </div>
            </div>

            <div v-if="loading" class="flex justify-center py-12"><LoadingSpinner /></div>

            <div v-else-if="filteredResult" class="mb-8 p-6 bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 rounded-2xl animate-in fade-in zoom-in duration-300">
              <div class="flex justify-between items-start mb-6">
                <div>
                  <p class="text-[10px] font-black text-blue-400 uppercase tracking-widest">Selected Performance</p>
                  <h3 class="text-xl font-black text-white uppercase italic">{{ filteredResult.contest?.name }}</h3>
                </div>
                <button @click="selectedHistoryId = ''" class="text-xs font-black text-white/40 hover:text-white uppercase">Clear Filter</button>
              </div>
              
              <div class="grid grid-cols-3 gap-4 mb-6">
                <div class="bg-white/5 p-3 rounded-xl">
                  <p class="text-[8px] font-black text-white/40 uppercase">Points</p>
                  <p class="text-xl font-black text-white">{{ filteredResult.totalScore?.toFixed(2) }}</p>
                </div>
                <div class="bg-white/5 p-3 rounded-xl">
                  <p class="text-[8px] font-black text-white/40 uppercase">Rank</p>
                  <p class="text-xl font-black text-red-500">#{{ filteredResult.rank }}</p>
                </div>
                <div class="bg-white/5 p-3 rounded-xl">
                  <p class="text-[8px] font-black text-white/40 uppercase">Solved</p>
                  <p class="text-xl font-black text-green-500">{{ filteredResult.solvedCount }}/{{ filteredResult.totalQuestions }}</p>
                </div>
              </div>

              <p class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">Protocol Detailed Logs</p>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div v-for="(score, qId) in filteredResult.questionScores" :key="qId" 
                     class="bg-white/[0.03] border border-white/5 p-2 rounded-lg flex justify-between items-center">
                  <span class="text-[10px] font-bold text-white/60">Q{{ qId }}</span>
                  <span class="text-xs font-black" :class="score > 0 ? 'text-green-400' : 'text-red-500'">{{ score.toFixed(1) }}</span>
                </div>
              </div>
            </div>

            <div v-else class="space-y-3">
              <div v-if="history.length === 0" class="text-center py-12 text-white/20 font-black uppercase">No records found</div>
              <div v-for="res in sortedHistory" :key="res.id"
                   @click="selectedHistoryId = res.id"
                   class="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all cursor-pointer group">
                <div class="w-12 h-12 flex flex-col items-center justify-center bg-white/5 rounded-xl">
                  <span class="text-[8px] font-black text-white/40 uppercase">Rank</span>
                  <span class="text-lg font-black text-red-500">#{{ res.rank }}</span>
                </div>
                <div class="flex-1">
                  <p class="text-lg font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{{ res.contest?.name }}</p>
                  <p class="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Score: {{ res.totalScore?.toFixed(1) }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-black text-white tracking-tighter">{{ res.solvedCount }} Solved</p>
                  <p class="text-[10px] text-gray-500 font-black uppercase">{{ formatDate(res.calculatedAt) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-4 space-y-6">
          <div class="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 text-center relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-transparent to-blue-600"></div>
            
            <div class="w-24 h-24 mx-auto rounded-3xl rotate-3 bg-gradient-to-br from-red-600 to-blue-600 p-1 mb-6 shadow-xl shadow-red-900/20">
              <div class="w-full h-full bg-[#020202] rounded-[1.4rem] overflow-hidden flex items-center justify-center">
                <img v-if="avatarFullUrl" :src="avatarFullUrl" class="w-full h-full object-cover" />
                <span v-else class="text-4xl font-black text-white">{{ auth.username?.charAt(0)?.toUpperCase() }}</span>
              </div>
            </div>

            <h3 class="text-2xl font-black text-white uppercase italic leading-none">{{ auth.fullName }}</h3>
            <p class="text-blue-500 text-xs font-black uppercase tracking-widest mt-2 mb-6">@{{ auth.username }}</p>

            <div v-if="profile" class="space-y-3 text-left bg-white/5 p-4 rounded-2xl mb-6">
              <div class="flex items-center gap-3 text-[11px] font-bold text-gray-400 uppercase">
                <span class="text-blue-500 text-lg">🎓</span> {{ profile.university || 'University of Dhaka' }}
              </div>
              <div class="flex items-center gap-3 text-[11px] font-bold text-gray-400 uppercase">
                <span class="text-red-500 text-lg">🪪</span> {{ profile.registrationNumber || 'N/A' }}
              </div>
            </div>

            <router-link to="/profile" class="block w-full py-4 bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-white hover:text-black transition-all">
              Edit Profile
            </router-link>
          </div>

          <div v-if="bestResult" class="bg-gradient-to-br from-red-600/20 to-blue-600/20 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 text-center">
            <p class="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4">Best Performance</p>
            <div class="text-7xl font-black text-white italic tracking-tighter mb-2">#{{ bestResult.rank }}</div>
            <p class="text-xs font-bold text-gray-300 uppercase px-4 truncate">{{ bestResult.contest?.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore }   from '@/stores/auth'
import { useContestStore } from '@/stores/contest'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { BACKEND_URL } from '@/config'
import api from '@/utils/api'
import { format } from 'date-fns'

const auth         = useAuthStore()
const contestStore = useContestStore()

// ── State ─────────────────────────────────────────────────────
const history           = ref([])
const profile           = ref(null)
const loading           = ref(true)
const selectedHistoryId = ref('')

// ── Avatar ────────────────────────────────────────────────────
const avatarFullUrl = computed(() => {
  const path = auth.avatar
  if (!path) return null
  return path.startsWith('http') ? path : BACKEND_URL + path
})

const todayDate = computed(() => format(new Date(), 'EEEE, MMM dd yyyy'))

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
})

// ── Derived Data ─────────────────────────────────────────────
const sortedHistory = computed(() => {
  return [...history.value].sort((a, b) => new Date(b.calculatedAt) - new Date(a.calculatedAt))
})

const filteredResult = computed(() => {
  if (!selectedHistoryId.value) return null
  return history.value.find(r => r.id === selectedHistoryId.value)
})

const bestResult = computed(() => {
  if (history.value.length === 0) return null
  return [...history.value].sort((a, b) => a.rank - b.rank)[0]
})

const statCards = computed(() => {
  const totalSolved = history.value.reduce((acc, curr) => acc + (curr.solvedCount || 0), 0)
  const totalPossible = history.value.reduce((acc, curr) => acc + (curr.totalQuestions || 0), 1)
  const accuracy = Math.round((totalSolved / totalPossible) * 100)

  return [
    { label: 'Contests Joined', value: history.value.length, color: '#ff0033', icon: '🏆' },
    { label: 'Avg Accuracy',    value: accuracy + '%',       color: '#00ff88', icon: '🎯' },
    { label: 'Best Rank',       value: bestResult.value ? '#' + bestResult.value.rank : '—', color: '#00bfff', icon: '🥇' },
    { label: 'Total Score',     value: Math.round(history.value.reduce((a, b) => a + (b.totalScore || 0), 0)), color: '#ffaa00', icon: '💎' },
  ]
})

// ── Helpers ───────────────────────────────────────────────────
function formatDate(d) {
  if (!d) return '—'
  try { return format(new Date(d), 'MMM dd, yyyy') } catch { return d }
}

// ── Mount ─────────────────────────────────────────────────────
onMounted(async () => {
  try {
    // 1. Fetch User Performance History
    history.value = await contestStore.getMyHistory()

    // 2. Fetch Profile Info
    const res = await api.get('/users/me')
    profile.value = res.data
  } catch (e) {
    console.error('Dashboard load failed:', e.message)
  } finally {
    loading.value = false
  }
})
</script>