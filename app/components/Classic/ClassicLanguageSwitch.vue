<template>
  <div
    class="flex overflow-hidden rounded-md border border-gray-300 dark:border-gray-600"
    role="group"
    :aria-label="isEnglish ? 'Language' : 'Langue'"
  >
    <button
      v-for="lang in languages"
      :key="lang"
      type="button"
      class="text-xs font-semibold uppercase tracking-wider transition-colors"
      :class="[
        large ? 'h-11 w-12' : 'px-2.5 py-1',
        currentLanguage === lang
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400',
      ]"
      :aria-label="lang === 'fr' ? 'FR, français' : 'EN, English'"
      :aria-pressed="currentLanguage === lang"
      @click="setLanguage(lang)"
    >
      {{ lang }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { usePreferencesStore } from '../../stores/preferences';

withDefaults(defineProps<{
  // Touch-sized buttons, for the mobile menu.
  large?: boolean;
}>(), {
  large: false,
});

const languages = ['fr', 'en'] as const;

const preferencesStore = usePreferencesStore();
const isEnglish = computed(() => preferencesStore.isEnglish);
const currentLanguage = computed(() => preferencesStore.lang);

function setLanguage(lang: 'en' | 'fr') {
  if (lang === preferencesStore.language) return;
  preferencesStore.setPreferences(lang);
  preferencesStore.updateUrlParameters();
}
</script>
