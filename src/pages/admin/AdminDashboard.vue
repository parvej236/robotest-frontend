<template>
  <div class="space-y-8">
    <!-- Stats Grid Layout -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div 
        v-for="stat in stats" 
        :key="stat.label"
        class="relative group overflow-hidden rounded-2xl border border-white/5 bg-dark-900/60 backdrop-blur-md px-5 py-4 transition-all hover:bg-dark-900/85 hover:border-white/15 shadow-lg flex flex-col justify-between min-h-[110px]"
      >
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-mono font-medium text-slate-400 tracking-wider">
            {{ stat.label }}
          </span>
          <span class="text-xl opacity-40 group-hover:opacity-90 group-hover:scale-110 transition-all duration-350">
            {{ stat.icon }}
          </span>
        </div>

        <div class="mt-4">
          <p class="text-3xl font-bold font-display tracking-wide leading-none" :style="`color: ${stat.color}`">
            {{ stat.value }}
          </p>
        </div>

        <!-- Bottom glow bar -->
        <div 
          class="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity" 
          :style="`background-color: ${stat.color}; box-shadow: 0 0 10px ${stat.color}`"
        ></div>
      </div>
    </div>

    <!-- Quick Navigation Cards (Mobile Helper & Shortcuts) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <router-link to="/admin/contests"
        class="group relative bg-dark-900/60 backdrop-blur-md border border-white/5 p-5 rounded-2xl hover:bg-neon-red/10 hover:border-neon-red/30 transition-all duration-300 overflow-hidden flex items-center gap-4 corner-bracket">
        <span class="text-3xl group-hover:scale-110 transition-transform">🏆</span>
        <div class="flex flex-col">
          <h3 class="text-sm font-semibold text-white tracking-wide font-display">Manage contests</h3>
          <p class="text-[10px] font-mono font-medium text-slate-400 tracking-tight mt-1">
            Launch, edit & monitor contests
          </p>
        </div>
      </router-link>

      <router-link to="/admin/users"
        class="group relative bg-dark-900/60 backdrop-blur-md border border-white/5 p-5 rounded-2xl hover:bg-neon-blue/10 hover:border-neon-blue/30 transition-all duration-300 overflow-hidden flex items-center gap-4 corner-bracket">
        <span class="text-3xl group-hover:scale-110 transition-transform">👥</span>
        <div class="flex flex-col">
          <h3 class="text-sm font-semibold text-white tracking-wide font-display">Manage users</h3>
          <p class="text-[10px] font-mono font-medium text-slate-400 tracking-tight mt-1">
            Create, review & suspend users
          </p>
        </div>
      </router-link>

      <router-link to="/contests"
        class="group relative bg-dark-900/60 backdrop-blur-md border border-white/5 p-5 rounded-2xl hover:bg-white/5 hover:border-white/15 transition-all duration-300 overflow-hidden flex items-center gap-4 corner-bracket">
        <span class="text-3xl group-hover:scale-110 transition-transform">👁️</span>
        <div class="flex flex-col">
          <h3 class="text-sm font-semibold text-white tracking-wide font-display">Public view</h3>
          <p class="text-[10px] font-mono font-medium text-slate-400 tracking-tight mt-1">
            View live public tournament board
          </p>
        </div>
      </router-link>
    </div>

    <!-- Recent Contests Scoreboard Grid Panel -->
    <div class="bg-dark-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden corner-bracket grid-bg">
      <div class="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <div class="flex items-center gap-2.5">
          <div class="w-1 h-4 bg-neon-red rounded-full shadow-[0_0_8px_rgba(255,0,51,0.8)]"></div>
          <h2 class="text-sm md:text-base font-semibold text-white tracking-wide font-display">Recent contests</h2>
        </div>
        <router-link to="/admin/contests"
          class="text-[10px] font-mono font-medium text-cyan-400 tracking-wider hover:text-white transition-colors">
          View all contests →
        </router-link>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <LoadingSpinner label="Syncing recent contests..." />
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr class="border-b border-white/5">
              <th class="px-6 py-4 text-[10px] font-mono font-medium tracking-wider text-slate-400">Contest name</th>
              <th class="px-6 py-4 text-center text-[10px] font-mono font-medium tracking-wider text-slate-400 hidden md:table-cell">Status</th>
              <th class="px-6 py-4 text-center text-[10px] font-mono font-medium tracking-wider text-slate-400 hidden sm:table-cell">Registered</th>
              <th class="px-6 py-4 text-right text-[10px] font-mono font-medium tracking-wider text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr v-for="c in recentContests" :key="c.id" class="group hover:bg-white/[0.03] transition-colors">
              <td class="px-6 py-4">
                <p class="text-sm font-semibold text-white group-hover:text-neon-red transition-colors truncate max-w-[280px]">
                  {{ c.name }}
                </p>
                <p class="text-[10px] font-mono font-medium text-cyan-400/80 mt-1">
                  Launch: {{ formatDate(c.contestDate) }}
                </p>
              </td>
              <td class="px-6 py-4 text-center hidden md:table-cell">
                <StatusBadge :status="c.status" class="scale-90" />
              </td>
              <td class="px-6 py-4 text-center hidden sm:table-cell">
                <span class="text-xs font-semibold text-white/70 font-mono">{{ c.registrationCount || 0 }}</span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-3">
                  <router-link :to="`/admin/contests/${c.id}/questions`"
                    class="px-4 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-black border border-blue-500/20 rounded-xl text-xs font-semibold tracking-wide transition-all"
                    title="Questions">
                    Questions
                  </router-link>
                  <router-link :to="`/contests/${c.id}`"
                    class="p-2 bg-white/5 text-slate-400 hover:bg-white hover:text-black border border-white/10 rounded-xl transition-all"
                    title="View Arena">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </router-link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useContestStore } from '@/stores/contest'
import StatusBadge from '@/components/common/StatusBadge.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { format } from 'date-fns'

const contestStore = useContestStore()
const loading = ref(true)
const recentContests = ref([])

const stats = computed(() => [
  { label: 'Total contests', value: contestStore.contests.length, color: '#ff0033', icon: '🏆' },
  { label: 'Active contests', value: contestStore.contests.filter(c => c.status === 'RUNNING').length, color: '#10b881', icon: '⚡' },
  { label: 'Open contests', value: contestStore.contests.filter(c => c.status === 'REGISTRATION_OPEN').length, color: '#06b6d4', icon: '📝' },
  { label: 'Closed contests', value: contestStore.contests.filter(c => c.status === 'FINISHED').length, color: '#94a3b8', icon: '✅' },
])

function formatDate(d) {
  if (!d) return 'TBD'
  try { return format(new Date(d), 'MMM dd, yyyy') } catch { return d }
}

onMounted(async () => {
  try {
    await contestStore.fetchAllContests()
    recentContests.value = [...contestStore.contests]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 8)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* Custom Scrollbar for the table */
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
</style>