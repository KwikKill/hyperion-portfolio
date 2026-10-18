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

import { usePreferencesStore } from '../../stores/preferences';
import { isLanguage } from '../../utils/language';

definePageMeta({
  validate: (route) => isLanguage(route.params.lang),
  middleware: 'language',
  // One page for /fr and /en: switching language keeps the page and its scroll position.
  key: 'cyberpunk',
  scrollToTop: false,
});

const preferencesStore = usePreferencesStore();

onMounted(() => {
  preferencesStore.restoreTheme();
});
</script>
