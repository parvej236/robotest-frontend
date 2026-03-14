<template>
  <div class="min-h-screen pt-20 px-4 pb-12">
    <div class="max-w-7xl mx-auto">
      <div class="mb-6">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-4 h-px bg-neon-red"></div>
          <span class="text-xs font-display tracking-widest text-neon-red uppercase">Admin</span>
        </div>
        <h1 class="font-display text-2xl font-black text-white uppercase tracking-wider">Manage Users</h1>
      </div>

      <!-- Search -->
      <div class="glass-card p-4 mb-6 flex items-center gap-3">
        <svg class="w-4 h-4 text-white/30 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input v-model="search" type="text" placeholder="Search by name, username, or email..." class="input-field border-0 bg-transparent p-0 focus:shadow-none text-sm" />
        <span class="text-xs font-mono text-white/30 flex-shrink-0">{{ filteredUsers.length }} users</span>
      </div>

      <!-- Table -->
      <div class="glass-card p-6 overflow-x-auto">
        <div v-if="loading" class="flex justify-center py-12"><LoadingSpinner /></div>
        <table v-else class="w-full">
          <thead>
            <tr class="border-b border-white/5">
              <th class="pb-3 text-left text-xs font-display tracking-wider text-white/40 uppercase">User</th>
              <th class="pb-3 text-left text-xs font-display tracking-wider text-white/40 uppercase hidden md:table-cell">Email</th>
              <th class="pb-3 text-center text-xs font-display tracking-wider text-white/40 uppercase hidden sm:table-cell">Roles</th>
              <th class="pb-3 text-center text-xs font-display tracking-wider text-white/40 uppercase hidden lg:table-cell">University</th>
              <th class="pb-3 text-right text-xs font-display tracking-wider text-white/40 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr v-for="u in filteredUsers" :key="u.id" class="hover:bg-white/3 transition-colors">
              <td class="py-3 pr-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full border border-white/10 overflow-hidden bg-dark-700 flex items-center justify-center flex-shrink-0">
                    <img v-if="u.profileImageUrl" :src="u.profileImageUrl" class="w-full h-full object-cover" />
                    <span v-else class="font-display text-xs font-bold text-neon-red">{{ u.username?.charAt(0)?.toUpperCase() }}</span>
                  </div>
                  <div>
                    <p class="font-display text-sm text-white font-semibold">{{ u.fullName }}</p>
                    <p class="text-xs font-mono text-white/40">@{{ u.username }}</p>
                  </div>
                </div>
              </td>
              <td class="py-3 hidden md:table-cell text-xs font-mono text-white/50 max-w-xs truncate">{{ u.email }}</td>
              <td class="py-3 text-center hidden sm:table-cell">
                <div class="flex gap-1 justify-center flex-wrap">
                  <span v-for="r in u.roles" :key="r"
                    :class="['text-[9px] font-display px-1.5 py-0.5 rounded border tracking-widest',
                              r === 'ROLE_ADMIN' ? 'text-neon-red border-neon-red/30 bg-neon-red/10' : 'text-white/40 border-white/10']">
                    {{ r.replace('ROLE_','') }}
                  </span>
                </div>
              </td>
              <td class="py-3 text-center hidden lg:table-cell text-xs text-white/40 font-body">{{ u.university || '—' }}</td>
              <td class="py-3 text-right">
                <button @click="confirmDelete(u)"
                  v-if="!u.roles?.includes('ROLE_ADMIN')"
                  class="text-xs font-display text-neon-red border border-neon-red/30 px-2 py-1 rounded hover:bg-neon-red/10 transition-colors">
                  Delete
                </button>
                <span v-else class="text-xs text-white/20 font-mono">protected</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Delete confirm -->
    <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" @click.self="deleteTarget = null">
      <div class="glass-panel neon-border-red p-8 w-full max-w-sm text-center">
        <div class="text-4xl mb-3">⚠️</div>
        <h3 class="font-display text-xl font-bold text-white mb-2">Delete User?</h3>
        <p class="text-white/60 font-body text-sm mb-6">
          Permanently delete <strong class="text-white">{{ deleteTarget.username }}</strong>?
        </p>
        <div class="flex gap-3 justify-center">
          <button @click="doDelete" :disabled="deleting" class="btn-primary">{{ deleting ? 'Deleting...' : 'Delete' }}</button>
          <button @click="deleteTarget = null" class="btn-ghost">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/utils/api'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const users = ref([])
const loading = ref(true)
const search = ref('')
const deleteTarget = ref(null)
const deleting = ref(false)

const filteredUsers = computed(() => {
  if (!search.value.trim()) return users.value
  const q = search.value.toLowerCase()
  return users.value.filter(u =>
    u.fullName?.toLowerCase().includes(q) ||
    u.username?.toLowerCase().includes(q) ||
    u.email?.toLowerCase().includes(q)
  )
})

function confirmDelete(u) { deleteTarget.value = u }

async function doDelete() {
  deleting.value = true
  try {
    await api.delete(`/users/${deleteTarget.value.id}`)
    deleteTarget.value = null
    await loadUsers()
  } catch (e) { console.error(e) }
  finally { deleting.value = false }
}

async function loadUsers() {
  const res = await api.get('/users')
  users.value = res.data.data
}

onMounted(async () => {
  try { await loadUsers() } finally { loading.value = false }
})
</script>
