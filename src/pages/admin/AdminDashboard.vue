<template>
  <div class="min-h-screen pt-20 px-6 pb-12 bg-[#020202] relative overflow-hidden font-sans">
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div class="absolute -top-48 -left-48 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
    </div>

    <div
      class="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
    </div>

    <div class="max-w-7xl mx-auto z-10 relative">
      <div class="mb-3 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div class="flex items-center gap-3">
          </div>
          <h1 class="text-xl md:text-3xl font-black text-white tracking-tighter uppercase italic leading-none">
            Admin <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400 pe-2">Dashboard</span>
          </h1>
        </div>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div v-for="stat in stats" :key="stat.label"
          class="relative group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.01] backdrop-blur-md px-4 py-3 transition-all hover:bg-white/[0.04] hover:border-white/20">

          <div
            class="absolute -inset-full top-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000">
          </div>

          <div class="relative z-10 flex items-center justify-between">
            <div>
              <p class="text-[9px] font-black text-white/80 uppercase tracking-[0.2em] leading-none mb-1">
                {{ stat.label }}
              </p>
              <p class="text-2xl font-black italic tracking-tighter leading-none" :style="`color: ${stat.color}`">
                {{ stat.value }}
              </p>
            </div>

            <div class="text-2xl opacity-20 group-hover:opacity-60 group-hover:scale-110 transition-all duration-300">
              {{ stat.icon }}
            </div>
          </div>

          <div
            class="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:w-full transition-all duration-500">
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-4 mb-10">
        <router-link to="/admin/contests"
          class="group relative bg-white/[0.03] backdrop-blur-md border border-white/10 p-4 rounded-2xl hover:bg-red-600 transition-all duration-300 overflow-hidden flex items-center gap-4">
          <span class="text-3xl group-hover:scale-110 transition-transform">🏆</span>
          <div class="flex flex-col">
            <h3 class="text-sm font-black text-white uppercase italic leading-none group-hover:text-white">Manage
              Contests</h3>
            <p class="text-[10px] font-bold text-gray-500 group-hover:text-red-100 uppercase tracking-tighter mt-1">
              Launch & Manage Contests</p>
          </div>
        </router-link>

        <router-link to="/admin/users"
          class="group relative bg-white/[0.03] backdrop-blur-md border border-white/10 p-4 rounded-2xl hover:bg-blue-600 transition-all duration-300 overflow-hidden flex items-center gap-4">
          <span class="text-3xl group-hover:scale-110 transition-transform">👥</span>
          <div class="flex flex-col">
            <h3 class="text-sm font-black text-white uppercase italic leading-none">Manage Users</h3>
            <p class="text-[10px] font-bold text-gray-500 group-hover:text-blue-100 uppercase tracking-tighter mt-1">
              Create & Edit Users</p>
          </div>
        </router-link>

        <router-link to="/contests"
          class="group relative bg-white/[0.03] backdrop-blur-md border border-white/10 p-4 rounded-2xl hover:bg-white transition-all duration-300 overflow-hidden flex items-center gap-4">
          <span class="text-3xl group-hover:scale-110 transition-transform">👁️</span>
          <div class="flex flex-col">
            <h3 class="text-sm font-black text-white uppercase italic leading-none group-hover:text-black">Public View
            </h3>
            <p class="text-[10px] font-bold text-gray-500 group-hover:text-gray-600 uppercase tracking-tighter mt-1">
              View Public Contests</p>
          </div>
        </router-link>
      </div>

      <div
        class="bg-white/[0.01] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>

        <div class="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
          <div class="flex items-center gap-2">
            <div class="w-1 h-4 bg-red-600 rounded-full"></div>
            <h2 class="text-sm font-black text-white uppercase tracking-[0.2em] italic">Recent Contests</h2>
          </div>
          <router-link to="/admin/contests"
            class="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-white transition-colors">
            View All Contests →
          </router-link>
        </div>

        <div v-if="loading" class="flex justify-center py-12">
          <LoadingSpinner />
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-white/[0.01]">
                <th class="px-6 py-3 text-[12px] font-black uppercase tracking-[0.3em] text-gray-500">Contest</th>
                <th
                  class="px-6 py-3 text-center text-[12px] font-black uppercase tracking-[0.3em] text-gray-500 hidden md:table-cell">
                  Status</th>
                <th
                  class="px-6 py-3 text-center text-[12px] font-black uppercase tracking-[0.3em] text-gray-500 hidden sm:table-cell">
                  Total Participants</th>
                <th class="px-6 py-3 text-right text-[12px] font-black uppercase tracking-[0.3em] text-gray-500">Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr v-for="c in recentContests" :key="c.id" class="group hover:bg-white/[0.03] transition-colors">
                <td class="px-6 py-4">
                  <p
                    class="text-sm font-bold text-white group-hover:text-red-500 transition-colors truncate max-w-[200px]">
                    {{ c.name }}</p>
                  <p class="text-sm font-bold text-green-600 uppercase tracking-tighter">{{ formatDate(c.contestDate)
                  }}</p>
                </td>
                <td class="px-6 py-4 text-center hidden md:table-cell">
                  <StatusBadge :status="c.status" size="ml" class="scale-90" />
                </td>
                <td class="px-6 py-4 text-center hidden sm:table-cell">
                  <span class="text-xs font-black text-gray-400 font-mono">{{ c.registrationCount }}</span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <router-link :to="`/admin/contests/${c.id}/questions`"
                      class="p-2 bg-blue-600/5 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-600/20 rounded-lg transition-all"
                      title="Questions">
                      View Questions
                    </router-link>
                    <router-link :to="`/contests/${c.id}`"
                      class="p-2 bg-white/5 text-gray-500 hover:bg-white hover:text-black border border-white/10 rounded-lg transition-all"
                      title="View">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
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
  { label: 'Total Contests', value: contestStore.contests.length, color: '#ff0033', icon: '🏆' },
  { label: 'Active Contests', value: contestStore.contests.filter(c => c.status === 'RUNNING').length, color: '#00ff88', icon: '⚡' },
  { label: 'Open Contests', value: contestStore.contests.filter(c => c.status === 'REGISTRATION_OPEN').length, color: '#00bfff', icon: '📝' },
  { label: 'Closed Contests', value: contestStore.contests.filter(c => c.status === 'FINISHED').length, color: '#555', icon: '✅' },
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
.text-transparent {
  -webkit-background-clip: text;
}

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