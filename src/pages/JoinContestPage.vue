<template>
  <div class="min-h-screen bg-transparent text-slate-200 selection:bg-neon-blue/30 overflow-hidden flex flex-col">
    <!-- ════════════════════ NAVBAR ════════════════════ -->
    <nav
      class="h-18 bg-black/80 backdrop-blur-xl border-b border-white/10 px-8 flex items-center justify-between shrink-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div class="flex-1">
        <div class="flex flex-col">
          <span class="text-[10px] text-white/30 font-display tracking-[0.3em] uppercase mb-1">Active Arena</span>
          <h1 class="font-display font-black text-white text-lg tracking-tighter uppercase italic leading-none">
            {{ contestName }}
          </h1>
        </div>
      </div>

      <div class="flex-1 flex justify-center">
        <div class="relative px-8 rounded-2xl bg-white/[0.03] border border-white/5 shadow-inner overflow-hidden">
          <div class="flex gap-3 items-baseline relative z-10">
            <div v-for="(val, key) in timeLeft" :key="key" class="flex flex-col items-center">
              <div class="font-mono font-bold text-green-600 text-4xl leading-none tracking-tighter text-center">
                {{ String(val).padStart(2, '0') }}
              </div>
              <div class="text-[9px] text-green-400 font-display tracking-[0.2em] uppercase">{{ key }}</div>
            </div>
          </div>
          <div
            class="absolute inset-0 bg-gradient-to-b from-transparent via-neon-red/5 to-transparent pointer-events-none animate-pulse">
          </div>
        </div>
      </div>

      <div class="flex-1 flex items-center justify-end gap-10">
        <div class="text-right">
          <div class="text-[10px] text-white/30 font-display tracking-widest uppercase mb-1">Progress</div>
          <div class="font-mono text-2xl font-bold text-neon-blue leading-none">
            {{ activeIdx + 1 }}<span class="text-white text-lg">/{{ questions.length }}</span>
          </div>
        </div>
        <div class="h-10 w-[1px] bg-white/10"></div>
        <router-link :to="`/contests/${$route.params.id}`"
          class="group flex flex-col items-center gap-1 transition-all duration-300">
          <div
            class="p-2 rounded-lg border border-orange-500/30 group-hover:border-orange-500 group-hover:bg-orange-500/10 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <span class="text-[10px] font-display uppercase tracking-widest text-orange-500">Exit</span>
        </router-link>
      </div>
    </nav>

    <!-- ════════════════════ LOADING STATE ════════════════════ -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <LoadingSpinner label="Initializing Arena..." />
    </div>

    <!-- ════════════════════ SUBMISSION COMPLETE ════════════════════ -->
    <div v-else-if="submitted" class="flex-1 flex items-center justify-center p-6">
      <div class="glass-card neon-border-blue p-12 text-center max-w-md animate-fade-in">
        <div class="text-6xl mb-6 animate-bounce-slow">🎯</div>
        <h2 class="font-display text-3xl font-black text-neon-blue uppercase tracking-tighter mb-4">Contest Completed
        </h2>
        <p class="text-white/50 mb-8">All answers submitted successfully. Check the leaderboards for your ranking.</p>
        <router-link :to="`/contests/${$route.params.id}`" class="btn-primary w-full">View Leaderboard</router-link>
      </div>
    </div>

    <!-- ════════════════════ MAIN CONTEST ARENA ════════════════════ -->
    <div v-else class="flex-1 flex flex-col md:flex-row overflow-hidden">
      <main class="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar relative">
        <div class="max-w-4xl mx-auto">
          <Transition name="fade-slide" mode="out-in">
            <div :key="activeIdx" class="space-y-8">
              <!-- Question Header -->
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <span class="text-neon-red font-display text-xs tracking-[0.3em] uppercase">Question {{ activeIdx + 1
                    }}</span>
                  <p class="text-xl md:text-2xl text-white font-light leading-relaxed">
                    {{ questions[activeIdx].description }}
                  </p>
                </div>

                <!-- Question Timer & Skip -->
                <div class="flex flex-col items-end ml-6 min-w-[120px]">
                  <div v-if="questionTimer !== null"
                    class="text-right w-full p-4 rounded-xl bg-white/[0.02] border border-white/5 mb-3">
                    <span class="text-[10px] text-white/30 font-display tracking-widest uppercase block mb-1">Time
                      Remaining</span>
                    <div
                      :class="['font-mono text-3xl font-bold leading-none', questionTimer < 30 ? 'text-red-500 animate-pulse' : 'text-neon-blue']">
                      {{ Math.floor(questionTimer / 60) }}:{{ String(questionTimer % 60).padStart(2, '0') }}
                    </div>
                  </div>
                  <button @click="showSkipModal = true"
                    class="text-xs text-orange-500/70 hover:text-orange-500 transition-colors uppercase tracking-widest font-display flex items-center gap-1 group">
                    <span>Skip Question</span>
                    <svg class="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Media Display (Image/Video) -->
              <div class="grid grid-cols-1 gap-6">
                <div v-if="questions[activeIdx].imageUrl"
                  class="group relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl">
                  <img :src="toFullUrl(questions[activeIdx].imageUrl)"
                    class="w-full max-h-[400px] object-contain cursor-zoom-in transition-transform duration-500 group-hover:scale-[1.02]"
                    @click="zoomedImg = questions[activeIdx].imageUrl" />
                  <div class="absolute top-4 right-4 flex gap-2">
                    <button @click.stop="downloadImg(questions[activeIdx].imageUrl)"
                      class="p-3 bg-black/60 backdrop-blur-md rounded-full text-white/70 hover:text-neon-blue hover:bg-black transition-all">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div v-if="questions[activeIdx].videoUrl"
                  class="rounded-2xl overflow-hidden border border-white/10 bg-black">
                  <video :src="toFullUrl(questions[activeIdx].videoUrl)" controls class="w-full max-h-80"></video>
                </div>
              </div>

              <!-- Answer Input & Submission -->
              <div class="space-y-4 pt-6 border-t border-white/10">

                <!-- Input Section -->
                <div class="flex justify-between items-end gap-6">
                  <div class="flex-1 w-full group">
                    <label class="text-sm font-display text-white/40 tracking-widest ml-1 mb-2 block">
                      Your Answer
                      <span v-if="questions[activeIdx].type === 'NUMERIC_MCQ'" class="text-white/30">(in grams)</span>
                    </label>
                    <div class="relative">
                      <input v-model="answers[questions[activeIdx].id]"
                        :type="questions[activeIdx].type === 'NUMERIC_MCQ' ? 'number' : 'text'" 
                        step="0.001"
                        :disabled="submitting || responseType === 'success'"
                        @keyup.enter="handleSingleSubmit"
                        class="w-full bg-white/[0.03] border-b-2 border-white/10 p-4 text-3xl text-neon-blue focus:outline-none focus:border-neon-blue transition-all placeholder:text-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                        :placeholder="questions[activeIdx].type === 'NUMERIC_MCQ' ? '0.000' : 'Type answer...'" />
                      <div v-if="questions[activeIdx].type === 'NUMERIC_MCQ' && questions[activeIdx].errorPercentage"
                        class="mt-2 text-sm font-mono text-white/60 tracking-wider">
                        TOLERANCE: ±{{ questions[activeIdx].errorPercentage }}%
                      </div>
                    </div>
                  </div>

                  <!-- Submit Button -->
                  <button @click="handleSingleSubmit" 
                    :disabled="submitting || responseType === 'success' || !answers[questions[activeIdx].id]"
                    :class="[
                      'py-3 px-12 rounded-2xl font-black uppercase tracking-tighter transition-all duration-300',
                      'shadow-[0_0_20px_rgba(0,243,255,0.2)]',
                      responseType === 'success'
                        ? 'bg-green-500 text-black hover:scale-100'
                        : 'bg-blue-500 text-black hover:scale-105 active:scale-95',
                      submitting && 'opacity-60 scale-95',
                      !answers[questions[activeIdx].id] && responseType !== 'success' && 'opacity-50 cursor-not-allowed'
                    ]">
                    <span v-if="responseType === 'success'" class="flex items-center gap-2">
                      <span>✓ Correct</span>
                    </span>
                    <span v-else-if="submitting">Checking...</span>
                    <span v-else>Submit</span>
                  </button>
                </div>


                <!-- Response Message (Success/Error) -->
                <Transition name="slide-down">
                  <div v-if="responseMessage" :class="[
                    'p-4 rounded-xl font-display font-black uppercase tracking-tight text-sm',
                    responseType === 'success' 
                      ? 'bg-green-500/20 border border-green-500/50 text-green-300' 
                      : 'bg-red-500/20 border border-red-500/50 text-red-300'
                  ]">
                    <div class="flex items-center gap-3">
                      <span v-if="responseType === 'success'" class="text-xl">✓</span>
                      <span v-else class="text-xl">✗</span>
                      <span>{{ responseMessage }}</span>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </Transition>
        </div>
      </main>
    </div>

    <!-- ════════════════════ SKIP CONFIRMATION MODAL ════════════════════ -->
    <Transition name="fade">
      <div v-if="showSkipModal"
        class="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="glass-card neon-border-blue p-8 max-w-md w-full animate-fade-in relative border !border-orange-500/50 !shadow-[0_0_20px_rgba(249,115,22,0.3)]">
          <h3 class="font-display text-2xl font-black text-white uppercase tracking-tight mb-4">Skip Question?</h3>
          <p class="text-white/60 mb-8">Are you sure you want to skip this question? You will not be able to return to it later.</p>
          <div class="flex justify-end gap-4">
            <button @click="showSkipModal = false"
              class="px-6 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all">
              Cancel
            </button>
            <button @click="confirmSkip"
              class="px-6 py-2 rounded-xl bg-orange-500 text-black font-bold hover:scale-105 active:scale-95 transition-all">
              Yes, Skip
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ════════════════════ IMAGE ZOOM MODAL ════════════════════ -->
    <Transition name="fade">
      <div v-if="zoomedImg"
        class="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-xl"
        @click="zoomedImg = null">
        <img :src="toFullUrl(zoomedImg)" class="max-w-full max-h-full object-contain" />
        <div class="absolute top-6 right-6 text-white/90 font-bold text-xl font-display uppercase tracking-widest">Click
          to Close</div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContestStore } from '@/stores/contest'
import { BACKEND_URL } from '@/config'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const contestStore = useContestStore()
const contestId = route.params.id

// ── State ─────────────────────────────────────────────────────
const loading = ref(true)
const submitting = ref(false)
const submitted = ref(false)
const questions = ref([])
const answers = ref({})
const questionStartTimes = ref({})
const activeIdx = ref(0)
const zoomedImg = ref(null)
const contestName = ref('')
const contestEndAt = ref(null)
const showSkipModal = ref(false)

// ── Response Message State ───────────────────────────────────
const responseMessage = ref(null)
const responseType = ref(null) // 'success' or 'error'

// ── Question Timer State ──────────────────────────────────────
const questionTimer = ref(null)
let qTimerHandle = null

// ── Contest End Timer ─────────────────────────────────────────
const timeLeft = ref({ H: 0, M: 0, S: 0 })
let contestTimerHandle = null

// ── Utility Logic ─────────────────────────────────────────────
const toFullUrl = (path) => (!path ? null : path.startsWith('http') ? path : BACKEND_URL + path)

function getLocalIsoString() {
  // Always return a proper UTC ISO-8601 string (e.g. "2026-04-27T16:40:16.000Z")
  // so the backend can parse it as an Instant without timezone ambiguity.
  return new Date().toISOString()
}

function getLocalStorageKey() {
  return `robotest_contest_${contestId}`
}

function saveContestState() {
  try {
    localStorage.setItem(getLocalStorageKey(), JSON.stringify({
      activeIdx: activeIdx.value,
      questionStartTimes: questionStartTimes.value,
      answers: answers.value
    }))
  } catch (e) {
    console.error('Failed to save contest state', e)
  }
}

function loadContestState() {
  try {
    const saved = localStorage.getItem(getLocalStorageKey())
    if (saved) return JSON.parse(saved)
  } catch (e) {
    console.error('Failed to load contest state', e)
  }
  return null
}

async function downloadImg(url) {
  try {
    const res = await fetch(toFullUrl(url))
    const blob = await res.blob()
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `Question-${activeIdx.value + 1}.jpg`
    link.click()
    URL.revokeObjectURL(link.href)
  } catch (e) {
    console.error('Download failed:', e)
  }
}

async function completeContestLocally() {
  submitted.value = true
  if (qTimerHandle) clearInterval(qTimerHandle)
  
  try {
    await contestStore.completeContest(contestId)
  } catch (e) {
    console.error('Failed to mark contest complete:', e)
  }
}

// ── Contest End Timer Logic ───────────────────────────────────
function tickContest() {
  if (!contestEndAt.value) return
  const diff = Math.max(0, new Date(contestEndAt.value).getTime() - Date.now())
  timeLeft.value = {
    H: Math.floor(diff / 3600000),
    M: Math.floor((diff % 3600000) / 60000),
    S: Math.floor((diff % 60000) / 1000),
  }

  // Auto-submit if contest ends
  if (diff === 0 && !submitted.value) {
    completeContestLocally()
  }
}

// ── Question Specific Timer Logic ─────────────────────────────
function startQuestionTimer() {
  if (qTimerHandle) clearInterval(qTimerHandle)

  const currentQ = questions.value[activeIdx.value]
  if (currentQ && currentQ.timeLimit && currentQ.timeLimit > 0) {
    const qId = currentQ.id;
    let startTimeIso = questionStartTimes.value[qId];
    if (!startTimeIso) {
      startTimeIso = getLocalIsoString();
      questionStartTimes.value[qId] = startTimeIso;
      saveContestState();
    }

    const [datePart, timePart] = startTimeIso.split('T')
    const [y, m, d] = datePart.split('-')
    const [H, M, S] = timePart.split(':')
    const startTimeMs = new Date(y, m-1, d, H, M, S).getTime()
    
    const elapsedSecs = Math.floor((Date.now() - startTimeMs) / 1000)
    const remaining = currentQ.timeLimit - elapsedSecs

    if (remaining > 0) {
      questionTimer.value = remaining
      qTimerHandle = setInterval(() => {
        if (questionTimer.value > 0) {
          questionTimer.value--
        } else {
          clearInterval(qTimerHandle)
          handleQuestionTimeout()
        }
      }, 1000)
    } else {
      questionTimer.value = 0
      handleQuestionTimeout()
    }
  } else {
    questionTimer.value = null
  }
}

function handleQuestionTimeout() {
  responseMessage.value = "Time's up! Moving to next question..."
  responseType.value = 'error'
  setTimeout(() => {
    moveToNext()
  }, 1500)
}

// ── Main Submit Handler ───────────────────────────────────────
async function handleSingleSubmit() {
  const qId = questions.value[activeIdx.value].id
  const answer = answers.value[qId]

  // Validation
  if (!answer || String(answer).trim() === '') {
    responseMessage.value = 'Please provide an answer first'
    responseType.value = 'error'
    setTimeout(() => {
      responseMessage.value = null
      responseType.value = null
    }, 3000)
    return
  }

  submitting.value = true
  responseMessage.value = null
  responseType.value = null

  try {
    // Call the store method with proper error handling
    const startedAt = questionStartTimes.value[qId]
    const result = await contestStore.submitAnswers(contestId, qId, answer, startedAt);
    console.log("Submit Result:", result);

    if (result.success) {
      // ✓ Correct answer
      responseMessage.value = 'Correct! Moving to next question...'
      responseType.value = 'success'
      
      // Auto-move to next question after brief delay
      setTimeout(() => {
        moveToNext()
      }, 1500)
    } else {
      // ✗ Wrong answer
      responseMessage.value = result.message || 'Wrong answer. Please try again.'
      responseType.value = 'error'
      
      // Clear message after 3 seconds
      setTimeout(() => {
        responseMessage.value = null
        responseType.value = null
      }, 3000)
    }
  } catch (e) {
    console.error('Submission error:', e)
    responseMessage.value = 'Connection error. Please check your network.'
    responseType.value = 'error'
    
    setTimeout(() => {
      responseMessage.value = null
      responseType.value = null
    }, 3000)
  } finally {
    submitting.value = false
  }
}

// ── Navigation Logic ──────────────────────────────────────────
function moveToNext() {
  responseMessage.value = null
  responseType.value = null
  
  if (activeIdx.value < questions.value.length - 1) {
    activeIdx.value++
    const currentQ = questions.value[activeIdx.value]
    if (currentQ && !questionStartTimes.value[currentQ.id]) {
      questionStartTimes.value[currentQ.id] = getLocalIsoString()
    }
    saveContestState()
    startQuestionTimer()
  } else {
    // All questions answered
    completeContestLocally()
  }
}

function confirmSkip() {
  showSkipModal.value = false
  moveToNext()
}

watch(answers, () => {
  saveContestState()
}, { deep: true })

watch(submitted, (newVal) => {
  if (newVal) {
    localStorage.removeItem(getLocalStorageKey())
  }
})

// ── Lifecycle ─────────────────────────────────────────────────
onMounted(async () => {
  try {
    // Fetch contest details
    const contest = await contestStore.fetchContest(contestId)
    contestName.value = contest.name
    contestEndAt.value = contest.contestEnd

    // Fetch questions
    const qs = await contestStore.getContestQuestions(contestId)
    questions.value = qs

    const savedState = loadContestState()
    if (savedState) {
      activeIdx.value = savedState.activeIdx || 0
      questionStartTimes.value = savedState.questionStartTimes || {}
      answers.value = savedState.answers || {}
    }

    // Ensure answers has the keys
    qs.forEach(q => {
      if (answers.value[q.id] === undefined) {
        answers.value[q.id] = ''
      }
    })

    // Record start time for the first question if not set
    if (qs.length > 0 && !questionStartTimes.value[qs[activeIdx.value].id]) {
      questionStartTimes.value[qs[activeIdx.value].id] = getLocalIsoString()
    }
    saveContestState()

    // Start timers
    tickContest()
    contestTimerHandle = setInterval(tickContest, 1000)
    startQuestionTimer()
  } catch (e) {
    console.error('Initialization failed:', e)
    // Navigate back to contests if initialization fails
    setTimeout(() => {
      router.replace('/contests')
    }, 2000)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  if (contestTimerHandle) clearInterval(contestTimerHandle)
  if (qTimerHandle) clearInterval(qTimerHandle)
})
</script>

<style scoped>
.font-display {
  font-family: 'Space Grotesk', sans-serif;
}

.text-neon-blue {
  color: #00f3ff;
  text-shadow: 0 0 15px rgba(0, 243, 255, 0.4);
}

.text-neon-red {
  color: #ff0055;
  text-shadow: 0 0 10px rgba(255, 0, 85, 0.3);
}

.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.neon-border-blue {
  border: 2px solid #00f3ff;
  box-shadow: 0 0 20px rgba(0, 243, 255, 0.3);
}


/* ════════════════════ ANIMATIONS ════════════════════ */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

.animate-bounce-slow {
  animation: bounce 2s infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* ════════════════════ CUSTOM SCROLLBAR ════════════════════ */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>