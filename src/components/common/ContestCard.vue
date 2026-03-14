<template>
  <div class="relative glass-card p-5 hover:border-neon-red/30 transition-all duration-300 group cursor-pointer corner-bracket"
       @click="$router.push(`/contests/${contest.id}`)">
    <!-- Glow overlay on hover -->
    <div class="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
         style="background: radial-gradient(ellipse at 50% 0%, rgba(255,0,51,0.05) 0%, transparent 70%)"></div>

    <div class="flex items-start justify-between mb-3">
      <StatusBadge :status="contest.status" />
      <span class="text-xs font-mono text-white/30">{{ formatDate(contest.contestDate) }}</span>
    </div>

    <h3 class="font-display font-bold text-base text-white group-hover:text-neon-red transition-colors mb-2 leading-tight line-clamp-2">
      {{ contest.name }}
    </h3>

    <p v-if="contest.description" class="text-xs text-white/40 font-body line-clamp-2 mb-4 leading-relaxed">
      {{ contest.description }}
    </p>

    <div class="flex items-center justify-between mt-auto">
      <span class="text-xs font-mono text-white/30 flex items-center gap-1">
        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        {{ contest.registrationCount || 0 }}
      </span>
      <button v-if="contest.status === 'REGISTRATION_OPEN'"
        @click.stop="$emit('register', contest)"
        class="btn-primary py-1 px-3 text-[10px]">
        Register
      </button>
      <button v-else-if="contest.status === 'RUNNING'"
        @click.stop="$router.push(`/contests/${contest.id}/join`)"
        class="btn-secondary py-1 px-3 text-[10px]">
        Join Now
      </button>
      <button v-else
        class="btn-ghost py-1 px-3 text-[10px]" @click.stop="$router.push(`/contests/${contest.id}`)">
        View
      </button>
    </div>
  </div>
</template>

<script setup>
import { format } from 'date-fns'
import StatusBadge from './StatusBadge.vue'

defineProps({ contest: { type: Object, required: true } })
defineEmits(['register'])

function formatDate(d) {
  if (!d) return 'TBD'
  try { return format(new Date(d), 'MMM dd, yyyy') } catch { return d }
}
</script>
