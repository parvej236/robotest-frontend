<template>
  <span :class="['inline-flex items-center gap-1 font-display font-semibold uppercase tracking-wider rounded-sm', sizeClasses, colorClasses]">
    <span :class="['rounded-full', dotClasses, 'animate-pulse']"></span>
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, required: true },
  size: { type: String, default: 'sm' }
})

const config = {
  UPCOMING: { label: 'Upcoming', color: 'text-white/60 border-white/20 bg-white/5', dot: 'bg-white/40' },
  REGISTRATION_OPEN: { label: 'Reg Open', color: 'text-neon-blue border-neon-blue/30 bg-neon-blue/10', dot: 'bg-neon-blue' },
  RUNNING: { label: 'Live', color: 'text-green-400 border-green-500/30 bg-green-500/10', dot: 'bg-green-400' },
  FINISHED: { label: 'Finished', color: 'text-white/40 border-white/10 bg-white/5', dot: 'bg-white/30' },
}

const cfg = computed(() => config[props.status] || config.UPCOMING)
const label = computed(() => cfg.value.label)
const colorClasses = computed(() => `${cfg.value.color} border`)
const dotClasses = computed(() => `${cfg.value.dot} ${props.size === 'xs' ? 'w-1 h-1' : 'w-1.5 h-1.5'}`)
const sizeClasses = computed(() => props.size === 'xs' ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]')
</script>
