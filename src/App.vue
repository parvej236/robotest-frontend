<script setup>
import Navbar from '@/components/layout/Navbar.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="page-shell min-h-screen">
    <Navbar />
    <RouterView />
  </div>
</template>
