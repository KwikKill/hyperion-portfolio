<template>
  <header class="bg-black/80 border-b border-theme-foreground/50 py-4 backdrop-blur-sm">
    <div class="container mx-auto px-4 flex justify-between items-center">
      <div class="text-2xl font-bold text-theme-foreground cyberpunk-text-glow">
        <span class="text-gray-500">&lt;</span>
        <img src="../assets/logo.png" alt="Logo" class="inline-block w-8 h-8" />
        KwikKill
        <span class="text-gray-500">/&gt;</span>
      </div>

      <nav>
        <ul class="md:flex space-x-6 hidden">
          <li v-for="item in navItems" :key="item.id">
            <a
              :href="item.href"
              class="text-gray-300 hover:text-yellow-400 transition-colors uppercase tracking-wider text-sm font-medium"
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
    { id: 'interests', href: '#interests', label: isEnglish ? 'Interests' : 'Intérêts' },
  ]
})
</script>

