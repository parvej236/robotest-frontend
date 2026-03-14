<template>
  <div class="min-h-screen pt-20 px-4 pb-12">
    <div class="max-w-3xl mx-auto">
      <router-link :to="`/contests/${$route.params.id}`"
        class="inline-flex items-center gap-1 text-xs font-display text-white/40 hover:text-white mb-6 transition-colors tracking-wider">
        ← Back to Contest
      </router-link>

      <div v-if="loading" class="flex justify-center py-20"><LoadingSpinner label="Loading questions..." /></div>

      <div v-else-if="submitted" class="glass-card neon-border-blue p-10 text-center">
        <div class="text-5xl mb-4">🎯</div>
        <h2 class="font-display text-2xl font-black text-neon-blue uppercase tracking-wider mb-2">Submitted!</h2>
        <p class="text-white/60 font-body text-sm mb-6">Your answers have been recorded. Check the leaderboard for your rank.</p>
        <div class="flex gap-3 justify-center">
          <router-link :to="`/contests/${$route.params.id}`" class="btn-primary">View Leaderboard</router-link>
          <router-link to="/dashboard" class="btn-ghost">Dashboard</router-link>
        </div>
      </div>

      <div v-else>
        <!-- Contest info bar -->
        <div class="glass-card neon-border-red p-4 mb-6 flex items-center justify-between">
          <div>
            <h1 class="font-display font-black text-white text-lg">{{ contestName }}</h1>
            <div class="flex items-center gap-2 mt-1">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span class="text-xs font-display tracking-widest text-green-400 uppercase">Live Contest</span>
            </div>
          </div>
          <div class="text-right">
            <div class="text-xs text-white/40 font-display tracking-wider uppercase mb-1">Ends In</div>
            <div class="flex gap-2">
              <span v-for="(val, key) in timeLeft" :key="key" class="font-display font-black text-neon-red text-lg">
                {{ String(val).padStart(2,'0') }}<span class="text-xs text-white/30">{{ key.charAt(0) }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Questions -->
        <div v-if="questions.length === 0" class="text-center py-12 glass-card">
          <p class="text-white/40 font-body">No questions found for this contest</p>
        </div>

        <form v-else @submit.prevent="handleSubmit">
          <div class="space-y-6">
            <div v-for="(q, idx) in questions" :key="q.id"
                 class="glass-card p-6 relative"
                 :class="answers[q.id] ? 'neon-border-blue' : ''">
              <!-- Question number -->
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded bg-neon-red/10 border border-neon-red/30 flex items-center justify-center flex-shrink-0">
                  <span class="font-display text-sm font-black text-neon-red">{{ idx + 1 }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-body text-white/90 text-sm leading-relaxed mb-4">{{ q.description }}</p>

                  <!-- Image -->
                  <div v-if="q.imageUrl" class="mb-4 rounded overflow-hidden border border-white/10">
                    <img :src="q.imageUrl" class="w-full max-h-64 object-contain bg-dark-800" :alt="`Question ${idx+1} image`" />
                  </div>

                  <!-- Video -->
                  <div v-if="q.videoUrl" class="mb-4 rounded overflow-hidden border border-white/10">
                    <video :src="q.videoUrl" controls class="w-full max-h-48 bg-black"></video>
                  </div>

                  <!-- Answer input -->
                  <div class="flex items-center gap-3">
                    <div class="flex-1">
                      <label class="label-text">Your Answer</label>
                      <input v-model="answers[q.id]" type="number" step="any"
                             :placeholder="q.type === 'NUMERIC_MCQ' ? 'Enter numeric answer' : 'Enter your answer'"
                             class="input-field" />
                    </div>
                    <div v-if="q.type === 'NUMERIC_MCQ' && q.errorPercentage" class="text-xs font-mono text-white/30 mt-5 flex-shrink-0">
                      ±{{ q.errorPercentage }}%
                    </div>
                    <!-- Answer status indicator -->
                    <div v-if="answers[q.id]" class="mt-5 w-2 h-2 bg-neon-blue rounded-full flex-shrink-0"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit bar -->
          <div class="sticky bottom-4 mt-8">
            <div class="glass-panel neon-border-red p-4 flex items-center justify-between">
              <div class="text-xs font-display text-white/50 tracking-wider">
                <span class="text-neon-blue font-bold">{{ answeredCount }}</span> / {{ questions.length }} answered
              </div>
              <div class="flex gap-3">
                <button type="submit" :disabled="submitting"
                        class="btn-primary flex items-center gap-2">
                  <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  {{ submitting ? 'Submitting...' : 'Submit Answers' }}
                </button>
              </div>
            </div>
            <div v-if="submitError" class="mt-2 text-xs text-neon-red font-body text-center">{{ submitError }}</div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useContestStore } from '@/stores/contest'
import { useCountdown } from '@/composables/useCountdown'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const route = useRoute()
const contestStore = useContestStore()

const loading = ref(true)
const submitting = ref(false)
const submitted = ref(false)
const submitError = ref('')
const questions = ref([])
const answers = ref({})
const contestName = ref('')
const contestEnd = ref(null)

const { timeLeft } = { timeLeft: ref({ days: 0, hours: 0, minutes: 0, seconds: 0 }) }

const answeredCount = computed(() => Object.keys(answers.value).filter(k => answers.value[k] !== '' && answers.value[k] !== null && answers.value[k] !== undefined).length)

async function handleSubmit() {
  submitError.value = ''
  submitting.value = true
  try {
    const answerMap = {}
    Object.entries(answers.value).forEach(([qId, ans]) => {
      if (ans !== '' && ans !== null && ans !== undefined) answerMap[Number(qId)] = String(ans)
    })
    await contestStore.submitAnswers(route.params.id, answerMap)
    submitted.value = true
  } catch (e) {
    submitError.value = e.response?.data?.message || 'Failed to submit answers'
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  try {
    const contest = await contestStore.fetchContest(route.params.id)
    contestName.value = contest.name
    contestEnd.value = contest.contestEnd
    questions.value = await contestStore.getContestQuestions(route.params.id)
    questions.value.forEach(q => { answers.value[q.id] = '' })
  } catch (e) { console.error(e) }
  finally { loading.value = false }
})
</script>
