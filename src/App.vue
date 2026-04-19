<script setup>
import { useRoute } from 'vue-router';
import Navbar from '@/components/layout/Navbar.vue';
import { RouterView } from 'vue-router';

const route = useRoute();
</script>

<template>
  <div class="page-shell min-h-screen">
    <Navbar v-if="!route.meta.hideNavbar" />
    
    <RouterView />
  </div>
</template>