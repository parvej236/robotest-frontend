<!-- src/pages/admin/AdminQuestions.vue -->
<template>
  <div class="relative min-h-screen pt-20 px-4 pb-12 bg-transparent overflow-hidden">
    <div class="relative z-10 max-w-5xl mx-auto">

      <!-- Header -->
      <div class="mb-6 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="min-w-0">
            <router-link to="/admin/contests"
              class="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm font-semibold tracking-[0.25em] text-slate-100 shadow-sm shadow-black/20 transition hover:bg-slate-800 hover:text-white mb-3">
              ← Back to Contests
            </router-link>
            <div class="flex flex-wrap items-center gap-3 mb-3">
              <span class="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-sky-200">
                Admin · Questions
              </span>
              <span class="text-xs text-slate-400">Manage contest question weights and validation</span>
            </div>
            <h1 class="font-display text-3xl font-black text-white leading-tight truncate">
              {{ contestName || 'Loading...' }}
            </h1>
          </div>
          <button @click="openAdd"
            class="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300">
            + Add Question
          </button>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <LoadingSpinner label="Loading questions..." />
      </div>

      <div v-else-if="questions.length === 0" class="rounded-3xl border border-white/10 bg-white/5 p-16 text-center backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
        <div class="text-5xl mb-4">📋</div>
        <p class="text-slate-300 font-medium mb-4">No questions added yet for this contest.</p>
        <button @click="openAdd" class="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400">
          Add First Question
        </button>
      </div>

      <!-- Questions list -->
      <div v-else class="space-y-5">
        <div v-for="(q, idx) in questions" :key="q.id"
             class="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20">

          <div class="px-5 py-4 border-b border-white/10 bg-slate-950/70">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex items-center gap-4 min-w-0">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-200 border border-sky-500/20 font-display font-black text-base">
                  {{ idx + 1 }}
                </div>
                <div class="min-w-0">
                  <p class="text-[11px] uppercase tracking-[0.35em] text-slate-400">Question {{ q.orderIndex || idx + 1 }}</p>
                  <p class="truncate text-xl font-semibold text-white">{{ q.description || 'No description provided.' }}</p>
                </div>
              </div>
              <div class="flex flex-wrap items-center justify-end gap-2">
                <span class="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-300 uppercase tracking-[0.3em]">
                  Numeric · weight
                </span>
                <button @click="openEdit(q)"
                  class="rounded-2xl border border-sky-400/20 bg-sky-400/10 px-3 py-2 text-xs font-semibold text-sky-100 transition hover:bg-sky-400/20">
                  Edit
                </button>
                <button @click="confirmDelete(q)"
                  class="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-xs font-semibold text-rose-100 transition hover:bg-rose-400/20">
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div class="p-5 grid gap-4 lg:grid-cols-[360px_1fr] items-start">
            <div class="space-y-4">
              <div v-if="q.imageUrl" class="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-inner transition duration-300 hover:-translate-y-0.5">
                <a :href="toFullUrl(q.imageUrl)"
                   :download="downloadFileName(q.imageUrl)"
                   target="_blank"
                   rel="noopener"
                   class="absolute right-3 top-3 z-10 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-2 text-[11px] font-semibold text-slate-100 transition hover:bg-black/80">
                  ⤓ Download
                </a>
                <button type="button" @click="openFullImage(q.imageUrl)"
                  class="block w-full overflow-hidden text-left">
                  <img
                    v-if="isLikelyImageUrl(q.imageUrl)"
                    :src="toFullUrl(q.imageUrl)"
                    alt="Question file"
                    class="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div
                    v-else
                    class="h-64 w-full flex items-center justify-center bg-slate-950/60 text-white/70 text-sm font-semibold p-3 text-center"
                  >
                    {{ isLikelyPdfUrl(q.imageUrl) ? 'PDF' : 'FILE' }}
                  </div>
                </button>
              </div>
              <div v-else class="flex min-h-[16rem] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-900/80 text-sm text-slate-500">
                No file uploaded
              </div>
              <div class="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                <p class="text-[11px] uppercase tracking-[0.35em] text-slate-400 mb-3">Summary</p>
                <p class="text-base md:text-lg text-slate-100 leading-8">{{ q.description || 'No description provided.' }}</p>
              </div>
            </div>

            <div class="space-y-4">
              <div class="grid gap-3 sm:grid-cols-2">
                <div class="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                  <p class="text-[10px] uppercase tracking-[0.35em] text-slate-400 mb-2">Correct weight</p>
                  <p class="text-lg font-semibold text-white">{{ q.correctAnswer != null ? q.correctAnswer + ' g' : 'Not set' }}</p>
                </div>
                <div class="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                  <p class="text-[10px] uppercase tracking-[0.35em] text-slate-400 mb-2">Tolerance</p>
                  <p class="text-lg font-semibold text-white">± {{ q.errorPercentage != null ? q.errorPercentage + '%' : '0%' }}</p>
                </div>
              </div>
              <div class="grid gap-3 sm:grid-cols-2">
                <div class="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                  <p class="text-[10px] uppercase tracking-[0.35em] text-slate-400 mb-2">Points</p>
                  <p class="text-lg font-semibold text-white">{{ q.points || 10 }}</p>
                </div>
                <div class="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                  <p class="text-[10px] uppercase tracking-[0.35em] text-slate-400 mb-2">Order index</p>
                  <p class="text-lg font-semibold text-white">{{ q.orderIndex || idx + 1 }}</p>
                </div>
              </div>
              <div class="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                <p class="text-[10px] uppercase tracking-[0.35em] text-slate-400 mb-2">Acceptable range</p>
                <p class="text-base text-slate-200 font-mono">{{ q.correctAnswer != null ? `${acceptableMin(q)}g – ${acceptableMax(q)}g` : 'Not available' }}</p>
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
      <div class="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_36px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
        <button @click="showModal = false" class="absolute top-4 right-4 text-white/50 hover:text-white text-xl">✕</button>
        <h2 class="text-2xl font-black uppercase tracking-[0.2em] text-white mb-6">
          {{ editingId ? 'Edit Question' : 'Add Question' }}
        </h2>

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
            <label class="label-text">Question File (optional)</label>
            <div class="flex items-start gap-4">
              <div class="flex-1">
                <label class="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 cursor-pointer transition hover:border-sky-400/30">
                  <svg class="w-8 h-8 text-slate-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <div>
                    <p class="text-xs font-body text-white/60">
                      {{ imageFile ? imageFile.name : 'Click to upload file' }}
                    </p>
                    <p class="text-[10px] text-white/30 mt-0.5">Any file — max 500 MB</p>
                  </div>
                  <input type="file" accept="*/*" class="hidden" @change="handleImageChange" />
                </label>
              </div>
              <div v-if="imagePreview || (editingId && qForm.existingImageUrl)"
                   class="w-28 h-28 rounded-3xl border border-white/10 overflow-hidden bg-slate-900 flex-shrink-0">
                <img
                  v-if="imagePreviewIsImage || (editingId && isLikelyImageUrl(qForm.existingImageUrl))"
                  :src="imagePreview || toFullUrl(qForm.existingImageUrl)"
                  class="w-full h-full object-cover" alt="Preview"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center text-white/70 text-xs font-semibold p-2 text-center"
                >
                  {{ imagePreviewIsPdf || (editingId && isLikelyPdfUrl(qForm.existingImageUrl)) ? 'PDF' : 'FILE' }}
                </div>
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

    <!-- IMAGE ZOOM MODAL -->
    <div v-if="showImageModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      @click.self="closeImageModal">
      <div class="relative w-full max-w-5xl overflow-hidden rounded-[2rem] bg-slate-950/95 p-4 shadow-[0_36px_120px_rgba(0,0,0,0.35)]">
        <button @click="closeImageModal" class="absolute right-4 top-4 text-white/70 hover:text-white text-2xl">✕</button>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-white/10 mb-4">
          <p class="text-sm uppercase tracking-[0.35em] text-slate-400">File preview</p>
          <a :href="toFullUrl(imageModalUrl)"
             :download="downloadFileName(imageModalUrl)"
             target="_blank"
             rel="noopener"
             class="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400">
            ⤓ Download
          </a>
        </div>
        <img
          v-if="isLikelyImageUrl(imageModalUrl)"
          :src="toFullUrl(imageModalUrl)"
          alt="Full question file"
          class="mx-auto max-h-[75vh] w-full object-contain"
        />
        <iframe
          v-else-if="isLikelyPdfUrl(imageModalUrl)"
          :src="toFullUrl(imageModalUrl)"
          class="mx-auto w-full max-h-[75vh] rounded-lg border border-white/10 bg-white/5"
        />
        <div
          v-else
          class="mx-auto w-full max-w-2xl text-center text-white/70 py-12"
        >
          Preview not available for this file type. Use Download above.
        </div>
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
const imagePreviewIsImage = ref(false)
const imagePreviewIsPdf = ref(false)
const showImageModal = ref(false)
const imageModalUrl = ref(null)

const defaultQ = () => ({
  description: '', correctAnswer: null, errorPercentage: 5,
  orderIndex: null, points: 10, existingImageUrl: null,
})
const qForm = ref(defaultQ())

const MAX_IMAGE_SIZE_BYTES = 500 * 1024 * 1024 // 500 MB

function toFullUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return BACKEND_URL + path
}

function isLikelyImageUrl(url) {
  if (!url) return false
  const s = String(url).toLowerCase()
  return ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.svg'].some(ext => s.endsWith(ext))
}

function isLikelyPdfUrl(url) {
  if (!url) return false
  const s = String(url).toLowerCase()
  return s.endsWith('.pdf')
}

function acceptableMin(q) {
  if (q.correctAnswer == null) return '—'
  return (q.correctAnswer * (1 - (q.errorPercentage || 0) / 100)).toFixed(3)
}
function acceptableMax(q) {
  if (q.correctAnswer == null) return '—'
  return (q.correctAnswer * (1 + (q.errorPercentage || 0) / 100)).toFixed(3)
}

const liveMin = computed(() => {
  if (!qForm.value.correctAnswer) return '—'
  return (qForm.value.correctAnswer * (1 - (qForm.value.errorPercentage || 0) / 100)).toFixed(3)
})
const liveMax = computed(() => {
  if (!qForm.value.correctAnswer) return '—'
  return (qForm.value.correctAnswer * (1 + (qForm.value.errorPercentage || 0) / 100)).toFixed(3)
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
  formError.value = ''

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    formError.value = `File is too large. Max size is 500 MB.`
    imageFile.value = null
    imagePreviewIsImage.value = false
    imagePreviewIsPdf.value = false
    if (imagePreview.value) URL.revokeObjectURL(imagePreview.value)
    imagePreview.value = null
    e.target.value = ''
    return
  }

  imageFile.value = file
  imagePreviewIsImage.value = file.type?.startsWith('image/') || isLikelyImageUrl(file.name)
  imagePreviewIsPdf.value = file.type === 'application/pdf' || String(file.name || '').toLowerCase().endsWith('.pdf')
  // Replace preview if user selects a new file
  if (imagePreview.value) URL.revokeObjectURL(imagePreview.value)
  imagePreview.value = URL.createObjectURL(file)
  e.target.value = ''
}

function openFullImage(imageUrl) {
  imageModalUrl.value = imageUrl
  showImageModal.value = true
}

function closeImageModal() {
  showImageModal.value = false
  imageModalUrl.value = null
}

function downloadFileName(imageUrl) {
  if (!imageUrl) return 'question-image'
  return imageUrl.split('/').filter(Boolean).pop()
}

function openAdd() {
  qForm.value = defaultQ()
  qForm.value.orderIndex = questions.value.length + 1
  editingId.value = null
  imageFile.value = null
  imagePreview.value = null
  imagePreviewIsImage.value = false
  imagePreviewIsPdf.value = false
  formError.value = ''
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
  imageFile.value = null
  imagePreview.value = null
  imagePreviewIsImage.value = false
  imagePreviewIsPdf.value = false
  formError.value = ''
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
    imageFile.value = null
    imagePreview.value = null
    imagePreviewIsImage.value = false
    imagePreviewIsPdf.value = false
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