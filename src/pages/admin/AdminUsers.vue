<!-- src/pages/admin/AdminUsers.vue -->
<template>
  <div class="min-h-screen pt-20 px-4 pb-12">
    <div class="max-w-7xl mx-auto">
          <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div class="absolute -top-48 -left-48 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
    </div>

      <!-- Header -->
      <div class="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <div class="w-4 h-px bg-red-700"></div>
            <span class="text-xs font-display tracking-widest text-neon-red uppercase">Admin</span>
          </div>
          <h1 class="font-display text-2xl font-black text-white uppercase tracking-wider">Manage Users</h1>
        </div>
        <button @click="openCreate" class="btn-primary text-xs py-2">+ Create User</button>
      </div>

      <!-- Search -->
      <div class="glass-card p-4 mb-6 flex items-center gap-3">
        <svg class="w-4 h-4 text-white/30 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input v-model="search" type="text"
          placeholder="Search by name, username, or email..."
          class="input-field border-0 bg-transparent p-0 focus:shadow-none text-sm flex-1" />
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
              <th class="pb-3 text-center text-xs font-display tracking-wider text-white/40 uppercase hidden lg:table-cell">Status</th>
              <th class="pb-3 text-center text-xs font-display tracking-wider text-white/40 uppercase hidden lg:table-cell">University</th>
              <th class="pb-3 text-right text-xs font-display tracking-wider text-white/40 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr v-for="u in filteredUsers" :key="u.id" class="hover:bg-white/3 transition-colors">

              <!-- User -->
              <td class="py-3 pr-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full border border-white/10 overflow-hidden bg-dark-700 flex items-center justify-center flex-shrink-0">
                    <!-- FIX: build full URL from relative path -->
                    <img v-if="u.profileImageUrl"
                         :src="toFullUrl(u.profileImageUrl)"
                         class="w-full h-full object-cover"
                         alt="Avatar" />
                    <span v-else class="font-display text-xs font-bold text-neon-red">
                      {{ u.username?.charAt(0)?.toUpperCase() }}
                    </span>
                  </div>
                  <div>
                    <p class="font-display text-sm text-white font-semibold">{{ u.fullName }}</p>
                    <p class="text-xs font-mono text-white/40">@{{ u.username }}</p>
                  </div>
                </div>
              </td>

              <!-- Email -->
              <td class="py-3 hidden md:table-cell text-xs font-mono text-white/50 max-w-xs truncate">
                {{ u.email }}
              </td>

              <!-- Roles -->
              <td class="py-3 text-center hidden sm:table-cell">
                <div class="flex gap-1 justify-center flex-wrap">
                  <span v-for="r in u.roles" :key="r"
                    :class="['text-[9px] font-display px-1.5 py-0.5 rounded border tracking-widest',
                              r === 'ROLE_ADMIN'
                                ? 'text-neon-red border-neon-red/30 bg-red-700/10'
                                : 'text-white/40 border-white/10']">
                    {{ r.replace('ROLE_', '') }}
                  </span>
                </div>
              </td>

              <!-- Status -->
              <td class="py-3 text-center hidden lg:table-cell">
                <span :class="['text-[9px] font-display px-1.5 py-0.5 rounded border tracking-widest',
                                u.enabled
                                  ? 'text-green-400 border-green-500/30 bg-green-500/10'
                                  : 'text-white/30 border-white/10']">
                  {{ u.enabled ? 'Active' : 'Inactive' }}
                </span>
              </td>

              <!-- University -->
              <td class="py-3 text-center hidden lg:table-cell text-xs text-white/40 font-body">
                {{ u.university || '—' }}
              </td>

              <!-- Actions -->
              <td class="py-3 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="openEdit(u)"
                    class="text-xs font-display text-neon-blue border border-neon-blue/30 px-2 py-1 rounded hover:bg-neon-blue/10 transition-colors">
                    Edit
                  </button>
                  <button @click="confirmDelete(u)"
                    v-if="!u.roles?.includes('ROLE_ADMIN')"
                    class="text-xs font-display text-neon-red border border-neon-red/30 px-2 py-1 rounded hover:bg-red-700/10 transition-colors">
                    Delete
                  </button>
                  <span v-else class="text-xs text-white/20 font-mono">protected</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── CREATE USER MODAL ─────────────────────────────── -->
    <div v-if="showCreateModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      @click.self="showCreateModal = false">
      <div class="glass-panel neon-border-red p-8 w-full max-w-lg relative my-4">
        <button @click="showCreateModal = false" class="absolute top-4 right-4 text-white/40 hover:text-white text-xl">✕</button>
        <h2 class="section-title mb-6">Create New User</h2>

        <form @submit.prevent="handleCreate" class="space-y-4">
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="label-text">Full Name *</label>
              <input v-model="createForm.fullName" type="text" class="input-field" required />
            </div>
            <div>
              <label class="label-text">Username *</label>
              <input v-model="createForm.username" type="text" class="input-field" required />
            </div>
            <div class="sm:col-span-2">
              <label class="label-text">Email *</label>
              <input v-model="createForm.email" type="email" class="input-field" required />
            </div>
            <div>
              <label class="label-text">Password *</label>
              <input v-model="createForm.password" type="password" class="input-field" required minlength="6" />
            </div>
            <div>
              <label class="label-text">Role</label>
              <select v-model="createForm.role" class="input-field">
                <option value="ROLE_USER">User</option>
                <option value="ROLE_ADMIN">Admin</option>
              </select>
            </div>
            <div class="sm:col-span-2 flex items-center gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="createForm.enabled" class="rounded" />
                <span class="text-xs font-body text-white/70">Account Enabled</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="createForm.emailVerified" class="rounded" />
                <span class="text-xs font-body text-white/70">Email Verified</span>
              </label>
            </div>
          </div>

          <div v-if="createError" class="text-xs text-neon-red font-body px-3 py-2 bg-red-700/10 border border-neon-red/30 rounded">
            {{ createError }}
          </div>

          <div class="flex gap-3 pt-2">
            <button type="submit" :disabled="creating"
              class="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <svg v-if="creating" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {{ creating ? 'Creating...' : 'Create User' }}
            </button>
            <button type="button" @click="showCreateModal = false" class="btn-ghost">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- ── EDIT USER MODAL ───────────────────────────────── -->
    <div v-if="showEditModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      @click.self="showEditModal = false">
      <div class="glass-panel neon-border-red p-8 w-full max-w-lg relative my-4">
        <button @click="showEditModal = false" class="absolute top-4 right-4 text-white/40 hover:text-white text-xl">✕</button>
        <h2 class="section-title mb-1">Edit User</h2>
        <p class="text-xs font-mono text-white/40 mb-6">@{{ editForm.username }}</p>

        <form @submit.prevent="handleEdit" class="space-y-4">
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="label-text">Full Name</label>
              <input v-model="editForm.fullName" type="text" class="input-field" />
            </div>
            <div>
              <label class="label-text">Gender</label>
              <select v-model="editForm.gender" class="input-field">
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label class="label-text">Registration Number</label>
              <input v-model="editForm.registrationNumber" type="text" class="input-field" placeholder="REG-XXXX" />
            </div>
            <div>
              <label class="label-text">Roll Number</label>
              <input v-model="editForm.rollNumber" type="text" class="input-field" placeholder="ROLL-XXXX" />
            </div>
            <div class="sm:col-span-2">
              <label class="label-text">University</label>
              <input v-model="editForm.university" type="text" class="input-field" />
            </div>
            <div class="sm:col-span-2">
              <label class="label-text">Hobby</label>
              <input v-model="editForm.hobby" type="text" class="input-field" />
            </div>
            <div class="sm:col-span-2">
              <label class="label-text">Bio</label>
              <textarea v-model="editForm.bio" class="input-field resize-none" rows="2"></textarea>
            </div>
            <div>
              <label class="label-text">Role</label>
              <select v-model="editForm.role" class="input-field">
                <option value="ROLE_USER">User</option>
                <option value="ROLE_ADMIN">Admin</option>
              </select>
            </div>
            <div class="flex flex-col gap-2 justify-center">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="editForm.enabled" class="rounded" />
                <span class="text-xs font-body text-white/70">Account Enabled</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="editForm.emailVerified" class="rounded" />
                <span class="text-xs font-body text-white/70">Email Verified</span>
              </label>
            </div>
          </div>

          <div v-if="editError" class="text-xs text-neon-red font-body px-3 py-2 bg-red-700/10 border border-neon-red/30 rounded">
            {{ editError }}
          </div>

          <div class="flex gap-3 pt-2">
            <button type="submit" :disabled="editing"
              class="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <svg v-if="editing" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {{ editing ? 'Saving...' : 'Save Changes' }}
            </button>
            <button type="button" @click="showEditModal = false" class="btn-ghost">Cancel</button>
          </div>
        </form>
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
import { ref, computed, onMounted } from 'vue'
import api from '@/utils/api'
import { BACKEND_URL } from '@/config'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

// ── State ────────────────────────────────────────────────────
const users       = ref([])
const loading     = ref(true)
const search      = ref('')

// Create modal
const showCreateModal = ref(false)
const creating        = ref(false)
const createError     = ref('')
const createForm      = ref(defaultCreateForm())

// Edit modal
const showEditModal = ref(false)
const editing       = ref(false)
const editError     = ref('')
const editingId     = ref(null)
const editForm      = ref({})

// Delete modal
const deleteTarget = ref(null)
const deleting     = ref(false)

// ── Helpers ──────────────────────────────────────────────────
function defaultCreateForm() {
  return { fullName: '', username: '', email: '', password: '', role: 'ROLE_USER', enabled: true, emailVerified: true }
}

// Converts "/uploads/profiles/x.jpg" → full URL with backend host
function toFullUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return BACKEND_URL + path
}

// ── Computed ─────────────────────────────────────────────────
const filteredUsers = computed(() => {
  if (!search.value.trim()) return users.value
  const q = search.value.toLowerCase()
  return users.value.filter(u =>
    u.fullName?.toLowerCase().includes(q) ||
    u.username?.toLowerCase().includes(q) ||
    u.email?.toLowerCase().includes(q)
  )
})

// ── Load users ───────────────────────────────────────────────
async function loadUsers() {
  const res = await api.get('/users')
  users.value = res.data   // res = { success, message, data: [...] }
}

onMounted(async () => {
  try { await loadUsers() } catch (e) { console.error(e) }
  finally { loading.value = false }
})

// ── Create ───────────────────────────────────────────────────
function openCreate() {
  createForm.value = defaultCreateForm()
  createError.value = ''
  showCreateModal.value = true
}

async function handleCreate() {
  createError.value = ''
  creating.value    = true
  try {
    await api.post('/users', {
      fullName:      createForm.value.fullName,
      username:      createForm.value.username,
      email:         createForm.value.email,
      password:      createForm.value.password,
      roles:         [createForm.value.role],
      enabled:       createForm.value.enabled,
      emailVerified: createForm.value.emailVerified,
    })
    showCreateModal.value = false
    await loadUsers()
  } catch (e) {
    createError.value = e.message || 'Failed to create user'
  } finally {
    creating.value = false
  }
}

// ── Edit ─────────────────────────────────────────────────────
function openEdit(u) {
  editingId.value = u.id
  editForm.value  = {
    username:           u.username,
    fullName:           u.fullName           || '',
    gender:             u.gender             || '',
    registrationNumber: u.registrationNumber || '',
    rollNumber:         u.rollNumber         || '',
    university:         u.university         || '',
    hobby:              u.hobby              || '',
    bio:                u.bio                || '',
    role:               u.roles?.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_USER',
    enabled:            u.enabled,
    emailVerified:      u.emailVerified,
  }
  editError.value    = ''
  showEditModal.value = true
}

async function handleEdit() {
  editError.value = ''
  editing.value   = true
  try {
    await api.put(`/users/${editingId.value}`, {
      fullName:           editForm.value.fullName           || null,
      gender:             editForm.value.gender             || null,
      registrationNumber: editForm.value.registrationNumber || null,
      rollNumber:         editForm.value.rollNumber         || null,
      university:         editForm.value.university         || null,
      hobby:              editForm.value.hobby              || null,
      bio:                editForm.value.bio                || null,
      roles:              [editForm.value.role],
      enabled:            editForm.value.enabled,
      emailVerified:      editForm.value.emailVerified,
    })
    showEditModal.value = false
    await loadUsers()
  } catch (e) {
    editError.value = e.message || 'Failed to update user'
  } finally {
    editing.value = false
  }
}

// ── Delete ───────────────────────────────────────────────────
function confirmDelete(u) { deleteTarget.value = u }

async function doDelete() {
  deleting.value = true
  try {
    await api.delete(`/users/${deleteTarget.value.id}`)
    deleteTarget.value = null
    await loadUsers()
  } catch (e) {
    console.error('Delete failed:', e.message)
  } finally {
    deleting.value = false
  }
}
</script>