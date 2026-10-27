<template>
  <!-- The cyberpunk version's root: its theme variables and classes apply to the error page too -->
  <div id="cyberpunkroot" class="cyberpunk min-h-dvh">
    <CyberpunkNotFound :code="code" :path="path"/>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';
import { useHead, useRequestURL } from 'nuxt/app';
import { computed, defineAsyncComponent, onMounted } from 'vue';

import { usePreferencesStore } from './stores/preferences';
import { detectBrowserLanguage, isLanguage } from './utils/language';

const props = defineProps({
  error: {
    type: Object as () => NuxtError,
    required: true,
  },
});

// Nuxt bundles the error page with every page of the site: the scene loads only when it shows
const CyberpunkNotFound = defineAsyncComponent(() => import('./components/Cyberpunk/CyberpunkNotFound.vue'));

const preferencesStore = usePreferencesStore();

// The address as typed, not the router's: /xyz fails its validation before the router reaches it.
// The server (nuxt dev) renders this page through an internal /__nuxt_error request, and passes the
// address in the error's url, which the NuxtError type leaves out.
function requestedPath() {
  if (import.meta.client) return window.location.pathname;
  const { url } = props.error as NuxtError & { url?: string };
  return (url ?? useRequestURL().pathname).split(/[?#]/)[0] || '/';
}
const pathname = requestedPath();
let path = pathname;
try {
  path = decodeURIComponent(pathname);
} catch {
  // Malformed escape sequence: shown as it came
}
const code = computed(() => props.error.statusCode || 404);

// The language of the address (/en/…), else the one already chosen, else the browser's
const pathLang = path.split('/')[1];
if (isLanguage(pathLang)) preferencesStore.setPreferences(pathLang);

onMounted(() => {
  if (!preferencesStore.language) preferencesStore.setPreferences(detectBrowserLanguage());
  preferencesStore.restoreTheme();
});

const titles = {
  fr: { missing: 'Secteur introuvable', failure: 'Défaillance système' },
  en: { missing: 'Sector not found', failure: 'System failure' },
};

useHead({
  title: computed(() => {
    const words = titles[preferencesStore.lang];
    return `${code.value} · ${code.value === 404 ? words.missing : words.failure} · Gabriel Blaisot`;
  }),
  htmlAttrs: { lang: computed(() => preferencesStore.lang) },
  // The static host answers missing pages with the app shell and a 200: keep them out of search results
  meta: [{ name: 'robots', content: 'noindex' }],
});
</script>
