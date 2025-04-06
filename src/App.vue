<template>
  <div>
    <LanguageVersionModal/>

    <div v-if="preferencesStore.showModal">
      <!-- Show nothing until modal is closed -->
    </div>
    <div v-else>
      <ClassicPortfolio v-if="preferencesStore.isClassic"/>
      <CyberpunkPortfolio v-else-if="preferencesStore.isCyberpunk"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import ClassicPortfolio from '@/components/Classic/ClassicPortfolio.vue';
import CyberpunkPortfolio from '@/components/Cyberpunk/CyberpunkPortfolio.vue';
import LanguageVersionModal from '@/components/LanguageVersionModal.vue';
import { usePreferencesStore } from '@/stores/preferences';

const preferencesStore = usePreferencesStore();

onMounted(() => {
  // Check for URL parameters on mount
  preferencesStore.checkUrlParameters();
});
</script>
