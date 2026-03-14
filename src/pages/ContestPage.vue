<template>
  <div class="min-h-screen pt-20 px-4 pb-12">
    <div class="max-w-5xl mx-auto">
      <div v-if="loading" class="flex justify-center py-20"><LoadingSpinner label="Loading contest..." /></div>

      <div v-else-if="contest">
        <!-- Back -->
        <router-link to="/contests" class="inline-flex items-center gap-1 text-xs font-display text-white/40 hover:text-white mb-6 transition-colors tracking-wider">
          ← Back to Contests
        </router-link>

        <!-- Header -->
        <div class="glass-card neon-border-red p-6 md:p-8 mb-6 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5" style="background: radial-gradient(circle, #ff0033, transparent)"></div>
          <div class="relative">
            <div class="flex flex-wrap items-start justify-between gap-4 mb-4">
              <StatusBadge :status="contest.status" />
              <span class="text-xs font-mono text-white/30">{{ contest.registrationCount }} registered</span>
            </div>
            <h1 class="font-display text-3xl md:text-4xl font-black text-white leading-tight mb-3">{{ contest.name }}</h1>
            <p v-if="contest.description" class="text-white/60 font-body leading-relaxed mb-6 max-w-2xl">{{ contest.description }}</p>

            <!-- Dates grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div v-for="d in dateItems" :key="d.label" class="bg-dark-800/60 rounded p-3 border border-white/5">
                <p class="text-xs text-white/40 font-display tracking-wider uppercase mb-1">{{ d.label }}</p>
                <p class="text-xs font-mono text-white/80">{{ d.value }}</p>
              </div>
            </div>

            <!-- Countdown -->
            <div v-if="countdownTarget" class="mb-6">
              <p class="text-xs font-display text-white/40 tracking-wider uppercase mb-2">{{ countdownLabel }}</p>
              <div class="flex gap-3">
                <div v-for="(val, key) in timeLeft" :key="key" class="text-center">
                  <div class="font-display text-2xl font-black glow-text-red">{{ String(val).padStart(2,'0') }}</div>
                  <div class="text-xs text-white/30 font-display tracking-wider uppercase">{{ key }}</div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-wrap gap-3">
              <button v-if="contest.status === 'REGISTRATION_OPEN' && !isRegistered"
                @click="handleRegister" :disabled="registering"
                class="btn-primary flex items-center gap-2">
                <svg v-if="registering" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {{ registering ? 'Registering...' : 'Register Now' }}
              </button>
              <div v-else-if="contest.status === 'REGISTRATION_OPEN' && isRegistered"
                   class="px-4 py-2 rounded text-xs font-display text-green-400 border border-green-500/30 bg-green-500/10 tracking-wider">
                ✓ Registered
              </div>
              <router-link v-if="contest.status === 'RUNNING' && isRegistered" :to="`/contests/${contest.id}/join`"
                class="btn-primary animate-glow-pulse">
                ⚡ Join Contest
              </router-link>
              <router-link v-if="contest.status === 'FINISHED'" :to="`/leaderboard`"
                class="btn-secondary">View Leaderboard</router-link>
            </div>

            <div v-if="regError" class="mt-3 text-xs text-neon-red font-body">{{ regError }}</div>
          </div>
        </div>

        <!-- Leaderboard (if finished or running) -->
        <div v-if="contest.status === 'FINISHED' || contest.status === 'RUNNING'" class="glass-card p-6">
          <h2 class="section-title mb-5">Leaderboard</h2>
          <div v-if="loadingLB" class="flex justify-center py-8"><LoadingSpinner /></div>
          <div v-else-if="leaderboard.length === 0" class="text-center py-6 text-white/40 font-body text-sm">No submissions yet</div>
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
                    <span v-if="entry.rank === 1" class="text-yellow-400 font-display font-black">🥇</span>
                    <span v-else-if="entry.rank === 2" class="text-gray-300 font-display font-black">🥈</span>
                    <span v-else-if="entry.rank === 3" class="text-amber-600 font-display font-black">🥉</span>
                    <span v-else class="font-mono text-white/40 text-xs">#{{ entry.rank }}</span>
                  </td>
                  <td class="py-3">
                    <div class="flex items-center gap-2">
                      <div class="w-7 h-7 rounded-full bg-dark-700 border border-white/10 flex items-center justify-center text-xs font-display text-neon-red font-bold overflow-hidden flex-shrink-0">
                        <img v-if="entry.profileImageUrl" :src="entry.profileImageUrl" class="w-full h-full object-cover" />
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContestStore } from '@/stores/contest'
import { useAuthStore } from '@/stores/auth'
import { useCountdown } from '@/composables/useCountdown'
import StatusBadge from '@/components/common/StatusBadge.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { format } from 'date-fns'

const route = useRoute()
const router = useRouter()
const contestStore = useContestStore()
const auth = useAuthStore()

const contest = ref(null)
const loading = ref(true)
const leaderboard = ref([])
const loadingLB = ref(false)
const isRegistered = ref(false)
const registering = ref(false)
const regError = ref('')

const countdownTarget = computed(() => {
  if (!contest.value) return null
  if (contest.value.status === 'UPCOMING') return contest.value.registrationStart
  if (contest.value.status === 'REGISTRATION_OPEN') return contest.value.contestStart
  if (contest.value.status === 'RUNNING') return contest.value.contestEnd
  return null
})

const countdownLabel = computed(() => {
  if (!contest.value) return ''
  if (contest.value.status === 'UPCOMING') return 'Registration Opens In'
  if (contest.value.status === 'REGISTRATION_OPEN') return 'Contest Starts In'
  if (contest.value.status === 'RUNNING') return 'Contest Ends In'
  return ''
})

const { timeLeft } = countdownTarget.value
  ? useCountdown(countdownTarget.value)
  : { timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0 } }

const dateItems = computed(() => {
  if (!contest.value) return []
  return [
    { label: 'Contest Date', value: formatDT(contest.value.contestDate) },
    { label: 'Reg Open', value: formatDT(contest.value.registrationStart) },
    { label: 'Reg Close', value: formatDT(contest.value.registrationEnd) },
    { label: 'Contest End', value: formatDT(contest.value.contestEnd) },
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

async function handleRegister() {
  if (!auth.isLoggedIn) { router.push('/login'); return }
  registering.value = true; regError.value = ''
  try {
    await contestStore.registerForContest(route.params.id)
    isRegistered.value = true
  } catch (e) {
    regError.value = e.response?.data?.message || 'Failed to register'
  } finally {
    registering.value = false
  }
}

onMounted(async () => {
  try {
    contest.value = await contestStore.fetchContest(route.params.id)
    if (auth.isLoggedIn) {
      isRegistered.value = await contestStore.isRegistered(route.params.id)
    }
    if (contest.value.status === 'RUNNING' || contest.value.status === 'FINISHED') {
      loadingLB.value = true
      leaderboard.value = await contestStore.getLeaderboard(route.params.id)
      loadingLB.value = false
    }
  } catch (e) { console.error(e) }
  finally { loading.value = false }
})
</script>
