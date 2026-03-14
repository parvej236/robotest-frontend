<template>
  <div class="min-h-screen pt-20 px-4 pb-12">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <div class="w-4 h-px bg-neon-red"></div>
            <span class="text-xs font-display tracking-widest text-neon-red uppercase">System Control</span>
          </div>
          <h1 class="font-display text-2xl font-black text-white uppercase tracking-wider">Admin Dashboard</h1>
        </div>
        <span class="text-xs font-display text-neon-red border border-neon-red/40 px-3 py-1.5 rounded">ADMIN ACCESS</span>
      </div>

      <!-- Stat cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div v-for="stat in stats" :key="stat.label" class="glass-card p-5 relative overflow-hidden group cursor-default">
          <div class="text-xs font-display tracking-widest text-white/40 uppercase mb-1">{{ stat.label }}</div>
          <div class="font-display text-3xl font-black" :style="`color: ${stat.color}`">{{ stat.value }}</div>
          <div class="absolute -right-4 -bottom-4 text-5xl opacity-10 group-hover:opacity-20 transition-opacity">{{ stat.icon }}</div>
        </div>
      </div>

      <!-- Quick actions -->
      <div class="grid md:grid-cols-3 gap-4 mb-8">
        <router-link to="/admin/contests" class="glass-card p-6 hover:neon-border-red transition-all duration-300 group cursor-pointer">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-neon-red/10 border border-neon-red/30 flex items-center justify-center text-2xl group-hover:bg-neon-red/20 transition-colors">🏆</div>
            <div>
              <h3 class="font-display font-bold text-white">Manage Contests</h3>
              <p class="text-xs text-white/40 font-body mt-0.5">Create, edit & delete contests</p>
            </div>
          </div>
        </router-link>
        <router-link to="/admin/users" class="glass-card p-6 hover:neon-border-blue transition-all duration-300 group cursor-pointer">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center text-2xl group-hover:bg-neon-blue/20 transition-colors">👥</div>
            <div>
              <h3 class="font-display font-bold text-white">Manage Users</h3>
              <p class="text-xs text-white/40 font-body mt-0.5">View and manage all users</p>
            </div>
          </div>
        </router-link>
        <router-link to="/contests" class="glass-card p-6 hover:border-white/20 transition-all duration-300 group cursor-pointer">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-2xl group-hover:bg-white/10 transition-colors">📊</div>
            <div>
              <h3 class="font-display font-bold text-white">Public View</h3>
              <p class="text-xs text-white/40 font-body mt-0.5">See the platform as users do</p>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Recent contests table -->
      <div class="glass-card p-6">
        <div class="flex items-center justify-between mb-5">
          <h2 class="section-title">Recent Contests</h2>
          <router-link to="/admin/contests" class="text-xs font-display text-neon-blue hover:text-white transition-colors tracking-wider">Manage All →</router-link>
        </div>
        <div v-if="loading" class="flex justify-center py-8"><LoadingSpinner /></div>
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-white/5">
                <th class="pb-3 text-left text-xs font-display tracking-wider text-white/40 uppercase">Contest</th>
                <th class="pb-3 text-center text-xs font-display tracking-wider text-white/40 uppercase hidden md:table-cell">Status</th>
                <th class="pb-3 text-center text-xs font-display tracking-wider text-white/40 uppercase hidden sm:table-cell">Registered</th>
                <th class="pb-3 text-right text-xs font-display tracking-wider text-white/40 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr v-for="c in recentContests" :key="c.id" class="hover:bg-white/3 transition-colors">
                <td class="py-3">
                  <p class="font-display text-sm text-white font-semibold truncate max-w-xs">{{ c.name }}</p>
                  <p class="text-xs font-mono text-white/30 mt-0.5">{{ formatDate(c.contestDate) }}</p>
                </td>
                <td class="py-3 text-center hidden md:table-cell"><StatusBadge :status="c.status" size="xs" /></td>
                <td class="py-3 text-center hidden sm:table-cell text-xs font-mono text-white/50">{{ c.registrationCount }}</td>
                <td class="py-3 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <router-link :to="`/admin/contests/${c.id}/questions`"
                      class="text-xs font-display text-neon-blue hover:text-white border border-neon-blue/30 px-2 py-1 rounded hover:bg-neon-blue/10 transition-colors">
                      Questions
                    </router-link>
                    <router-link :to="`/contests/${c.id}`"
                      class="text-xs font-display text-white/40 hover:text-white border border-white/10 px-2 py-1 rounded hover:bg-white/5 transition-colors">
                      View
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
  { label: 'Active Now', value: contestStore.contests.filter(c => c.status === 'RUNNING').length, color: '#00ff88', icon: '⚡' },
  { label: 'Registration Open', value: contestStore.contests.filter(c => c.status === 'REGISTRATION_OPEN').length, color: '#00bfff', icon: '📝' },
  { label: 'Finished', value: contestStore.contests.filter(c => c.status === 'FINISHED').length, color: '#888', icon: '✅' },
])

function formatDate(d) {
  if (!d) return 'TBD'
  try { return format(new Date(d), 'MMM dd, yyyy') } catch { return d }
}

onMounted(async () => {
  try {
    await contestStore.fetchAllContests()
    recentContests.value = [...contestStore.contests].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8)
  } finally { loading.value = false }
})
</script>
