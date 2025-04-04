<template>
  <header class="bg-black/80 border-b border-theme-foreground/50 py-4 backdrop-blur-sm">
    <div class="container mx-auto px-4 flex justify-between items-center">
      <div
        class="text-2xl font-bold text-theme-foreground cyberpunk-text-glow cursor-pointer hover:text-yellow-400 transition-colors"
        @click="preferencesStore.resetPreferences" @keydown.enter="preferencesStore.resetPreferences">
        <span class="text-gray-500">&lt;</span>
        <img src="/src/assets/logo.png" alt="Logo" class="inline-block w-8 h-8" />
        KwikKill
        <span class="text-gray-500">/&gt;</span>
      </div>

      <nav>
        <ul class="md:flex space-x-6 hidden">
          <li v-for="item in navLinks" :key="item.href">
            <a :href="item.href"
              class="text-gray-300 hover:text-yellow-400 transition-colors uppercase tracking-wider text-sm font-medium">
              {{ item.name }}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { usePreferencesStore } from '../../stores/preferences'

const preferencesStore = usePreferencesStore()

const isEnglish = computed(() => preferencesStore.isEnglish)

// Find the navigation links array and add the Experience link

const navLinks = computed(() => [
  { name: isEnglish.value ? 'Home' : 'Accueil', href: '#home' },
  { name: isEnglish.value ? 'About' : 'À Propos', href: '#about' },
  { name: isEnglish.value ? 'Experience' : 'Expérience', href: '#experience' },
  { name: isEnglish.value ? 'Projects' : 'Projets', href: '#projects' },
  { name: isEnglish.value ? 'Interests' : 'Intérêts', href: '#interests' },
])
</script>
