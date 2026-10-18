<template>
  <div/>
</template>

<script setup lang="ts">
import { isLanguage } from '../../utils/language';
import { redirectToPortfolio } from '../../utils/routes';

// /fr and /en, briefly the portfolio's address: sent on to /fr/cyberpunk and /en/cyberpunk.
definePageMeta({
  validate: (route) => isLanguage(route.params.lang),
  middleware: (to) => {
    if (import.meta.server || !isLanguage(to.params.lang)) return;
    return redirectToPortfolio(to, 'cyberpunk', to.params.lang);
  },
});
</script>
