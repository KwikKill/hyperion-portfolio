<template>
  <div>
    <LanguageVersionModal />

    <div v-if="preferencesStore.showModal">
      <!-- Show nothing until modal is closed -->
    </div>
    <div v-else>
      <ClassicPortfolio v-if="preferencesStore.isClassic" />
      <CyberpunkPortfolio v-else-if="preferencesStore.isCyberpunk" />
    </div>
  </div>
</template>

<script setup>
import { usePreferencesStore } from '@/stores/preferences'
import LanguageVersionModal from '@/components/LanguageVersionModal.vue'
import ClassicPortfolio from '@/components/ClassicPortfolio.vue'
import CyberpunkPortfolio from '@/components/CyberpunkPortfolio.vue'

const preferencesStore = usePreferencesStore()
</script>

