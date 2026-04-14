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
                <tr class="border-b border-white/5">
                  <th class="pb-3 text-left text-xs font-display tracking-widest text-white/40 uppercase w-16">Rank</th>
                  <th class="pb-3 text-left text-xs font-display tracking-widest text-white/40 uppercase">Contestant</th>
                  <th class="pb-3 text-center text-xs font-display tracking-widest text-white/40 uppercase">Score</th>
                  <th class="pb-3 text-right text-xs font-display tracking-widest text-white/40 uppercase hidden md:table-cell">Last Submit</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <tr v-for="entry in leaderboard" :key="entry.rank"
                    :class="['hover:bg-white/3 transition-colors', entry.rank <= 3 ? 'bg-white/2' : '']">
                  <td class="py-3">
                    <span v-if="entry.rank === 1" class="font-display font-black text-yellow-400">01</span>
                    <span v-else-if="entry.rank === 2" class="font-display font-black text-gray-300">02</span>
                    <span v-else-if="entry.rank === 3" class="font-display font-black text-amber-600">03</span>
                    <span v-else class="font-mono text-white/30 text-xs">#{{ entry.rank }}</span>
                  </td>
                  <td class="py-3">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-dark-700 border border-white/10 flex items-center justify-center text-xs font-display text-neon-red font-bold overflow-hidden flex-shrink-0">
                        <!-- FIX: toFullUrl() converts relative path to full URL -->
                        <img v-if="entry.profileImageUrl"
                             :src="toFullUrl(entry.profileImageUrl)"
                             class="w-full h-full object-cover" alt="Avatar" />
                        <span v-else>{{ entry.username?.charAt(0)?.toUpperCase() }}</span>
                      </div>
                      <div>
                        <p class="font-display text-sm text-white font-semibold">{{ entry.username }}</p>
                        <p class="text-xs text-white/40 font-body">{{ entry.fullName }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-3 text-center">
                    <span class="font-display font-bold text-xl text-neon-blue">{{ entry.correctCount }}</span>
                    <span class="text-white/30 text-xs font-mono"> / {{ entry.totalQuestions }}</span>
                  </td>
                  <td class="py-3 text-right hidden md:table-cell">
                    <!-- FIX: lastSubmissionTime is ISO string from backend -->
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
import { ref, watch, onMounted } from 'vue'
import { useContestStore } from '@/stores/contest'
import { BACKEND_URL } from '@/config'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { format, parseISO } from 'date-fns'

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