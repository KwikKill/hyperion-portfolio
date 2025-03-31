<template>
  <div class="min-h-screen flex flex-col bg-black text-white">
    <CyberpunkHeader />
    <main>
      <CyberpunkHero />
      <CyberpunkAbout />
      <CyberpunkProjects />
      <CyberpunkInterests />
    </main>
    <CyberpunkFooter />
  </div>
</template>

<script setup>
import CyberpunkHeader from './CyberpunkHeader.vue'
import CyberpunkHero from './CyberpunkHero.vue'
import CyberpunkAbout from './CyberpunkAbout.vue'
import CyberpunkProjects from './CyberpunkProjects.vue'
import CyberpunkInterests from './CyberpunkInterests.vue'
import CyberpunkFooter from './CyberpunkFooter.vue'
</script>

