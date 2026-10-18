<template>
  <div>
    <LanguageVersionModal/>
  </div>
</template>

<script setup lang="ts">
import { redirectToPortfolio } from '../utils/routes';

// The language and version picker. Links from the former site, which named both in the
// query (/?lang=fr&version=cyberpunk, still on the freelance site), go to that page.
definePageMeta({
  middleware: (to) => {
    // The query is only known in the browser: the page is prerendered.
    if (import.meta.server) return;
    const { version } = to.query;
    if (version === 'cyberpunk' || version === 'classic') return redirectToPortfolio(to, version);
  },
});
</script>
