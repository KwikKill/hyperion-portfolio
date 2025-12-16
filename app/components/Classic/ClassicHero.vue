<template>
  <section id="home" class="bg-gray-50 py-20 dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div class="mb-10 md:mb-0">
          <h1 class="mb-4 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
            {{ isEnglish ? 'Hi, I\'m Gabriel Blaisot' : 'Bonjour, je suis Gabriel Blaisot' }}
          </h1>
          <h2 class="mb-6 text-2xl font-semibold text-blue-600 md:text-3xl dark:text-blue-400">
            {{ isEnglish ? 'Computer Science Student' : 'Étudiant en Informatique' }}
            <br/>
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
            <ClassicContact class="rounded-lg shadow-lg"/>
            <div class="flex items-center justify-center gap-4 md:justify-start">
              <a
                href="#projects"
                class="rounded-md bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
              >
                {{ isEnglish ? 'View Projects' : 'Voir les Projets' }}
              </a>
              <a
                href="#interests"
                class="rounded-md border border-blue-600 px-6 py-3 text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/30"
              >
                {{ isEnglish ? 'My Interests' : 'Mes Intérêts' }}
              </a>
            </div>
          </div>
        </div>
        <div class="h-full">
          <div class="flex h-full flex-col items-center">
            <div class="size-full md:w-3/4">
              <ClassicTerminal/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { usePreferencesStore } from '../../stores/preferences';
import ClassicContact from './ClassicContact.vue';
import ClassicTerminal from './ClassicTerminal.vue';

const preferencesStore = usePreferencesStore();
const isEnglish = computed(() => preferencesStore.isEnglish);
</script>
