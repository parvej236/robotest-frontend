<!-- src/pages/DashboardPage.vue -->
<template>
  <div class="min-h-screen pt-20 px-4 pb-12">
    <div class="max-w-7xl mx-auto">

      <!-- ── Header ──────────────────────────────────────────── -->
      <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <div class="w-4 h-px bg-neon-red"></div>
            <span class="text-xs font-display tracking-widest text-neon-red uppercase">Command Center</span>
          </div>
          <h1 class="font-display text-2xl font-black text-white tracking-wide">
            Welcome back, <span class="glow-text-red">{{ auth.username }}</span>
          </h1>
          <p class="text-white/30 font-body text-xs mt-1">
            {{ greeting }} · {{ todayDate }}
          </p>
        </div>
        <div class="flex gap-3">
          <router-link to="/contests" class="btn-primary py-2 text-xs">Browse Contests</router-link>
        </div>
      </div>

      <!-- ── Stats cards ─────────────────────────────────────── -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div v-for="stat in statCards" :key="stat.label"
             class="glass-card p-5 relative overflow-hidden group cursor-default">
          <div class="absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-10 group-hover:opacity-25 transition-opacity"
               :style="`background: ${stat.color}`"></div>
          <div class="text-3xl font-display font-black mb-1" :style="`color: ${stat.color}`">
            {{ stat.value }}
          </div>
          <div class="text-xs font-body text-white/40 uppercase tracking-wider">{{ stat.label }}</div>
          <div class="absolute bottom-2 right-3 text-lg opacity-20 select-none">{{ stat.icon }}</div>
        </div>
      </div>

      <!-- ── Live contest alert banner ──────────────────────── -->
      <div v-if="runningContests.length > 0" class="mb-6 space-y-3">
        <div v-for="c in runningContests" :key="'live-' + c.id"
             class="glass-card border border-green-500/30 bg-green-500/5 p-4
                    flex items-center justify-between gap-4 flex-wrap">
          <div class="flex items-center gap-3">
            <div class="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
            <div>
              <p class="font-display font-bold text-white text-sm">{{ c.name }}</p>
              <p class="text-xs text-green-400/70 font-mono">Contest is LIVE right now!</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <!-- Countdown -->
            <div v-if="countdowns[c.id]" class="flex gap-2">
              <div v-for="(val, unit) in countdowns[c.id]" :key="unit" class="text-center">
                <div class="font-display font-black text-green-400 text-lg leading-none">{{ val }}</div>
                <div class="text-[9px] text-white/30 font-display tracking-wider uppercase">{{ unit }}</div>
              </div>
            </div>
            <router-link :to="`/contests/${c.id}/join`"
              class="btn-primary text-xs py-1.5 px-4 whitespace-nowrap">
              ⚡ Join Now
            </router-link>
          </div>
        </div>
      </div>

      <!-- ── Main grid ────────────────────────────────────────── -->
      <div class="grid lg:grid-cols-3 gap-6">

        <!-- Left — contests + results -->
        <div class="lg:col-span-2 space-y-6">

          <!-- My Contests -->
          <div class="glass-card p-6">
            <div class="flex items-center justify-between mb-5">
              <h2 class="section-title">My Contests</h2>
              <router-link to="/contests"
                class="text-xs font-display text-neon-blue hover:text-white transition-colors tracking-wider">
                View All →
              </router-link>
            </div>

            <div v-if="loadingContests" class="flex justify-center py-8">
              <LoadingSpinner />
            </div>

            <div v-else-if="myContests.length === 0" class="text-center py-10">
              <div class="text-4xl mb-3">🤖</div>
              <p class="text-white/40 font-body text-sm mb-4">No contests joined yet</p>
              <router-link to="/contests"
                class="text-neon-blue text-xs hover:underline">
                Browse contests →
              </router-link>
            </div>

            <div v-else class="space-y-2">
              <div v-for="contest in myContests" :key="contest.id"
                   class="flex items-center gap-3 p-3 bg-dark-800/50 rounded-lg border border-white/5
                          hover:border-neon-red/20 hover:bg-dark-800/80 transition-all cursor-pointer group"
                   @click="$router.push(`/contests/${contest.id}`)">

                <!-- Status dot -->
                <div class="w-2 h-2 rounded-full flex-shrink-0 transition-all"
                     :style="`background: ${statusDotColor(contest.status)}`"
                     :class="contest.status === 'RUNNING' ? 'animate-pulse' : ''"></div>

                <!-- Name + date -->
                <div class="flex-1 min-w-0">
                  <p class="font-display text-sm text-white font-semibold truncate
                             group-hover:text-neon-red transition-colors">
                    {{ contest.name }}
                  </p>
                  <p class="text-xs text-white/40 font-mono mt-0.5">{{ formatDate(contest.contestDate) }}</p>
                </div>

                <!-- Right side: badge + rank + join -->
                <div class="flex items-center gap-2 flex-shrink-0">
                  <StatusBadge :status="contest.status" size="xs" />

                  <span v-if="myResults[contest.id]"
                        class="text-[10px] font-display text-neon-blue border border-neon-blue/30 px-1.5 py-0.5 rounded">
                    #{{ myResults[contest.id].rank }}
                  </span>

                  <span v-if="myResults[contest.id]"
                        class="text-[10px] font-mono text-white/30 hidden sm:inline">
                    {{ myResults[contest.id].correctCount }}/{{ myResults[contest.id].totalQuestions }}
                  </span>

                  <router-link v-if="contest.status === 'RUNNING'"
                    :to="`/contests/${contest.id}/join`" @click.stop
                    class="btn-primary py-0.5 px-2 text-[10px]">
                    Join
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <!-- My Results -->
          <div v-if="finishedContests.length > 0" class="glass-card p-6">
            <h2 class="section-title mb-5">My Results</h2>
            <div class="space-y-3">
              <div v-for="contest in finishedContests.slice(0, 5)" :key="'res-' + contest.id"
                   class="flex items-center gap-4 p-3 bg-dark-800/40 rounded-lg border border-white/5">

                <div class="flex-1 min-w-0">
                  <p class="font-display text-sm text-white font-semibold truncate">{{ contest.name }}</p>
                  <p class="text-xs text-white/30 font-mono">{{ formatDate(contest.contestDate) }}</p>
                </div>

                <div v-if="myResults[contest.id]" class="flex items-center gap-4">
                  <!-- Rank -->
                  <div class="text-center">
                    <p class="text-[9px] text-white/30 font-display tracking-wider uppercase">Rank</p>
                    <p class="font-display font-black text-base"
                       :class="myResults[contest.id].rank === 1 ? 'text-yellow-400' :
                                myResults[contest.id].rank === 2 ? 'text-gray-300'   :
                                myResults[contest.id].rank === 3 ? 'text-amber-600'  : 'text-neon-blue'">
                      #{{ myResults[contest.id].rank }}
                    </p>
                  </div>

                  <!-- Score -->
                  <div class="text-center">
                    <p class="text-[9px] text-white/30 font-display tracking-wider uppercase">Score</p>
                    <p class="font-display font-black text-neon-blue text-base">
                      {{ myResults[contest.id].correctCount }}
                      <span class="text-white/30 text-xs font-mono">
                        /{{ myResults[contest.id].totalQuestions }}
                      </span>
                    </p>
                  </div>

                  <!-- Score bar -->
                  <div class="w-20 h-1.5 bg-dark-800 rounded-full overflow-hidden hidden sm:block">
                    <div class="h-full rounded-full bg-gradient-to-r from-neon-red to-neon-blue"
                         :style="`width: ${scorePercent(myResults[contest.id])}%`"></div>
                  </div>
                </div>

                <span v-else class="text-xs text-white/20 font-mono">no result</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Right column -->
        <div class="space-y-4">

          <!-- Profile card -->
          <div class="glass-card neon-border-red p-5 text-center">
            <div class="w-20 h-20 mx-auto rounded-full border-2 border-neon-red/50 overflow-hidden
                        bg-dark-700 flex items-center justify-center mb-3">
              <img v-if="avatarFullUrl" :src="avatarFullUrl" :key="avatarFullUrl"
                   class="w-full h-full object-cover" alt="Avatar" />
              <span v-else class="font-display text-3xl font-black text-neon-red">
                {{ auth.username?.charAt(0)?.toUpperCase() }}
              </span>
            </div>

            <h3 class="font-display font-bold text-white text-base">{{ auth.fullName }}</h3>
            <p class="text-xs font-mono text-white/40 mt-0.5 mb-4">@{{ auth.username }}</p>

            <!-- Extra profile fields -->
            <div v-if="profile" class="space-y-1.5 text-left mb-4">
              <div v-if="profile.university"
                   class="flex items-center gap-2 text-xs text-white/50 font-body">
                <span class="text-neon-blue/60 text-sm">🎓</span>
                <span class="truncate">{{ profile.university }}</span>
              </div>
              <div v-if="profile.registrationNumber"
                   class="flex items-center gap-2 text-xs text-white/50 font-body">
                <span class="text-neon-red/60 text-sm">🪪</span>
                <span class="truncate">{{ profile.registrationNumber }}</span>
              </div>
              <div v-if="profile.rollNumber"
                   class="flex items-center gap-2 text-xs text-white/50 font-body">
                <span class="text-white/30 text-sm">📋</span>
                <span class="truncate">{{ profile.rollNumber }}</span>
              </div>
              <div v-if="profile.hobby"
                   class="flex items-center gap-2 text-xs text-white/50 font-body">
                <span class="text-white/30 text-sm">⚡</span>
                <span class="truncate">{{ profile.hobby }}</span>
              </div>
            </div>

            <div v-if="auth.isAdmin"
                 class="mb-3 inline-flex items-center gap-1 text-neon-red text-xs font-display
                        border border-neon-red/30 px-2 py-0.5 rounded-sm">
              ADMIN
            </div>

            <router-link to="/profile"
              class="btn-ghost w-full justify-center flex text-xs py-2">
              Edit Profile
            </router-link>
          </div>

          <!-- Best rank card — only shows if user has finished contest results -->
          <div v-if="bestResult" class="glass-card p-4 text-center neon-border-blue">
            <p class="text-xs font-display tracking-widest text-neon-blue uppercase mb-2">Best Rank Ever</p>
            <p class="font-display font-black text-5xl"
               :class="bestResult.rank === 1 ? 'text-yellow-400' :
                        bestResult.rank === 2 ? 'text-gray-300'   :
                        bestResult.rank === 3 ? 'text-amber-600'  : 'text-neon-blue'">
              #{{ bestResult.rank }}
            </p>
            <p class="text-[11px] text-white/30 font-body mt-1 truncate px-2">{{ bestResult.contestName }}</p>
            <p class="text-[10px] text-white/20 font-mono mt-0.5">
              {{ bestResult.correctCount }}/{{ bestResult.totalQuestions }} correct
            </p>
          </div>

          <!-- Quick links -->
          <div class="glass-card p-4">
            <h3 class="section-title text-sm mb-3">Quick Links</h3>
            <div class="space-y-0.5">
              <router-link to="/contests"
                class="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/5 transition-colors text-sm text-white/70 hover:text-white">
                <span class="text-neon-red text-xs">◆</span> Browse Contests
              </router-link>
              <router-link to="/leaderboard"
                class="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/5 transition-colors text-sm text-white/70 hover:text-white">
                <span class="text-neon-blue text-xs">◆</span> Leaderboard
              </router-link>
              <router-link to="/profile"
                class="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/5 transition-colors text-sm text-white/70 hover:text-white">
                <span class="text-white/30 text-xs">◆</span> Edit Profile
              </router-link>
              <router-link v-if="auth.isAdmin" to="/admin"
                class="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/5 transition-colors text-sm text-neon-red hover:text-white">
                <span class="text-neon-red text-xs">◆</span> Admin Panel
              </router-link>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

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