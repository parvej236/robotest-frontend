<template>
  <div class="flex flex-col items-center justify-center gap-4">
    <div class="relative w-12 h-12">
      <div class="absolute inset-0 border-2 border-neon-red/20 rounded-full"></div>
      <div class="absolute inset-0 border-2 border-transparent border-t-neon-red rounded-full animate-spin"></div>
      <div class="absolute inset-2 border-2 border-transparent border-b-neon-blue rounded-full animate-spin" style="animation-direction: reverse; animation-duration: 0.7s;"></div>
    </div>
    <p v-if="label" class="text-xs font-display tracking-widest text-white/40 uppercase">{{ label }}</p>
  </div>
</template>
<script setup>
defineProps({ label: { type: String, default: '' } })
</script>
