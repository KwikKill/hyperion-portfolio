<template>
  <div class="bg-theme-bg min-h-screen flex flex-col">
    <div class="flex-1 bg-theme-bg text-theme-text">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from 'nuxt/app';
import { computed } from 'vue';

import { useShareMeta } from './composables/useShareMeta';
import { usePreferencesStore } from './stores/preferences';

const preferencesStore = usePreferencesStore();

// Screen readers pick their voice from <html lang>: follow the language of the content.
useHead({ htmlAttrs: { lang: computed(() => preferencesStore.lang) } });
useShareMeta();
</script>
