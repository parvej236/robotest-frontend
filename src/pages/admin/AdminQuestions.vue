<template>
  <div class="min-h-screen pt-20 px-4 pb-12">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <router-link to="/admin/contests" class="text-xs font-display text-white/40 hover:text-white tracking-wider transition-colors">← Contests</router-link>
          <div class="flex items-center gap-2 mt-1 mb-1">
            <div class="w-4 h-px bg-neon-red"></div>
            <span class="text-xs font-display tracking-widest text-neon-red uppercase">Admin</span>
          </div>
          <h1 class="font-display text-xl font-black text-white uppercase tracking-wider">Questions — <span class="glow-text-red">{{ contestName }}</span></h1>
        </div>
        <button @click="openAdd" class="btn-primary">+ Add Question</button>
      </div>

      <!-- Questions list -->
      <div class="space-y-4">
        <div v-if="loading" class="flex justify-center py-12"><LoadingSpinner /></div>
        <div v-else-if="questions.length === 0" class="glass-card p-12 text-center">
          <div class="text-4xl mb-3">📝</div>
          <p class="text-white/40 font-body text-sm">No questions yet. Add your first question!</p>
        </div>
        <div v-for="(q, idx) in questions" :key="q.id" class="glass-card p-5 flex gap-4">
          <div class="w-10 h-10 rounded bg-neon-red/10 border border-neon-red/30 flex items-center justify-center flex-shrink-0">
            <span class="font-display text-sm font-black text-neon-red">{{ idx + 1 }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-3">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-2 flex-wrap">
                  <span class="text-xs font-display border px-2 py-0.5 rounded"
                    :class="q.type === 'NUMERIC_MCQ' ? 'text-neon-blue border-neon-blue/30' : 'text-neon-red border-neon-red/30'">
                    {{ q.type === 'NUMERIC_MCQ' ? 'Numeric / MCQ' : 'Custom' }}
                  </span>
                  <span class="text-xs font-mono text-white/30">{{ q.points }} pts</span>
                </div>
                <p class="font-body text-sm text-white/80 mb-2 line-clamp-2">{{ q.description }}</p>
                <div class="flex gap-4 text-xs font-mono text-white/40 flex-wrap">
                  <span v-if="q.correctAnswer != null">Answer: <span class="text-neon-blue">{{ q.correctAnswer }}</span></span>
                  <span v-if="q.errorPercentage != null">±<span class="text-neon-red">{{ q.errorPercentage }}%</span></span>
                  <span v-if="q.imageUrl" class="text-green-400">📷 Image</span>
                  <span v-if="q.videoUrl" class="text-purple-400">🎬 Video</span>
                </div>
              </div>
              <div class="flex gap-2 flex-shrink-0">
                <button @click="openEdit(q)" class="text-xs font-display text-white/60 border border-white/10 px-2 py-1 rounded hover:bg-white/5 transition-colors">Edit</button>
                <button @click="confirmDelete(q)" class="text-xs font-display text-neon-red border border-neon-red/30 px-2 py-1 rounded hover:bg-neon-red/10 transition-colors">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto" @click.self="showModal = false">
      <div class="glass-panel neon-border-red p-8 w-full max-w-2xl relative my-4">
        <button @click="showModal = false" class="absolute top-4 right-4 text-white/40 hover:text-white text-xl">✕</button>
        <h2 class="section-title mb-6">{{ editingId ? 'Edit Question' : 'Add Question' }}</h2>

        <form @submit.prevent="handleSave" class="space-y-4">
          <div>
            <label class="label-text">Question Type *</label>
            <select v-model="qForm.type" class="input-field" required>
              <option value="NUMERIC_MCQ">Numeric / MCQ</option>
              <option value="CUSTOM">Custom</option>
            </select>
          </div>
          <div>
            <label class="label-text">Description *</label>
            <textarea v-model="qForm.description" class="input-field resize-none" rows="4" required></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div v-if="qForm.type === 'NUMERIC_MCQ'">
              <label class="label-text">Correct Answer *</label>
              <input v-model.number="qForm.correctAnswer" type="number" step="any" class="input-field" :required="qForm.type === 'NUMERIC_MCQ'" />
            </div>
            <div v-if="qForm.type === 'NUMERIC_MCQ'">
              <label class="label-text">Error % (tolerance)</label>
              <input v-model.number="qForm.errorPercentage" type="number" step="0.01" min="0" class="input-field" placeholder="e.g. 5 for ±5%" />
            </div>
            <div v-if="qForm.type === 'CUSTOM'" class="col-span-2">
              <label class="label-text">Answer Key *</label>
              <input v-model="qForm.customAnswerKey" type="text" class="input-field" :required="qForm.type === 'CUSTOM'" placeholder="Exact answer (case insensitive)" />
            </div>
            <div>
              <label class="label-text">Points *</label>
              <input v-model.number="qForm.points" type="number" min="1" class="input-field" required />
            </div>
            <div>
              <label class="label-text">Order Index</label>
              <input v-model.number="qForm.orderIndex" type="number" min="1" class="input-field" />
            </div>
          </div>

          <!-- Image upload -->
          <div>
            <label class="label-text">Question Image (optional)</label>
            <div class="flex items-center gap-3">
              <label class="btn-ghost cursor-pointer text-xs py-2">
                📷 {{ imageFile ? imageFile.name : 'Choose Image' }}
                <input type="file" accept="image/*" class="hidden" @change="handleImageChange" />
              </label>
              <span v-if="qForm.imageUrl && !imageFile" class="text-xs text-green-400">✓ Image attached</span>
            </div>
            <div v-if="imagePreview" class="mt-2 rounded overflow-hidden border border-white/10 max-w-xs">
              <img :src="imagePreview" class="w-full h-32 object-cover" />
            </div>
          </div>

          <!-- Video upload -->
          <div>
            <label class="label-text">Question Video (optional)</label>
            <div class="flex items-center gap-3">
              <label class="btn-ghost cursor-pointer text-xs py-2">
                🎬 {{ videoFile ? videoFile.name : 'Choose Video' }}
                <input type="file" accept="video/*" class="hidden" @change="handleVideoChange" />
              </label>
              <span v-if="qForm.videoUrl && !videoFile" class="text-xs text-purple-400">✓ Video attached</span>
            </div>
          </div>

          <div v-if="formError" class="text-neon-red text-xs font-body">{{ formError }}</div>

          <div class="flex gap-3 pt-2">
            <button type="submit" :disabled="saving" class="btn-primary flex items-center gap-2">
              <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {{ saving ? 'Saving...' : (editingId ? 'Update' : 'Add Question') }}
            </button>
            <button type="button" @click="showModal = false" class="btn-ghost">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirm -->
    <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" @click.self="deleteTarget = null">
      <div class="glass-panel neon-border-red p-8 w-full max-w-sm text-center">
        <div class="text-4xl mb-3">⚠️</div>
        <h3 class="font-display text-xl font-bold text-white mb-2">Delete Question?</h3>
        <p class="text-white/60 font-body text-sm mb-6">This cannot be undone.</p>
        <div class="flex gap-3 justify-center">
          <button @click="doDelete" :disabled="deleting" class="btn-primary">{{ deleting ? 'Deleting...' : 'Delete' }}</button>
          <button @click="deleteTarget = null" class="btn-ghost">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/utils/api'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const route = useRoute()
const contestId = route.params.id

const questions = ref([])
const contestName = ref('')
const loading = ref(true)
const showModal = ref(false)
const editingId = ref(null)
const saving = ref(false)
const formError = ref('')
const deleteTarget = ref(null)
const deleting = ref(false)
const imageFile = ref(null)
const videoFile = ref(null)
const imagePreview = ref(null)

const defaultQ = () => ({
  type: 'NUMERIC_MCQ', description: '', correctAnswer: null, errorPercentage: null,
  customAnswerKey: '', points: 10, orderIndex: questions.value.length + 1,
  imageUrl: null, videoUrl: null
})
const qForm = ref(defaultQ())

function handleImageChange(e) {
  imageFile.value = e.target.files[0]
  if (imageFile.value) imagePreview.value = URL.createObjectURL(imageFile.value)
}
function handleVideoChange(e) { videoFile.value = e.target.files[0] }

function openAdd() {
  qForm.value = defaultQ(); editingId.value = null; imageFile.value = null; videoFile.value = null; imagePreview.value = null; formError.value = ''; showModal.value = true
}
function openEdit(q) {
  editingId.value = q.id
  qForm.value = { ...q }
  imageFile.value = null; videoFile.value = null; imagePreview.value = null; formError.value = ''
  showModal.value = true
}

async function handleSave() {
  saving.value = true; formError.value = ''
  try {
    const fd = new FormData()
    const qData = JSON.stringify({
      description: qForm.value.description, type: qForm.value.type,
      correctAnswer: qForm.value.correctAnswer, errorPercentage: qForm.value.errorPercentage,
      customAnswerKey: qForm.value.customAnswerKey, points: qForm.value.points,
      orderIndex: qForm.value.orderIndex
    })
    fd.append('question', new Blob([qData], { type: 'application/json' }))
    if (imageFile.value) fd.append('image', imageFile.value)
    if (videoFile.value) fd.append('video', videoFile.value)

    if (editingId.value) {
      await api.put(`/questions/${editingId.value}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    } else {
      await api.post(`/questions/contest/${contestId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    }
    showModal.value = false
    await loadQuestions()
  } catch (e) {
    formError.value = e.response?.data?.message || 'Failed to save question'
  } finally { saving.value = false }
}

function confirmDelete(q) { deleteTarget.value = q }
async function doDelete() {
  deleting.value = true
  try { await api.delete(`/questions/${deleteTarget.value.id}`); deleteTarget.value = null; await loadQuestions() }
  catch (e) { console.error(e) }
  finally { deleting.value = false }
}

async function loadQuestions() {
  const res = await api.get(`/questions/contest/${contestId}/admin`)
  questions.value = res.data.data
}

onMounted(async () => {
  try {
    const cRes = await api.get(`/contests/${contestId}`)
    contestName.value = cRes.data.data.name
    await loadQuestions()
  } finally { loading.value = false }
})
</script>
