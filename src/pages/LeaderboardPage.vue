<!-- src/pages/LeaderboardPage.vue -->
<template>
  <div class="min-h-screen pt-20 px-4 pb-12">
    <div class="max-w-5xl mx-auto">
          <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div class="absolute -top-48 -left-48 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
    </div>

      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-4 h-px bg-red-700"></div>
          <span class="text-xs font-display tracking-widest text-neon-red uppercase">Rankings</span>
        </div>
        <h1 class="page-title">Leaderboard</h1>
      </div>

      <!-- Contest selector -->
      <div class="glass-card p-4 mb-6 flex items-center gap-4 flex-wrap">
        <label class="label-text whitespace-nowrap">Select Contest</label>
        <select v-model="selectedContest" class="input-field flex-1 max-w-xs">
          <option value="">-- Choose a contest --</option>
          <option v-for="c in contests" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </div>

      <!-- Empty state -->
      <div v-if="!selectedContest" class="glass-card p-12 text-center">
        <div class="text-4xl mb-3">🏆</div>
        <p class="text-white/40 font-body">Select a contest to view the leaderboard</p>
      </div>

      <div v-else>
        <!-- Loading -->
        <div v-if="loading" class="flex justify-center py-12">
          <LoadingSpinner label="Loading leaderboard..." />
        </div>

        <!-- No data -->
        <div v-else-if="leaderboard.length === 0" class="glass-card p-12 text-center">
          <div class="text-4xl mb-3">📊</div>
          <p class="text-white/40 font-body text-sm">No submissions yet for this contest</p>
        </div>

        <div v-else>
          <!-- Top 3 podium -->
          <div class="flex justify-center items-end gap-4 mb-8">

            <!-- 2nd place -->
            <div v-if="leaderboard[1]" class="text-center">
              <div class="w-16 h-16 rounded-full border-2 border-gray-400 mx-auto mb-2 overflow-hidden bg-dark-700 flex items-center justify-center">
                <!-- FIX: profileImageUrl from backend is relative — prefix with BACKEND_URL -->
                <img v-if="leaderboard[1].profileImageUrl"
                     :src="toFullUrl(leaderboard[1].profileImageUrl)"
                     class="w-full h-full object-cover" alt="Avatar" />
                <span v-else class="font-display text-xl font-black text-gray-300">
                  {{ leaderboard[1].username?.charAt(0)?.toUpperCase() }}
                </span>
              </div>
              <div class="font-display text-xs font-bold text-gray-300 mb-1 truncate max-w-[80px]">
                {{ leaderboard[1].username }}
              </div>
              <div class="font-display text-lg font-black text-gray-300">{{ leaderboard[1].correctCount }}</div>
              <div class="bg-gray-600 rounded-t h-16 w-20 mx-auto flex items-center justify-center">
                <span class="text-2xl">🥈</span>
              </div>
            </div>

            <!-- 1st place -->
            <div class="text-center">
              <div class="w-20 h-20 rounded-full border-2 border-yellow-400 mx-auto mb-2 overflow-hidden bg-dark-700 flex items-center justify-center"
                   style="box-shadow: 0 0 20px rgba(250,204,21,0.4)">
                <img v-if="leaderboard[0].profileImageUrl"
                     :src="toFullUrl(leaderboard[0].profileImageUrl)"
                     class="w-full h-full object-cover" alt="Avatar" />
                <span v-else class="font-display text-2xl font-black text-yellow-400">
                  {{ leaderboard[0].username?.charAt(0)?.toUpperCase() }}
                </span>
              </div>
              <div class="font-display text-sm font-bold text-yellow-400 mb-1 truncate max-w-[96px]">
                {{ leaderboard[0].username }}
              </div>
              <div class="font-display text-2xl font-black glow-text-red">{{ leaderboard[0].correctCount }}</div>
              <div class="bg-yellow-600/40 border border-yellow-500/30 rounded-t h-24 w-24 mx-auto flex items-center justify-center">
                <span class="text-3xl">🥇</span>
              </div>
            </div>

            <!-- 3rd place -->
            <div v-if="leaderboard[2]" class="text-center">
              <div class="w-14 h-14 rounded-full border-2 border-amber-600 mx-auto mb-2 overflow-hidden bg-dark-700 flex items-center justify-center">
                <img v-if="leaderboard[2].profileImageUrl"
                     :src="toFullUrl(leaderboard[2].profileImageUrl)"
                     class="w-full h-full object-cover" alt="Avatar" />
                <span v-else class="font-display text-lg font-black text-amber-600">
                  {{ leaderboard[2].username?.charAt(0)?.toUpperCase() }}
                </span>
              </div>
              <div class="font-display text-xs font-bold text-amber-600 mb-1 truncate max-w-[64px]">
                {{ leaderboard[2].username }}
              </div>
              <div class="font-display text-base font-black text-amber-600">{{ leaderboard[2].correctCount }}</div>
              <div class="bg-amber-800/40 border border-amber-700/30 rounded-t h-10 w-16 mx-auto flex items-center justify-center">
                <span class="text-xl">🥉</span>
              </div>
            </div>
          </div>

          <!-- Full table -->
          <div class="glass-card p-6 overflow-x-auto">

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
                      <div v-if="status.correct"
                        class="px-2 py-1 rounded-md bg-green-500/10 border border-green-500/30 flex flex-col items-center w-full min-w-[60px]">
                        <span class="text-[11px] font-black text-green-400">+{{ status.score.toFixed(1) }}</span>
                        <div v-if="status.penalty > 0" class="text-[9px] font-bold text-red-400" title="Total Penalty">
                          (-{{ status.penalty.toFixed(1) }})
                        </div>
                      </div>

                      <div v-else
                        class="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                        <span class="text-[10px] font-black text-red-500">-{{ status.wrongCount }}</span>
                      </div>

                      <!-- <span class="text-[8px] text-white/80 font-mono">{{ formatTime(status.submittedAt) }}</span> -->

                        <div v-if="status.timeTakenSeconds != null" class="text-[10px] mt-0.5 text-white/80 font-mono leading-tight whitespace-nowrap">
                          {{ formatDuration(status.timeTakenSeconds) }}
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
import { ref, watch, onMounted } from 'vue'
import { useContestStore } from '@/stores/contest'
import { BACKEND_URL } from '@/config'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { format, parseISO } from 'date-fns'
import { useHead } from '@vueuse/head'

useHead({
  title: 'Leaderboard - RMEDU Robotics Society',
  meta: [
    {
      name: 'description',
      content: 'Check rankings of CAD contest participants in RMEDU Robotics Society.'
    }
  ]
})

const contestStore    = useContestStore()
const contests        = ref([])
const selectedContest = ref('')
const leaderboard     = ref([])
const loading         = ref(false)

// FIX: builds full image URL from relative path stored in backend
// e.g. "/uploads/profiles/uuid.jpg" → "http://192.168.x.x:8080/uploads/..."
function toFullUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return BACKEND_URL + path
}

// FIX: lastSubmissionTime arrives as ISO 8601 string from Jackson serialization
// e.g. "2024-03-15T14:30:45" — parse it correctly before formatting
function formatTime(d) {
  if (!d) return '—'
  try {
    const date = typeof d === 'string' ? parseISO(d) : new Date(d)
    return format(date, 'HH:mm:ss')
  } catch {
    return String(d)
  }
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

// FIX: contestStore.getLeaderboard() returns res.data (the array directly)
// watch triggers when the dropdown selection changes
watch(selectedContest, async (id) => {
  if (!id) { leaderboard.value = []; return }
  loading.value = true
  try {
    leaderboard.value = await contestStore.getLeaderboard(id)
  } catch (e) {
    console.error('Leaderboard load failed:', e.message)
    leaderboard.value = []
  } finally {
    loading.value = false
  }
})

// FIX: fetchAllContests() populates contestStore.contests (the ref)
// filter to only show RUNNING + FINISHED contests in the selector
onMounted(async () => {
  await contestStore.fetchAllContests()
  contests.value = contestStore.contests.filter(
    c => c.status === 'FINISHED' || c.status === 'RUNNING'
  )
})
</script>