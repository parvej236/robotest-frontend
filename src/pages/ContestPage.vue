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
          <div
            class="absolute -top-40 -right-40 w-[500px] h-[500px] bg-red-600/15 blur-[140px] rounded-full pointer-events-none">
          </div>
          <div
            class="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-red-900/10 blur-[120px] rounded-full pointer-events-none">
          </div>

          <div class="relative z-10">
            <div class="flex flex-wrap items-center justify-between gap-6">
              <StatusBadge :status="contest.status"
                class="scale-125 origin-left drop-shadow-[0_0_15px_rgba(220,38,38,0.3)]" />
              <div
                class="flex items-center gap-4 px-6 py-2.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                <div class="flex -space-x-2">
                  <div class="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center border-2 border-[#111]">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                </div>
                <span class="text-lg font-black text-white leading-none">
                  {{ contest.registrationCount || 0 }} <span class="text-white/40 font-bold ml-1">Joined</span>
                </span>
              </div>
            </div>

            <div class="flex items-center justify-between mb-2">
              <div>
                <h1 class="text-3xl md:text-5xl font-black text-white leading-[1] tracking-tighter drop-shadow-2xl">
                  {{ contest.name }}
                </h1>
                <p v-if="contest.description"
                  class="text-xl md:text-2xl text-gray-400 font-medium leading-relaxed max-w-4xl">
                  {{ contest.description }}
                </p>
              </div>


              <div v-if="countdownLabel" class="p-2 bg-white/[0.03] border border-green-500/50 rounded-2xl 
            relative overflow-hidden group backdrop-blur-sm flex flex-col md:flex-row 
            items-center justify-between gap-6">

                <div class="absolute inset-0 bg-gradient-to-r from-green-600/10 to-transparent opacity-50"></div>

                <div class="relative flex items-center gap-3">
                  <div class="relative flex h-3 w-3">
                    <span
                      class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
                  </div>
                  <span class="text-xl font-black text-white uppercase tracking-[0.3em] opacity-70">
                    {{ countdownLabel }}
                  </span>
                </div>

                <div class="relative flex gap-6 md:gap-10 mb-2">
                  <div v-for="(val, key) in timeLeft" :key="key" class="flex items-baseline gap-2">
                    <span class="text-3xl md:text-5xl font-black text-white tabular-nums tracking-tighter 
                   drop-shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                      {{ String(val).padStart(2, '0') }}
                    </span>
                    <span class="text-[9px] font-black text-red-500 uppercase tracking-widest">{{ key }}</span>
                  </div>
                </div>
              </div>

            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <div v-for="d in dateItems" :key="d.label"
                class="relative group bg-white/[0.03] p-3 text-center rounded-3xl border border-white/10 hover:border-red-500/50 transition-all duration-500">
                <p class="text-[11px] font-black text-red-500 uppercase tracking-[0.2em]">{{ d.label }}</p>
                <p class="text-lg font-bold text-white group-hover:text-red-400 transition-colors">{{ d.value }}</p>
              </div>
            </div>

            <div class="flex flex-wrap gap-5 items-center mt-2">
              <button v-if="contest.status === 'REGISTRATION_OPEN' && !auth.isLoggedIn" @click="$router.push('/login')"
                class="bg-white text-black font-black py-5 px-12 rounded-[1.5rem] text-lg hover:bg-gray-200 transition-all active:scale-95 flex items-center gap-3 shadow-[0_20px_40px_rgba(255,255,255,0.1)]">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                LOGIN TO REGISTER
              </button>

              <button v-if="contest.status === 'REGISTRATION_OPEN' && auth.isLoggedIn && !isRegistered"
                @click="handleRegister" :disabled="registering"
                class="bg-red-600 hover:bg-red-500 text-white font-black py-5 px-12 rounded-[1.5rem] text-lg shadow-[0_20px_50px_rgba(220,38,38,0.4)] transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3">
                <span v-if="!registering" class="flex items-center gap-3">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  REGISTER FOR CONTEST
                </span>
                <span v-else class="flex items-center gap-3">
                  <LoadingSpinner class="w-5 h-5" /> PROCESSING...
                </span>
              </button>

              <div v-if="isRegistered && contest.status === 'REGISTRATION_OPEN'"
                class="bg-green-500/10 border border-green-500/30 text-green-400 font-black py-5 px-10 rounded-[1.5rem] flex items-center gap-4 text-lg">
                <div class="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                REGISTERED & READY
              </div>

              <router-link v-if="contest.status === 'RUNNING' && isRegistered && !hasSubmitted"
                :to="`/contests/${contest.id}/join`"
                class="bg-gradient-to-r from-red-600 to-red-500 text-white font-black py-5 px-14 rounded-[1.5rem] shadow-[0_20px_50px_rgba(220,38,38,0.5)] transition-all active:scale-95 flex items-center gap-4 text-xl tracking-tight">
                ⚡ JOIN CONTEST NOW
              </router-link>

              <div v-if="contest.status === 'RUNNING' && isRegistered && hasSubmitted"
                class="bg-white/10 text-white/50 border border-white/20 font-black py-5 px-10 rounded-[1.5rem] flex items-center gap-4 text-lg cursor-not-allowed">
                <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                CONTEST COMPLETED
              </div>
            </div>

            <transition name="slide-up">
              <div v-if="regSuccess"
                class="mt-8 p-5 bg-green-500 text-black font-black rounded-2xl flex items-center justify-center gap-3 shadow-2xl">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ENROLLMENT SUCCESSFUL! SEE YOU IN THE CONTEST.
              </div>
            </transition>
          </div>
        </div>

        <div v-if="contest.status === 'FINISHED' || contest.status === 'RUNNING'"
          class="bg-white/[0.02] border border-white/10 rounded-[3rem] px-8 py-1  shadow-2xl backdrop-blur-3xl">

          <div class="flex items-center justify-center">
            <h2 class="text-xl font-black text-blue-500 italic tracking-tighter">
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
                  <th class="text-xs font-black text-white/30 uppercase tracking-[0.3em]">Rank</th>
                  <th class="text-xs font-black text-white/30 uppercase tracking-[0.3em]">Combatant</th>

                  <th v-for="n in (leaderboard[0]?.totalQuestions || 0)" :key="n"
                    class="text-center text-lg font-black text-white/40 uppercase tracking-widest">
                    Q{{ n }}
                  </th>

                  <th class="text-right text-xs font-black text-white/30 uppercase tracking-[0.3em]">Score
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/[0.03]">
                <tr v-for="entry in leaderboard" :key="entry.rank" class="group hover:bg-white/[0.04] transition-all">
                  <td class="py-1">
                    <span v-if="entry.rank <= 3" class="text-2xl">
                      {{ entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉' }}
                    </span>
                    <span v-else class="font-black text-white/20 px-2">#{{ entry.rank }}</span>
                  </td>

                  <td class="py-1">
                    <div class="flex items-center gap-4">
                      <div
                        class="w-10 h-10 rounded-full bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                        <img v-if="entry.profileImageUrl" :src="toFullUrl(entry.profileImageUrl)"
                          class="w-full h-full object-cover" />
                        <div v-else
                          class="w-full h-full flex items-center justify-center text-red-500 font-black text-lg">
                          {{ entry.username?.charAt(0).toUpperCase() }}
                        </div>
                      </div>
                      <div>
                        <p class="font-black text-white group-hover:text-red-500 transition-colors">@{{ entry.username
                          }}</p>
                        <p class="text-[10px] text-white/40 font-bold tracking-tight">{{ entry.fullName }}</p>
                      </div>
                    </div>
                  </td>

                  <td v-for="(status, idx) in entry.questionStatuses" :key="idx" class="py-2 text-center">
                    <div v-if="status" class="inline-flex flex-col items-center gap-1">
                      <div
                        class="px-2 py-1 rounded-md bg-green-500/10 border border-green-500/30 flex flex-col items-center w-full min-w-[60px]">
                        <span class="text-[11px] font-black text-green-400">{{ status.score.toFixed(2) }}</span>
                        <div v-if="status.timePenalty > 0" class="text-[10px] font-bold text-green-500" title="Time Penalty">
                          -{{ status.timePenalty.toFixed(2) }}
                        </div>
                        <div v-if="status.wrongPenalty > 0" class="text-[10px] font-bold text-red-500" title="Wrong Penalty">
                          -{{ status.wrongPenalty.toFixed(2) }} ({{ status.wrongCount }})
                        </div>
                      </div>

                      <!-- <div v-else
                        class="px-2 py-1 rounded-md bg-red-500/10 border border-red-500/30 flex items-center justify-center w-full min-w-[60px]">
                        <span class="text-[10px] whitespace-nowrap font-black text-red-500">-{{ (status.wrongPenalty || 0).toFixed(2) }} ({{ status.wrongCount }})</span>
                      </div> -->

                      <!-- <span class="text-[8px] text-white/80 font-mono">{{ formatTime(status.submittedAt) }}</span> -->

                        <div v-if="status.timeTakenSeconds != null" class="text-[10px] mt-0.5 text-white/80 font-mono leading-tight whitespace-nowrap">
                          {{ formatDuration(status.timeTakenSeconds) }}/{{ formatDuration(status.timeLimits) }}
                        </div>
                    </div>
                    <div v-else class="w-6 h-1 bg-white/5 rounded-full mx-auto"></div>
                  </td>

                  <td class="py-1 text-right">
                    <div class="flex flex-col items-end">
                      <span class="text-2xl font-black text-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.3)]">
                        {{ entry.totalScore.toFixed(2) }}
                      </span>
                      <span v-if="entry.lastSubmissionTime" class="text-[9px] font-mono text-white">
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

function formatDuration(sec) {
  if (sec == null) return '-'
  if (sec === 0) return '0s'
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  let res = []
  if (h > 0) res.push(`${h}h`)
  if (m > 0 || h > 0) res.push(`${m}m`)
  res.push(`${s}s`)
  return res.join(' ')
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
        console.log("Leaderboard: " + leaderboard.value);
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
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.drop-shadow-2xl {
  filter: drop-shadow(0 10px 10px rgba(0, 0, 0, 0.8));
}
</style>