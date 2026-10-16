<template>
  <div
    class="flex border border-primary/40"
    role="group"
    :aria-label="isEnglish ? 'Language' : 'Langue'"
  >
    <button
      v-for="lang in languages"
      :key="lang"
      type="button"
      class="font-mono text-xs font-semibold uppercase tracking-wider transition-colors"
      :class="[
        large ? 'h-11 w-12' : 'px-2.5 py-1',
        currentLanguage === lang ? 'bg-primary text-black' : 'text-gray-400 hover:text-primary',
      ]"
      :aria-label="lang === 'fr' ? 'Français' : 'English'"
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
