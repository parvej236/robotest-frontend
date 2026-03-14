<template>
  <div class="min-h-screen pt-20 px-4 pb-12">
    <div class="max-w-7xl mx-auto">

      <!-- Header -->
      <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <div class="w-4 h-px bg-neon-red"></div>
            <span class="text-xs font-display tracking-widest text-neon-red uppercase">Command Center</span>
          </div>
          <h1 class="font-display text-2xl font-black text-white tracking-wide">
            Welcome back, <span class="glow-text-red">{{ auth.username }}</span>
          </h1>
        </div>
        <div class="flex gap-3">
          <router-link to="/profile" class="btn-ghost py-2 text-xs">Edit Profile</router-link>
          <router-link to="/contests" class="btn-primary py-2 text-xs">Browse Contests</router-link>
        </div>
      </div>

      <!-- Stats cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div v-for="stat in statCards" :key="stat.label"
             class="glass-card p-5 relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-10 transition-opacity group-hover:opacity-20"
               :style="`background: ${stat.color}`"></div>
          <div class="text-2xl font-display font-black mb-1" :style="`color: ${stat.color}`">{{ stat.value }}</div>
          <div class="text-xs font-body text-white/40 uppercase tracking-wider">{{ stat.label }}</div>
        </div>
      </div>

      <!-- Main content grid -->
      <div class="grid lg:grid-cols-3 gap-6">

        <!-- My Contests -->
        <div class="lg:col-span-2 glass-card p-6">
          <div class="flex items-center justify-between mb-5">
            <h2 class="section-title">My Contests</h2>
            <router-link to="/contests" class="text-xs font-display text-neon-blue hover:text-white transition-colors tracking-wider">View All →</router-link>
          </div>
          <div v-if="loadingContests" class="flex justify-center py-8"><LoadingSpinner /></div>
          <div v-else-if="myContests.length === 0" class="text-center py-8">
            <div class="text-3xl mb-2">🤖</div>
            <p class="text-white/40 font-body text-sm">No contests joined yet</p>
            <router-link to="/contests" class="text-neon-blue text-xs mt-2 inline-block hover:underline">Browse contests →</router-link>
          </div>
          <div v-else class="space-y-3">
            <div v-for="contest in myContests" :key="contest.id"
                 class="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
                 @click="$router.push(`/contests/${contest.id}`)">
              <div class="min-w-0 flex-1">
                <p class="font-display text-sm text-white font-semibold truncate">{{ contest.name }}</p>
                <p class="text-xs text-white/40 font-mono mt-0.5">{{ formatDate(contest.contestDate) }}</p>
              </div>
              <div class="flex items-center gap-3 ml-3">
                <StatusBadge :status="contest.status" size="xs" />
                <router-link v-if="contest.status === 'RUNNING'" :to="`/contests/${contest.id}/join`"
                  @click.stop class="btn-primary py-0.5 px-2 text-[9px]">Join</router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile summary -->
        <div class="space-y-4">
          <!-- Profile card -->
          <div class="glass-card neon-border-red p-5 text-center">
            <div class="w-20 h-20 mx-auto rounded-full border-2 border-neon-red/50 overflow-hidden bg-dark-700 flex items-center justify-center mb-3">
              <img v-if="auth.avatar" :src="auth.avatar" class="w-full h-full object-cover" />
              <span v-else class="font-display text-3xl font-black text-neon-red">{{ auth.username?.charAt(0)?.toUpperCase() }}</span>
            </div>
            <h3 class="font-display font-bold text-white text-base">{{ auth.fullName }}</h3>
            <p class="text-xs font-mono text-white/40 mt-0.5">@{{ auth.username }}</p>
            <div v-if="auth.isAdmin" class="mt-2 inline-flex items-center gap-1 text-neon-red text-xs font-display border border-neon-red/30 px-2 py-0.5 rounded-sm">
              ADMIN
            </div>
            <router-link to="/profile" class="btn-ghost w-full justify-center flex mt-4 text-xs py-2">Edit Profile</router-link>
          </div>

          <!-- Quick links -->
          <div class="glass-card p-4">
            <h3 class="section-title text-sm mb-3">Quick Links</h3>
            <div class="space-y-1">
              <router-link to="/contests" class="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/5 transition-colors text-sm text-white/70 hover:text-white">
                <span class="text-neon-red">◆</span> Browse Contests
              </router-link>
              <router-link to="/leaderboard" class="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/5 transition-colors text-sm text-white/70 hover:text-white">
                <span class="text-neon-blue">◆</span> Leaderboard
              </router-link>
              <router-link v-if="auth.isAdmin" to="/admin" class="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/5 transition-colors text-sm text-neon-red hover:text-white">
                <span class="text-neon-red">◆</span> Admin Panel
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useContestStore } from '@/stores/contest'
import StatusBadge from '@/components/common/StatusBadge.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { format } from 'date-fns'

const auth = useAuthStore()
const contestStore = useContestStore()

const myContests = ref([])
const loadingContests = ref(true)

const statCards = computed(() => [
  { label: 'Contests Joined', value: myContests.value.length, color: '#ff0033' },
  { label: 'Active Contests', value: myContests.value.filter(c => c.status === 'RUNNING').length, color: '#00ff88' },
  { label: 'Completed', value: myContests.value.filter(c => c.status === 'FINISHED').length, color: '#00bfff' },
  { label: 'Upcoming', value: myContests.value.filter(c => c.status === 'UPCOMING' || c.status === 'REGISTRATION_OPEN').length, color: '#ffaa00' },
])

function formatDate(d) {
  if (!d) return 'TBD'
  try { return format(new Date(d), 'MMM dd, yyyy') } catch { return d }
}

onMounted(async () => {
  try { myContests.value = await contestStore.getMyContests() }
  catch (e) { console.error(e) }
  finally { loadingContests.value = false }
})
</script>
