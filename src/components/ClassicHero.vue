<template>
  <section id="home" class="py-20 bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row items-center">
        <div class="md:w-1/2 mb-10 md:mb-0">
          <h1 class="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            {{ isEnglish ? 'Hi, I\'m Gabriel Blaisot' : 'Bonjour, je suis Gabriel Blaisot' }}
          </h1>
          <h2 class="text-2xl md:text-3xl font-semibold mb-6 text-blue-600 dark:text-blue-400">
            {{ isEnglish ? 'Computer Science Student' : 'Étudiant en Informatique' }}
          </h2>
          <p class="text-lg text-gray-700 dark:text-gray-300 mb-8">
            {{ isEnglish
              ? 'Passionate about web development, software engineering, and creating innovative solutions.'
              : 'Passionné par le développement web, l\'ingénierie logicielle et la création de solutions innovantes.'
            }}
          </p>
          <div class="flex space-x-4">
            <a
              href="#projects"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              {{ isEnglish ? 'View Projects' : 'Voir les Projets' }}
            </a>
          </div>
        </div>
        <div class="md:w-1/2">
          <img
            src="@/assets/placeholder400x400.svg"
            alt="Profile"
            class="rounded-full w-64 h-64 mx-auto object-cover shadow-lg"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { usePreferencesStore } from '../stores/preferences'

const preferencesStore = usePreferencesStore()
const isEnglish = computed(() => preferencesStore.isEnglish)
</script>

