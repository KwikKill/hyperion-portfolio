<template>
  <div/>
</template>

<script setup lang="ts">
import { redirectToPortfolio } from '../utils/routes';

// Former address, still in shared links and favourites: /cyberpunk?lang=en → /en.
definePageMeta({
  middleware: (to) => {
    // Redirect on the client only: the browser language is unknown while prerendering.
    if (import.meta.server) return;
    return redirectToPortfolio(to, 'cyberpunk');
  },
});
</script>
