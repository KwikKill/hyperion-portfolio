<template>
  <div class="dark text-white">
    <ClassicPortfolio/>
  </div>
</template>

<script setup lang="ts">
import { isLanguage } from '../../utils/language';

definePageMeta({
  validate: (route) => isLanguage(route.params.lang),
  middleware: 'language',
  // One page for /fr/classic and /en/classic: switching language keeps the page
  // and its scroll position.
  key: 'classic',
  scrollToTop: false,
});
</script>
