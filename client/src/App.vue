<script setup lang="ts">
import AppNavbar from '@/components/AppNavbar.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <main>
    <AppNavbar />
    <RouterView />
  </main>
</template>
