<template>
  <div class="min-h-screen bg-dark-900 grid-bg">
    <div class="scan-line"></div>
    <Navbar />
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import Navbar from '@/components/layout/Navbar.vue'
</script>
