<template>
  <div class="min-h-screen pt-20 px-4 pb-12">
    <div class="max-w-7xl mx-auto">
      <div class="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <div class="w-4 h-px bg-neon-red"></div>
            <span class="text-xs font-display tracking-widest text-neon-red uppercase">Admin</span>
          </div>
          <h1 class="font-display text-2xl font-black text-white uppercase tracking-wider">Manage Contests</h1>
        </div>
        <button @click="openCreate" class="btn-primary">+ New Contest</button>
      </div>

      <!-- Table -->
      <div class="glass-card p-6">
        <div v-if="loading" class="flex justify-center py-12"><LoadingSpinner /></div>
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-white/5">
                <th class="pb-3 text-left text-xs font-display tracking-wider text-white/40 uppercase">Name</th>
                <th class="pb-3 text-center text-xs font-display tracking-wider text-white/40 uppercase hidden sm:table-cell">Status</th>
                <th class="pb-3 text-center text-xs font-display tracking-wider text-white/40 uppercase hidden lg:table-cell">Contest Date</th>
                <th class="pb-3 text-center text-xs font-display tracking-wider text-white/40 uppercase hidden md:table-cell">Registered</th>
                <th class="pb-3 text-right text-xs font-display tracking-wider text-white/40 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr v-for="c in contests" :key="c.id" class="hover:bg-white/3 transition-colors">
                <td class="py-3 pr-4 max-w-xs">
                  <p class="font-display text-sm text-white font-semibold truncate">{{ c.name }}</p>
                </td>
                <td class="py-3 text-center hidden sm:table-cell"><StatusBadge :status="c.status" size="xs" /></td>
                <td class="py-3 text-center hidden lg:table-cell text-xs font-mono text-white/40">{{ formatDate(c.contestDate) }}</td>
                <td class="py-3 text-center hidden md:table-cell text-xs font-mono text-white/50">{{ c.registrationCount }}</td>
                <td class="py-3">
                  <div class="flex items-center justify-end gap-2">
                    <router-link :to="`/admin/contests/${c.id}/questions`"
                      class="text-xs font-display text-neon-blue border border-neon-blue/30 px-2 py-1 rounded hover:bg-neon-blue/10 transition-colors">
                      Questions
                    </router-link>
                    <button @click="openEdit(c)"
                      class="text-xs font-display text-white/60 border border-white/10 px-2 py-1 rounded hover:bg-white/5 hover:text-white transition-colors">
                      Edit
                    </button>
                    <button @click="confirmDelete(c)"
                      class="text-xs font-display text-neon-red border border-neon-red/30 px-2 py-1 rounded hover:bg-neon-red/10 transition-colors">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" @click.self="showModal = false">
      <div class="glass-panel neon-border-red p-8 w-full max-w-lg relative">
        <button @click="showModal = false" class="absolute top-4 right-4 text-white/40 hover:text-white text-xl">✕</button>
        <h2 class="section-title mb-6">{{ editingId ? 'Edit Contest' : 'Create Contest' }}</h2>

        <form @submit.prevent="handleSave" class="space-y-4">
          <div>
            <label class="label-text">Contest Name *</label>
            <input v-model="form.name" type="text" class="input-field" required />
          </div>
          <div>
            <label class="label-text">Description</label>
            <textarea v-model="form.description" class="input-field resize-none" rows="3"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label-text">Contest Date *</label>
              <input v-model="form.contestDate" type="datetime-local" class="input-field" required />
            </div>
            <div>
              <label class="label-text">Contest End *</label>
              <input v-model="form.contestEnd" type="datetime-local" class="input-field" required />
            </div>
            <div>
              <label class="label-text">Reg Open *</label>
              <input v-model="form.registrationStart" type="datetime-local" class="input-field" required />
            </div>
            <div>
              <label class="label-text">Reg Close *</label>
              <input v-model="form.registrationEnd" type="datetime-local" class="input-field" required />
            </div>
            <div>
              <label class="label-text">Contest Start *</label>
              <input v-model="form.contestStart" type="datetime-local" class="input-field" required />
            </div>
          </div>
          <div v-if="formError" class="text-neon-red text-xs font-body">{{ formError }}</div>
          <div class="flex gap-3 pt-2">
            <button type="submit" :disabled="saving" class="btn-primary flex items-center gap-2">
              <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {{ saving ? 'Saving...' : (editingId ? 'Update' : 'Create') }}
            </button>
            <button type="button" @click="showModal = false" class="btn-ghost">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" @click.self="deleteTarget = null">
      <div class="glass-panel neon-border-red p-8 w-full max-w-sm text-center">
        <div class="text-4xl mb-3">⚠️</div>
        <h3 class="font-display text-xl font-bold text-white mb-2">Delete Contest?</h3>
        <p class="text-white/60 font-body text-sm mb-6">This will permanently delete <strong class="text-white">{{ deleteTarget.name }}</strong> and all associated data.</p>
        <div class="flex gap-3 justify-center">
          <button @click="doDelete" :disabled="deleting" class="btn-primary flex items-center gap-2">
            <svg v-if="deleting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Delete
          </button>
          <button @click="deleteTarget = null" class="btn-ghost">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useContestStore } from '@/stores/contest'
import StatusBadge from '@/components/common/StatusBadge.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { format } from 'date-fns'

const contestStore = useContestStore()
const contests = ref([])
const loading = ref(true)
const showModal = ref(false)
const editingId = ref(null)
const saving = ref(false)
const formError = ref('')
const deleteTarget = ref(null)
const deleting = ref(false)

const defaultForm = () => ({ name: '', description: '', contestDate: '', registrationStart: '', registrationEnd: '', contestStart: '', contestEnd: '' })
const form = ref(defaultForm())

function toLocalDatetime(d) {
  if (!d) return ''
  try { return format(new Date(d), "yyyy-MM-dd'T'HH:mm") } catch { return d }
}

function formatDate(d) {
  if (!d) return 'TBD'
  try { return format(new Date(d), 'MMM dd, yyyy') } catch { return d }
}

function openCreate() {
  form.value = defaultForm(); editingId.value = null; formError.value = ''; showModal.value = true
}

function openEdit(c) {
  editingId.value = c.id
  form.value = {
    name: c.name, description: c.description || '',
    contestDate: toLocalDatetime(c.contestDate), registrationStart: toLocalDatetime(c.registrationStart),
    registrationEnd: toLocalDatetime(c.registrationEnd), contestStart: toLocalDatetime(c.contestStart),
    contestEnd: toLocalDatetime(c.contestEnd)
  }
  formError.value = ''; showModal.value = true
}

async function handleSave() {
  saving.value = true; formError.value = ''
  try {
    const payload = { ...form.value }
    if (editingId.value) {
      await contestStore.updateContest(editingId.value, payload)
    } else {
      await contestStore.createContest(payload)
    }
    showModal.value = false
    await loadContests()
  } catch (e) {
    formError.value = e.response?.data?.message || 'Failed to save contest'
  } finally { saving.value = false }
}

function confirmDelete(c) { deleteTarget.value = c }

async function doDelete() {
  deleting.value = true
  try {
    await contestStore.deleteContest(deleteTarget.value.id)
    deleteTarget.value = null
    await loadContests()
  } catch (e) { console.error(e) }
  finally { deleting.value = false }
}

async function loadContests() {
  await contestStore.fetchAllContests()
  contests.value = contestStore.contests
}

onMounted(async () => {
  try { await loadContests() } finally { loading.value = false }
})
</script>
