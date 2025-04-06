<template>
  <header class="border-b border-theme-foreground/50 bg-black/80 py-4 backdrop-blur-sm">
    <div class="container mx-auto flex items-center justify-between px-4">
      <div
        class="cyberpunk-text-glow cursor-pointer text-2xl font-bold text-theme-foreground transition-colors hover:text-yellow-400"
        @click="preferencesStore.resetPreferences"
        @keydown.enter="preferencesStore.resetPreferences"
      >
        <span class="text-gray-500">&lt;</span>
        <img src="/src/assets/logo.png" alt="Logo" class="inline-block size-8"/>
        KwikKill
        <span class="text-gray-500">/&gt;</span>
      </div>

      <nav>
        <ul class="hidden space-x-6 md:flex">
          <li v-for="item in navLinks" :key="item.href">
            <a
              :href="item.href"
              class="text-sm font-medium uppercase tracking-wider text-gray-300 transition-colors hover:text-yellow-400"
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
