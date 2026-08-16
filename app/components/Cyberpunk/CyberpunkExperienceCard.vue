<template>
  <div class="relative">
    <!-- Timeline node -->
    <div
      class="absolute left-1/2 z-20 size-6 -translate-x-1/2 rounded-full border-2 border-secondary bg-bg"
      style="top: -12px;"
    >
      <div class="absolute inset-1 animate-pulse rounded-full bg-secondary"/>
    </div>

    <!-- Experience card -->
    <div
      class="relative z-10 flex flex-col items-center pt-6 md:flex-row"
      :class="index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'"
    >
      <!-- Date badge -->
      <CyberpunkTerminalWindow :no-body="true" :no-buttons="true" :show-icon="false" class="md:w-2/6 2xl:w-1/4">
        <template #title>
          {{ experience.localizedPeriod }}
        </template>
      </CyberpunkTerminalWindow>

      <!-- Content card -->
      <div
        class="cyberpunk-terminal mt-4 w-full overflow-hidden rounded-lg border-2 border-primary bg-bg/95 transition-all duration-300 hover:scale-[1.02] hover:border-secondary hover:bg-bg md:mt-0 md:w-full"
        :class="index % 2 === 0 ? 'md:ml-8' : 'md:mr-8'"
      >
        <!-- Header -->
        <div class="border-b border-primary/30 bg-gradient-to-r from-bg to-bg/50 p-4">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <h3 class="cyberpunk-text-glow text-xl font-bold text-primary">
              {{ experience.localizedTitle }}
            </h3>
            <div class="font-mono mt-2 text-secondary md:mt-0">
              {{ experience.company }}
            </div>
          </div>
          <div class="mt-2 text-primary/70">
            <span class="inline-flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mr-1 size-4 text-secondary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span class="mr-2 text-secondary">[</span>
              {{ experience.localizedLocation }}
              <span class="ml-2 text-secondary">]</span>
            </span>
          </div>
        </div>

        <!-- Body -->
        <div class="p-6">
          <!-- Description -->
          <div class="mb-6">
            <h4 class="font-mono mb-2 text-sm uppercase tracking-wider text-secondary">
              {{ isEnglish ? 'Mission' : 'Mission' }}
            </h4>
            <p class="leading-relaxed text-primary">
              {{ experience.localizedDescription }}
            </p>
          </div>

          <!-- Technologies -->
          <div class="mb-6">
            <h4 class="font-mono mb-2 text-sm uppercase tracking-wider text-secondary">
              {{ isEnglish ? 'Technologies' : 'Technologies' }}
            </h4>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(tech, techIndex) in experience.technologies"
                :key="techIndex"
                class="rounded-sm border border-primary/50 bg-bg/30 px-3 py-1 text-sm text-primary transition-colors hover:bg-secondary/10"
              >
                {{ tech }}
              </span>
            </div>
          </div>

          <!-- Achievements -->
          <div v-if="experience.localizedAchievements.length">
            <h4 class="font-mono mb-2 text-sm uppercase tracking-wider text-secondary">
              {{ isEnglish ? 'Key Achievements' : 'Réalisations Clés' }}
            </h4>
            <ul class="space-y-2 text-primary">
              <li
                v-for="(achievement, achievementIndex) in experience.localizedAchievements"
                :key="achievementIndex"
                class="flex items-start"
              >
                <span class="mr-2 text-terminal">></span>
                <span>{{ achievement }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { LocalizedExperience } from '../../models/experience';
import { usePreferencesStore } from '../../stores/preferences';
import CyberpunkTerminalWindow from './CyberpunkTerminalWindow.vue';

defineProps<{
  experience: LocalizedExperience;
  index: number;
}>();

const preferencesStore = usePreferencesStore();
const isEnglish = computed(() => preferencesStore.isEnglish);
</script>
