<template>
  <div class="min-h-screen bg-transparent text-slate-200 selection:bg-neon-blue/30 overflow-hidden flex flex-col">
    
    <nav class="h-20 bg-black/60 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between shrink-0 z-50">
      <div class="flex items-center gap-6">
        <router-link :to="`/contests/${$route.params.id}`" class="text-xs font-display uppercase tracking-widest text-orange-500 hover:text-white transition-colors">
          ← Exit
        </router-link>
        <h1 class="hidden md:block font-display font-black text-white text-lg tracking-tighter uppercase italic">
          {{ contestName }}
        </h1>
      </div>

      <div class="flex items-center gap-8">
        <div class="text-right">
          <div class="text-[10px] text-white/30 font-display tracking-widest uppercase mb-1">Answered</div>
          <div class="font-mono text-xl font-bold text-neon-blue">
            {{ answeredCount }}<span class="text-white/20">/{{ questions.length }}</span>
          </div>
        </div>

        <div class="h-10 w-[1px] bg-white/10"></div>

        <div class="flex gap-3">
          <div v-for="(val, key) in timeLeft" :key="key" class="text-center">
            <div class="font-mono font-bold text-neon-red text-2xl leading-none w-10">
              {{ String(val).padStart(2, '0') }}
            </div>
            <div class="text-[8px] text-white/30 font-display tracking-widest uppercase">{{ key }}</div>
          </div>
        </div>
      </div>
    </nav>

    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <LoadingSpinner label="Initializing Arena..." />
    </div>

    <div v-else-if="submitted" class="flex-1 flex items-center justify-center p-6">
      <div class="glass-card neon-border-blue p-12 text-center max-w-md">
        <div class="text-6xl mb-6">🎯</div>
        <h2 class="font-display text-3xl font-black text-neon-blue uppercase tracking-tighter mb-4">Submission Received</h2>
        <p class="text-white/50 mb-8">Your answers are submitted properly. Check the leaderboards for ranking.</p>
        <router-link :to="`/contests/${$route.params.id}`" class="btn-primary w-full">View Results</router-link>
      </div>
    </div>

    <div v-else class="flex-1 flex flex-col md:flex-row overflow-hidden">
      
      <aside class="w-full md:w-24 bg-white/[0.02] border-r border-white/5 overflow-y-auto p-4 flex md:flex-col gap-3 custom-scrollbar">
        <button 
          v-for="(q, idx) in questions" 
          :key="q.id"
          @click="activeIdx = idx"
          class="w-12 h-12 shrink-0 rounded-xl font-display font-bold transition-all duration-300 border relative"
          :class="[
            activeIdx === idx 
              ? 'bg-neon-red text-white border-neon-red shadow-[0_0_15px_rgba(255,0,85,0.4)]' 
              : isAnswered(q.id) 
                ? 'bg-neon-blue/10 border-neon-blue/50 text-neon-blue' 
                : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
          ]"
        >
          {{ idx + 1 }}
          <div v-if="isAnswered(q.id) && activeIdx !== idx" class="absolute -top-1 -right-1 w-3 h-3 bg-neon-blue rounded-full border-2 border-[#050505]"></div>
        </button>
      </aside>

      <main class="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar relative">
        <div class="max-w-4xl mx-auto">
          <Transition name="fade-slide" mode="out-in">
            <div :key="activeIdx" class="space-y-8">
              
              <div class="space-y-4">
                <span class="text-neon-red font-display text-xs tracking-[0.3em] uppercase">Question {{ activeIdx + 1 }}</span>
                <p class="text-xl md:text-2xl text-white font-light leading-relaxed">
                  {{ questions[activeIdx].description }}
                </p>
              </div>

              <div class="grid grid-cols-1 gap-6">
                <div v-if="questions[activeIdx].imageUrl" class="group relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl">
                  <img 
                    :src="toFullUrl(questions[activeIdx].imageUrl)" 
                    class="w-full max-h-[400px] object-contain cursor-zoom-in transition-transform duration-500 group-hover:scale-[1.02]"
                    @click="zoomedImg = questions[activeIdx].imageUrl"
                  />
                  <div class="absolute top-4 right-4 flex gap-2">
                    <button @click.stop="downloadImg(questions[activeIdx].imageUrl)" class="p-3 bg-black/60 backdrop-blur-md rounded-full text-white/70 hover:text-neon-blue hover:bg-black transition-all">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    </button>
                  </div>
                </div>

                <div v-if="questions[activeIdx].videoUrl" class="rounded-2xl overflow-hidden border border-white/10 bg-black">
                  <video :src="toFullUrl(questions[activeIdx].videoUrl)" controls class="w-full max-h-80"></video>
                </div>
              </div>

              <div class="max-w-xl space-y-4">
                <div class="relative group">
                  <label class="text-xl font-display text-white/80 tracking-widest ml-1">Your Answer (in gm)</label>
                  <input
                    v-model="answers[questions[activeIdx].id]"
                    :type="questions[activeIdx].type === 'NUMERIC_MCQ' ? 'number' : 'text'"
                    class="w-full bg-white/[0.03] border-1 rounded-full border-blue-500 p-4 text-2xl text-green-500 placeholder:text-green-500 focus:outline-none focus:border-blue-500 transition-all"
                    :placeholder="questions[activeIdx].type === 'NUMERIC_MCQ' ? '0.000' : 'Enter value...'"
                  />
                </div>
                
                <p v-if="questions[activeIdx].type === 'NUMERIC_MCQ' && questions[activeIdx].errorPercentage" class="text-xl font-mono text-blue-500">
                  Tolerance: ±{{ questions[activeIdx].errorPercentage }}%
                </p>
              </div>

              <div class="pt-10 flex items-center justify-between border-t border-white/5">
                <button 
                  @click="activeIdx--" 
                  :disabled="activeIdx === 0"
                  class="text-xs font-display uppercase tracking-widest text-green-500 hover:text-white disabled:opacity-0"
                >
                  ← Previous
                </button>

                <button 
                  v-if="activeIdx < questions.length - 1"
                  @click="activeIdx++" 
                  class="btn-primary px-10"
                >
                  Next Question
                </button>
                
                <button 
                  v-else
                  @click="handleSubmit" 
                  :disabled="submitting || answeredCount === 0"
                  class="btn-primary px-10 !bg-neon-blue !text-black shadow-[0_0_20px_rgba(0,243,255,0.4)]"
                >
                  {{ submitting ? 'Transmitting...' : 'Complete Contest' }}
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </main>
    </div>

    <Transition name="fade">
      <div v-if="zoomedImg" class="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-xl" @click="zoomedImg = null">
        <img :src="toFullUrl(zoomedImg)" class="max-w-full max-h-full object-contain" />
        <div class="absolute top-6 right-6 text-white/90 font-bold text-xl font-display uppercase tracking-widest">Click to Close</div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useContestStore } from '@/stores/contest'
import { BACKEND_URL } from '@/config'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const route = useRoute()
const contestStore = useContestStore()
const contestId = route.params.id

// ── State ─────────────────────────────────────────────────────
const loading = ref(true)
const submitting = ref(false)
const submitted = ref(false)
const questions = ref([])
const answers = ref({})
const activeIdx = ref(0)
const zoomedImg = ref(null)
const contestName = ref('')
const contestEndAt = ref(null)

// ── URL Logic ─────────────────────────────────────────────────
const toFullUrl = (path) => (!path ? null : path.startsWith('http') ? path : BACKEND_URL + path)

async function downloadImg(url) {
  const res = await fetch(toFullUrl(url))
  const blob = await res.blob()
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `Question-${activeIdx.value + 1}.jpg`
  link.click()
}

// ── Timer Logic ───────────────────────────────────────────────
const timeLeft = ref({ H: 0, M: 0, S: 0 })
let timerHandle = null

function tick() {
  if (!contestEndAt.value) return
  const diff = Math.max(0, new Date(contestEndAt.value).getTime() - Date.now())
  timeLeft.value = {
    H: Math.floor(diff / 3600000),
    M: Math.floor((diff % 3600000) / 60000),
    S: Math.floor((diff % 60000) / 1000),
  }
}

// ── Computed ──────────────────────────────────────────────────
const isAnswered = (qId) => {
  const v = answers.value[qId]
  return v !== '' && v !== null && v !== undefined
}
const answeredCount = computed(() => questions.value.filter(q => isAnswered(q.id)).length)

// ── Actions ───────────────────────────────────────────────────
async function handleSubmit() {
  submitting.value = true
  try {
    const answerMap = {}
    questions.value.forEach(q => {
      if (isAnswered(q.id)) answerMap[Number(q.id)] = String(answers.value[q.id])
    })
    await contestStore.submitAnswers(contestId, answerMap)
    submitted.value = true
  } catch (e) {
    alert(e.message || 'Submission failed')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  try {
    const contest = await contestStore.fetchContest(contestId)
    contestName.value = contest.name
    contestEndAt.value = contest.contestEnd
    const qs = await contestStore.getContestQuestions(contestId)
    questions.value = qs
    qs.forEach(q => answers.value[q.id] = '')
    tick()
    timerHandle = setInterval(tick, 1000)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => { if (timerHandle) clearInterval(timerHandle) })
</script>

<style scoped>
.font-display { font-family: 'Space Grotesk', sans-serif; }

.text-neon-blue { color: #00f3ff; text-shadow: 0 0 10px rgba(0, 243, 255, 0.3); }
.text-neon-red { color: #ff0055; text-shadow: 0 0 10px rgba(255, 0, 85, 0.3); }

/* Transitions */
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.3s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateX(20px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-20px); }

/* Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
</style>