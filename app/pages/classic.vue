<template>
  <div/>
</template>

<script setup lang="ts">
import { navigateTo } from 'nuxt/app';

import { legacyLocation } from '../utils/routes';

// Former address, still in shared links and favourites: /classic?lang=en → /en/classic.
definePageMeta({
  middleware: (to) => {
    // Redirect on the client only: the browser language is unknown while prerendering.
    if (import.meta.server) return;
    return navigateTo(legacyLocation(to, 'classic'), { replace: true });
  },
});
</script>
