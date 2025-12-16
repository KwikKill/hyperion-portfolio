<template>
  <section id="interests" class="bg-white pb-20 pt-10 dark:bg-gray-800">
    <div class="container mx-auto px-4">
      <h2 class="mb-4 text-center text-3xl font-bold text-gray-900 dark:text-white">
        {{ isEnglish ? 'My Interests' : 'Mes centres d\'intérêts' }}
      </h2>

      <p class="mx-auto max-w-3xl text-center text-gray-700 dark:text-gray-300">
        <template
          v-if="isEnglish"
        >
          Beyond coding, I have a variety of interests that inspire my creativity and approach to problem-solving.
          Here are some of my favorite movies and games.
        </template>
        <template
          v-else
        >
          Au-delà du code, j'ai une variété d'intérêts qui inspirent ma créativité et mon approche de la
          résolution de problèmes. Voici quelques-uns de mes films et jeux préférés.
        </template>
      </p>

      <!-- Categories tabs -->
      <div class="mb-8 flex justify-center border-b border-gray-200 dark:border-gray-700">
        <button
          class="relative px-6 py-3 text-sm font-medium transition-colors duration-200"
          :class="activeCategory === 'movies'
            ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
            : 'text-gray-500 hover:text-blue-600 dark:hover:text-blue-400'"
          type="button"
          @click="activeCategory = 'movies'"
        >
          <span>{{ isEnglish ? 'Movies' : 'Films' }}</span>
        </button>
        <button
          class="relative px-6 py-3 text-sm font-medium transition-colors duration-200"
          :class="activeCategory === 'games'
            ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
            : 'text-gray-500 hover:text-blue-600 dark:hover:text-blue-400'"
          type="button"
          @click="activeCategory = 'games'"
        >
          <span>{{ isEnglish ? 'Video Games' : 'Jeux Vidéo' }}</span>
        </button>
      </div>

      <!-- Movies content -->
      <div v-if="activeCategory === 'movies'" class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(movie, index) in movies"
          :key="index"
          class="overflow-hidden rounded-lg bg-gray-50 shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-gray-900"
        >
          <img :src="movie.image" :alt="movie.title" class="h-48 w-full object-cover"/>
          <div class="p-6">
            <h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              {{ movie.title }}
            </h3>
            <p class="mb-3 text-sm text-gray-500 dark:text-gray-400">
              {{ movie.year }} • {{ movie.genre }}
            </p>
            <p class="mb-4 text-gray-700 dark:text-gray-300">
              {{ movie.description }}
            </p>
            <div class="text-sm font-medium text-blue-600 dark:text-blue-400">
              {{ isEnglish ? 'Why I love it:' : 'Pourquoi je l\'aime:' }} {{ movie.whyILoveIt }}
            </div>
          </div>
        </div>
      </div>

      <!-- Games content -->
      <div v-if="activeCategory === 'games'" class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(game, index) in games"
          :key="index"
          class="overflow-hidden rounded-lg bg-gray-50 shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-gray-900"
        >
          <img :src="game.image" :alt="game.title" class="h-48 w-full object-cover"/>
          <div class="p-6">
            <h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              {{ game.title }}
            </h3>
            <p class="mb-3 text-sm text-gray-500 dark:text-gray-400">
              {{ game.year }}
            </p>
            <p class="mb-4 text-gray-700 dark:text-gray-300">
              {{ game.description }}
            </p>
            <div class="text-sm font-medium text-blue-600 dark:text-blue-400">
              {{ isEnglish ? 'Why I love it:' : 'Pourquoi je l\'aime:' }} {{ game.whyILoveIt }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import { usePreferencesStore } from '../../stores/preferences';
import { useProjectsStore } from '../../stores/projects';

const preferencesStore = usePreferencesStore();
const isEnglish = computed(() => preferencesStore.isEnglish);

const activeCategory = ref('movies');
const projectsStore = useProjectsStore();
const movies = computed(() => projectsStore.getLocalizedMovies);
const games = computed(() => projectsStore.getLocalizedGames);

</script>
