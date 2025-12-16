<template>
  <div
    id="cyberpunkroot"
    class="cyberpunk"
  >
    <CyberpunkPortfolio />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { usePreferencesStore } from '@/stores/preferences';

const preferencesStore = usePreferencesStore();

onMounted(() => {
  // Check for URL parameters on mount
  preferencesStore.checkUrlParameters();
});
</script>
