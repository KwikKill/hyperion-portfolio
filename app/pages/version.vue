<template>
  <div/>
</template>

<script setup lang="ts">
import { navigateTo } from 'nuxt/app';

// Former address of the picker, which now lives on the root.
definePageMeta({
  middleware: () => {
    // A full page load, like the other redirecting pages (see utils/routes.ts).
    if (import.meta.server) return;
    return navigateTo('/', { replace: true, external: true });
  },
});
</script>
