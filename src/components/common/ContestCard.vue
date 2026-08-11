<template>
  <div 
    :class="[
      'relative group bg-dark-900/80 backdrop-blur-2xl border rounded-2xl p-7 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col justify-between h-full corner-bracket grid-bg min-h-[420px]',
      shadowClass
    ]"
    @click="$router.push(`/contests/${contest.id}`)"
  >
    <!-- Background glowing gradient based on status -->
    <div :class="['absolute -inset-px opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-2xl pointer-events-none bg-gradient-to-br', gradientClass]"></div>
    
    <!-- Gaming HUD Top Border Accent line -->
    <div :class="['absolute top-0 left-0 right-0 h-[3px] transition-all duration-500', statusBarColor]"></div>

    <div class="relative z-10 flex flex-col h-full justify-between">
      <div>
        <!-- Top Row: Status Badge & Date -->
        <div class="flex items-center justify-between mb-6">
          <StatusBadge :status="contest.status" class="scale-110 origin-left" />
          <div class="flex items-center gap-2 text-xs md:text-sm font-bold text-white/50 group-hover:text-white transition-colors font-mono">
            <svg :class="['w-4 h-4 md:w-5 h-5 transition-colors', statusTextColor]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ formatDate(contest.contestDate) }}</span>
          </div>
        </div>

        <!-- Tech Header tag -->
        <div class="flex items-center gap-1.5 mb-2">
          <span :class="['w-2 h-2 rounded-full animate-pulse', statusBgColor]"></span>
          <span class="text-[10px] md:text-xs font-mono font-bold tracking-[0.3em] uppercase text-white/40">
            System Node: 0{{ contest.id }}
          </span>
        </div>

        <!-- Contest Title (Properly Large & Futuristic) -->
        <h3 :class="['text-2xl md:text-3xl font-black text-white transition-all duration-300 mb-4 leading-tight tracking-wide uppercase font-display', titleHoverColor]">
          {{ contest.name }}
        </h3>

        <!-- Description (High Contrast & Clear) -->
        <p v-if="contest.description" class="text-sm md:text-base text-slate-300 font-body line-clamp-3 mb-6 leading-relaxed group-hover:text-slate-100 transition-colors">
          {{ contest.description }}
        </p>
      </div>

      <div>
        <!-- Stats Grid (Futuristic Specs Interface) -->
        <div class="grid grid-cols-3 gap-2 py-4 mb-6 border-t border-b border-white/10 bg-black/60 rounded-xl px-3 shadow-inner">
          <!-- Joined Count -->
          <div class="flex flex-col items-center justify-center text-center">
            <span class="text-[10px] md:text-xs uppercase font-bold text-slate-400 tracking-widest mb-1.5">Joined</span>
            <div class="flex items-center gap-1.5">
              <svg :class="['w-4 h-4 md:w-5 h-5', statusTextColor]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span class="text-base md:text-xl font-black text-white font-mono leading-none">{{ contest.registrationCount || 0 }}</span>
            </div>
          </div>

          <!-- Questions Count -->
          <div class="flex flex-col items-center justify-center text-center border-l border-r border-white/10">
            <span class="text-[10px] md:text-xs uppercase font-bold text-slate-400 tracking-widest mb-1.5">Tasks</span>
            <div class="flex items-center gap-1.5">
              <svg :class="['w-4 h-4 md:w-5 h-5', statusTextColor]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span class="text-base md:text-xl font-black text-white font-mono leading-none">{{ contest.questionCount || 0 }}</span>
            </div>
          </div>

          <!-- Duration -->
          <div class="flex flex-col items-center justify-center text-center">
            <span class="text-[10px] md:text-xs uppercase font-bold text-slate-400 tracking-widest mb-1.5">Duration</span>
            <div class="flex items-center gap-1.5">
              <svg :class="['w-4 h-4 md:w-5 h-5', statusTextColor]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-base md:text-xl font-black text-white font-mono leading-none">{{ durationText || 'TBD' }}</span>
            </div>
          </div>
        </div>

        <!-- Footer Row: Action Button / Review details -->
        <div class="flex items-center justify-between pt-2">
          <div class="text-xs md:text-sm font-mono font-bold text-white/30 group-hover:text-white/50 transition-colors uppercase tracking-wider">
            ID: #{{ contest.id }}
          </div>

          <!-- Buttons: Properly sized, colorful gradients, glowing shadows -->
          <button v-if="contest.status === 'REGISTRATION_OPEN'"
            @click.stop="$emit('register', contest)"
            class="relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 text-black text-xs md:text-sm font-black uppercase tracking-widest py-3 px-6 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.7)] active:scale-95 cursor-pointer font-display">
            Register
          </button>

          <button v-else-if="contest.status === 'RUNNING'"
            @click.stop="$router.push(`/contests/${contest.id}/join`)"
            class="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 text-black text-xs md:text-sm font-black uppercase tracking-widest py-3 px-6 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.7)] active:scale-95 animate-pulse cursor-pointer font-display">
            Join Now
          </button>

          <button v-else-if="contest.status === 'UPCOMING'"
            class="relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 text-black text-xs md:text-sm font-black uppercase tracking-widest py-3 px-6 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] cursor-pointer font-display"
            @click.stop="$router.push(`/contests/${contest.id}`)">
            Details
          </button>

          <button v-else
            class="bg-white/5 hover:bg-rose-500/10 text-rose-400 hover:text-rose-350 text-xs md:text-sm font-black uppercase tracking-widest py-3 px-6 rounded-xl border border-white/10 hover:border-rose-500/30 transition-all duration-300 cursor-pointer font-display"
            @click.stop="$router.push(`/contests/${contest.id}`)">
            Review
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { format } from 'date-fns'
import StatusBadge from './StatusBadge.vue'

const props = defineProps({ contest: { type: Object, required: true } })
defineEmits(['register'])

function formatDate(d) {
  if (!d) return 'TBD'
  try { return format(new Date(d), 'MMM dd, yyyy') } catch { return d }
}

const durationText = computed(() => {
  if (!props.contest.contestStart || !props.contest.contestEnd) return null
  const start = new Date(props.contest.contestStart)
  const end = new Date(props.contest.contestEnd)
  const diffMs = end - start
  if (diffMs <= 0) return null
  const diffMins = Math.floor(diffMs / (1000 * 60))
  if (diffMins < 60) return `${diffMins}m`
  const hours = Math.floor(diffMins / 60)
  const mins = diffMins % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
})

// Dynamic border and shadow glows matching each contest's status
const shadowClass = computed(() => {
  if (props.contest.status === 'RUNNING') {
    return 'hover:shadow-[0_0_35px_rgba(16,185,129,0.2)] hover:border-emerald-500/50 border-emerald-500/20'
  }
  if (props.contest.status === 'REGISTRATION_OPEN') {
    return 'hover:shadow-[0_0_35px_rgba(6,182,212,0.2)] hover:border-cyan-500/50 border-cyan-500/20'
  }
  if (props.contest.status === 'UPCOMING') {
    return 'hover:shadow-[0_0_35px_rgba(245,158,11,0.18)] hover:border-amber-500/50 border-amber-500/20'
  }
  // FINISHED
  return 'hover:shadow-[0_0_25px_rgba(244,63,94,0.15)] hover:border-rose-500/30 border-rose-500/10'
})

const gradientClass = computed(() => {
  if (props.contest.status === 'RUNNING') return 'from-emerald-500/10 via-transparent to-transparent'
  if (props.contest.status === 'REGISTRATION_OPEN') return 'from-cyan-500/10 via-transparent to-transparent'
  if (props.contest.status === 'UPCOMING') return 'from-amber-500/10 via-transparent to-transparent'
  return 'from-rose-500/5 via-transparent to-transparent'
})

const statusBarColor = computed(() => {
  if (props.contest.status === 'RUNNING') return 'bg-emerald-500 shadow-[0_1px_10px_rgba(16,185,129,0.5)]'
  if (props.contest.status === 'REGISTRATION_OPEN') return 'bg-cyan-500 shadow-[0_1px_10px_rgba(6,182,212,0.5)]'
  if (props.contest.status === 'UPCOMING') return 'bg-amber-500 shadow-[0_1px_10px_rgba(245,158,11,0.5)]'
  return 'bg-rose-500/40'
})

const statusBgColor = computed(() => {
  if (props.contest.status === 'RUNNING') return 'bg-emerald-400'
  if (props.contest.status === 'REGISTRATION_OPEN') return 'bg-cyan-400'
  if (props.contest.status === 'UPCOMING') return 'bg-amber-400'
  return 'bg-rose-400/50'
})

const statusTextColor = computed(() => {
  if (props.contest.status === 'RUNNING') return 'text-emerald-400'
  if (props.contest.status === 'REGISTRATION_OPEN') return 'text-cyan-400'
  if (props.contest.status === 'UPCOMING') return 'text-amber-400'
  return 'text-rose-400/70'
})

const titleHoverColor = computed(() => {
  if (props.contest.status === 'RUNNING') return 'group-hover:glow-text-green group-hover:text-emerald-400'
  if (props.contest.status === 'REGISTRATION_OPEN') return 'group-hover:glow-text-cyan group-hover:text-cyan-400'
  if (props.contest.status === 'UPCOMING') return 'group-hover:glow-text-amber group-hover:text-amber-400'
  return 'group-hover:glow-text-rose group-hover:text-rose-400'
})
</script>

<style scoped>
.group:hover .glow-text-green {
  text-shadow: 0 0 15px rgba(16, 185, 129, 0.6);
}
.group:hover .glow-text-cyan {
  text-shadow: 0 0 15px rgba(6, 182, 212, 0.6);
}
.group:hover .glow-text-amber {
  text-shadow: 0 0 15px rgba(245, 158, 11, 0.6);
}
.group:hover .glow-text-rose {
  text-shadow: 0 0 15px rgba(244, 63, 94, 0.5);
}
</style>