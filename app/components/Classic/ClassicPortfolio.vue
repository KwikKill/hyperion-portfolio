<template>
  <div>
    <ClassicHeader/>
    <main>
      <ClassicHero/>
      <ClassicAbout/>
      <ClassicExperience/>
      <ClassicProjects/>
      <ClassicInterests/>
    </main>
    <ClassicFooter/>
  </div>
</template>

<script setup lang="ts">
import ClassicAbout from './ClassicAbout.vue';
import ClassicExperience from './ClassicExperience.vue';
import ClassicFooter from './ClassicFooter.vue';
import ClassicHeader from './ClassicHeader.vue';
import ClassicHero from './ClassicHero.vue';
import ClassicInterests from './ClassicInterests.vue';
import ClassicProjects from './ClassicProjects.vue';
</script>

<style scoped>
/* Sections scrolled to stop below the sticky header (h-16) */
:deep(section[id]) {
  scroll-margin-top: 4rem;
}
</style>
