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
          <li v-for="item in navItems" :key="item.id">
            <a
              :href="item.href"
              class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {{ item.label }}
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

const navItems = computed(() => {
  const isEnglish = preferencesStore.isEnglish

  return [
    { id: 'home', href: '#home', label: isEnglish ? 'Home' : 'Accueil' },
    { id: 'about', href: '#about', label: isEnglish ? 'About' : 'À propos' },
    { id: 'projects', href: '#projects', label: isEnglish ? 'Projects' : 'Projets' },
  ]
})
</script>

