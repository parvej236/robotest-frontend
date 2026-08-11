<template>
  <div class="min-h-screen pt-28 px-4 md:px-6 pb-24 bg-transparent text-white selection:bg-neon-red/30 relative overflow-hidden">
    <!-- Ambient glowing backgrounds -->
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
      <div class="absolute -top-48 -left-48 w-[600px] h-[600px] bg-neon-red/5 rounded-full blur-[140px]"></div>
      <div class="absolute bottom-24 right-0 w-[600px] h-[600px] bg-neon-blue/5 rounded-full blur-[140px]"></div>
    </div>

    <div class="max-w-7xl mx-auto relative z-10">

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-48">
        <LoadingSpinner label="Decrypting Arena Node..." />
      </div>

      <!-- Not Found State -->
      <div v-else-if="!contest"
        class="text-center py-32 bg-dark-900/60 border border-white/10 rounded-3xl backdrop-blur-xl max-w-xl mx-auto corner-bracket grid-bg">
        <div class="w-20 h-20 bg-neon-red/10 border border-neon-red/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(255,0,51,0.2)]">
          <svg class="w-10 h-10 text-neon-red animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="text-2xl font-black uppercase tracking-wider mb-2">Contest Profile Offline</h2>
        <p class="text-slate-400 text-sm font-body mb-8 max-w-sm mx-auto leading-relaxed">
          The requested competition node could not be retrieved from the database. It may have been archived or removed.
        </p>
        <router-link to="/contests"
          class="bg-white text-dark-950 px-8 py-3.5 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-gray-150 transition-all inline-flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.25)] active:scale-95">
          ← Return to Exploration
        </router-link>
      </div>

      <!-- Main Layout -->
      <div v-else>
        <!-- Back Navigation -->
        <router-link to="/contests"
          class="inline-flex items-center gap-3 text-xs md:text-sm font-black text-white/50 hover:text-neon-red mb-8 transition-colors group tracking-widest uppercase font-mono">
          <span
            class="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center group-hover:border-neon-red/50 group-hover:-translate-x-1 transition-all">←</span>
          Return to Arena Board
        </router-link>

        <!-- Two-Column Responsive Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <!-- LEFT COLUMN: Main Info & Standings in Tabs -->
          <div class="lg:col-span-2 space-y-6">
            
            <!-- Navigation Tabs (Gaming HUD Tab bar) -->
            <div class="flex border-b border-white/10 gap-2 bg-dark-900/40 p-1.5 rounded-t-xl backdrop-blur-md">
              <button 
                @click="activeTab = 'overview'"
                :class="[
                  'px-6 py-3 font-display font-black text-xs md:text-sm uppercase tracking-widest transition-all relative cursor-pointer',
                  activeTab === 'overview' 
                    ? 'text-neon-red' 
                    : 'text-white/40 hover:text-white'
                ]"
              >
                Overview
                <div v-if="activeTab === 'overview'" class="absolute bottom-0 left-0 right-0 h-[2.5px] bg-neon-red shadow-[0_0_10px_rgba(255,0,51,0.9)]"></div>
              </button>
              
              <button 
                v-if="contest.status === 'RUNNING' || contest.status === 'FINISHED'"
                @click="activeTab = 'standings'"
                :class="[
                  'px-6 py-3 font-display font-black text-xs md:text-sm uppercase tracking-widest transition-all relative cursor-pointer flex items-center gap-2',
                  activeTab === 'standings' 
                    ? 'text-cyan-400' 
                    : 'text-white/40 hover:text-white'
                ]"
              >
                <span>Live Standings</span>
                <span v-if="contest.status === 'RUNNING'" class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <div v-if="activeTab === 'standings'" class="absolute bottom-0 left-0 right-0 h-[2.5px] bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.9)]"></div>
              </button>
            </div>

            <!-- Tab Content Container -->
            <div class="transition-all duration-300">
              
              <!-- TAB 1: OVERVIEW -->
              <div v-if="activeTab === 'overview'" class="space-y-6">
                <!-- Contest Info card -->
                <div class="relative bg-dark-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 corner-bracket grid-bg overflow-hidden shadow-2xl">
                  <!-- dynamic status top stripe -->
                  <div :class="['absolute top-0 left-0 right-0 h-[3px] transition-colors', statusBarColor]"></div>
                  
                  <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div class="flex items-center gap-3">
                      <StatusBadge :status="contest.status" />
                      <span class="text-xs font-mono font-bold text-white/40 tracking-wider">ARENA NODE #{{ contest.id }}</span>
                    </div>
                    
                    <!-- Joined badge -->
                    <div class="flex items-center gap-2.5 px-4 py-1.5 bg-black/40 rounded-lg border border-white/5 font-mono">
                      <svg class="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span class="text-xs md:text-sm font-black text-white leading-none">
                        {{ contest.registrationCount || 0 }} <span class="text-white/40 font-bold ml-0.5">Joined</span>
                      </span>
                    </div>
                  </div>
                  
                  <h1 class="text-3xl md:text-5xl font-black text-white leading-tight uppercase tracking-wide font-display mb-4">
                    {{ contest.name }}
                  </h1>
                  
                  <p v-if="contest.description" class="text-sm md:text-base text-slate-350 leading-relaxed font-body">
                    {{ contest.description }}
                  </p>
                </div>

                <!-- Date Spec Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div 
                    v-for="d in dateItems" 
                    :key="d.label"
                    class="relative bg-dark-900/40 p-4 rounded-xl border border-white/5 hover:border-white/15 transition-all duration-300 flex items-center justify-between group"
                  >
                    <div>
                      <p class="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">{{ d.label }}</p>
                      <p class="text-sm md:text-base font-bold text-white mt-1 group-hover:text-cyan-400 transition-colors font-mono">{{ d.value }}</p>
                    </div>
                    <div class="text-white/10 group-hover:text-white/30 transition-colors">
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Action Center (Enroll/Register actions) -->
                <div class="bg-dark-900/60 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-center justify-between grid-bg">
                  <div class="text-center sm:text-left">
                    <span class="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">Enrollment State</span>
                    <div class="flex items-center justify-center sm:justify-start gap-2">
                      <span :class="['w-2 h-2 rounded-full animate-ping', isRegistered ? 'bg-green-500' : 'bg-red-500']"></span>
                      <span class="text-base font-black text-white uppercase font-display">
                        {{ isRegistered ? 'Registered' : 'Not Registered' }}
                      </span>
                    </div>
                  </div>

                  <div class="flex flex-wrap gap-4 items-center justify-center sm:justify-end w-full sm:w-auto">
                    <!-- Login to Register Button -->
                    <button v-if="contest.status === 'REGISTRATION_OPEN' && !auth.isLoggedIn" @click="$router.push('/login')"
                      class="bg-white text-dark-950 font-black py-3 px-8 rounded-xl text-xs md:text-sm hover:bg-gray-150 transition-all active:scale-95 flex items-center gap-2.5 shadow-[0_4px_20px_rgba(255,255,255,0.2)] tracking-widest uppercase cursor-pointer">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Login to Register
                    </button>

                    <!-- Register Now Button -->
                    <button v-if="contest.status === 'REGISTRATION_OPEN' && auth.isLoggedIn && !isRegistered"
                      @click="handleRegister" :disabled="registering"
                      class="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black py-3.5 px-8 rounded-xl text-xs md:text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2.5 tracking-widest uppercase cursor-pointer font-display">
                      <span v-if="!registering" class="flex items-center gap-2.5">
                        <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Register for Contest
                      </span>
                      <span v-else class="flex items-center gap-2.5">
                        <LoadingSpinner class="w-4 h-4" /> Processing...
                      </span>
                    </button>

                    <!-- Registered Label -->
                    <div v-if="isRegistered && contest.status === 'REGISTRATION_OPEN'"
                      class="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black py-3 px-6 rounded-xl flex items-center gap-3 text-xs md:text-sm tracking-wider uppercase">
                      <div class="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      Registered & Ready
                    </div>

                    <!-- Join Button -->
                    <router-link v-if="contest.status === 'RUNNING' && isRegistered && !hasSubmitted"
                      :to="`/contests/${contest.id}/join`"
                      class="bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-black py-3.5 px-8 rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all active:scale-95 flex items-center gap-2.5 text-xs md:text-sm tracking-widest uppercase cursor-pointer animate-pulse font-display">
                      ⚡ Join Contest Now
                    </router-link>

                    <!-- Completed Label -->
                    <div v-if="contest.status === 'RUNNING' && isRegistered && hasSubmitted"
                      class="bg-white/10 text-white/40 border border-white/10 font-black py-3 px-6 rounded-xl flex items-center gap-3 text-xs md:text-sm tracking-wider uppercase cursor-not-allowed">
                      <div class="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      Contest Completed
                    </div>
                  </div>
                </div>

                <transition name="slide-up">
                  <div v-if="regSuccess"
                    class="p-4 bg-emerald-500 text-black font-black text-xs md:text-sm rounded-xl flex items-center justify-center gap-2.5 shadow-2xl tracking-wider uppercase">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Enrollment Successful! See you in the contest.
                  </div>
                </transition>
              </div>

              <!-- TAB 2: STANDINGS -->
              <div v-if="activeTab === 'standings'" class="space-y-6">
                <!-- Leaderboard / Live Standings (Scoreboard HUD) -->
                <div class="bg-dark-900/60 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-xl corner-bracket grid-bg">
                  
                  <div class="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                    <div class="flex items-center gap-2.5">
                      <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                      <h2 class="text-xl md:text-2xl font-black text-cyan-400 tracking-wider uppercase font-display">
                        Live Standings
                      </h2>
                    </div>
                    <span class="text-[10px] md:text-xs font-mono font-bold text-white/30 tracking-widest uppercase">Arena Status: Online</span>
                  </div>

                  <div v-if="loadingLB" class="flex justify-center py-24">
                    <LoadingSpinner label="Retrieving Standings Matrix..." />
                  </div>

                  <div v-else-if="leaderboard.length === 0"
                    class="text-center py-20 text-white/30 text-base md:text-lg font-bold border border-dashed border-white/10 rounded-xl bg-black/30 max-w-md mx-auto leading-relaxed">
                    <div class="text-3xl mb-3 opacity-40">🤖</div>
                    Arena is open.<br>Waiting for the first combatant...
                  </div>

                  <div v-else class="overflow-x-auto">
                    <table class="w-full min-w-[700px]">
                      <thead>
                        <tr class="text-left border-b border-white/10 pb-4">
                          <th class="py-3 text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest font-mono">Rank</th>
                          <th class="py-3 text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest font-mono">Combatant</th>

                          <th v-for="n in (leaderboard[0]?.totalQuestions || 0)" :key="n"
                            class="py-3 text-center text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest font-mono">
                            Q{{ n }}
                          </th>

                          <th class="py-3 text-right text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest font-mono">Score</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-white/5">
                        <tr 
                          v-for="entry in leaderboard" 
                          :key="entry.rank"
                          :class="[
                            'group transition-all duration-300',
                            isMe(entry.username) ? 'bg-neon-red/10 border-l-2 border-neon-red font-semibold shadow-[0_0_15px_rgba(255,0,51,0.1)]' : 'hover:bg-white/[0.03]'
                          ]"
                        >
                          <td class="py-4 pl-2">
                            <span v-if="entry.rank <= 3" class="text-2xl drop-shadow-[0_0_5px_rgba(255,255,255,0.4)]">
                              {{ entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉' }}
                            </span>
                            <span v-else class="font-mono font-black text-white/30 px-1 text-sm">#{{ entry.rank }}</span>
                          </td>

                          <td class="py-4">
                            <div class="flex items-center gap-3.5">
                              <div
                                class="w-10 h-10 rounded-full bg-white/5 border border-white/10 overflow-hidden flex-shrink-0"
                              >
                                <!-- Secure referrerpolicy added to avoid 403 blocks -->
                                <img v-if="entry.profileImageUrl" 
                                  :src="toFullUrl(entry.profileImageUrl)"
                                  referrerpolicy="no-referrer"
                                  class="w-full h-full object-cover" 
                                />
                                <div v-else
                                  class="w-full h-full flex items-center justify-center text-neon-red font-black text-lg bg-neon-red/5">
                                  {{ entry.username?.charAt(0).toUpperCase() }}
                                </div>
                              </div>
                              <div>
                                <p class="font-black text-white group-hover:text-neon-red transition-colors text-sm">
                                  @{{ entry.username }}
                                </p>
                                <p class="text-[10px] text-white/40 font-bold tracking-tight uppercase">{{ entry.fullName }}</p>
                              </div>
                            </div>
                          </td>

                          <!-- Question Matrix Status Cells -->
                          <td v-for="(status, idx) in entry.questionStatuses" :key="idx" class="py-4 text-center">
                            <div v-if="status" class="inline-flex flex-col items-center gap-1">
                              <div
                                class="px-2.5 py-1 rounded bg-green-500/10 border border-green-500/20 flex flex-col items-center w-full min-w-[70px]">
                                <span class="text-[11px] font-black text-green-400 font-mono">{{ status.score.toFixed(2) }}</span>
                                <div v-if="status.timePenalty > 0" class="text-[9px] font-bold text-green-500 font-mono" title="Time Penalty">
                                  -{{ status.timePenalty.toFixed(2) }}
                                </div>
                                <div v-if="status.wrongPenalty > 0" class="text-[9px] font-bold text-red-500 font-mono" title="Wrong Penalty">
                                  -{{ status.wrongPenalty.toFixed(2) }} ({{ status.wrongCount }})
                                </div>
                              </div>
                              <div v-if="status.timeTakenSeconds != null" class="text-[9px] mt-0.5 text-white/60 font-mono leading-tight whitespace-nowrap">
                                {{ formatDuration(status.timeTakenSeconds) }}/{{ formatDuration(status.timeLimits) }}
                              </div>
                            </div>
                            <div v-else class="w-6 h-[2px] bg-white/10 rounded-full mx-auto"></div>
                          </td>

                          <td class="py-4 pr-3 text-right">
                            <div class="flex flex-col items-end">
                              <span class="text-xl font-black text-neon-red font-display tracking-wider leading-none">
                                {{ entry.totalScore.toFixed(2) }}
                              </span>
                              <span v-if="entry.lastSubmissionTime" class="text-[9px] font-mono text-white/40 mt-1 uppercase">
                                {{ formatTime(entry.lastSubmissionTime) }}
                              </span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>

          </div>

          <!-- RIGHT COLUMN: Sidebar HUD Widgets (1 col wide) -->
          <div class="space-y-6">
            
            <!-- Gaming Countdown widget -->
            <div 
              v-if="countdownLabel" 
              :class="[
                'relative bg-dark-900/60 backdrop-blur-xl p-6 rounded-2xl border transition-all duration-500 corner-bracket grid-bg text-center',
                countdownBorderColor
              ]"
            >
              <div class="flex items-center justify-center gap-2 mb-4">
                <span :class="['w-2 h-2 rounded-full animate-ping', countdownPulseColor]"></span>
                <span class="text-xs font-mono font-bold tracking-[0.25em] text-white/60 uppercase">
                  {{ countdownLabel }}
                </span>
              </div>

              <!-- Time display console -->
              <div class="flex justify-center items-center gap-4 py-4 px-2 bg-black/60 rounded-xl border border-white/5 shadow-inner">
                <div v-for="(val, key) in timeLeft" :key="key" class="flex flex-col items-center">
                  <span class="text-3xl md:text-4xl font-black text-white tabular-nums tracking-wide font-display leading-none">
                    {{ String(val).padStart(2, '0') }}
                  </span>
                  <span class="text-[9px] font-black text-neon-red uppercase tracking-widest mt-1.5 font-mono">{{ key }}</span>
                </div>
              </div>
            </div>

            <!-- Stats & Spec Widget -->
            <div class="bg-dark-900/60 border border-white/10 rounded-2xl p-6 corner-bracket grid-bg space-y-4">
              <h4 class="text-sm font-black uppercase tracking-wider text-white border-b border-white/10 pb-3 font-display">
                Arena Node Spec
              </h4>

              <div class="space-y-3 font-mono">
                <div class="flex justify-between text-xs py-1">
                  <span class="text-white/40 uppercase">Node ID</span>
                  <span class="text-white font-bold">#{{ contest.id }}</span>
                </div>
                <div class="flex justify-between text-xs py-1 border-t border-white/5">
                  <span class="text-white/40 uppercase">Mode</span>
                  <span class="text-cyan-400 font-bold uppercase">Speed CAD</span>
                </div>
                <div class="flex justify-between text-xs py-1 border-t border-white/5">
                  <span class="text-white/40 uppercase">Joined</span>
                  <span class="text-white font-bold">{{ contest.registrationCount || 0 }} Competitors</span>
                </div>
                <div class="flex justify-between text-xs py-1 border-t border-white/5">
                  <span class="text-white/40 uppercase">Status</span>
                  <span :class="['font-bold uppercase', contest.status === 'RUNNING' ? 'text-emerald-400' : 'text-cyan-400']">
                    {{ contest.status.replace('_', ' ') }}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContestStore } from '@/stores/contest'
import { useAuthStore } from '@/stores/auth'
import { BACKEND_URL } from '@/config'
import StatusBadge from '@/components/common/StatusBadge.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { format } from 'date-fns'
import { useHead } from '@vueuse/head'

const route = useRoute()
const router = useRouter()
const contestStore = useContestStore()
const auth = useAuthStore()

// ── Head / SEO tags ───────────────────────────────────────────
useHead({
  title: computed(() => contest.value ? `${contest.value.name} - Arena` : 'Loading Arena...'),
  meta: [
    {
      name: 'description',
      content: computed(() => contest.value?.description || 'View contest details and live leaderboards.')
    }
  ]
})

// ── State ─────────────────────────────────────────────────────
const contest = ref(null)
const loading = ref(true)
const leaderboard = ref([])
const loadingLB = ref(false)
const isRegistered = ref(false)
const registering = ref(false)
const regError = ref('')
const regSuccess = ref(false)
const hasSubmitted = ref(false)

const activeTab = ref('overview')

// ── Helpers ───────────────────────────────────────────────────
function toFullUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return BACKEND_URL + path
}

function formatDT(d) {
  if (!d) return 'TBD'
  try { return format(new Date(d), 'MMM dd, hh:mm a') } catch { return d }
}

function formatTime(d) {
  if (!d) return '-'
  try { return format(new Date(d), 'hh:mm a') } catch { return d }
}

function formatDuration(sec) {
  if (sec == null) return '-'
  if (sec === 0) return '0s'
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  let res = []
  if (h > 0) res.push(`${h}h`)
  if (m > 0 || h > 0) res.push(`${m}m`)
  res.push(`${s}s`)
  return res.join(' ')
}

const isMe = (entryUsername) => {
  return auth.isLoggedIn && entryUsername === auth.username
}

const dateItems = computed(() => {
  if (!contest.value) return []
  return [
    { label: 'Registration Start', value: formatDT(contest.value.registrationStart) },
    { label: 'Registration End', value: formatDT(contest.value.registrationEnd) },
    { label: 'Contest Launch', value: formatDT(contest.value.contestStart || contest.value.contestDate) },
    { label: 'Contest Concludes', value: formatDT(contest.value.contestEnd) },
  ]
})

// ── Countdown Timer Logic ────────────────────────────────────
const timeLeft = ref({ HR: 0, MIN: 0, SEC: 0 })
let timerHandle = null

const countdownLabel = computed(() => {
  if (!contest.value) return ''
  const statusLabels = {
    UPCOMING: 'Registration Opens In',
    REGISTRATION_OPEN: 'Contest Starts In',
    RUNNING: 'Contest Ends In'
  }
  return statusLabels[contest.value.status] || ''
})

const countdownTarget = computed(() => {
  if (!contest.value) return null
  const targets = {
    UPCOMING: contest.value.registrationStart,
    REGISTRATION_OPEN: contest.value.contestStart,
    RUNNING: contest.value.contestEnd
  }
  return targets[contest.value.status] || null
})

function tick() {
  const target = countdownTarget.value
  if (!target) return
  const diff = Math.max(0, new Date(target).getTime() - Date.now())
  timeLeft.value = {
    HR: Math.floor(diff / 3_600_000),
    MIN: Math.floor((diff % 3_600_000) / 60_000),
    SEC: Math.floor((diff % 60_000) / 1_000),
  }
}

// ── Actions ──────────────────────────────────────────────────
async function handleRegister() {
  if (!auth.isLoggedIn) { router.push('/login'); return }
  registering.value = true
  try {
    await contestStore.registerForContest(contest.value.id)
    isRegistered.value = true
    regSuccess.value = true
    setTimeout(() => { regSuccess.value = false }, 5000)
    if (contest.value) contest.value.registrationCount = (contest.value.registrationCount || 0) + 1
  } catch (e) {
    regError.value = e.message || 'Registration failed.'
  } finally {
    registering.value = false
  }
}

// ── Styles ────────────────────────────────────────────────────
const statusBarColor = computed(() => {
  if (!contest.value) return ''
  if (contest.value.status === 'RUNNING') return 'bg-emerald-500 shadow-[0_1px_10px_rgba(16,185,129,0.5)]'
  if (contest.value.status === 'REGISTRATION_OPEN') return 'bg-cyan-500 shadow-[0_1px_10px_rgba(6,182,212,0.5)]'
  if (contest.value.status === 'UPCOMING') return 'bg-amber-500 shadow-[0_1px_10px_rgba(245,158,11,0.5)]'
  return 'bg-rose-500/40'
})

const countdownBorderColor = computed(() => {
  if (!contest.value) return 'border-white/10'
  if (contest.value.status === 'RUNNING') return 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
  if (contest.value.status === 'REGISTRATION_OPEN') return 'border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
  if (contest.value.status === 'UPCOMING') return 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.12)]'
  return 'border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.1)]'
})

const countdownPulseColor = computed(() => {
  if (!contest.value) return 'bg-white/40'
  if (contest.value.status === 'RUNNING') return 'bg-emerald-500'
  if (contest.value.status === 'REGISTRATION_OPEN') return 'bg-cyan-500'
  if (contest.value.status === 'UPCOMING') return 'bg-amber-500'
  return 'bg-rose-500'
})

const titleHoverColor = computed(() => {
  if (!contest.value) return ''
  if (contest.value.status === 'RUNNING') return 'hover:text-emerald-400'
  if (contest.value.status === 'REGISTRATION_OPEN') return 'hover:text-cyan-400'
  if (contest.value.status === 'UPCOMING') return 'hover:text-amber-400'
  return 'hover:text-rose-450'
})

// ── Lifecycle ────────────────────────────────────────────────
onMounted(async () => {
  try {
    const res = await contestStore.fetchContest(route.params.id)
    contest.value = res

    if (auth.isLoggedIn) {
      isRegistered.value = await contestStore.isRegistered(route.params.id)
      hasSubmitted.value = await contestStore.hasSubmittedContest(route.params.id)
    }

    if (contest.value.status === 'RUNNING' || contest.value.status === 'FINISHED') {
      loadingLB.value = true
      try {
        leaderboard.value = await contestStore.getLeaderboard(route.params.id)
        // Set the active tab default to standings if contest is active or finished
        activeTab.value = 'standings'
      } finally {
        loadingLB.value = false
      }
    }

    tick()
    timerHandle = setInterval(tick, 1000)
  } catch (e) {
    console.error('Mount Error:', e)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  if (timerHandle) clearInterval(timerHandle)
})
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>