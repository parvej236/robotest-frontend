<!-- src/pages/JoinContestPage.vue -->
<template>
  <div class="min-h-screen pt-20 px-4 pb-12">
    <div class="max-w-3xl mx-auto">
      <router-link :to="`/contests/${$route.params.id}`"
        class="inline-flex items-center gap-1 text-xs font-display text-white/40 hover:text-white mb-6 transition-colors tracking-wider">
        ← Back to Contest
      </router-link>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <LoadingSpinner label="Loading questions..." />
      </div>

      <!-- Submitted success -->
      <div v-else-if="submitted" class="glass-card neon-border-blue p-10 text-center">
        <div class="text-5xl mb-4">🎯</div>
        <h2 class="font-display text-2xl font-black text-neon-blue uppercase tracking-wider mb-2">Submitted!</h2>
        <p class="text-white/60 font-body text-sm mb-6">
          Your answers have been recorded. Check the leaderboard for your rank.
        </p>
        <div class="flex gap-3 justify-center">
          <router-link :to="`/contests/${$route.params.id}`" class="btn-primary">View Leaderboard</router-link>
          <router-link to="/dashboard" class="btn-ghost">Dashboard</router-link>
        </div>
      </div>

      <!-- Questions -->
      <div v-else>

        <!-- Contest info bar -->
        <div class="glass-card neon-border-red p-4 mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 class="font-display font-black text-white text-lg">{{ contestName }}</h1>
            <div class="flex items-center gap-2 mt-1">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span class="text-xs font-display tracking-widest text-green-400 uppercase">Live Contest</span>
            </div>
          </div>
          <div class="text-right">
            <div class="text-xs text-white/40 font-display tracking-wider uppercase mb-1">Ends In</div>
            <div class="flex gap-1.5">
              <div v-for="(val, key) in timeLeft" :key="key" class="text-center">
                <div class="font-display font-black text-neon-red text-xl leading-none">
                  {{ String(val).padStart(2, '0') }}
                </div>
                <div class="text-[9px] text-white/30 font-display tracking-wider uppercase">{{ key.charAt(0) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- No questions -->
        <div v-if="questions.length === 0" class="text-center py-12 glass-card">
          <p class="text-white/40 font-body">No questions found for this contest</p>
        </div>

        <form v-else @submit.prevent="handleSubmit">
          <div class="space-y-6">
            <div v-for="(q, idx) in questions" :key="q.id"
                 class="glass-card p-6 transition-all"
                 :class="answers[q.id] ? 'neon-border-blue' : ''">

              <div class="flex items-start gap-4">
                <!-- Number badge -->
                <div class="w-10 h-10 rounded bg-neon-red/10 border border-neon-red/30
                            flex items-center justify-center flex-shrink-0">
                  <span class="font-display text-sm font-black text-neon-red">{{ idx + 1 }}</span>
                </div>

                <div class="flex-1 min-w-0">
                  <!-- Description -->
                  <p class="font-body text-white/90 text-sm leading-relaxed mb-4">
                    {{ q.description }}
                  </p>

                  <!-- FIX: image URL must be prefixed with BACKEND_URL
                       q.imageUrl from backend = "/uploads/questions/images/uuid.jpg"
                       Without prefix → browser requests from :5173 → 404
                       With toFullUrl() → "http://YOUR_IP:8080/uploads/..." → ✅ -->
                  <div v-if="q.imageUrl"
                       class="mb-4 rounded-lg overflow-hidden border border-white/10 bg-dark-800">
                    <img
                      :src="toFullUrl(q.imageUrl)"
                      :key="q.imageUrl"
                      class="w-full max-h-72 object-contain"
                      :alt="`Question ${idx + 1} image`"
                      @error="onImgError($event, idx)"
                    />
                  </div>

                  <!-- Video (same fix) -->
                  <div v-if="q.videoUrl"
                       class="mb-4 rounded-lg overflow-hidden border border-white/10">
                    <video
                      :src="toFullUrl(q.videoUrl)"
                      controls
                      class="w-full max-h-56 bg-black"
                    ></video>
                  </div>

                  <!-- Answer field -->
                  <div class="flex items-end gap-3">
                    <div class="flex-1">
                      <label class="label-text">
                        Your Answer
                        <span v-if="q.type === 'NUMERIC_MCQ'" class="text-white/30 font-mono normal-case ml-1">
                          (grams)
                        </span>
                      </label>
                      <input
                        v-model="answers[q.id]"
                        :type="q.type === 'NUMERIC_MCQ' ? 'number' : 'text'"
                        step="any"
                        :placeholder="q.type === 'NUMERIC_MCQ' ? 'e.g. 250.5' : 'Enter answer'"
                        class="input-field"
                      />
                    </div>

                    <!-- Tolerance hint -->
                    <div v-if="q.type === 'NUMERIC_MCQ' && q.errorPercentage"
                         class="pb-1 text-xs font-mono text-white/30 whitespace-nowrap flex-shrink-0">
                      ± {{ q.errorPercentage }}%
                    </div>

                    <!-- Answered dot -->
                    <div v-if="isAnswered(q.id)"
                         class="pb-1 w-2.5 h-2.5 bg-neon-blue rounded-full flex-shrink-0"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sticky submit bar -->
          <div class="sticky bottom-4 mt-8">
            <div class="glass-panel neon-border-red p-4 flex items-center justify-between gap-4">
              <div class="text-xs font-display text-white/50 tracking-wider">
                <span class="text-neon-blue font-bold text-base">{{ answeredCount }}</span>
                <span class="text-white/30"> / {{ questions.length }}</span>
                <span class="ml-1 text-white/40">answered</span>
              </div>

              <!-- Progress bar -->
              <div class="flex-1 h-1 bg-dark-800 rounded-full overflow-hidden hidden sm:block">
                <div class="h-full bg-gradient-to-r from-neon-red to-neon-blue rounded-full transition-all duration-300"
                     :style="`width: ${progressPercent}%`"></div>
              </div>

              <button
                type="submit"
                :disabled="submitting || answeredCount === 0"
                class="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
                <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {{ submitting ? 'Submitting...' : 'Submit Answers' }}
              </button>
            </div>

            <div v-if="submitError"
                 class="mt-2 text-xs text-neon-red font-body text-center
                        bg-neon-red/10 border border-neon-red/20 rounded px-3 py-2">
              {{ submitError }}
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useContestStore } from '@/stores/contest'
import { BACKEND_URL } from '@/config'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const route        = useRoute()
const contestStore = useContestStore()
const contestId    = route.params.id

// ── State ─────────────────────────────────────────────────────
const loading      = ref(true)
const submitting   = ref(false)
const submitted    = ref(false)
const submitError  = ref('')
const questions    = ref([])
const answers      = ref({})
const contestName  = ref('')
const contestEndAt = ref(null)

// ── FIX: converts "/uploads/..." relative path → full backend URL ──
// q.imageUrl from the backend is "/uploads/questions/images/uuid.jpg"
// Without this the browser requests it from :5173 (Vite) which has no /uploads
function toFullUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return BACKEND_URL + path
}

function onImgError(event, idx) {
  console.error(`Question ${idx + 1} image failed:`, event.target.src)
  // Hide broken image rather than show broken icon
  event.target.closest('div').style.display = 'none'
}

// ── Countdown ─────────────────────────────────────────────────
const timeLeft = ref({ H: 0, M: 0, S: 0 })
let timerHandle = null

function tick() {
  if (!contestEndAt.value) return
  const diff = Math.max(0, new Date(contestEndAt.value).getTime() - Date.now())
  timeLeft.value = {
    H: Math.floor(diff / 3_600_000),
    M: Math.floor((diff % 3_600_000) / 60_000),
    S: Math.floor((diff % 60_000) / 1_000),
  }
}

// ── Computed ──────────────────────────────────────────────────
function isAnswered(qId) {
  const v = answers.value[qId]
  return v !== '' && v !== null && v !== undefined
}

const answeredCount = computed(() =>
  questions.value.filter(q => isAnswered(q.id)).length
)

const progressPercent = computed(() =>
  questions.value.length ? Math.round((answeredCount.value / questions.value.length) * 100) : 0
)

// ── Submit ────────────────────────────────────────────────────
async function handleSubmit() {
  submitError.value = ''
  submitting.value  = true
  try {
    const answerMap = {}
    questions.value.forEach(q => {
      if (isAnswered(q.id)) answerMap[Number(q.id)] = String(answers.value[q.id])
    })
    await contestStore.submitAnswers(contestId, answerMap)
    submitted.value = true
  } catch (e) {
    // FIX: fetch-based api.js throws { message } — not e.response?.data?.message
    submitError.value = e.message || 'Failed to submit answers'
  } finally {
    submitting.value = false
  }
}

// ── Mount ─────────────────────────────────────────────────────
onMounted(async () => {
  try {
    // Load contest info for name + end time
    const contest = await contestStore.fetchContest(contestId)
    contestName.value = contest.name
    contestEndAt.value = contest.contestEnd

    // Load questions — images come as relative paths like "/uploads/questions/images/x.jpg"
    // toFullUrl() in the template converts them to full backend URLs
    const qs = await contestStore.getContestQuestions(contestId)
    questions.value = qs
    qs.forEach(q => { answers.value[q.id] = '' })

    // Start countdown
    tick()
    timerHandle = setInterval(tick, 1000)

  } catch (e) {
    console.error('Failed to load contest questions:', e.message)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  if (timerHandle) clearInterval(timerHandle)
})
</script>