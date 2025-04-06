<template>
  <header class="bg-white py-4 shadow-md dark:bg-gray-800">
    <div class="container mx-auto flex items-center justify-between px-4">
      <div
        class="cursor-pointer text-2xl font-bold text-gray-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
        @click="preferencesStore.resetPreferences"
        @keydown.enter="preferencesStore.resetPreferences"
      >
        KwikKill - Portfolio
      </div>

      <nav>
        <ul class="hidden space-x-6 md:flex">
          <li v-for="item in navLinks" :key="item.href">
            <a
              :href="item.href"
              class="text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              {{ item.name }}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { usePreferencesStore } from '../../stores/preferences';

const preferencesStore = usePreferencesStore();

const isEnglish = computed(() => preferencesStore.isEnglish);

// Find the navigation links array and add the Experience link

const navLinks = computed(() => [
  { name: isEnglish.value ? 'Home' : 'Accueil', href: '#home' },
  { name: isEnglish.value ? 'About' : 'À Propos', href: '#about' },
  { name: isEnglish.value ? 'Experience' : 'Expérience', href: '#experience' },
  { name: isEnglish.value ? 'Projects' : 'Projets', href: '#projects' },
  { name: isEnglish.value ? 'Interests' : 'Intérêts', href: '#interests' },
]);
</script>
