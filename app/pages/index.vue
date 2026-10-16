<template>
  <div/>
</template>

<script setup lang="ts">
import { navigateTo } from 'nuxt/app';

import { detectBrowserLanguage } from '../utils/language';

// Visitors land straight on the cyberpunk portfolio in their browser's language;
// the language/version picker lives on /version.
definePageMeta({
  middleware: (to) => {
    // Prerendering runs on the server, where the browser language is unknown:
    // redirect on the client only (Nuxt reruns the middleware there on first load).
    if (import.meta.server) return;

    const lang = to.query.lang === 'en' || to.query.lang === 'fr'
      ? to.query.lang
      : detectBrowserLanguage();
    return navigateTo(`/cyberpunk?lang=${lang}`, { replace: true });
  },
});
</script>
