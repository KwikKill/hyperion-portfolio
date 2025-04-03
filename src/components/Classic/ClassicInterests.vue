<template>
  <section id="interests" class="pb-20 pt-10 bg-white dark:bg-gray-800">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold mb-4 text-center text-gray-900 dark:text-white">
        {{ isEnglish ? 'My Interests' : 'Mes centres d\'intérêts' }}
      </h2>

      <p class="text-gray-700 dark:text-gray-300 text-center max-w-3xl mx-auto">
        {{ isEnglish
          ? 'Beyond coding, I have a variety of interests that inspire my creativity and approach to problem-solving. Here are some of my favorite movies and games.'
          : 'Au-delà du code, j\'ai une variété d\'intérêts qui inspirent ma créativité et mon approche de la résolution de problèmes. Voici quelques-uns de mes films et jeux préférés.'
        }}
      </p>

      <!-- Categories tabs -->
      <div class="flex justify-center mb-8 border-b border-gray-200 dark:border-gray-700">
        <button
          @click="activeCategory = 'movies'"
          class="px-6 py-3 font-medium text-sm transition-colors duration-200 relative"
          :class="activeCategory === 'movies'
            ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
            : 'text-gray-500 hover:text-blue-600 dark:hover:text-blue-400'"
        >
          <span>{{ isEnglish ? 'Movies' : 'Films' }}</span>
        </button>
        <button
          @click="activeCategory = 'games'"
          class="px-6 py-3 font-medium text-sm transition-colors duration-200 relative"
          :class="activeCategory === 'games'
            ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
            : 'text-gray-500 hover:text-blue-600 dark:hover:text-blue-400'"
        >
          <span>{{ isEnglish ? 'Video Games' : 'Jeux Vidéo' }}</span>
        </button>
      </div>

      <!-- Movies content -->
      <div v-if="activeCategory === 'movies'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(movie, index) in movies"
          :key="index"
          class="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <img
            :src="movie.image"
            :alt="movie.title"
            class="w-full h-48 object-cover"
          />
          <div class="p-6">
            <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">{{ movie.title }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">{{ movie.year }} • {{ movie.genre }}</p>
            <p class="text-gray-700 dark:text-gray-300 mb-4">{{ movie.description }}</p>
            <div
              class="text-sm font-medium text-blue-600 dark:text-blue-400"
            >
              {{ isEnglish ? 'Why I love it:' : 'Pourquoi je l\'aime:' }} {{ movie.whyILoveIt }}
            </div>
          </div>
        </div>
      </div>

      <!-- Games content -->
      <div v-if="activeCategory === 'games'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(game, index) in games"
          :key="index"
          class="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <img
            :src="game.image"
            :alt="game.title"
            class="w-full h-48 object-cover"
          />
          <div class="p-6">
            <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">{{ game.title }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">{{ game.year }}</p>
            <p class="text-gray-700 dark:text-gray-300 mb-4">{{ game.description }}</p>
            <div
              class="text-sm text-blue-600 dark:text-blue-400 font-medium"
            >
              {{ isEnglish ? 'Why I love it:' : 'Pourquoi je l\'aime:' }} {{ game.whyILoveIt }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePreferencesStore } from '../../stores/preferences'
import { useProjectsStore } from '../../stores/projects'

const preferencesStore = usePreferencesStore()
const isEnglish = computed(() => preferencesStore.isEnglish)

const activeCategory = ref('movies')
const projectsStore = useProjectsStore()
const movies = computed(() => projectsStore.getLocalizedMovies)
const games = computed(() => projectsStore.getLocalizedGames)

</script>

