<template>
  <div/>
</template>

<script setup lang="ts">
import { redirectToPortfolio } from '../utils/routes';

// Visitors land straight on the cyberpunk portfolio in their browser's language (or the
// ?lang= of an older link); the language/version picker lives on /version.
definePageMeta({
  middleware: (to) => {
    // Prerendering runs on the server, where the browser language is unknown:
    // redirect on the client only (Nuxt reruns the middleware there on first load).
    if (import.meta.server) return;
    return redirectToPortfolio(to, to.query.version === 'classic' ? 'classic' : 'cyberpunk');
  },
});
</script>
