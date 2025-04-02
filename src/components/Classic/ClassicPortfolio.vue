<template>
  <div class="min-h-screen flex flex-col">
    <ClassicHeader />
    <main>
      <ClassicHero />
      <ClassicAbout />
      <ClassicProjects />
      <ClassicInterests />
    </main>
    <ClassicFooter />
  </div>
</template>

<script setup>
import ClassicHeader from './ClassicHeader.vue'
import ClassicHero from './ClassicHero.vue'
import ClassicAbout from './ClassicAbout.vue'
import ClassicProjects from './ClassicProjects.vue'
import ClassicInterests from './ClassicInterests.vue'
import ClassicFooter from './ClassicFooter.vue'
</script>

