<template>
  <div class="space-y-5">

    <!-- Stats Grid Layout -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <div 
        v-for="stat in stats" 
        :key="stat.label"
        class="relative group overflow-hidden rounded-2xl border border-white/5 bg-dark-900/40 backdrop-blur-md px-5 py-2.5 transition-all hover:bg-dark-900/60 hover:border-white/10 shadow-md flex items-center gap-4"
      >
        <!-- Icon Container with theme glow -->
        <div 
          class="flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300"
          :style="`background-color: ${stat.color}15; border: 1px solid ${stat.color}30; color: ${stat.color}`"
        >
          <component :is="stat.icon" class="w-5 h-5" />
        </div>

        <!-- Details -->
        <div class="min-w-0">
          <p class="text-[13px] font-semibold text-slate-350 leading-none mb-1.5">{{ stat.label }}</p>
          <p class="text-2xl font-bold font-mono tracking-tight leading-none text-white">
            {{ stat.value }}
          </p>
        </div>

        <!-- Subtle ambient corner glow -->
        <div 
          class="absolute -right-4 -bottom-4 w-12 h-12 rounded-full opacity-10 group-hover:opacity-20 blur-xl transition-opacity pointer-events-none"
          :style="`background-color: ${stat.color}`"
        ></div>
      </div>
    </div>

    <!-- Search and Filters Panel -->
    <div class="space-y-4">
      <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        <!-- Search bar -->
        <div class="glass-card px-4 py-3 flex items-center gap-3 flex-1">
          <Search class="w-4 h-4 text-white/30 flex-shrink-0" />
          <input v-model="search" type="text"
            placeholder="Search by name, username, email or university..."
            class="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none" />
        </div>
        
        <!-- Filters & sorting -->
        <div class="flex flex-wrap items-center gap-3">
          
          <!-- Role filter -->
          <div class="relative rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 w-full sm:w-40 shadow-inner">
            <select v-model="roleFilter" class="w-full bg-slate-950/90 text-xs text-slate-200 outline-none appearance-none cursor-pointer">
              <option value="ALL">All roles</option>
              <option value="ROLE_ADMIN">Admins</option>
              <option value="ROLE_USER">Users</option>
              <option value="ROLE_JUDGE">Judges</option>
              <option value="ROLE_MANAGER">Managers</option>
            </select>
            <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          <!-- Status filter -->
          <div class="relative rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 w-full sm:w-36 shadow-inner">
            <select v-model="statusFilter" class="w-full bg-slate-950/90 text-xs text-slate-200 outline-none appearance-none cursor-pointer">
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active only</option>
              <option value="INACTIVE">Inactive only</option>
            </select>
            <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          <!-- Sort order -->
          <div class="relative rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 w-full sm:w-44 shadow-inner">
            <select v-model="sortBy" class="w-full bg-slate-950/90 text-xs text-slate-200 outline-none appearance-none cursor-pointer">
              <option value="nameAsc">Name: A-Z</option>
              <option value="nameDesc">Name: Z-A</option>
              <option value="newest">Joined: Newest</option>
              <option value="oldest">Joined: Oldest</option>
            </select>
            <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          <!-- Create user button -->
          <router-link to="/admin/users/create" class="btn-primary text-xs py-2.5 px-5 font-semibold tracking-wide flex-shrink-0 w-full sm:w-auto text-center">
            + Create User
          </router-link>
        </div>
      </div>
      <div class="text-[11px] font-mono text-slate-400">
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }} of {{ filteredUsers.length }} users
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-20">
      <LoadingSpinner label="Loading users list..." />
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredUsers.length === 0" class="glass-card p-16 text-center">
      <div class="text-5xl mb-4">👥</div>
      <p class="text-slate-300 font-medium text-lg mb-2">No users found matching filters.</p>
      <p class="text-slate-500 text-sm">Try adjusting your search queries or active filter tags.</p>
    </div>

    <!-- Users List Containers (Mobile Cards & Desktop Table) -->
    <div v-else class="space-y-6">
      
      <!-- Mobile Cards List View (Visible on small screens) -->
      <div class="md:hidden space-y-4">
        <div 
          v-for="u in paginatedUsers" 
          :key="u.id" 
          class="glass-card p-5 relative border border-white/5 bg-slate-950/40 rounded-2xl flex flex-col gap-4 shadow-md transition-all hover:border-white/10"
        >
          <!-- User Profile Row -->
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-full border border-white/10 overflow-hidden bg-dark-700 flex items-center justify-center flex-shrink-0">
              <img v-if="u.profileImageUrl" :src="toFullUrl(u.profileImageUrl)" class="w-full h-full object-cover" alt="Avatar" />
              <span v-else class="font-display text-base font-bold text-neon-red">
                {{ u.username?.charAt(0)?.toUpperCase() }}
              </span>
            </div>
            <div class="min-w-0">
              <p class="text-base font-bold text-white leading-tight">{{ u.fullName }}</p>
              <p class="text-sm font-mono text-slate-400">@{{ u.username }}</p>
            </div>
          </div>

          <!-- Attributes Grid -->
          <div class="grid grid-cols-2 gap-y-3 gap-x-2 text-sm border-t border-white/5 pt-3">
            <div>
              <p class="text-xs text-slate-500 mb-0.5">Email</p>
              <p class="font-mono text-slate-300 truncate text-xs" :title="u.email">{{ u.email }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-500 mb-0.5">University</p>
              <p class="text-slate-350 truncate text-xs">{{ u.university || '—' }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-500 mb-1">Roles</p>
              <div class="flex gap-1 flex-wrap">
                <span v-for="r in u.roles" :key="r"
                  :class="['text-[10px] px-2 py-0.5 rounded-full border tracking-wide font-mono', getRoleBadgeClass(r)]">
                  {{ formatRoleName(r) }}
                </span>
              </div>
            </div>
            <div>
              <p class="text-xs text-slate-500 mb-1">Status</p>
              <span :class="['text-[10px] px-2 py-0.5 inline-block rounded-full border tracking-wide font-mono',
                              u.enabled ? 'text-green-400 border-green-500/30 bg-green-500/10' : 'text-slate-400 border-white/10 bg-white/5']">
                {{ u.enabled ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </div>

          <!-- Actions Row -->
          <div class="flex justify-end gap-2.5 border-t border-white/5 pt-3">
            <router-link :to="'/admin/users/edit/' + u.id"
              class="text-sm font-semibold text-neon-blue border border-neon-blue/30 px-3.5 py-1.5 rounded-xl hover:bg-neon-blue/10 transition-colors text-center">
              Edit
            </router-link>
            <button @click="confirmDelete(u)"
              v-if="!u.roles?.includes('ROLE_ADMIN')"
              class="text-sm font-semibold text-neon-red border border-neon-red/30 px-3.5 py-1.5 rounded-xl hover:bg-red-700/10 transition-colors">
              Delete
            </button>
            <span v-else class="text-xs text-white/20 font-mono self-center pr-2">protected</span>
          </div>
        </div>
      </div>

      <!-- Desktop Table View (Visible on md and up) -->
      <div class="hidden md:block glass-card p-6 overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-white/5">
              <th class="pb-3.5 text-left text-sm font-semibold text-white/50">User</th>
              <th class="pb-3.5 text-left text-sm font-semibold text-white/50">Email</th>
              <th class="pb-3.5 text-center text-sm font-semibold text-white/50">Roles</th>
              <th class="pb-3.5 text-center text-sm font-semibold text-white/50">Status</th>
              <th class="pb-3.5 text-center text-sm font-semibold text-white/50">University</th>
              <th class="pb-3.5 text-right text-sm font-semibold text-white/50">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr v-for="u in paginatedUsers" :key="u.id" class="hover:bg-white/3 transition-colors">

              <!-- User Profile -->
              <td class="py-4 pr-4">
                <div class="flex items-center gap-3.5">
                  <div class="w-11 h-11 rounded-full border border-white/10 overflow-hidden bg-dark-700 flex items-center justify-center flex-shrink-0">
                    <img v-if="u.profileImageUrl"
                         :src="toFullUrl(u.profileImageUrl)"
                         class="w-full h-full object-cover"
                         alt="Avatar" />
                    <span v-else class="font-display text-sm font-bold text-neon-red">
                      {{ u.username?.charAt(0)?.toUpperCase() }}
                    </span>
                  </div>
                  <div>
                    <p class="font-display text-base text-white font-bold">{{ u.fullName }}</p>
                    <p class="text-sm font-mono text-white/45">@{{ u.username }}</p>
                  </div>
                </div>
              </td>

              <!-- Email address -->
              <td class="py-4 text-sm font-mono text-slate-300 max-w-xs truncate">
                {{ u.email }}
              </td>

              <!-- Roles list -->
              <td class="py-4 text-center">
                <div class="flex gap-1.5 justify-center flex-wrap">
                  <span v-for="r in u.roles" :key="r"
                    :class="['text-xs px-2.5 py-0.5 rounded-full border tracking-wide font-mono', getRoleBadgeClass(r)]">
                    {{ formatRoleName(r) }}
                  </span>
                </div>
              </td>

              <!-- Status tag -->
              <td class="py-4 text-center">
                <span :class="['text-xs px-2.5 py-0.5 rounded-full border tracking-wide font-mono',
                                u.enabled
                                  ? 'text-green-400 border-green-500/30 bg-green-500/10'
                                  : 'text-slate-400 border-white/10 bg-white/5']">
                  {{ u.enabled ? 'Active' : 'Inactive' }}
                </span>
              </td>

              <!-- University credentials -->
              <td class="py-4 text-center text-sm text-slate-300 font-body">
                {{ u.university || '—' }}
              </td>

              <!-- Action triggers -->
              <td class="py-4 text-right">
                <div class="flex items-center justify-end gap-2.5">
                  <router-link :to="'/admin/users/edit/' + u.id"
                    class="text-sm font-semibold text-neon-blue border border-neon-blue/30 px-3.5 py-1.5 rounded-xl hover:bg-neon-blue/10 transition-colors text-center">
                    Edit
                  </router-link>
                  <button @click="confirmDelete(u)"
                    v-if="!u.roles?.includes('ROLE_ADMIN')"
                    class="text-sm font-semibold text-neon-red border border-neon-red/30 px-3.5 py-1.5 rounded-xl hover:bg-red-700/10 transition-colors">
                    Delete
                  </button>
                  <span v-else class="text-sm text-white/20 font-mono pr-2">protected</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Navigation Elements -->
      <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between border-t border-white/5 pt-5 gap-4">
        <div class="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-body">
          <div>
            Page <span class="font-semibold text-slate-200">{{ currentPage }}</span> of <span class="font-semibold text-slate-200">{{ totalPages }}</span>
          </div>
          <span class="text-white/10 hidden sm:inline">|</span>
          <div class="flex items-center gap-1.5">
            <span>Show:</span>
            <div class="relative rounded-xl border border-slate-700 bg-slate-950/80 px-2 py-1 shadow-inner flex items-center">
              <select v-model="itemsPerPage" class="bg-slate-950/90 text-xs text-slate-200 outline-none appearance-none cursor-pointer pr-4.5 pl-1 font-semibold">
                <option :value="5">5</option>
                <option :value="8">8</option>
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
              </select>
              <div class="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-500">
                <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
            <span>per page</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <!-- Previous Button -->
          <button 
            @click="currentPage = Math.max(1, currentPage - 1)" 
            :disabled="currentPage === 1"
            class="px-3.5 py-2 text-xs font-semibold rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-900 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            <ChevronLeft class="w-3.5 h-3.5" /> Previous
          </button>

          <!-- Page Numbers -->
          <button 
            v-for="page in visiblePages" 
            :key="page"
            @click="currentPage = page"
            class="w-9 h-9 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center border font-mono"
            :class="currentPage === page 
              ? 'border-neon-red bg-neon-red/10 text-neon-red shadow-[0_0_12px_rgba(255,0,51,0.15)] font-bold'
              : 'border-white/5 bg-transparent hover:bg-white/5 text-slate-400'"
          >
            {{ page }}
          </button>

          <!-- Next Button -->
          <button 
            @click="currentPage = Math.min(totalPages, currentPage + 1)" 
            :disabled="currentPage === totalPages"
            class="px-3.5 py-2 text-xs font-semibold rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-900 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            Next <ChevronRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>

    <!-- ── DELETE CONFIRM MODAL ──────────────────────────── -->
    <div v-if="deleteTarget"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      @click.self="deleteTarget = null">
      <div class="glass-panel neon-border-red p-8 w-full max-w-sm text-center">
        <div class="text-4xl mb-3">⚠️</div>
        <h3 class="font-display text-xl font-bold text-white mb-2">Delete User?</h3>
        <p class="text-white/60 font-body text-sm mb-6">
          Permanently delete <strong class="text-white">{{ deleteTarget.username }}</strong>?
          This cannot be undone.
        </p>
        <div class="flex gap-3 justify-center">
          <button @click="doDelete" :disabled="deleting"
            class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
          <button @click="deleteTarget = null" class="btn-ghost">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api from '@/utils/api'
import { BACKEND_URL } from '@/config'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useToast } from '@/composables/useToast'
import { Users, Zap, Ban, Shield, Scale, Search, ChevronLeft, ChevronRight } from '@lucide/vue'

const toast = useToast()

// ── State ────────────────────────────────────────────────────
const users       = ref([])
const loading     = ref(true)
const search      = ref('')
const roleFilter  = ref('ALL')
const statusFilter = ref('ALL')
const sortBy      = ref('newest')

// Pagination State
const currentPage = ref(1)
const itemsPerPage = ref(5)

const stats = computed(() => [
  { label: 'Total users', value: users.value.length, color: '#38bdf8', icon: Users },
  { label: 'Active users', value: users.value.filter(u => u.enabled).length, color: '#34d399', icon: Zap },
  { label: 'Inactive users', value: users.value.filter(u => !u.enabled).length, color: '#94a3b8', icon: Ban },
  { label: 'Total admins', value: users.value.filter(u => u.roles?.includes('ROLE_ADMIN')).length, color: '#f87171', icon: Shield },
  { label: 'Total judges', value: users.value.filter(u => u.roles?.includes('ROLE_JUDGE')).length, color: '#fbbf24', icon: Scale },
])

// Delete modal
const deleteTarget = ref(null)
const deleting     = ref(false)

// Converts "/uploads/profiles/x.jpg" → full URL with backend host
function toFullUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return BACKEND_URL + path
}

// ── Computed ─────────────────────────────────────────────────
const filteredUsers = computed(() => {
  let list = [...users.value]

  // 1. Search Query
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(u =>
      u.fullName?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.university?.toLowerCase().includes(q)
    )
  }

  // 2. Role Filter
  if (roleFilter.value !== 'ALL') {
    list = list.filter(u => u.roles?.includes(roleFilter.value))
  }

  // 3. Status Filter
  if (statusFilter.value === 'ACTIVE') {
    list = list.filter(u => u.enabled)
  } else if (statusFilter.value === 'INACTIVE') {
    list = list.filter(u => !u.enabled)
  }

  // 4. Sorting
  list.sort((a, b) => {
    if (sortBy.value === 'nameAsc') {
      return (a.fullName || '').localeCompare(b.fullName || '')
    } else if (sortBy.value === 'nameDesc') {
      return (b.fullName || '').localeCompare(a.fullName || '')
    } else if (sortBy.value === 'newest') {
      return (b.id - a.id)
    } else if (sortBy.value === 'oldest') {
      return (a.id - b.id)
    }
    return 0
  })

  return list
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage.value))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredUsers.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

watch([search, roleFilter, statusFilter, sortBy, itemsPerPage], () => {
  currentPage.value = 1
})

function getRoleBadgeClass(r) {
  if (r === 'ROLE_ADMIN') return 'text-neon-red border-neon-red/30 bg-neon-red/10'
  if (r === 'ROLE_JUDGE') return 'text-amber-400 border-amber-500/30 bg-amber-500/10'
  if (r === 'ROLE_MANAGER') return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10'
  return 'text-slate-400 border-white/10 bg-white/5'
}

function formatRoleName(r) {
  if (!r) return ''
  const clean = r.replace('ROLE_', '')
  return clean.charAt(0) + clean.slice(1).toLowerCase()
}

// ── Load users ───────────────────────────────────────────────
async function loadUsers() {
  const res = await api.get('/users')
  users.value = res.data
}

onMounted(async () => {
  try { await loadUsers() } catch (e) { console.error(e) }
  finally { loading.value = false }
})

// ── Delete ───────────────────────────────────────────────────
function confirmDelete(u) { deleteTarget.value = u }

async function doDelete() {
  deleting.value = true
  try {
    await api.delete(`/users/${deleteTarget.value.id}`)
    toast.success('User account deleted successfully!')
    deleteTarget.value = null
    await loadUsers()
  } catch (e) {
    toast.error(e.response?.data?.message || e.message || 'Failed to delete user')
  } finally {
    deleting.value = false
  }
}
</script>