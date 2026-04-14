<template>
  <div class="min-h-screen pt-24 px-6 pb-12 bg-[#020202] relative overflow-hidden font-sans">
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

      <div v-if="runningContests.length > 0" class="mb-8 space-y-4">
        <div v-for="c in runningContests" :key="'live-' + c.id"
             class="bg-green-500/10 backdrop-blur-md border border-green-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-green-900/10">
          <div class="flex items-center gap-5">
            <div class="w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
            <div>
              <p class="font-black text-white text-xl uppercase italic tracking-tight">{{ c.name }}</p>
              <p class="text-xs text-green-400 font-black uppercase tracking-widest">Battle is active</p>
            </div>
          </div>
          <div class="flex items-center gap-8">
            <div v-if="countdowns[c.id]" class="flex gap-4">
              <div v-for="(val, unit) in countdowns[c.id]" :key="unit" class="text-center">
                <div class="text-2xl font-black text-white leading-none">{{ val }}</div>
                <div class="text-[10px] text-gray-500 font-black uppercase">{{ unit }}</div>
              </div>
            </div>
            <router-link :to="`/contests/${c.id}/join`"
              class="px-6 py-3 bg-green-500 text-black font-black rounded-xl hover:scale-105 transition-transform uppercase tracking-tighter text-sm">
              ⚡ Join Battle
            </router-link>
          </div>
        </div>
      </div>

      <div class="grid lg:grid-cols-12 gap-8">
        
        <div class="lg:col-span-8 space-y-8">
          <div class="bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 shadow-2xl">
            <div class="flex items-center justify-between mb-8">
              <h2 class="text-2xl font-black text-white uppercase italic tracking-tight underline decoration-red-600 underline-offset-8">My Contests</h2>
              <router-link to="/contests" class="text-xs font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors">View All →</router-link>
            </div>

            <div v-if="loadingContests" class="flex justify-center py-12"><LoadingSpinner /></div>

            <div v-else class="space-y-3">
              <div v-for="contest in myContests" :key="contest.id"
                   @click="$router.push(`/contests/${contest.id}`)"
                   class="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] hover:border-blue-500/30 transition-all cursor-pointer group">
                
                <div class="w-2 h-10 rounded-full transition-all" :style="`background: ${statusDotColor(contest.status)}`"></div>
                
                <div class="flex-1">
                  <p class="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{{ contest.name }}</p>
                  <p class="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">{{ formatDate(contest.contestDate) }}</p>
                </div>

                <div class="flex items-center gap-3">
                  <span v-if="myResults[contest.id]" class="bg-blue-600/20 text-blue-400 text-xs font-black px-3 py-1 rounded-lg">#{{ myResults[contest.id].rank }}</span>
                  <StatusBadge :status="contest.status" size="sm" />
                </div>
              </div>
            </div>
          </div>

          <div v-if="finishedContests.length > 0" class="bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 shadow-2xl">
            <h2 class="text-2xl font-black text-white uppercase italic tracking-tight mb-8">Battle Records</h2>
            <div class="space-y-4">
              <div v-for="contest in finishedContests.slice(0, 5)" :key="'res-' + contest.id"
                   class="grid grid-cols-2 md:grid-cols-4 items-center gap-4 p-5 bg-white/[0.01] border border-white/5 rounded-2xl">
                <div class="col-span-2">
                  <p class="text-base font-bold text-white truncate">{{ contest.name }}</p>
                  <p class="text-[10px] text-gray-500 font-black uppercase">{{ formatDate(contest.contestDate) }}</p>
                </div>
                <div v-if="myResults[contest.id]" class="text-center">
                  <p class="text-[10px] text-gray-500 font-black uppercase">Rank</p>
                  <p class="text-xl font-black text-blue-400">#{{ myResults[contest.id].rank }}</p>
                </div>
                <div v-if="myResults[contest.id]" class="text-center">
                  <p class="text-[10px] text-gray-500 font-black uppercase">Accuracy</p>
                  <p class="text-xl font-black text-red-500">{{ scorePercent(myResults[contest.id]) }}%</p>
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

            <h3 class="text-2xl font-black text-white uppercase italic">{{ auth.fullName }}</h3>
            <p class="text-blue-500 text-xs font-black uppercase tracking-widest mt-1 mb-6">@{{ auth.username }}</p>

            <div v-if="profile" class="space-y-3 text-left bg-white/5 p-4 rounded-2xl mb-6">
              <div v-if="profile.university" class="flex items-center gap-3 text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                <span class="text-blue-500 text-lg">🎓</span> {{ profile.university }}
              </div>
              <div v-if="profile.registrationNumber" class="flex items-center gap-3 text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                <span class="text-red-500 text-lg">🪪</span> {{ profile.registrationNumber }}
              </div>
            </div>

            <router-link to="/profile" class="block w-full py-4 bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-white hover:text-black transition-all">
              Edit Profile
            </router-link>
          </div>

          <div v-if="bestResult" class="bg-gradient-to-br from-red-600/20 to-blue-600/20 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 text-center">
            <p class="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4">Peak Performance</p>
            <div class="text-7xl font-black text-white italic tracking-tighter mb-2">#{{ bestResult.rank }}</div>
            <p class="text-xs font-bold text-gray-300 uppercase px-4 truncate">{{ bestResult.contestName }}</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Chrome/Safari placeholder fix for bold text */
::placeholder {
  font-weight: 900;
  color: #334155;
}

.text-transparent {
  -webkit-background-clip: text;
}
</style>
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore }   from '@/stores/auth'
import { useContestStore } from '@/stores/contest'
import StatusBadge   from '@/components/common/StatusBadge.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { BACKEND_URL } from '@/config'
import api from '@/utils/api'
import { format } from 'date-fns'

const auth         = useAuthStore()
const contestStore = useContestStore()

// ── State ─────────────────────────────────────────────────────
const myContests      = ref([])
const loadingContests = ref(true)
const profile         = ref(null)
const myResults       = ref({})     // { [contestId]: Result }
const countdowns      = ref({})     // { [contestId]: { H, M, S } }
let   timerHandle     = null

// ── Avatar ────────────────────────────────────────────────────
const avatarFullUrl = computed(() => {
  const path = auth.avatar
  if (!path) return null
  return path.startsWith('http') ? path : BACKEND_URL + path
})

// ── Greeting ──────────────────────────────────────────────────
const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
})

const todayDate = computed(() => {
  try { return format(new Date(), 'EEEE, MMM dd yyyy') } catch { return '' }
})

// ── Derived lists ─────────────────────────────────────────────
const runningContests  = computed(() => myContests.value.filter(c => c.status === 'RUNNING'))
const finishedContests = computed(() => myContests.value.filter(c => c.status === 'FINISHED'))

// ── Stat cards ─────────────────────────────────────────────────
const statCards = computed(() => [
  { label: 'Contests Joined', value: myContests.value.length, color: '#ff0033', icon: '🏆' },
  { label: 'Live Now',        value: runningContests.value.length, color: '#00ff88', icon: '⚡' },
  { label: 'Completed',       value: finishedContests.value.length, color: '#00bfff', icon: '✅' },
  {
    label: 'Upcoming',
    value: myContests.value.filter(c =>
      c.status === 'UPCOMING' || c.status === 'REGISTRATION_OPEN').length,
    color: '#ffaa00', icon: '📅'
  },
])

// ── Best result across all finished contests ──────────────────
const bestResult = computed(() => {
  const all = Object.values(myResults.value)
  if (!all.length) return null
  const best = all.reduce((a, b) => (a.rank < b.rank ? a : b), all[0])
  const contest = myContests.value.find(
    c => c.id === (best.contest?.id ?? best.contestId)
  )
  return { ...best, contestName: contest?.name || '—' }
})

// ── Helpers ───────────────────────────────────────────────────
function formatDate(d) {
  if (!d) return 'TBD'
  try { return format(new Date(d), 'MMM dd, yyyy') } catch { return d }
}

function statusDotColor(status) {
  return ({
    UPCOMING:          '#555',
    REGISTRATION_OPEN: '#00bfff',
    RUNNING:           '#00ff88',
    FINISHED:          '#333',
  })[status] || '#555'
}

function scorePercent(result) {
  if (!result?.totalQuestions) return 0
  return Math.round((result.correctCount / result.totalQuestions) * 100)
}

// ── Live countdown for RUNNING contests ───────────────────────
function tick() {
  const now = Date.now()
  runningContests.value.forEach(c => {
    if (!c.contestEnd) return
    const diff = Math.max(0, new Date(c.contestEnd).getTime() - now)
    const h = Math.floor(diff / 3_600_000)
    const m = Math.floor((diff % 3_600_000) / 60_000)
    const s = Math.floor((diff % 60_000)    / 1_000)
    countdowns.value[c.id] = {
      H: String(h).padStart(2, '0'),
      M: String(m).padStart(2, '0'),
      S: String(s).padStart(2, '0'),
    }
  })
}

// ── Load results for finished contests ───────────────────────
async function loadMyResults() {
  try {
    const res = await api.get('/leaderboard/my-results')
    const list = res.data || []
    list.forEach(r => {
      // backend returns Result entity; contestId may be nested or flat
      const cid = r.contest?.id ?? r.contestId
      if (cid) myResults.value[cid] = r
    })
  } catch (e) {
    console.error('Results load failed:', e.message)
  }
}

// ── Mount ─────────────────────────────────────────────────────
onMounted(async () => {
  // 1. Load my contests
  try {
    myContests.value = await contestStore.getMyContests()
  } catch (e) {
    console.error('Contests load failed:', e.message)
  } finally {
    loadingContests.value = false
  }

  // 2. Load full profile for sidebar details
  try {
    const res = await api.get('/users/me')
    profile.value = res.data
  } catch (e) {
    console.error('Profile load failed:', e.message)
  }

  // 3. Load results for finished contests
  if (finishedContests.value.length > 0) {
    await loadMyResults()
  }

  // 4. Start countdown ticker
  tick()
  timerHandle = setInterval(tick, 1000)
})

onUnmounted(() => {
  if (timerHandle) clearInterval(timerHandle)
})
</script>