<template>
  <div class="min-h-screen pt-28 px-6 pb-24 bg-transparent text-white selection:bg-red-500/30">
    <div class="max-w-6xl mx-auto">

      <div v-if="loading" class="flex flex-col items-center justify-center py-40">
        <div class="relative w-20 h-20 mb-6">
          <div class="absolute inset-0 border-4 border-red-500/20 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-red-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p class="text-white/40 font-bold tracking-widest uppercase text-xs animate-pulse">Syncing Arena Data</p>
      </div>

      <div v-else-if="!contest"
        class="text-center py-32 bg-white/[0.02] border border-white/10 rounded-[2.5rem] backdrop-blur-xl">
        <div class="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-2xl font-black mb-6">Contest profile not found.</p>
        <router-link to="/contests"
          class="bg-white text-black px-8 py-3 rounded-2xl font-black hover:bg-gray-200 transition-all inline-flex items-center gap-2">
          ← Return to Exploration
        </router-link>
      </div>

      <div v-else>
        <router-link to="/contests"
          class="inline-flex items-center gap-3 text-xl font-black text-white/70 hover:text-red-500 mb-10 transition-all group">
          <span
            class="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-red-500/50 group-hover:-translate-x-1 transition-all">←</span>
          BACK TO ALL CONTESTS
        </router-link>

        <div
          class="relative bg-white/[0.03] border border-white/10 rounded-[3rem] p-2 md:p-6 mb-6 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl">
          <div class="absolute -top-40 -right-40 w-[500px] h-[500px] bg-red-600/15 blur-[140px] rounded-full pointer-events-none"></div>
          
          <div class="relative z-10">
            <div class="flex flex-wrap items-center justify-between gap-6">
              <StatusBadge :status="contest.status" class="scale-125 origin-left drop-shadow-[0_0_15px_rgba(220,38,38,0.3)]" />
              <div class="flex items-center gap-4 px-6 py-2.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                <span class="text-lg font-black text-white leading-none">
                  {{ contest.registrationCount || 0 }} <span class="text-white/40 font-bold ml-1">Joined</span>
                </span>
              </div>
            </div>

            <div class="flex items-center justify-between mb-2 mt-4">
              <div>
                <h1 class="text-3xl md:text-5xl font-black text-white leading-[1] tracking-tighter drop-shadow-2xl">
                  {{ contest.name }}
                </h1>
                <p v-if="contest.description" class="text-xl md:text-2xl text-gray-400 font-medium max-w-4xl mt-2">
                  {{ contest.description }}
                </p>
              </div>

              <div v-if="countdownLabel" class="p-4 bg-white/[0.03] border border-green-500/50 rounded-2xl relative overflow-hidden backdrop-blur-sm hidden lg:flex items-center gap-6">
                <div class="flex items-center gap-3">
                  <span class="animate-ping h-3 w-3 rounded-full bg-green-500"></span>
                  <span class="text-xs font-black text-white uppercase tracking-widest opacity-70">{{ countdownLabel }}</span>
                </div>
                <div class="flex gap-4">
                  <div v-for="(val, key) in timeLeft" :key="key" class="text-center">
                    <span class="text-3xl font-black block">{{ String(val).padStart(2, '0') }}</span>
                    <span class="text-[9px] text-red-500 font-black uppercase">{{ key }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap gap-5 items-center mt-8">
              <button v-if="contest.status === 'REGISTRATION_OPEN' && !auth.isLoggedIn" @click="$router.push('/login')"
                class="bg-white text-black font-black py-4 px-10 rounded-2xl hover:bg-gray-200 transition-all">
                LOGIN TO REGISTER
              </button>

              <button v-if="contest.status === 'REGISTRATION_OPEN' && auth.isLoggedIn && !isRegistered"
                @click="handleRegister" :disabled="registering"
                class="bg-red-600 hover:bg-red-500 text-white font-black py-4 px-10 rounded-2xl transition-all disabled:opacity-50">
                <span v-if="!registering">REGISTER NOW</span>
                <span v-else>PROCESSING...</span>
              </button>

              <router-link v-if="contest.status === 'RUNNING' && isRegistered"
                :to="`/contests/${contest.id}/join`"
                class="bg-gradient-to-r from-red-600 to-red-500 text-white font-black py-4 px-12 rounded-2xl shadow-lg transition-all active:scale-95">
                ⚡ JOIN CONTEST
              </router-link>
            </div>
          </div>
        </div>

        <div v-if="contest.status === 'FINISHED' || contest.status === 'RUNNING'"
          class="bg-white/[0.02] border border-white/10 rounded-[3rem] p-8 md:p-10 shadow-2xl backdrop-blur-3xl mt-12">
          
          <div class="flex items-center justify-between mb-10">
             <h2 class="text-2xl font-black text-white flex items-center gap-4 italic tracking-tighter">
              <span class="w-2 h-8 bg-blue-500 rounded-full shadow-[0_0_15px_#3b82f6]"></span>
              LIVE STANDINGS
            </h2>
          </div>

          <div v-if="loadingLB" class="flex justify-center py-24">
            <LoadingSpinner />
          </div>

          <div v-else-if="leaderboard.length === 0"
            class="text-center py-16 text-white/30 text-xl font-medium border-2 border-dashed border-white/5 rounded-[2rem]">
            Arena is open. Waiting for the first combatant...
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="text-left border-b border-white/10">
                  <th class="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] py-4">Rank</th>
                  <th class="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Combatant</th>
                  
                  <th v-for="n in (leaderboard[0]?.totalQuestions || 0)" :key="n"
                    class="text-center text-[11px] font-black text-white/40 uppercase tracking-widest">
                    Q{{ n }}
                  </th>
                  
                  <th class="text-right text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Total Score</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/[0.03]">
                <tr v-for="entry in leaderboard" :key="entry.rank" class="group hover:bg-white/[0.04] transition-all">
                  <td class="py-6">
                    <span v-if="entry.rank <= 3" class="text-2xl">
                      {{ entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉' }}
                    </span>
                    <span v-else class="font-black text-white/20 px-2">#{{ entry.rank }}</span>
                  </td>
                  
                  <td class="py-6">
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-full bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                        <img v-if="entry.profileImageUrl" :src="toFullUrl(entry.profileImageUrl)" class="w-full h-full object-cover" />
                        <div v-else class="w-full h-full flex items-center justify-center text-red-500 font-black text-lg">
                          {{ entry.username?.charAt(0).toUpperCase() }}
                        </div>
                      </div>
                      <div>
                        <p class="font-black text-white group-hover:text-red-500 transition-colors">@{{ entry.username }}</p>
                        <p class="text-[10px] text-white/40 font-bold uppercase tracking-tight">{{ entry.fullName }}</p>
                      </div>
                    </div>
                  </td>

                  <td v-for="(status, idx) in entry.questionStatuses" :key="idx" class="py-6 text-center">
                    <div v-if="status" class="inline-flex flex-col items-center gap-1">
                      <div v-if="status.correct" 
                        class="px-2 py-1 rounded-md bg-green-500/10 border border-green-500/30 flex flex-col items-center">
                        <span class="text-[10px] font-black text-green-400">+{{ status.score.toFixed(1) }}</span>
                        <div v-if="status.wrongCount > 0" class="text-[8px] font-bold text-red-400">(-{{ status.wrongCount }})</div>
                      </div>
                      
                      <div v-else 
                        class="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                        <span class="text-[10px] font-black text-red-500">-{{ status.wrongCount }}</span>
                      </div>
                      
                      <span class="text-[8px] text-white/20 font-mono">{{ formatTime(status.submittedAt) }}</span>
                    </div>
                    <div v-else class="w-6 h-1 bg-white/5 rounded-full mx-auto"></div>
                  </td>

                  <td class="py-6 text-right">
                    <div class="flex flex-col items-end">
                      <span class="text-2xl font-black text-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.3)]">
                        {{ entry.totalScore.toFixed(2) }}
                      </span>
                      <span v-if="entry.lastSubmissionTime" class="text-[9px] font-mono text-white/30">
                        Last: {{ formatTime(entry.lastSubmissionTime) }}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContestStore } from '@/stores/contest'
import { useAuthStore } from '@/stores/auth'
import { BACKEND_URL } from '@/config'
import StatusBadge from '@/components/common/StatusBadge.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { format } from 'date-fns'

const route = useRoute()
const router = useRouter()
const contestStore = useContestStore()
const auth = useAuthStore()

// ── State ─────────────────────────────────────────────────────
const contest = ref(null)
const loading = ref(true)
const leaderboard = ref([])
const loadingLB = ref(false)
const isRegistered = ref(false)
const registering = ref(false)
const regError = ref('')
const regSuccess = ref(false)
const hasSubmitted = ref(false)

// ── Helpers ───────────────────────────────────────────────────
function toFullUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return BACKEND_URL + path
}

function formatDT(d) {
  if (!d) return 'TBD'
  try { return format(new Date(d), 'MMM dd, hh:mm a') } catch { return d }
}

function formatTime(d) {
  if (!d) return '-'
  try { return format(new Date(d), 'hh:mm a') } catch { return d }
}

const dateItems = computed(() => {
  if (!contest.value) return []
  return [
    { label: 'Reg Open', value: formatDT(contest.value.registrationStart) },
    { label: 'Reg Close', value: formatDT(contest.value.registrationEnd) },
    { label: 'Contest Date', value: formatDT(contest.value.contestDate) },
    { label: 'Contest End', value: formatDT(contest.value.contestEnd) },
  ]
})

// ── Countdown Timer Logic ────────────────────────────────────
const timeLeft = ref({ H: 0, M: 0, S: 0 })
let timerHandle = null

const countdownLabel = computed(() => {
  if (!contest.value) return ''
  const statusLabels = {
    UPCOMING: 'Registration Opens In',
    REGISTRATION_OPEN: 'Contest Starts In',
    RUNNING: 'Contest Ends In'
  }
  return statusLabels[contest.value.status] || ''
})

const countdownTarget = computed(() => {
  if (!contest.value) return null
  const targets = {
    UPCOMING: contest.value.registrationStart,
    REGISTRATION_OPEN: contest.value.contestStart,
    RUNNING: contest.value.contestEnd
  }
  return targets[contest.value.status] || null
})

function tick() {
  const target = countdownTarget.value
  if (!target) return
  const diff = Math.max(0, new Date(target).getTime() - Date.now())
  timeLeft.value = {
    H: Math.floor(diff / 3_600_000),
    M: Math.floor((diff % 3_600_000) / 60_000),
    S: Math.floor((diff % 60_000) / 1_000),
  }
}

// ── Actions ──────────────────────────────────────────────────
async function handleRegister() {
  if (!auth.isLoggedIn) { router.push('/login'); return }
  registering.value = true
  try {
    await contestStore.registerForContest(contest.value.id)
    isRegistered.value = true
    regSuccess.value = true
    setTimeout(() => { regSuccess.value = false }, 5000)
    if (contest.value) contest.value.registrationCount = (contest.value.registrationCount || 0) + 1
  } catch (e) {
    regError.value = e.message || 'Registration failed.'
  } finally {
    registering.value = false
  }
}

// ── Lifecycle ────────────────────────────────────────────────
onMounted(async () => {
  try {
    const res = await contestStore.fetchContest(route.params.id)
    contest.value = res

    if (auth.isLoggedIn) {
      isRegistered.value = await contestStore.isRegistered(route.params.id)
      hasSubmitted.value = await contestStore.hasSubmittedContest(route.params.id)
    }

    if (contest.value.status === 'RUNNING' || contest.value.status === 'FINISHED') {
      loadingLB.value = true
      try {
        leaderboard.value = await contestStore.getLeaderboard(route.params.id)
      } finally {
        loadingLB.value = false
      }
    }

    tick()
    timerHandle = setInterval(tick, 1000)
  } catch (e) {
    console.error('Mount Error:', e)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  if (timerHandle) clearInterval(timerHandle)
})
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from { opacity: 0; transform: translateY(20px); }
.slide-up-leave-to { opacity: 0; transform: translateY(-20px); }
.drop-shadow-2xl { filter: drop-shadow(0 10px 10px rgba(0, 0, 0, 0.8)); }
</style>