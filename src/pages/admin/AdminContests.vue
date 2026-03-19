<!-- src/pages/admin/AdminContests.vue -->
<template>
  <div class="min-h-screen pt-20 px-4 pb-12">
    <div class="max-w-7xl mx-auto">

      <!-- Header -->
      <div class="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <div class="w-4 h-px bg-red-700"></div>
            <span class="text-xs font-display tracking-widest text-neon-red uppercase">Admin</span>
          </div>
          <h1 class="font-display text-2xl font-black text-white uppercase tracking-wider">Manage Contests</h1>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center bg-dark-700/60 border border-white/10 rounded overflow-hidden">
            <button @click="viewMode = 'grid'"
              :class="['px-3 py-1.5 text-xs font-display tracking-wider transition-colors',
                       viewMode === 'grid' ? 'bg-red-700 text-white' : 'text-white/40 hover:text-white']">
              ▦ Grid
            </button>
            <button @click="viewMode = 'list'"
              :class="['px-3 py-1.5 text-xs font-display tracking-wider transition-colors',
                       viewMode === 'list' ? 'bg-red-700 text-white' : 'text-white/40 hover:text-white']">
              ☰ List
            </button>
          </div>
          <button @click="openCreate" class="btn-primary text-xs py-2">+ New Contest</button>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <LoadingSpinner label="Loading contests..." />
      </div>

      <div v-else-if="contests.length === 0" class="glass-card p-16 text-center">
        <div class="text-5xl mb-4">🏆</div>
        <p class="text-white/40 font-body mb-4">No contests yet</p>
        <button @click="openCreate" class="btn-primary">Create First Contest</button>
      </div>

      <!-- GRID VIEW -->
      <div v-else-if="viewMode === 'grid'" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="c in contests" :key="c.id"
             class="glass-card relative overflow-hidden group hover:border-neon-red/30 transition-all duration-300">
          <div class="h-1 w-full" :style="`background: ${statusColor(c.status)}`"></div>
          <div class="p-5">
            <div class="flex items-center justify-between mb-3">
              <StatusBadge :status="c.status" />
              <span class="text-xs font-mono text-white/30">{{ formatDate(c.contestDate) }}</span>
            </div>
            <h3 class="font-display font-black text-white text-base leading-tight mb-2 line-clamp-2 group-hover:text-neon-red transition-colors">
              {{ c.name }}
            </h3>
            <p v-if="c.description" class="text-xs text-white/40 font-body line-clamp-2 mb-4 leading-relaxed">{{ c.description }}</p>
            <div class="grid grid-cols-2 gap-2 mb-4">
              <div class="bg-dark-800/60 rounded p-2 text-center">
                <p class="text-neon-red font-display font-black text-lg">{{ c.registrationCount || 0 }}</p>
                <p class="text-[9px] text-white/30 font-display tracking-wider uppercase">Registered</p>
              </div>
              <div class="bg-dark-800/60 rounded p-2 text-center">
                <p class="text-neon-blue font-display font-black text-lg">{{ c.questionCount ?? '—' }}</p>
                <p class="text-[9px] text-white/30 font-display tracking-wider uppercase">Questions</p>
              </div>
            </div>
            <div class="space-y-1 mb-4">
              <div class="flex items-center justify-between text-[10px] font-mono">
                <span class="text-white/30">Reg Open</span>
                <span class="text-white/50">{{ formatShort(c.registrationStart) }}</span>
              </div>
              <div class="flex items-center justify-between text-[10px] font-mono">
                <span class="text-white/30">Contest Start</span>
                <span class="text-white/50">{{ formatShort(c.contestStart) }}</span>
              </div>
              <div class="flex items-center justify-between text-[10px] font-mono">
                <span class="text-white/30">Ends</span>
                <span class="text-white/50">{{ formatShort(c.contestEnd) }}</span>
              </div>
            </div>
            <div class="flex gap-2">
              <router-link :to="`/admin/contests/${c.id}/questions`"
                class="flex-1 text-center text-xs font-display text-neon-blue border border-neon-blue/30 px-2 py-1.5 rounded hover:bg-neon-blue/10 transition-colors">
                Questions
              </router-link>
              <button @click="openEdit(c)"
                class="flex-1 text-xs font-display text-white/60 border border-white/10 px-2 py-1.5 rounded hover:bg-white/5 hover:text-white transition-colors">
                Edit
              </button>
              <button @click="confirmDelete(c)"
                class="text-xs font-display text-neon-red border border-neon-red/30 px-2 py-1.5 rounded hover:bg-red-700/10 transition-colors">
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- LIST VIEW -->
      <div v-else class="glass-card p-6 overflow-x-auto">
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
                <p v-if="c.description" class="text-xs text-white/30 font-body truncate mt-0.5">{{ c.description }}</p>
              </td>
              <td class="py-3 text-center hidden sm:table-cell"><StatusBadge :status="c.status" size="xs" /></td>
              <td class="py-3 text-center hidden lg:table-cell text-xs font-mono text-white/40">{{ formatDate(c.contestDate) }}</td>
              <td class="py-3 text-center hidden md:table-cell text-xs font-mono text-white/50">{{ c.registrationCount || 0 }}</td>
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
                    class="text-xs font-display text-neon-red border border-neon-red/30 px-2 py-1 rounded hover:bg-red-700/10 transition-colors">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── CREATE / EDIT MODAL ───────────────────────────────── -->
    <div v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
      @click.self="showModal = false">
      <div class="glass-panel neon-border-red p-8 w-full max-w-xl relative my-4">
        <button @click="showModal = false"
          class="absolute top-4 right-4 text-white/40 hover:text-white text-xl">✕</button>
        <h2 class="section-title mb-6">{{ editingId ? 'Edit Contest' : 'Create Contest' }}</h2>

        <form @submit.prevent="handleSave" class="space-y-6">
          <div>
            <label class="label-text">Contest Name *</label>
            <input v-model="form.name" type="text" class="input-field" required
              placeholder="e.g. RoboContest Week-1" />
          </div>
          <div>
            <label class="label-text">Description</label>
            <textarea v-model="form.description" class="input-field resize-none" rows="2"
              placeholder="Brief description..."></textarea>
          </div>

          <!-- ── Registration Window ────────────────────────── -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <div class="w-3 h-3 rounded-full bg-neon-blue/40 border border-neon-blue/60"></div>
              <span class="text-xs font-display tracking-widest text-neon-blue uppercase">Registration Window</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="label-text">Opens On *</label>
                <input v-model="form.registrationStartDate" type="date" class="dt-input" required />
                <input v-model="form.registrationStartTime" type="time" class="dt-input mt-2" required />
              </div>
              <div>
                <label class="label-text">Closes On *</label>
                <input v-model="form.registrationEndDate" type="date" class="dt-input" required />
                <input v-model="form.registrationEndTime" type="time" class="dt-input mt-2" required />
              </div>
            </div>
          </div>

          <!-- ── Contest Window ─────────────────────────────── -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <div class="w-3 h-3 rounded-full bg-neon-red/40 border border-neon-red/60"></div>
              <span class="text-xs font-display tracking-widest text-neon-red uppercase">Contest Window</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="label-text">Starts On *</label>
                <input v-model="form.contestStartDate" type="date" class="dt-input" required />
                <input v-model="form.contestStartTime" type="time" class="dt-input mt-2" required />
              </div>
              <div>
                <label class="label-text">Ends On *</label>
                <input v-model="form.contestEndDate" type="date" class="dt-input" required />
                <input v-model="form.contestEndTime" type="time" class="dt-input mt-2" required />
              </div>
            </div>
          </div>

          <!-- Schedule preview -->
          <div v-if="formPreviewReady"
               class="bg-dark-800/60 border border-white/5 rounded-lg p-3 space-y-1.5">
            <div class="text-[9px] text-white/30 uppercase tracking-wider mb-2 font-display">Schedule Preview</div>
            <div class="flex justify-between text-[11px] font-mono">
              <span class="text-neon-blue/60">Reg opens</span>
              <span class="text-white/70">{{ previewFmt(form.registrationStartDate, form.registrationStartTime) }}</span>
            </div>
            <div class="flex justify-between text-[11px] font-mono">
              <span class="text-neon-blue/40">Reg closes</span>
              <span class="text-white/70">{{ previewFmt(form.registrationEndDate, form.registrationEndTime) }}</span>
            </div>
            <div class="border-t border-white/5 pt-1.5 flex justify-between text-[11px] font-mono">
              <span class="text-neon-red/60">Contest starts</span>
              <span class="text-white/70">{{ previewFmt(form.contestStartDate, form.contestStartTime) }}</span>
            </div>
            <div class="flex justify-between text-[11px] font-mono">
              <span class="text-neon-red/40">Contest ends</span>
              <span class="text-white/70">{{ previewFmt(form.contestEndDate, form.contestEndTime) }}</span>
            </div>
          </div>

          <div v-if="formError"
            class="text-neon-red text-xs font-body px-3 py-2 bg-red-700/10 border border-neon-red/30 rounded">
            {{ formError }}
          </div>

          <div class="flex gap-3 pt-2">
            <button type="submit" :disabled="saving"
              class="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {{ saving ? 'Saving...' : (editingId ? 'Update Contest' : 'Create Contest') }}
            </button>
            <button type="button" @click="showModal = false" class="btn-ghost">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- DELETE CONFIRM -->
    <div v-if="deleteTarget"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      @click.self="deleteTarget = null">
      <div class="glass-panel neon-border-red p-8 w-full max-w-sm text-center">
        <div class="text-4xl mb-3">⚠️</div>
        <h3 class="font-display text-xl font-bold text-white mb-2">Delete Contest?</h3>
        <p class="text-white/60 font-body text-sm mb-6">
          Permanently delete <strong class="text-white">{{ deleteTarget.name }}</strong>
          and all its questions, registrations and results.
        </p>
        <div class="flex gap-3 justify-center">
          <button @click="doDelete" :disabled="deleting"
            class="btn-primary flex items-center gap-2 disabled:opacity-50">
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

    <!-- ADD QUESTIONS PROMPT -->
    <div v-if="newContestId"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="glass-panel neon-border-blue p-8 w-full max-w-sm text-center">
        <div class="text-5xl mb-4">✅</div>
        <h3 class="font-display text-xl font-bold text-white mb-2">Contest Created!</h3>
        <p class="text-white/60 font-body text-sm mb-6">Would you like to add questions now?</p>
        <div class="flex gap-3 justify-center">
          <router-link :to="`/admin/contests/${newContestId}/questions`"
            @click="newContestId = null" class="btn-primary">Add Questions</router-link>
          <button @click="newContestId = null" class="btn-ghost">Later</button>
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

const contests     = ref([])
const loading      = ref(true)
const viewMode     = ref('grid')
const showModal    = ref(false)
const editingId    = ref(null)
const saving       = ref(false)
const formError    = ref('')
const deleteTarget = ref(null)
const deleting     = ref(false)
const newContestId = ref(null)

const defaultForm = () => ({
  name:                  '',
  description:           '',
  registrationStartDate: '',
  registrationStartTime: '09:00',
  registrationEndDate:   '',
  registrationEndTime:   '23:59',
  contestStartDate:      '',
  contestStartTime:      '10:00',
  contestEndDate:        '',
  contestEndTime:        '18:00',
})
const form = ref(defaultForm())

const formPreviewReady = computed(() =>
  form.value.registrationStartDate && form.value.contestStartDate && form.value.contestEndDate
)

// ── Preview: dd/mm/yyyy HH:mm format ─────────────────────────
function previewFmt(date, time) {
  if (!date || !time) return '—'
  try {
    // date = "yyyy-MM-dd" from input[type=date]
    const [y, m, d] = date.split('-')
    return `${d}/${m}/${y} ${time}`
  } catch { return '—' }
}

// ── CRITICAL FIX: build ISO WITHOUT timezone conversion ───────
//
// WRONG (old):  new Date(`${date}T${time}:00`).toISOString()
//   → Converts local time to UTC then sends UTC.
//   → Jackson receives "04:00Z", strips Z, stores "04:00" (wrong!)
//   → Bangladesh (UTC+6) user enters 10:00, saved as 04:00
//
// CORRECT (new): just concatenate date + time as a plain string
//   → "2026-03-20T10:00:00" — no timezone info
//   → Jackson's LocalDateTime reads exactly "10:00" — saved correctly
//
function toLocalDateTime(date, time) {
  if (!date || !time) return null
  return `${date}T${time}:00`   // "2026-03-20T10:00:00" — no Z, no offset
}

// ── Split: backend returns "2026-03-20T10:00:00" (no Z) ───────
// Do NOT use new Date() here — it would apply timezone and shift the time
function splitDatetime(iso) {
  if (!iso) return { date: '', time: '' }
  try {
    // iso from backend = "2026-03-20T10:00:00" or "2026-03-20T10:00:00.000000"
    const parts = iso.split('T')
    const date  = parts[0]                        // "2026-03-20"
    const time  = (parts[1] || '').slice(0, 5)   // "10:00"
    return { date, time }
  } catch { return { date: '', time: '' } }
}

// ── Display: dd/mm/yyyy ───────────────────────────────────────
function formatDate(iso) {
  if (!iso) return 'TBD'
  try {
    const d = iso.split('T')[0]          // "2026-03-20"
    const [y, m, day] = d.split('-')
    return `${day}/${m}/${y}`            // "20/03/2026"
  } catch { return iso }
}

function formatShort(iso) {
  if (!iso) return '—'
  try {
    const [datePart, timePart] = iso.split('T')
    const [y, m, d] = datePart.split('-')
    const time = (timePart || '').slice(0, 5)   // "10:00"
    return `${d}/${m} ${time}`                  // "20/03 10:00"
  } catch { return iso }
}

function statusColor(s) {
  return { UPCOMING:'#444', REGISTRATION_OPEN:'#00bfff', RUNNING:'#00ff88', FINISHED:'#333' }[s] || '#444'
}

// ── Load ──────────────────────────────────────────────────────
async function loadContests() {
  await contestStore.fetchAllContests()
  contests.value = contestStore.contests
}

onMounted(async () => {
  try { await loadContests() } finally { loading.value = false }
})

function openCreate() {
  form.value = defaultForm(); editingId.value = null; formError.value = ''; showModal.value = true
}

function openEdit(c) {
  editingId.value = c.id
  formError.value = ''
  const rs = splitDatetime(c.registrationStart)
  const re = splitDatetime(c.registrationEnd)
  const cs = splitDatetime(c.contestStart)
  const ce = splitDatetime(c.contestEnd)
  form.value = {
    name:                  c.name,
    description:           c.description || '',
    registrationStartDate: rs.date,
    registrationStartTime: rs.time,
    registrationEndDate:   re.date,
    registrationEndTime:   re.time,
    contestStartDate:      cs.date,
    contestStartTime:      cs.time,
    contestEndDate:        ce.date,
    contestEndTime:        ce.time,
  }
  showModal.value = true
}

async function handleSave() {
  saving.value    = true
  formError.value = ''

  const regStart = toLocalDateTime(form.value.registrationStartDate, form.value.registrationStartTime)
  const regEnd   = toLocalDateTime(form.value.registrationEndDate,   form.value.registrationEndTime)
  const conStart = toLocalDateTime(form.value.contestStartDate,      form.value.contestStartTime)
  const conEnd   = toLocalDateTime(form.value.contestEndDate,        form.value.contestEndTime)

  // Client-side validation (compare string directly — same format, lexicographic = chronological)
  if (regEnd <= regStart) {
    formError.value = 'Registration close must be after registration open'
    saving.value = false; return
  }
  if (conEnd <= conStart) {
    formError.value = 'Contest end must be after contest start'
    saving.value = false; return
  }

  const payload = {
    name:              form.value.name,
    description:       form.value.description || null,
    contestDate:       conStart,   // display date = contest start
    registrationStart: regStart,
    registrationEnd:   regEnd,
    contestStart:      conStart,
    contestEnd:        conEnd,
  }

  try {
    if (editingId.value) {
      await contestStore.updateContest(editingId.value, payload)
      showModal.value = false
    } else {
      const created = await contestStore.createContest(payload)
      showModal.value = false
      newContestId.value = created?.id ?? null
    }
    await loadContests()
  } catch (e) {
    formError.value = e.message || 'Failed to save contest'
  } finally {
    saving.value = false
  }
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
</script>

<style scoped>
.dt-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-family: monospace;
  color: rgba(255, 255, 255, 0.85);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  color-scheme: dark;
}
.dt-input:focus {
  border-color: rgba(255, 0, 51, 0.5);
  box-shadow: 0 0 0 1px rgba(255, 0, 51, 0.15);
}
.dt-input::-webkit-calendar-picker-indicator {
  filter: invert(0.6);
  cursor: pointer;
  opacity: 0.7;
}
.dt-input::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}
</style>