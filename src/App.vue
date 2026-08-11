<script setup>
import { useRoute } from 'vue-router';
import Navbar from '@/components/layout/Navbar.vue';
import { RouterView } from 'vue-router';
import { useToast } from '@/composables/useToast';

const route = useRoute();
const { toasts, remove } = useToast();
</script>

<template>
  <div class="page-shell min-h-screen">
    <Navbar v-if="!route.matched.some(record => record.meta.hideNavbar)" />
    
    <RouterView />

    <!-- Global Toast Container -->
    <div class="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <TransitionGroup 
        name="toast-slide"
        enter-active-class="transition duration-300 ease-out transform translate-y-3 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in transform opacity-100 scale-95"
        leave-to-class="translate-y-1 opacity-0 scale-90"
      >
        <div 
          v-for="toast in toasts" 
          :key="toast.id" 
          class="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border backdrop-blur-md shadow-2xl text-sm transition-all"
          :class="{
            'bg-emerald-950/90 border-emerald-500/30 text-emerald-200': toast.type === 'success',
            'bg-rose-950/90 border-rose-500/30 text-rose-200': toast.type === 'error',
            'bg-sky-950/90 border-sky-500/30 text-sky-200': toast.type === 'info',
            'bg-amber-950/90 border-amber-500/30 text-amber-250': toast.type === 'warning',
          }"
        >
          <div class="flex items-center gap-2.5 min-w-0">
            <!-- Icon -->
            <span v-if="toast.type === 'success'" class="text-emerald-450 flex-shrink-0 text-base">✅</span>
            <span v-else-if="toast.type === 'error'" class="text-rose-450 flex-shrink-0 text-base">❌</span>
            <span v-else-if="toast.type === 'info'" class="text-sky-450 flex-shrink-0 text-base">ℹ️</span>
            <span v-else-if="toast.type === 'warning'" class="text-amber-450 flex-shrink-0 text-base">⚠️</span>
            <span class="font-medium text-slate-100 truncate">{{ toast.message }}</span>
          </div>
          <button @click="remove(toast.id)" class="text-white/40 hover:text-white/80 transition-colors text-xs ml-2 flex-shrink-0">✕</button>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>