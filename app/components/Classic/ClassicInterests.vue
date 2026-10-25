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
      <div
        class="mb-8 flex justify-center border-b border-gray-200 dark:border-gray-700"
        role="tablist"
        :aria-label="isEnglish ? 'My interests' : 'Mes centres d\'intérêts'"
        @keydown="onTabKeydown"
      >
        <button
          id="interests-tab-movies"
          class="relative px-6 py-3 text-sm font-medium transition-colors duration-200"
          :class="activeCategory === 'movies'
            ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
            : 'text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400'"
          type="button"
          role="tab"
          :aria-selected="activeCategory === 'movies'"
          aria-controls="interests-panel-movies"
          :tabindex="activeCategory === 'movies' ? 0 : -1"
          @click="activeCategory = 'movies'"
        >
          <span>{{ isEnglish ? 'Movies' : 'Films' }}</span>
        </button>
        <button
          id="interests-tab-games"
          class="relative px-6 py-3 text-sm font-medium transition-colors duration-200"
          :class="activeCategory === 'games'
            ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
            : 'text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400'"
          type="button"
          role="tab"
          :aria-selected="activeCategory === 'games'"
          aria-controls="interests-panel-games"
          :tabindex="activeCategory === 'games' ? 0 : -1"
          @click="activeCategory = 'games'"
        >
          <span>{{ isEnglish ? 'Video Games' : 'Jeux Vidéo' }}</span>
        </button>
      </div>

      <!-- Movies content -->
      <div
        v-if="activeCategory === 'movies'"
        id="interests-panel-movies"
        class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        role="tabpanel"
        aria-labelledby="interests-tab-movies"
        tabindex="0"
      >
        <div
          v-for="(movie, index) in movies"
          :key="index"
          class="overflow-hidden rounded-lg bg-gray-50 shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-gray-900"
        >
          <img :src="movie.image" loading="lazy" decoding="async" :alt="movie.title" class="h-48 w-full object-cover"/>
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
              {{ isEnglish ? 'Why I love it:' : 'Pourquoi je l\'aime :' }} {{ movie.whyILoveIt }}
            </div>
          </div>
        </div>
      </div>

      <!-- Games content -->
      <div
        v-if="activeCategory === 'games'"
        id="interests-panel-games"
        class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        role="tabpanel"
        aria-labelledby="interests-tab-games"
        tabindex="0"
      >
        <div
          v-for="(game, index) in games"
          :key="index"
          class="overflow-hidden rounded-lg bg-gray-50 shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-gray-900"
        >
          <img :src="game.image" loading="lazy" decoding="async" :alt="game.title" class="h-48 w-full object-cover"/>
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
              {{ isEnglish ? 'Why I love it:' : 'Pourquoi je l\'aime :' }} {{ game.whyILoveIt }}
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

const TABS = ['movies', 'games'] as const;
const activeCategory = ref<typeof TABS[number]>('movies');
const projectsStore = useProjectsStore();
const movies = computed(() => projectsStore.getLocalizedMovies);
const games = computed(() => projectsStore.getLocalizedGames);

// Arrow keys, Home and End move between the tabs, as in any tab list
function onTabKeydown(event: KeyboardEvent) {
  const index = TABS.indexOf(activeCategory.value);
  const moves: Record<string, number> = {
    ArrowRight: (index + 1) % TABS.length,
    ArrowLeft: (index - 1 + TABS.length) % TABS.length,
    Home: 0,
    End: TABS.length - 1,
  };
  const target = moves[event.key];
  if (target === undefined) return;
  event.preventDefault();
  activeCategory.value = TABS[target] ?? 'movies';
  document.getElementById(`interests-tab-${activeCategory.value}`)?.focus();
}

</script>
