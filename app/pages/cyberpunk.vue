<template>
  <div/>
</template>

<script setup lang="ts">
import { redirectToPortfolio } from '../utils/routes';

// Former address, still in shared links and favourites: /cyberpunk → /fr/cyberpunk
// (/cyberpunk?lang=en → /en/cyberpunk).
definePageMeta({
  middleware: (to) => {
    // Redirect in the browser only: the page is prerendered, the query is unknown there.
    if (import.meta.server) return;
    return redirectToPortfolio(to, 'cyberpunk');
  },
});
</script>
