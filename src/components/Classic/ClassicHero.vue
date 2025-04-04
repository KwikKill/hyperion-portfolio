<template>
  <section id="home" class="py-20 bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="mb-10 md:mb-0">
          <h1 class="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            {{ isEnglish ? 'Hi, I\'m Gabriel Blaisot' : 'Bonjour, je suis Gabriel Blaisot' }}
          </h1>
          <h2 class="text-2xl md:text-3xl font-semibold mb-6 text-blue-600 dark:text-blue-400">
            {{ isEnglish ? 'Computer Science Student' : 'Étudiant en Informatique' }}
            <br />
            INSA Rennes
          </h2>
          <div class="flex flex-col gap-4">
            <p class="text-lg text-gray-700 dark:text-gray-300">
              <template v-if="isEnglish">
                Passionate about web development and software engineering. I love video games, technology, and learning
                new things. Also passionate about Greek mythology.
              </template>
              <template v-else>
                Etudiant en Informatique passionné par le développement web et l'ingénierie logicielle. J'adore les jeux
                vidéo, la technologie et apprendre de nouvelles choses. Également passionné par la mythologie grecque.
              </template>
            </p>
            <ClassicContact class="shadow-lg rounded-lg" />
            <div class="flex gap-4 items-center justify-center md:justify-start">
              <a href="#projects"
                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                {{ isEnglish ? 'View Projects' : 'Voir les Projets' }}
              </a>
              <a href="#interests"
                class="px-6 py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors">
                {{ isEnglish ? 'My Interests' : 'Mes Intérêts' }}
              </a>
            </div>
          </div>
        </div>
        <div class="h-full">
          <div class="flex flex-col items-center h-full">
            <div class="md:w-3/4 w-full h-full">
              <ClassicTerminal />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { usePreferencesStore } from '../../stores/preferences'
import ClassicTerminal from './ClassicTerminal.vue'
import ClassicContact from './ClassicContact.vue'

const preferencesStore = usePreferencesStore()
const isEnglish = computed(() => preferencesStore.isEnglish)
</script>
