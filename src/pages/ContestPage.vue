<!-- src/pages/ContestPage.vue -->
<template>
  <div class="min-h-screen pt-20 px-4 pb-12">
    <div class="max-w-5xl mx-auto">

      <div v-if="loading" class="flex justify-center py-20">
        <LoadingSpinner label="Loading contest..." />
      </div>

      <div v-else-if="!contest" class="text-center py-20">
        <p class="text-white/40 font-body">Contest not found.</p>
        <router-link to="/contests" class="text-neon-blue text-xs mt-3 inline-block hover:underline">
          ← Back to Contests
        </router-link>
      </div>

      <div v-else>
        <!-- Back -->
        <router-link to="/contests"
          class="inline-flex items-center gap-1 text-xs font-display text-white/40
                 hover:text-white mb-6 transition-colors tracking-wider">
          ← Back to Contests
        </router-link>

        <!-- ── Header card ──────────────────────────────────── -->
        <div class="glass-card neon-border-red p-6 md:p-8 mb-6 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5 pointer-events-none"
               style="background:radial-gradient(circle,#ff0033,transparent)"></div>

          <div class="relative">
            <!-- Status + reg count -->
            <div class="flex flex-wrap items-start justify-between gap-3 mb-4">
              <StatusBadge :status="contest.status" />
              <span class="text-xs font-mono text-white/30">
                {{ contest.registrationCount || 0 }} registered
              </span>
            </div>

            <!-- Title -->
            <h1 class="font-display text-3xl md:text-4xl font-black text-white leading-tight mb-3">
              {{ contest.name }}
            </h1>

            <p v-if="contest.description"
               class="text-white/60 font-body leading-relaxed mb-6 max-w-2xl">
              {{ contest.description }}
            </p>

            <!-- Dates grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div v-for="d in dateItems" :key="d.label"
                   class="bg-dark-800/60 rounded-lg p-3 border border-white/5">
                <p class="text-[10px] text-white/40 font-display tracking-wider uppercase mb-1">{{ d.label }}</p>
                <p class="text-xs font-mono text-white/80">{{ d.value }}</p>
              </div>
            </div>

            <!-- Countdown -->
            <div v-if="countdownLabel" class="mb-6">
              <p class="text-xs font-display text-white/40 tracking-wider uppercase mb-2">
                {{ countdownLabel }}
              </p>
              <div class="flex gap-4">
                <div v-for="(val, key) in timeLeft" :key="key" class="text-center">
                  <div class="font-display text-2xl font-black glow-text-red">
                    {{ String(val).padStart(2, '0') }}
                  </div>
                  <div class="text-[9px] text-white/30 font-display tracking-wider uppercase">{{ key }}</div>
                </div>
              </div>
            </div>

            <!-- ── ACTION BUTTONS ──────────────────────────── -->
            <div class="flex flex-wrap gap-3 items-center">

              <!-- ❶ UPCOMING — show when registration will open -->
              <div v-if="contest.status === 'UPCOMING'"
                   class="px-4 py-2 rounded text-xs font-display text-white/40
                          border border-white/10 tracking-wider">
                Registration not open yet
              </div>

              <!-- ❷ REGISTRATION_OPEN + not logged in → Login to Register -->
              <button
                v-if="contest.status === 'REGISTRATION_OPEN' && !auth.isLoggedIn"
                @click="$router.push('/login')"
                class="btn-primary flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                </svg>
                Login to Register
              </button>

              <!-- ❸ REGISTRATION_OPEN + logged in + not registered → Register Now -->
              <button
                v-if="contest.status === 'REGISTRATION_OPEN' && auth.isLoggedIn && !isRegistered"
                @click="handleRegister"
                :disabled="registering"
                class="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg v-if="registering" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                </svg>
                {{ registering ? 'Registering...' : 'Register Now' }}
              </button>

              <!-- ❹ REGISTRATION_OPEN + already registered badge -->
              <div
                v-if="contest.status === 'REGISTRATION_OPEN' && auth.isLoggedIn && isRegistered"
                class="flex items-center gap-2 px-4 py-2 rounded text-xs font-display
                       text-green-400 border border-green-500/30 bg-green-500/10 tracking-wider">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
                Registered — waiting for contest to start
              </div>

              <!-- ❺ RUNNING + registered → Join Contest -->
              <router-link
                v-if="contest.status === 'RUNNING' && auth.isLoggedIn && isRegistered"
                :to="`/contests/${contest.id}/join`"
                class="btn-primary flex items-center gap-2">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                ⚡ Join Contest
              </router-link>

              <!-- ❻ RUNNING + not registered -->
              <div
                v-if="contest.status === 'RUNNING' && auth.isLoggedIn && !isRegistered"
                class="px-4 py-2 rounded text-xs font-display text-white/30
                       border border-white/10 tracking-wider">
                Registration closed
              </div>

              <!-- ❼ RUNNING + not logged in -->
              <button
                v-if="contest.status === 'RUNNING' && !auth.isLoggedIn"
                @click="$router.push('/login')"
                class="btn-ghost flex items-center gap-2 text-xs">
                Login to participate
              </button>

              <!-- ❽ FINISHED → View leaderboard -->
              <router-link
                v-if="contest.status === 'FINISHED'"
                to="/leaderboard"
                class="btn-secondary">
                View Leaderboard
              </router-link>
            </div>

            <!-- Registration error -->
            <div v-if="regError"
                 class="mt-3 text-xs text-neon-red font-body px-3 py-2
                        bg-neon-red/10 border border-neon-red/20 rounded">
              {{ regError }}
            </div>

            <!-- Registration success toast -->
            <div v-if="regSuccess"
                 class="mt-3 text-xs text-green-400 font-body px-3 py-2
                        bg-green-500/10 border border-green-500/20 rounded flex items-center gap-2">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
              </svg>
              Successfully registered! You'll be notified when the contest starts.
            </div>
          </div>
        </div>

        <!-- ── Leaderboard (RUNNING or FINISHED) ───────────── -->
        <div v-if="contest.status === 'FINISHED' || contest.status === 'RUNNING'"
             class="glass-card p-6">
          <h2 class="section-title mb-5">Leaderboard</h2>

          <div v-if="loadingLB" class="flex justify-center py-8">
            <LoadingSpinner />
          </div>

          <div v-else-if="leaderboard.length === 0"
               class="text-center py-6 text-white/40 font-body text-sm">
            No submissions yet
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-white/5">
                  <th class="pb-3 text-left text-xs font-display tracking-wider text-white/40 uppercase">Rank</th>
                  <th class="pb-3 text-left text-xs font-display tracking-wider text-white/40 uppercase">Contestant</th>
                  <th class="pb-3 text-right text-xs font-display tracking-wider text-white/40 uppercase">Score</th>
                  <th class="pb-3 text-right text-xs font-display tracking-wider text-white/40 uppercase hidden md:table-cell">Last Submit</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <tr v-for="entry in leaderboard" :key="entry.rank"
                    :class="['transition-colors hover:bg-white/3', entry.rank <= 3 ? 'bg-white/2' : '']">
                  <td class="py-3 pr-4">
                    <span v-if="entry.rank === 1" class="text-2xl">🥇</span>
                    <span v-else-if="entry.rank === 2" class="text-2xl">🥈</span>
                    <span v-else-if="entry.rank === 3" class="text-2xl">🥉</span>
                    <span v-else class="font-mono text-white/40 text-xs">#{{ entry.rank }}</span>
                  </td>
                  <td class="py-3">
                    <div class="flex items-center gap-2">
                      <div class="w-7 h-7 rounded-full bg-dark-700 border border-white/10
                                  flex items-center justify-center text-xs font-display
                                  text-neon-red font-bold overflow-hidden flex-shrink-0">
                        <!-- FIX: profileImageUrl is relative → must use toFullUrl() -->
                        <img v-if="entry.profileImageUrl"
                             :src="toFullUrl(entry.profileImageUrl)"
                             class="w-full h-full object-cover"
                             alt="Avatar" />
                        <span v-else>{{ entry.username?.charAt(0)?.toUpperCase() }}</span>
                      </div>
                      <div>
                        <p class="font-display text-xs text-white font-semibold">{{ entry.username }}</p>
                        <p class="text-xs text-white/40 font-body">{{ entry.fullName }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-3 text-right">
                    <span class="font-display font-bold text-neon-blue">{{ entry.correctCount }}</span>
                    <span class="text-white/30 text-xs font-mono">/{{ entry.totalQuestions }}</span>
                  </td>
                  <td class="py-3 text-right hidden md:table-cell">
                    <span class="text-xs font-mono text-white/40">{{ formatTime(entry.lastSubmissionTime) }}</span>
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
import { useAuthStore }    from '@/stores/auth'
import { BACKEND_URL }     from '@/config'
import StatusBadge    from '@/components/common/StatusBadge.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { format } from 'date-fns'

const route        = useRoute()
const router       = useRouter()
const contestStore = useContestStore()
const auth         = useAuthStore()

// ── State ─────────────────────────────────────────────────────
const contest      = ref(null)
const loading      = ref(true)
const leaderboard  = ref([])
const loadingLB    = ref(false)
const isRegistered = ref(false)
const registering  = ref(false)
const regError     = ref('')
const regSuccess   = ref(false)

// ── FIX: convert relative path to full backend URL ────────────
function toFullUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return BACKEND_URL + path
}

// ── Countdown (no external composable needed) ─────────────────
const timeLeft    = ref({ H: 0, M: 0, S: 0 })
let   timerHandle = null

const countdownLabel = computed(() => {
  if (!contest.value) return ''
  return {
    UPCOMING:          'Registration Opens In',
    REGISTRATION_OPEN: 'Contest Starts In',
    RUNNING:           'Contest Ends In',
  }[contest.value.status] || ''
})

const countdownTarget = computed(() => {
  if (!contest.value) return null
  return {
    UPCOMING:          contest.value.registrationStart,
    REGISTRATION_OPEN: contest.value.contestStart,
    RUNNING:           contest.value.contestEnd,
  }[contest.value.status] || null
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

// ── Date display helpers ──────────────────────────────────────
const dateItems = computed(() => {
  if (!contest.value) return []
  return [
    { label: 'Contest Date', value: formatDT(contest.value.contestDate) },
    { label: 'Reg Open',     value: formatDT(contest.value.registrationStart) },
    { label: 'Reg Close',    value: formatDT(contest.value.registrationEnd) },
    { label: 'Contest End',  value: formatDT(contest.value.contestEnd) },
  ]
})

function formatDT(d) {
  if (!d) return 'TBD'
  try { return format(new Date(d), 'MMM dd, HH:mm') } catch { return d }
}
function formatTime(d) {
  if (!d) return '-'
  try { return format(new Date(d), 'HH:mm:ss') } catch { return d }
}

// ── Register ──────────────────────────────────────────────────
async function handleRegister() {
  if (!auth.isLoggedIn) { router.push('/login'); return }
  registering.value = true
  regError.value    = ''
  regSuccess.value  = false

  try {
    await contestStore.registerForContest(contest.value.id)
    isRegistered.value = true
    regSuccess.value   = true
    // Auto-hide success message after 5 seconds
    setTimeout(() => { regSuccess.value = false }, 5000)
    // Bump count locally so UI reflects it immediately
    if (contest.value) contest.value.registrationCount = (contest.value.registrationCount || 0) + 1
  } catch (e) {
    // FIX: fetch-based api.js throws { message } not e.response?.data?.message
    regError.value = e.message || 'Failed to register. Please try again.'
  } finally {
    registering.value = false
  }
}

// ── Mount ─────────────────────────────────────────────────────
onMounted(async () => {
  try {
    // Fetch contest details
    const res = await contestStore.fetchContest(route.params.id)
    contest.value = res

    // Check registration status if logged in
    if (auth.isLoggedIn) {
      isRegistered.value = await contestStore.isRegistered(route.params.id)
    }

    // Load leaderboard if contest is running or finished
    if (contest.value.status === 'RUNNING' || contest.value.status === 'FINISHED') {
      loadingLB.value = true
      try {
        leaderboard.value = await contestStore.getLeaderboard(route.params.id)
      } finally {
        loadingLB.value = false
      }
    }

    // Start countdown
    tick()
    timerHandle = setInterval(tick, 1000)

  } catch (e) {
    console.error('Failed to load contest:', e.message)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  if (timerHandle) clearInterval(timerHandle)
})
</script>