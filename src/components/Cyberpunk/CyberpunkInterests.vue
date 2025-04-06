<template>
  <section id="interests" class="cyberpunk-terminal relative min-h-screen py-20">
    <!-- Unique background for this section -->
    <div class="absolute inset-0 z-0">
      <!-- Holographic grid background -->
      <div class="holographic-bg h-full"/>
      <!-- Overlay with gradient -->
      <div class="absolute inset-0 bg-gradient-to-br from-yellow-900/30 via-black/60 to-orange-800/20"/>
      <!-- Animated scan lines -->
      <div class="scanlines absolute inset-0 opacity-20"/>
    </div>

    <div class="container relative z-10 mx-auto flex flex-col gap-4">
      <!-- Section header -->
      <CyberpunkTerminalWindow no-body :show-icon="false">
        <template #title>
          {{
            isEnglish
              ? 'HYPERION v1.0 - USER INTERESTS'
              : 'HYPERION v1.0 - INTÉRÊTS UTILISATEUR'
          }}
        </template>
      </CyberpunkTerminalWindow>

      <!-- Content container -->
      <CyberpunkTerminalWindow :show-icon="false">
        <!-- Terminal header -->
        <template #title>
          {{ isEnglish ? 'PERSONAL DATABASE // CLASSIFIED' : 'BASE DE DONNÉES PERSONNELLE // CLASSIFIÉ' }}
        </template>

        <template #body>
          <div class="p-6">
            <!-- Categories tabs -->
            <div class="mb-8 flex border-b border-yellow-500/30">
              <button
                class="font-mono relative px-4 py-2 text-sm uppercase transition-colors duration-200"
                :class="activeCategory === 'movies' ? 'text-yellow-300' : 'text-gray-500 hover:text-yellow-400'"
                type="button"
                @click="activeCategory = 'movies'"
              >
                <span>{{ isEnglish ? 'Movies' : 'Films' }}</span>
                <span
                  v-if="activeCategory === 'movies'"
                  class="absolute bottom-0 left-0 h-0.5 w-full bg-yellow-500"
                />
              </button>
              <button
                class="font-mono relative px-4 py-2 text-sm uppercase transition-colors duration-200"
                :class="activeCategory === 'games' ? 'text-yellow-300' : 'text-gray-500 hover:text-yellow-400'"
                type="button"
                @click="activeCategory = 'games'"
              >
                <span>{{ isEnglish ? 'Video Games' : 'Jeux Vidéo' }}</span>
                <span
                  v-if="activeCategory === 'games'"
                  class="absolute bottom-0 left-0 h-0.5 w-full bg-yellow-500"
                />
              </button>
            </div>

            <!-- Movies content -->
            <div v-if="activeCategory === 'movies'" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div
                v-for="(movie, index) in movies"
                :key="index"
                class="media-card group"
                :class="activeCard === index ? 'active' : ''"
                @click="activeCard = activeCard === index ? null : index"
                @keydown.enter="activeCard = activeCard === index ? null : index"
              >
                <div class="media-card-inner">
                  <div class="media-card-front">
                    <img :src="movie.image" :alt="movie.title" class="h-48 w-full rounded-t-md object-cover"/>
                    <div class="rounded-b-md border-t border-yellow-500/50 bg-black/80 p-4">
                      <h3 class="text-lg font-bold text-yellow-300">
                        {{ movie.title }}
                      </h3>
                      <p class="text-xs text-gray-400">
                        {{ movie.year }} • {{ movie.genre }}
                      </p>
                    </div>
                  </div>
                  <div class="media-card-back bg-black/90 p-4 text-white">
                    <h3 class="mb-2 text-lg font-bold text-yellow-300">
                      {{ movie.title }}
                    </h3>
                    <p class="text-sm">
                      {{ movie.description }}
                    </p>
                    <div class="mt-2 text-xs text-yellow-300">
                      {{ isEnglish ? 'Why I love it:' : 'Pourquoi je l\'aime:' }} {{ movie.whyILoveIt }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Games content -->
            <div v-if="activeCategory === 'games'" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div v-for="(game, index) in games" :key="index" class="media-card group">
                <div class="media-card-inner">
                  <div class="media-card-front">
                    <img :src="game.image" :alt="game.title" class="h-48 w-full rounded-t-md object-cover"/>
                    <div class="rounded-b-md border-t border-yellow-500/50 bg-black/80 p-4">
                      <h3 class="text-lg font-bold text-yellow-300">
                        {{ game.title }}
                      </h3>
                      <p class="text-xs text-gray-400">
                        {{ game.year }}
                      </p>
                    </div>
                  </div>
                  <div class="media-card-back bg-black/90 p-4 text-white">
                    <h3 class="mb-2 text-lg font-bold text-yellow-300">
                      {{ game.title }}
                    </h3>
                    <p class="text-sm">
                      {{ game.description }}
                    </p>
                    <div class="mt-2 text-xs text-yellow-300">
                      {{ isEnglish ? 'Why I love it:' : 'Pourquoi je l\'aime:' }} {{ game.whyILoveIt }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Terminal footer -->
            <div class="mt-8 border-t border-yellow-500/30 pt-4 text-center">
              <p class="font-mono text-sm text-yellow-400">
                <template
                  v-if="isEnglish"
                >
                  Beyond coding, I have a variety of interests that inspire my creativity and approach
                  to problem - solving. Here are some of my favorite movies and games.
                </template>
                <template
                  v-else
                >
                  Au-delà du code, j'ai une variété d'intérêts qui inspirent ma créativité et mon approche de
                  la résolution de problèmes. Voici quelques - uns de mes films et jeux préférés.
                </template>
              </p>
            </div>
          </div>
        </template>
      </CyberpunkTerminalWindow>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import { usePreferencesStore } from '../../stores/preferences';
import { useProjectsStore } from '../../stores/projects';
import CyberpunkTerminalWindow from './CyberpunkTerminalWindow.vue';

const preferencesStore = usePreferencesStore();
const isEnglish = computed(() => preferencesStore.isEnglish);
const projectsStore = useProjectsStore();
const movies = computed(() => projectsStore.getLocalizedMovies);
const games = computed(() => projectsStore.getLocalizedGames);

const activeCategory = ref('movies');

const activeCard = ref<number | null>(null);

</script>

<style scoped>
.holographic-bg {
  background-color: #1d1d0c;
  background-image:
    linear-gradient(0deg, rgba(179, 255, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(183, 255, 0, 0.1) 1px, transparent 1px);
  background-size: 30px 30px;
  position: relative;
  overflow: hidden;
}

.holographic-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 30% 40%, rgba(255, 251, 0, 0.4) 0%, transparent 40%),
    radial-gradient(circle at 70% 60%, rgba(229, 255, 0, 0.4) 0%, transparent 40%);
  pointer-events: none;
}

.scanlines {
  background: linear-gradient(to bottom,
      transparent 50%,
      rgba(255, 242, 0, 0.1) 50%);
  background-size: 100% 4px;
  pointer-events: none;
}

.media-card {
  perspective: 1000px;
  height: 280px;
}

.media-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.media-card.active .media-card-inner {
  transform: rotateY(180deg);
}

.media-card:hover .media-card-inner {
  transform: rotateY(180deg);
}

.media-card-front,
.media-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border-radius: 0.375rem;
  box-shadow: 0 0 15px rgba(255, 230, 0, 0.3);
}

.media-card-back {
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
