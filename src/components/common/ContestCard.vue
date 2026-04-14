<template>
  <div 
    class="relative bg-[#0D0D0D] border border-white/10 rounded-2xl p-6 hover:border-red-500 transition-all duration-500 group cursor-pointer overflow-hidden shadow-2xl"
    @click="$router.push(`/contests/${contest.id}`)"
  >
    <div class="absolute -inset-px bg-gradient-to-br from-red-600/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

    <div class="relative z-10 flex items-center justify-between mb-6">
      <StatusBadge :status="contest.status" class="scale-110 origin-left shadow-[0_0_15px_rgba(0,0,0,0.5)]" />
      <div class="flex items-center gap-2 text-sm font-bold text-white/90">
        <svg class="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="tracking-wide">{{ formatDate(contest.contestDate) }}</span>
      </div>
    </div>

    <h3 class="relative z-10 text-2xl font-black text-white group-hover:text-red-500 transition-colors mb-3 leading-tight line-clamp-2">
      {{ contest.name }}
    </h3>

    <p v-if="contest.description" class="relative z-10 text-base text-gray-300 font-medium line-clamp-2 mb-8 leading-relaxed opacity-90">
      {{ contest.description }}
    </p>

    <div class="relative z-10 flex items-center justify-between pt-5 border-t border-white/10">
      <div class="flex items-center gap-3">
        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10 border border-red-500/40">
           <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
        </div>
        <span class="text-base font-bold text-white">
          {{ contest.registrationCount || 0 }} 
          <span class="text-white/40 font-semibold ml-1">Joined</span>
        </span>
      </div>

      <button v-if="contest.status === 'REGISTRATION_OPEN'"
        @click.stop="$emit('register', contest)"
        class="bg-red-600 hover:bg-red-500 text-white text-sm font-black uppercase tracking-widest py-2.5 px-6 rounded-xl shadow-[0_5px_20px_rgba(220,38,38,0.4)] transition-all active:scale-95">
        Register
      </button>
      <button v-else-if="contest.status === 'RUNNING'"
        @click.stop="$router.push(`/contests/${contest.id}/join`)"
        class="bg-white text-black hover:bg-gray-200 text-sm font-black uppercase tracking-widest py-2.5 px-6 rounded-xl shadow-[0_5px_20px_rgba(255,255,255,0.15)] transition-all active:scale-95">
        Join Now
      </button>
      <button v-else
        class="bg-white/5 hover:bg-white/10 text-white text-sm font-bold py-2.5 px-6 rounded-xl border border-white/20 transition-all"
        @click.stop="$router.push(`/contests/${contest.id}`)">
        View Details
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