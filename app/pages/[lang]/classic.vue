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
});
</script>
