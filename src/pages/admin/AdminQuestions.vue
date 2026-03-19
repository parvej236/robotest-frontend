<!-- src/pages/admin/AdminQuestions.vue -->
<template>
  <div class="min-h-screen pt-20 px-4 pb-12">
    <div class="max-w-5xl mx-auto">

      <!-- Header -->
      <div class="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <router-link to="/admin/contests"
            class="inline-flex items-center gap-1 text-xs font-display text-white/40 hover:text-white transition-colors tracking-wider mb-2">
            ← Back to Contests
          </router-link>
          <div class="flex items-center gap-2 mb-1">
            <div class="w-4 h-px bg-red-700"></div>
            <span class="text-xs font-display tracking-widest text-neon-red uppercase">Admin · Questions</span>
          </div>
          <h1 class="font-display text-xl font-black text-white uppercase tracking-wider line-clamp-1">
            {{ contestName || 'Loading...' }}
          </h1>
        </div>
        <button @click="openAdd" class="btn-primary text-xs py-2">+ Add Question</button>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <LoadingSpinner label="Loading questions..." />
      </div>

      <div v-else-if="questions.length === 0" class="glass-card p-16 text-center neon-border-red">
        <div class="text-5xl mb-4">📋</div>
        <p class="text-white/40 font-body mb-4">No questions added yet</p>
        <button @click="openAdd" class="btn-primary">Add First Question</button>
      </div>

      <!-- Questions list -->
      <div v-else class="space-y-4">
        <div v-for="(q, idx) in questions" :key="q.id"
             class="glass-card overflow-hidden group hover:border-neon-red/20 transition-all duration-300">

          <!-- Top bar -->
          <div class="flex items-center gap-3 px-5 py-3 border-b border-white/5 bg-dark-800/40">
            <div class="w-8 h-8 rounded bg-red-700/10 border border-neon-red/30 flex items-center justify-center flex-shrink-0">
              <span class="font-display text-sm font-black text-neon-red">{{ idx + 1 }}</span>
            </div>
            <div class="flex items-center gap-2 flex-wrap flex-1">
              <span class="text-[10px] font-display border border-neon-blue/30 text-neon-blue px-2 py-0.5 rounded tracking-widest">
                NUMERIC · WEIGHT
              </span>
              <span class="text-[10px] font-mono text-white/30">{{ q.points || 10 }} pts</span>
              <span class="text-[10px] font-mono text-white/30">Order: {{ q.orderIndex || idx + 1 }}</span>
            </div>
            <!-- Edit/Delete always visible on mobile, hover on desktop -->
            <div class="flex gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <button @click="openEdit(q)"
                class="text-xs font-display text-neon-blue border border-neon-blue/30 px-2 py-1 rounded hover:bg-neon-blue/10 transition-colors">
                Edit
              </button>
              <button @click="confirmDelete(q)"
                class="text-xs font-display text-neon-red border border-neon-red/30 px-2 py-1 rounded hover:bg-red-700/10 transition-colors">
                Delete
              </button>
            </div>
          </div>

          <!-- Body -->
          <div class="p-5 flex gap-5 flex-col sm:flex-row">
            <!-- Image -->
            <div v-if="q.imageUrl"
                 class="w-full sm:w-48 flex-shrink-0 rounded overflow-hidden border border-white/10 bg-dark-800">
              <img :src="toFullUrl(q.imageUrl)" class="w-full h-40 sm:h-36 object-contain" alt="Question image" />
            </div>
            <div v-else
                 class="w-full sm:w-48 flex-shrink-0 rounded border border-dashed border-white/10 bg-dark-800/40 flex items-center justify-center h-24 sm:h-36">
              <span class="text-white/20 text-xs font-body">No image</span>
            </div>

            <!-- Details -->
            <div class="flex-1 min-w-0">
              <p class="font-body text-white/80 text-sm leading-relaxed mb-4">
                {{ q.description || 'No description' }}
              </p>
              <div class="flex flex-wrap gap-3">
                <div class="bg-dark-800/60 rounded px-3 py-2 border border-neon-blue/20">
                  <p class="text-[9px] font-display tracking-widest text-white/30 uppercase mb-0.5">Correct Weight</p>
                  <p class="font-display font-black text-neon-blue text-sm">
                    {{ q.correctAnswer != null ? q.correctAnswer + ' g' : '—' }}
                  </p>
                </div>
                <div class="bg-dark-800/60 rounded px-3 py-2 border border-neon-red/20">
                  <p class="text-[9px] font-display tracking-widest text-white/30 uppercase mb-0.5">Tolerance</p>
                  <p class="font-display font-black text-neon-red text-sm">
                    ± {{ q.errorPercentage != null ? q.errorPercentage + '%' : '0%' }}
                  </p>
                </div>
                <div class="bg-dark-800/60 rounded px-3 py-2 border border-white/10">
                  <p class="text-[9px] font-display tracking-widest text-white/30 uppercase mb-0.5">Acceptable Range</p>
                  <p class="font-mono text-white/60 text-xs">
                    <span v-if="q.correctAnswer != null">
                      {{ acceptableMin(q) }}g – {{ acceptableMax(q) }}g
                    </span>
                    <span v-else>—</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ADD / EDIT MODAL -->
    <div v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      @click.self="showModal = false">
      <div class="glass-panel neon-border-red p-8 w-full max-w-xl relative my-4">
        <button @click="showModal = false" class="absolute top-4 right-4 text-white/40 hover:text-white text-xl">✕</button>
        <h2 class="section-title mb-6">{{ editingId ? 'Edit Question' : 'Add Question' }}</h2>

        <form @submit.prevent="handleSave" class="space-y-5">

          <!-- Description -->
          <div>
            <label class="label-text">Question Description *</label>
            <textarea v-model="qForm.description" class="input-field resize-none" rows="4"
              placeholder="Describe the question — what should the robot weigh, what task to perform, etc."
              required></textarea>
          </div>

          <!-- Image upload -->
          <div>
            <label class="label-text">Question Image (optional)</label>
            <div class="flex items-start gap-4">
              <div class="flex-1">
                <label class="flex items-center gap-3 glass-card p-4 cursor-pointer hover:border-neon-red/30 transition-colors border-dashed">
                  <svg class="w-8 h-8 text-white/20 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <div>
                    <p class="text-xs font-body text-white/60">
                      {{ imageFile ? imageFile.name : 'Click to upload image' }}
                    </p>
                    <p class="text-[10px] text-white/30 mt-0.5">JPEG, PNG, WebP — max 5 MB</p>
                  </div>
                  <input type="file" accept="image/jpeg,image/png,image/webp" class="hidden" @change="handleImageChange" />
                </label>
              </div>
              <div v-if="imagePreview || (editingId && qForm.existingImageUrl)"
                   class="w-24 h-24 rounded border border-white/10 overflow-hidden bg-dark-800 flex-shrink-0">
                <img :src="imagePreview || toFullUrl(qForm.existingImageUrl)"
                     class="w-full h-full object-contain" alt="Preview" />
              </div>
            </div>
          </div>

          <!-- Weight + Tolerance -->
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="label-text">Correct Weight (grams) *</label>
              <div class="relative">
                <input v-model.number="qForm.correctAnswer" type="number" step="0.01" min="0"
                  class="input-field pr-8" placeholder="e.g. 250.00" required />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/30 font-mono">g</span>
              </div>
              <p class="text-[10px] text-white/30 mt-1 font-body">Weight in grams the robot must achieve</p>
            </div>
            <div>
              <label class="label-text">Tolerance (%)</label>
              <div class="relative">
                <input v-model.number="qForm.errorPercentage" type="number" step="0.1" min="0" max="100"
                  class="input-field pr-8" placeholder="e.g. 5" />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/30 font-mono">%</span>
              </div>
              <p class="text-[10px] text-white/30 mt-1 font-body">
                ± {{ qForm.errorPercentage || 0 }}% of correct weight accepted
              </p>
            </div>
          </div>

          <!-- Live range preview -->
          <div v-if="qForm.correctAnswer > 0"
               class="glass-card p-4 border border-neon-blue/20 bg-neon-blue/5">
            <p class="text-xs font-display tracking-widest text-neon-blue uppercase mb-2">Acceptable Range Preview</p>
            <div class="flex items-center gap-3">
              <div class="text-center">
                <p class="font-mono text-white/50 text-xs">Min</p>
                <p class="font-display font-black text-white text-base">{{ liveMin }}g</p>
              </div>
              <div class="flex-1 h-1 bg-dark-800 rounded-full relative">
                <div class="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-neon-red/40 via-neon-blue to-neon-red/40 rounded-full"></div>
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-neon-blue shadow"></div>
              </div>
              <div class="text-center">
                <p class="font-mono text-white/50 text-xs">Max</p>
                <p class="font-display font-black text-white text-base">{{ liveMax }}g</p>
              </div>
            </div>
            <p class="text-center text-[10px] text-white/30 mt-2 font-mono">
              Target: {{ qForm.correctAnswer }}g ± {{ qForm.errorPercentage || 0 }}%
            </p>
          </div>

          <!-- Order + Points -->
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="label-text">Order Index</label>
              <input v-model.number="qForm.orderIndex" type="number" min="1" class="input-field"
                placeholder="Question order (1, 2, 3...)" />
            </div>
            <div>
              <label class="label-text">Points *</label>
              <input v-model.number="qForm.points" type="number" min="1" class="input-field"
                placeholder="e.g. 10" required />
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
              {{ saving ? 'Saving...' : (editingId ? 'Update Question' : 'Add Question') }}
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
        <h3 class="font-display text-xl font-bold text-white mb-2">Delete Question?</h3>
        <p class="text-white/60 font-body text-sm mb-6">
          Question #{{ questions.indexOf(deleteTarget) + 1 }} will be permanently deleted.
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
import { useRoute } from 'vue-router'
import { BACKEND_URL } from '@/config'
import api from '@/utils/api'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const route     = useRoute()
const contestId = route.params.id

const contestName  = ref('')
const questions    = ref([])
const loading      = ref(true)
const showModal    = ref(false)
const editingId    = ref(null)
const saving       = ref(false)
const formError    = ref('')
const deleteTarget = ref(null)
const deleting     = ref(false)
const imageFile    = ref(null)
const imagePreview = ref(null)

const defaultQ = () => ({
  description: '', correctAnswer: null, errorPercentage: 5,
  orderIndex: null, points: 10, existingImageUrl: null,
})
const qForm = ref(defaultQ())

function toFullUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return BACKEND_URL + path
}

function acceptableMin(q) {
  if (q.correctAnswer == null) return '—'
  return (q.correctAnswer * (1 - (q.errorPercentage || 0) / 100)).toFixed(2)
}
function acceptableMax(q) {
  if (q.correctAnswer == null) return '—'
  return (q.correctAnswer * (1 + (q.errorPercentage || 0) / 100)).toFixed(2)
}

const liveMin = computed(() => {
  if (!qForm.value.correctAnswer) return '—'
  return (qForm.value.correctAnswer * (1 - (qForm.value.errorPercentage || 0) / 100)).toFixed(2)
})
const liveMax = computed(() => {
  if (!qForm.value.correctAnswer) return '—'
  return (qForm.value.correctAnswer * (1 + (qForm.value.errorPercentage || 0) / 100)).toFixed(2)
})

// FIX: api.get returns { success, message, data: ContestDto }
// so res.data = ContestDto → res.data.name = contest name ✓
async function loadContest() {
  const res = await api.get(`/contests/${contestId}`)
  contestName.value = res.data?.name || ''
}

// FIX: api.get returns { success, message, data: QuestionDto[] }
// so res.data = the array ✓
async function loadQuestions() {
  const res = await api.get(`/questions/contest/${contestId}/admin`)
  questions.value = res.data || []
}

onMounted(async () => {
  try { await Promise.all([loadContest(), loadQuestions()]) }
  catch (e) { console.error('Failed to load:', e.message) }
  finally { loading.value = false }
})

function handleImageChange(e) {
  const file = e.target.files[0]
  if (!file) return
  imageFile.value    = file
  imagePreview.value = URL.createObjectURL(file)
  e.target.value     = ''
}

function openAdd() {
  qForm.value = defaultQ()
  qForm.value.orderIndex = questions.value.length + 1
  editingId.value = null
  imageFile.value = null; imagePreview.value = null; formError.value = ''
  showModal.value = true
}

function openEdit(q) {
  editingId.value = q.id
  qForm.value = {
    description:      q.description      || '',
    correctAnswer:    q.correctAnswer,
    errorPercentage:  q.errorPercentage  ?? 5,
    orderIndex:       q.orderIndex,
    points:           q.points           || 10,
    existingImageUrl: q.imageUrl         || null,
  }
  imageFile.value = null; imagePreview.value = null; formError.value = ''
  showModal.value = true
}

// FIX: raw fetch for multipart — never set Content-Type with FormData
async function handleSave() {
  saving.value = true; formError.value = ''
  try {
    const fd = new FormData()
    fd.append('question', new Blob([JSON.stringify({
      description:     qForm.value.description,
      type:            'NUMERIC_MCQ',
      correctAnswer:   qForm.value.correctAnswer,
      errorPercentage: qForm.value.errorPercentage ?? 0,
      orderIndex:      qForm.value.orderIndex || (questions.value.length + 1),
      points:          qForm.value.points || 10,
    })], { type: 'application/json' }))

    if (imageFile.value) fd.append('image', imageFile.value)

    const token    = localStorage.getItem('accessToken')
    const url      = editingId.value
      ? `${BACKEND_URL}/api/questions/${editingId.value}`
      : `${BACKEND_URL}/api/questions/contest/${contestId}`
    const method   = editingId.value ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method, body: fd,
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data?.message || 'Failed to save question')

    showModal.value = false
    if (imagePreview.value) URL.revokeObjectURL(imagePreview.value)
    imageFile.value = null; imagePreview.value = null
    await loadQuestions()
  } catch (e) {
    formError.value = e.message || 'Failed to save question'
  } finally {
    saving.value = false
  }
}

function confirmDelete(q) { deleteTarget.value = q }

async function doDelete() {
  deleting.value = true
  try {
    await api.delete(`/questions/${deleteTarget.value.id}`)
    deleteTarget.value = null
    await loadQuestions()
  } catch (e) { console.error(e) }
  finally { deleting.value = false }
}
</script>