<template>
  <header class="bg-white dark:bg-gray-800 shadow-md py-4">
    <div class="container mx-auto px-4 flex justify-between items-center">
      <div
        class="text-2xl font-bold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        @click="preferencesStore.resetPreferences"
        @keydown.enter="preferencesStore.resetPreferences"
      >
        KwikKill - Portfolio
      </div>

      <nav>
        <ul class="flex space-x-6">
          <li v-for="item in navLinks" :key="item.href">
            <a
              :href="item.href"
              class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
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

