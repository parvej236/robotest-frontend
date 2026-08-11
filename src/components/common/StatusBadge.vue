<template>
  <span 
    :class="[
      'inline-flex items-center gap-1.5 font-mono font-black uppercase tracking-widest rounded-md border backdrop-blur-md px-3 py-1 text-[10px] transition-all duration-300',
      statusClasses
    ]"
  >
    <span :class="['w-1.5 h-1.5 rounded-full animate-ping', dotClass]"></span>
    <span>{{ label }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, required: true }
})

const config = {
  UPCOMING: { 
    label: 'Upcoming', 
    style: 'text-amber-400 border-amber-500/30 bg-amber-500/10 shadow-[0_0_10px_rgba(245,158,11,0.15)]',
    dot: 'bg-amber-400' 
  },
  REGISTRATION_OPEN: { 
    label: 'Reg Open', 
    style: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10 shadow-[0_0_10px_rgba(6,182,212,0.15)]',
    dot: 'bg-cyan-400' 
  },
  RUNNING: { 
    label: 'Live Now', 
    style: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.25)] font-bold',
    dot: 'bg-emerald-400' 
  },
  FINISHED: { 
    label: 'Finished', 
    style: 'text-rose-400/80 border-rose-500/20 bg-rose-500/5 shadow-none',
    dot: 'bg-rose-400/60' 
  },
}

const cfg = computed(() => config[props.status] || config.UPCOMING)
const label = computed(() => cfg.value.label)
const statusClasses = computed(() => cfg.value.style)
const dotClass = computed(() => cfg.value.dot)
</script>
