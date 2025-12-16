<template>
  <section id="experience" class="relative min-h-screen py-20">
    <!-- Unique cyberpunk background - digital city skyline with data streams -->
    <div class="absolute inset-0 z-0 overflow-hidden">
      <div class="digital-city top-0 h-1/2 rotate-180 bg-bottom"/>
      <div class="digital-city bottom-0 h-1/2 bg-top"/>

      <!--div class="bg-black/30 w-full h-full absolute bottom-0 left-0 right-0 z-10"/-->

      <!-- Data stream overlay -->
      <div class="data-streams"/>
      <!-- Dark gradient overlay for readability -->
      <!--div class="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/90"></div-->
    </div>

    <div class="container relative z-10 mx-auto flex flex-col gap-8 px-4">
      <!-- Section header -->
      <CyberpunkTerminalWindow :no-body="true" :show-icon="false">
        <template #title>
          {{ isEnglish ? 'HYPERION v1.0 - CAREER PATH' : 'HYPERION v1.0 - PARCOURS PROFESSIONNEL' }}
        </template>
      </CyberpunkTerminalWindow>

      <!-- Experience timeline -->
      <div class="relative">
        <!-- Vertical timeline line -->
        <div
          class="absolute left-1/2 h-full w-1 -translate-x-1/2 bg-gradient-to-b from-secondary via-primary to-primary"
        />

        <div class="space-y-24">
          <div v-for="(experience, index) in experiences" :key="index" class="relative">
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
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { usePreferencesStore } from '../../stores/preferences';
import { useProjectsStore } from '../../stores/projects';
import CyberpunkTerminalWindow from './CyberpunkTerminalWindow.vue';

const preferencesStore = usePreferencesStore();
const projectsStore = useProjectsStore();

const isEnglish = computed(() => preferencesStore.isEnglish);
const experiences = computed(() => projectsStore.getLocalizedExperiences);
</script>

<style scoped>
.digital-city {
  background-color: rgb(var(--color-background));
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 800 400"><defs><linearGradient id="windowGlow" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="%2300FFFF40"/><stop offset="100%" stop-color="%2300FFFF10"/></linearGradient></defs><!-- Main Buildings --><rect x="0" y="150" width="25" height="250" fill="%23000B14"/><rect x="5" y="160" width="15" height="20" fill="url(%23windowGlow)" opacity="0.8"/><rect x="5" y="190" width="15" height="20" fill="url(%23windowGlow)" opacity="0.6"/><rect x="5" y="220" width="15" height="20" fill="url(%23windowGlow)" opacity="0.9"/><rect x="5" y="250" width="15" height="20" fill="url(%23windowGlow)" opacity="0.7"/><rect x="5" y="280" width="15" height="20" fill="url(%23windowGlow)" opacity="0.8"/><rect x="5" y="310" width="15" height="20" fill="url(%23windowGlow)" opacity="0.5"/><rect x="5" y="340" width="15" height="20" fill="url(%23windowGlow)" opacity="0.9"/><rect x="0" y="145" width="25" height="5" fill="%2300FFFF30"/><rect x="30" y="100" width="35" height="300" fill="%23000B14"/><rect x="35" y="110" width="10" height="15" fill="url(%23windowGlow)" opacity="0.7"/><rect x="50" y="110" width="10" height="15" fill="url(%23windowGlow)" opacity="0.8"/><rect x="35" y="135" width="10" height="15" fill="url(%23windowGlow)" opacity="0.6"/><rect x="50" y="135" width="10" height="15" fill="url(%23windowGlow)" opacity="0.9"/><rect x="35" y="160" width="10" height="15" fill="url(%23windowGlow)" opacity="0.7"/><rect x="50" y="160" width="10" height="15" fill="url(%23windowGlow)" opacity="0.5"/><rect x="35" y="185" width="10" height="15" fill="url(%23windowGlow)" opacity="0.8"/><rect x="50" y="185" width="10" height="15" fill="url(%23windowGlow)" opacity="0.6"/><rect x="35" y="210" width="10" height="15" fill="url(%23windowGlow)" opacity="0.9"/><rect x="50" y="210" width="10" height="15" fill="url(%23windowGlow)" opacity="0.7"/><rect x="35" y="235" width="10" height="15" fill="url(%23windowGlow)" opacity="0.5"/><rect x="50" y="235" width="10" height="15" fill="url(%23windowGlow)" opacity="0.8"/><rect x="35" y="260" width="10" height="15" fill="url(%23windowGlow)" opacity="0.6"/><rect x="50" y="260" width="10" height="15" fill="url(%23windowGlow)" opacity="0.9"/><rect x="35" y="285" width="10" height="15" fill="url(%23windowGlow)" opacity="0.7"/><rect x="50" y="285" width="10" height="15" fill="url(%23windowGlow)" opacity="0.5"/><rect x="35" y="310" width="10" height="15" fill="url(%23windowGlow)" opacity="0.8"/><rect x="50" y="310" width="10" height="15" fill="url(%23windowGlow)" opacity="0.6"/><rect x="35" y="335" width="10" height="15" fill="url(%23windowGlow)" opacity="0.9"/><rect x="50" y="335" width="10" height="15" fill="url(%23windowGlow)" opacity="0.7"/><rect x="35" y="360" width="10" height="15" fill="url(%23windowGlow)" opacity="0.5"/><rect x="50" y="360" width="10" height="15" fill="url(%23windowGlow)" opacity="0.8"/><rect x="30" y="95" width="35" height="5" fill="%2300FFFF30"/><line x1="47" y1="70" x2="47" y2="95" stroke="%2300FFFF40" stroke-width="1"/><circle cx="47" cy="70" r="2" fill="%2300FFFF60"/><rect x="70" y="50" width="45" height="350" fill="%23000B14"/><rect x="75" y="60" width="15" height="25" fill="url(%23windowGlow)" opacity="0.8"/><rect x="95" y="60" width="15" height="25" fill="url(%23windowGlow)" opacity="0.6"/><rect x="75" y="90" width="15" height="25" fill="url(%23windowGlow)" opacity="0.7"/><rect x="95" y="90" width="15" height="25" fill="url(%23windowGlow)" opacity="0.9"/><rect x="75" y="120" width="15" height="25" fill="url(%23windowGlow)" opacity="0.5"/><rect x="95" y="120" width="15" height="25" fill="url(%23windowGlow)" opacity="0.8"/><rect x="75" y="150" width="15" height="25" fill="url(%23windowGlow)" opacity="0.6"/><rect x="95" y="150" width="15" height="25" fill="url(%23windowGlow)" opacity="0.7"/><rect x="75" y="180" width="15" height="25" fill="url(%23windowGlow)" opacity="0.9"/><rect x="95" y="180" width="15" height="25" fill="url(%23windowGlow)" opacity="0.5"/><rect x="75" y="210" width="15" height="25" fill="url(%23windowGlow)" opacity="0.8"/><rect x="95" y="210" width="15" height="25" fill="url(%23windowGlow)" opacity="0.6"/><rect x="75" y="240" width="15" height="25" fill="url(%23windowGlow)" opacity="0.7"/><rect x="95" y="240" width="15" height="25" fill="url(%23windowGlow)" opacity="0.9"/><rect x="75" y="270" width="15" height="25" fill="url(%23windowGlow)" opacity="0.5"/><rect x="95" y="270" width="15" height="25" fill="url(%23windowGlow)" opacity="0.8"/><rect x="75" y="300" width="15" height="25" fill="url(%23windowGlow)" opacity="0.6"/><rect x="95" y="300" width="15" height="25" fill="url(%23windowGlow)" opacity="0.7"/><rect x="75" y="330" width="15" height="25" fill="url(%23windowGlow)" opacity="0.9"/><rect x="95" y="330" width="15" height="25" fill="url(%23windowGlow)" opacity="0.5"/><rect x="70" y="45" width="45" height="5" fill="%2300FFFF30"/><line x1="92" y1="20" x2="92" y2="45" stroke="%2300FFFF40" stroke-width="1"/><circle cx="92" cy="20" r="2" fill="%2300FFFF60"/><rect x="120" y="130" width="30" height="270" fill="%23000B14"/><rect x="125" y="140" width="20" height="20" fill="url(%23windowGlow)" opacity="0.7"/><rect x="125" y="165" width="20" height="20" fill="url(%23windowGlow)" opacity="0.9"/><rect x="125" y="190" width="20" height="20" fill="url(%23windowGlow)" opacity="0.6"/><rect x="125" y="215" width="20" height="20" fill="url(%23windowGlow)" opacity="0.8"/><rect x="125" y="240" width="20" height="20" fill="url(%23windowGlow)" opacity="0.5"/><rect x="125" y="265" width="20" height="20" fill="url(%23windowGlow)" opacity="0.7"/><rect x="125" y="290" width="20" height="20" fill="url(%23windowGlow)" opacity="0.9"/><rect x="125" y="315" width="20" height="20" fill="url(%23windowGlow)" opacity="0.6"/><rect x="125" y="340" width="20" height="20" fill="url(%23windowGlow)" opacity="0.8"/><rect x="120" y="125" width="30" height="5" fill="%2300FFFF30"/><rect x="155" y="170" width="20" height="230" fill="%23000B14"/><rect x="160" y="180" width="10" height="15" fill="url(%23windowGlow)" opacity="0.8"/><rect x="160" y="200" width="10" height="15" fill="url(%23windowGlow)" opacity="0.6"/><rect x="160" y="220" width="10" height="15" fill="url(%23windowGlow)" opacity="0.9"/><rect x="160" y="240" width="10" height="15" fill="url(%23windowGlow)" opacity="0.7"/><rect x="160" y="260" width="10" height="15" fill="url(%23windowGlow)" opacity="0.5"/><rect x="160" y="280" width="10" height="15" fill="url(%23windowGlow)" opacity="08"/><rect x="565" y="240" width="15" height="20" fill="url(%23windowGlow)" opacity="0.9"/><rect x="565" y="240" width="15" height="20" fill="url(%23windowGlow)" opacity="0.7"/><rect x="565" y="265" width="15" height="20" fill="url(%23windowGlow)" opacity="0.5"/><rect x="565" y="290" width="15" height="20" fill="url(%23windowGlow)" opacity="0.8"/><rect x="565" y="315" width="15" height="20" fill="url(%23windowGlow)" opacity="0.6"/><rect x="565" y="340" width="15" height="20" fill="url(%23windowGlow)" opacity="0.9"/><rect x="160" y="300" width="10" height="15" fill="url(%23windowGlow)" opacity="0.6"/><rect x="160" y="320" width="10" height="15" fill="url(%23windowGlow)" opacity="0.9"/><rect x="160" y="340" width="10" height="15" fill="url(%23windowGlow)" opacity="0.7"/><rect x="160" y="360" width="10" height="15" fill="url(%23windowGlow)" opacity="0.5"/><rect x="155" y="165" width="20" height="5" fill="%2300FFFF30"/><rect x="185" y="80" width="40" height="320" fill="%23000B14"/><rect x="190" y="90" width="15" height="20" fill="url(%23windowGlow)" opacity="0.7"/><rect x="210" y="90" width="10" height="20" fill="url(%23windowGlow)" opacity="0.9"/><rect x="190" y="115" width="15" height="20" fill="url(%23windowGlow)" opacity="0.6"/><rect x="210" y="115" width="10" height="20" fill="url(%23windowGlow)" opacity="0.8"/><rect x="190" y="140" width="15" height="20" fill="url(%23windowGlow)" opacity="0.5"/><rect x="210" y="140" width="10" height="20" fill="url(%23windowGlow)" opacity="0.7"/><rect x="190" y="165" width="15" height="20" fill="url(%23windowGlow)" opacity="0.9"/><rect x="210" y="165" width="10" height="20" fill="url(%23windowGlow)" opacity="0.6"/><rect x="190" y="190" width="15" height="20" fill="url(%23windowGlow)" opacity="0.8"/><rect x="210" y="190" width="10" height="20" fill="url(%23windowGlow)" opacity="0.5"/><rect x="190" y="215" width="15" height="20" fill="url(%23windowGlow)" opacity="0.7"/><rect x="210" y="215" width="10" height="20" fill="url(%23windowGlow)" opacity="0.9"/><rect x="190" y="240" width="15" height="20" fill="url(%23windowGlow)" opacity="0.6"/><rect x="210" y="240" width="10" height="20" fill="url(%23windowGlow)" opacity="0.8"/><rect x="190" y="265" width="15" height="20" fill="url(%23windowGlow)" opacity="0.5"/><rect x="210" y="265" width="10" height="20" fill="url(%23windowGlow)" opacity="0.7"/><rect x="190" y="290" width="15" height="20" fill="url(%23windowGlow)" opacity="0.9"/><rect x="210" y="290" width="10" height="20" fill="url(%23windowGlow)" opacity="0.6"/><rect x="190" y="315" width="15" height="20" fill="url(%23windowGlow)" opacity="0.8"/><rect x="210" y="315" width="10" height="20" fill="url(%23windowGlow)" opacity="0.5"/><rect x="190" y="340" width="15" height="20" fill="url(%23windowGlow)" opacity="0.7"/><rect x="210" y="340" width="10" height="20" fill="url(%23windowGlow)" opacity="0.9"/><rect x="185" y="75" width="40" height="5" fill="%2300FFFF30"/><line x1="205" y1="50" x2="205" y2="75" stroke="%2300FFFF40" stroke-width="1"/><circle cx="205" cy="50" r="2" fill="%2300FFFF60"/><rect x="230" y="180" width="20" height="220" fill="%23000B14"/><rect x="235" y="190" width="10" height="15" fill="url(%23windowGlow)" opacity="0.8"/><rect x="235" y="210" width="10" height="15" fill="url(%23windowGlow)" opacity="0.6"/><rect x="235" y="230" width="10" height="15" fill="url(%23windowGlow)" opacity="0.9"/><rect x="235" y="250" width="10" height="15" fill="url(%23windowGlow)" opacity="0.7"/><rect x="235" y="270" width="10" height="15" fill="url(%23windowGlow)" opacity="0.5"/><rect x="235" y="290" width="10" height="15" fill="url(%23windowGlow)" opacity="0.8"/><rect x="235" y="310" width="10" height="15" fill="url(%23windowGlow)" opacity="0.6"/><rect x="235" y="330" width="10" height="15" fill="url(%23windowGlow)" opacity="0.9"/><rect x="235" y="350" width="10" height="15" fill="url(%23windowGlow)" opacity="0.7"/><rect x="235" y="370" width="10" height="15" fill="url(%23windowGlow)" opacity="0.5"/><rect x="230" y="175" width="20" height="5" fill="%2300FFFF30"/><rect x="255" y="120" width="30" height="280" fill="%23000B14"/><rect x="260" y="130" width="20" height="20" fill="url(%23windowGlow)" opacity="0.7"/><rect x="260" y="155" width="20" height="20" fill="url(%23windowGlow)" opacity="0.9"/><rect x="260" y="180" width="20" height="20" fill="url(%23windowGlow)" opacity="0.6"/><rect x="260" y="205" width="20" height="20" fill="url(%23windowGlow)" opacity="0.8"/><rect x="260" y="230" width="20" height="20" fill="url(%23windowGlow)" opacity="0.5"/><rect x="260" y="255" width="20" height="20" fill="url(%23windowGlow)" opacity="0.7"/><rect x="260" y="280" width="20" height="20" fill="url(%23windowGlow)" opacity="0.9"/><rect x="260" y="305" width="20" height="20" fill="url(%23windowGlow)" opacity="0.6"/><rect x="260" y="330" width="20" height="20" fill="url(%23windowGlow)" opacity="0.8"/><rect x="260" y="355" width="20" height="20" fill="url(%23windowGlow)" opacity="0.5"/><rect x="255" y="115" width="30" height="5" fill="%2300FFFF30"/><line x1="270" y1="90" x2="270" y2="115" stroke="%2300FFFF40" stroke-width="1"/><circle cx="270" cy="90" r="2" fill="%2300FFFF60"/><rect x="290" y="160" width="30" height="240" fill="%23000B14"/><rect x="295" y="170" width="20" height="20" fill="url(%23windowGlow)" opacity="0.8"/><rect x="295" y="195" width="20" height="20" fill="url(%23windowGlow)" opacity="0.6"/><rect x="295" y="220" width="20" height="20" fill="url(%23windowGlow)" opacity="0.9"/><rect x="295" y="245" width="20" height="20" fill="url(%23windowGlow)" opacity="0.7"/><rect x="295" y="270" width="20" height="20" fill="url(%23windowGlow)" opacity="0.5"/><rect x="295" y="295" width="20" height="20" fill="url(%23windowGlow)" opacity="0.8"/><rect x="295" y="320" width="20" height="20" fill="url(%23windowGlow)" opacity="0.6"/><rect x="295" y="345" width="20" height="20" fill="url(%23windowGlow)" opacity="0.9"/><rect x="290" y="155" width="30" height="5" fill="%2300FFFF30"/><rect x="330" y="190" width="20" height="210" fill="%23000B14"/><rect x="335" y="200" width="10" height="15" fill="url(%23windowGlow)" opacity="0.7"/><rect x="335" y="220" width="10" height="15" fill="url(%23windowGlow)" opacity="0.9"/><rect x="335" y="240" width="10" height="15" fill="url(%23windowGlow)" opacity="0.6"/><rect x="335" y="260" width="10" height="15" fill="url(%23windowGlow)" opacity="0.8"/><rect x="335" y="280" width="10" height="15" fill="url(%23windowGlow)" opacity="0.5"/><rect x="335" y="300" width="10" height="15" fill="url(%23windowGlow)" opacity="0.7"/><rect x="335" y="320" width="10" height="15" fill="url(%23windowGlow)" opacity="0.9"/><rect x="335" y="340" width="10" height="15" fill="url(%23windowGlow)" opacity="0.6"/><rect x="335" y="360" width="10" height="15" fill="url(%23windowGlow)" opacity="0.8"/><rect x="330" y="185" width="20" height="5" fill="%2300FFFF30"/><rect x="360" y="70" width="45" height="330" fill="%23000B14"/><rect x="365" y="80" width="15" height="25" fill="url(%23windowGlow)" opacity="0.8"/><rect x="385" y="80" width="15" height="25" fill="url(%23windowGlow)" opacity="0.6"/><rect x="365" y="110" width="15" height="25" fill="url(%23windowGlow)" opacity="0.7"/><rect x="385" y="110" width="15" height="25" fill="url(%23windowGlow)" opacity="0.9"/><rect x="365" y="140" width="15" height="25" fill="url(%23windowGlow)" opacity="0.5"/><rect x="385" y="140" width="15" height="25" fill="url(%23windowGlow)" opacity="0.8"/><rect x="365" y="170" width="15" height="25" fill="url(%23windowGlow)" opacity="0.6"/><rect x="385" y="170" width="15" height="25" fill="url(%23windowGlow)" opacity="0.7"/><rect x="365" y="200" width="15" height="25" fill="url(%23windowGlow)" opacity="0.9"/><rect x="385" y="200" width="15" height="25" fill="url(%23windowGlow)" opacity="0.5"/><rect x="365" y="230" width="15" height="25" fill="url(%23windowGlow)" opacity="0.8"/><rect x="385" y="230" width="15" height="25" fill="url(%23windowGlow)" opacity="0.6"/><rect x="365" y="260" width="15" height="25" fill="url(%23windowGlow)" opacity="0.7"/><rect x="385" y="260" width="15" height="25" fill="url(%23windowGlow)" opacity="0.9"/><rect x="365" y="290" width="15" height="25" fill="url(%23windowGlow)" opacity="0.5"/><rect x="385" y="290" width="15" height="25" fill="url(%23windowGlow)" opacity="0.8"/><rect x="365" y="320" width="15" height="25" fill="url(%23windowGlow)" opacity="0.6"/><rect x="385" y="320" width="15" height="25" fill="url(%23windowGlow)" opacity="0.7"/><rect x="365" y="350" width="15" height="25" fill="url(%23windowGlow)" opacity="0.9"/><rect x="385" y="350" width="15" height="25" fill="url(%23windowGlow)" opacity="0.5"/><rect x="360" y="65" width="45" height="5" fill="%2300FFFF30"/><line x1="382" y1="40" x2="382" y2="65" stroke="%2300FFFF40" stroke-width="1"/><circle cx="382" cy="40" r="2" fill="%2300FFFF60"/><rect x="410" y="170" width="25" height="230" fill="%23000B14"/><rect x="415" y="180" width="15" height="20" fill="url(%23windowGlow)" opacity="0.7"/><rect x="415" y="205" width="15" height="20" fill="url(%23windowGlow)" opacity="0.9"/><rect x="415" y="230" width="15" height="20" fill="url(%23windowGlow)" opacity="0.6"/><rect x="415" y="255" width="15" height="20" fill="url(%23windowGlow)" opacity="0.8"/><rect x="415" y="280" width="15" height="20" fill="url(%23windowGlow)" opacity="0.5"/><rect x="415" y="305" width="15" height="20" fill="url(%23windowGlow)" opacity="0.7"/><rect x="415" y="330" width="15" height="20" fill="url(%23windowGlow)" opacity="0.9"/><rect x="415" y="355" width="15" height="20" fill="url(%23windowGlow)" opacity="0.6"/><rect x="410" y="165" width="25" height="5" fill="%2300FFFF30"/><rect x="445" y="150" width="30" height="250" fill="%23000B14"/><rect x="450" y="160" width="20" height="20" fill="url(%23windowGlow)" opacity="0.8"/><rect x="450" y="185" width="20" height="20" fill="url(%23windowGlow)" opacity="0.6"/><rect x="450" y="210" width="20" height="20" fill="url(%23windowGlow)" opacity="0.9"/><rect x="450" y="235" width="20" height="20" fill="url(%23windowGlow)" opacity="0.7"/><rect x="450" y="260" width="20" height="20" fill="url(%23windowGlow)" opacity="0.5"/><rect x="450" y="285" width="20" height="20" fill="url(%23windowGlow)" opacity="0.8"/><rect x="450" y="310" width="20" height="20" fill="url(%23windowGlow)" opacity="0.6"/><rect x="450" y="335" width="20" height="20" fill="url(%23windowGlow)" opacity="0.9"/><rect x="450" y="360" width="20" height="20" fill="url(%23windowGlow)" opacity="0.7"/><rect x="445" y="145" width="30" height="5" fill="%2300FFFF30"/><line x1="460" y1="120" x2="460" y2="145" stroke="%2300FFFF40" stroke-width="1"/><circle cx="460" cy="120" r="2" fill="%2300FFFF60"/><rect x="485" y="190" width="20" height="210" fill="%23000B14"/><rect x="490" y="200" width="10" height="15" fill="url(%23windowGlow)" opacity="0.7"/><rect x="490" y="220" width="10" height="15" fill="url(%23windowGlow)" opacity="0.9"/><rect x="490" y="240" width="10" height="15" fill="url(%23windowGlow)" opacity="0.6"/><rect x="490" y="260" width="10" height="15" fill="url(%23windowGlow)" opacity="0.8"/><rect x="490" y="280" width="10" height="15" fill="url(%23windowGlow)" opacity="0.5"/><rect x="490" y="300" width="10" height="15" fill="url(%23windowGlow)" opacity="0.7"/><rect x="490" y="320" width="10" height="15" fill="url(%23windowGlow)" opacity="0.9"/><rect x="490" y="340" width="10" height="15" fill="url(%23windowGlow)" opacity="0.6"/><rect x="490" y="360" width="10" height="15" fill="url(%23windowGlow)" opacity="0.8"/><rect x="485" y="185" width="20" height="5" fill="%2300FFFF30"/><rect x="515" y="90" width="40" height="310" fill="%23000B14"/><rect x="520" y="100" width="15" height="20" fill="url(%23windowGlow)" opacity="0.8"/><rect x="540" y="100" width="10" height="20" fill="url(%23windowGlow)" opacity="0.6"/><rect x="520" y="125" width="15" height="20" fill="url(%23windowGlow)" opacity="0.7"/><rect x="540" y="125" width="10" height="20" fill="url(%23windowGlow)" opacity="0.9"/><rect x="520" y="150" width="15" height="20" fill="url(%23windowGlow)" opacity="0.5"/><rect x="540" y="150" width="10" height="20" fill="url(%23windowGlow)" opacity="0.8"/><rect x="520" y="175" width="15" height="20" fill="url(%23windowGlow)" opacity="0.6"/><rect x="540" y="175" width="10" height="20" fill="url(%23windowGlow)" opacity="0.7"/><rect x="520" y="200" width="15" height="20" fill="url(%23windowGlow)" opacity="0.9"/><rect x="540" y="200" width="10" height="20" fill="url(%23windowGlow)" opacity="0.5"/><rect x="520" y="225" width="15" height="20" fill="url(%23windowGlow)" opacity="0.8"/><rect x="540" y="225" width="10" height="20" fill="url(%23windowGlow)" opacity="0.6"/><rect x="520" y="250" width="15" height="20" fill="url(%23windowGlow)" opacity="0.7"/><rect x="540" y="250" width="10" height="20" fill="url(%23windowGlow)" opacity="0.9"/><rect x="520" y="275" width="15" height="20" fill="url(%23windowGlow)" opacity="0.5"/><rect x="540" y="275" width="10" height="20" fill="url(%23windowGlow)" opacity="0.8"/><rect x="520" y="300" width="15" height="20" fill="url(%23windowGlow)" opacity="0.6"/><rect x="540" y="300" width="10" height="20" fill="url(%23windowGlow)" opacity="0.7"/><rect x="520" y="325" width="15" height="20" fill="url(%23windowGlow)" opacity="0.9"/><rect x="540" y="325" width="10" height="20" fill="url(%23windowGlow)" opacity="0.5"/><rect x="520" y="350" width="15" height="20" fill="url(%23windowGlow)" opacity="0.8"/><rect x="540" y="350" width="10" height="20" fill="url(%23windowGlow)" opacity="0.6"/><rect x="515" y="85" width="40" height="5" fill="%2300FFFF30"/><line x1="535" y1="60" x2="535" y2="85" stroke="%2300FFFF40" stroke-width="1"/><circle cx="535" cy="60" r="2" fill="%2300FFFF60"/><rect x="560" y="180" width="25" height="220" fill="%23000B14"/><rect x="565" y="190" width="15" height="20" fill="url(%23windowGlow)" opacity="0.7"/><rect x="565" y="215" width="15" height="20" fill="url(%23windowGlow)" opacity="0.9"/><rect x="565" y="240" width="15" height="20" fill="url(%23windowGlow)" opacity="0.7"/><rect x="565" y="265" width="15" height="20" fill="url(%23windowGlow)" opacity="0.5"/><rect x="565" y="290" width="15" height="20" fill="url(%23windowGlow)" opacity="0.8"/><rect x="565" y="315" width="15" height="20" fill="url(%23windowGlow)" opacity="0.6"/><rect x="565" y="340" width="15" height="20" fill="url(%23windowGlow)" opacity="0.9"/><rect x="560" y="175" width="25" height="5" fill="%2300FFFF30"/><rect x="595" y="160" width="30" height="240" fill="%23000B14"/><rect x="600" y="170" width="20" height="20" fill="url(%23windowGlow)" opacity="0.8"/><rect x="600" y="195" width="20" height="20" fill="url(%23windowGlow)" opacity="0.6"/><rect x="600" y="220" width="20" height="20" fill="url(%23windowGlow)" opacity="0.9"/><rect x="600" y="245" width="20" height="20" fill="url(%23windowGlow)" opacity="0.7"/><rect x="600" y="270" width="20" height="20" fill="url(%23windowGlow)" opacity="0.5"/><rect x="600" y="295" width="20" height="20" fill="url(%23windowGlow)" opacity="0.8"/><rect x="600" y="320" width="20" height="20" fill="url(%23windowGlow)" opacity="0.6"/><rect x="600" y="345" width="20" height="20" fill="url(%23windowGlow)" opacity="0.9"/><rect x="595" y="155" width="30" height="5" fill="%2300FFFF30"/><line x1="610" y1="130" x2="610" y2="155" stroke="%2300FFFF40" stroke-width="1"/><circle cx="610" cy="130" r="2" fill="%2300FFFF60"/><rect x="635" y="200" width="15" height="200" fill="%23000B14"/><rect x="640" y="210" width="5" height="10" fill="url(%23windowGlow)" opacity="0.7"/><rect x="640" y="225" width="5" height="10" fill="url(%23windowGlow)" opacity="0.9"/><rect x="640" y="240" width="5" height="10" fill="url(%23windowGlow)" opacity="0.6"/><rect x="640" y="255" width="5" height="10" fill="url(%23windowGlow)" opacity="0.8"/><rect x="640" y="270" width="5" height="10" fill="url(%23windowGlow)" opacity="0.5"/><rect x="640" y="285" width="5" height="10" fill="url(%23windowGlow)" opacity="0.7"/><rect x="640" y="300" width="5" height="10" fill="url(%23windowGlow)" opacity="0.9"/><rect x="640" y="315" width="5" height="10" fill="url(%23windowGlow)" opacity="0.6"/><rect x="640" y="330" width="5" height="10" fill="url(%23windowGlow)" opacity="0.8"/><rect x="640" y="345" width="5" height="10" fill="url(%23windowGlow)" opacity="0.5"/><rect x="640" y="360" width="5" height="10" fill="url(%23windowGlow)" opacity="0.7"/><rect x="640" y="375" width="5" height="10" fill="url(%23windowGlow)" opacity="0.9"/><rect x="635" y="195" width="15" height="5" fill="%2300FFFF30"/><rect x="660" y="100" width="45" height="300" fill="%23000B14"/><rect x="665" y="110" width="15" height="25" fill="url(%23windowGlow)" opacity="0.8"/><rect x="685" y="110" width="15" height="25" fill="url(%23windowGlow)" opacity="0.6"/><rect x="665" y="140" width="15" height="25" fill="url(%23windowGlow)" opacity="0.7"/><rect x="685" y="140" width="15" height="25" fill="url(%23windowGlow)" opacity="0.9"/><rect x="665" y="170" width="15" height="25" fill="url(%23windowGlow)" opacity="0.5"/><rect x="685" y="170" width="15" height="25" fill="url(%23windowGlow)" opacity="0.8"/><rect x="665" y="200" width="15" height="25" fill="url(%23windowGlow)" opacity="0.6"/><rect x="685" y="200" width="15" height="25" fill="url(%23windowGlow)" opacity="0.7"/><rect x="665" y="230" width="15" height="25" fill="url(%23windowGlow)" opacity="0.9"/><rect x="685" y="230" width="15" height="25" fill="url(%23windowGlow)" opacity="0.5"/><rect x="665" y="260" width="15" height="25" fill="url(%23windowGlow)" opacity="0.8"/><rect x="685" y="260" width="15" height="25" fill="url(%23windowGlow)" opacity="0.6"/><rect x="665" y="290" width="15" height="25" fill="url(%23windowGlow)" opacity="0.7"/><rect x="685" y="290" width="15" height="25" fill="url(%23windowGlow)" opacity="0.9"/><rect x="665" y="320" width="15" height="25" fill="url(%23windowGlow)" opacity="0.5"/><rect x="685" y="320" width="15" height="25" fill="url(%23windowGlow)" opacity="0.8"/><rect x="665" y="350" width="15" height="25" fill="url(%23windowGlow)" opacity="0.6"/><rect x="685" y="350" width="15" height="25" fill="url(%23windowGlow)" opacity="0.7"/><rect x="660" y="95" width="45" height="5" fill="%2300FFFF30"/><line x1="682" y1="70" x2="682" y2="95" stroke="%2300FFFF40" stroke-width="1"/><circle cx="682" cy="70" r="2" fill="%2300FFFF60"/><rect x="710" y="170" width="25" height="230" fill="%23000B14"/><rect x="715" y="180" width="15" height="20" fill="url(%23windowGlow)" opacity="0.7"/><rect x="715" y="205" width="15" height="20" fill="url(%23windowGlow)" opacity="0.9"/><rect x="715" y="230" width="15" height="20" fill="url(%23windowGlow)" opacity="0.6"/><rect x="715" y="255" width="15" height="20" fill="url(%23windowGlow)" opacity="0.8"/><rect x="715" y="280" width="15" height="20" fill="url(%23windowGlow)" opacity="0.5"/><rect x="715" y="305" width="15" height="20" fill="url(%23windowGlow)" opacity="0.7"/><rect x="715" y="330" width="15" height="20" fill="url(%23windowGlow)" opacity="0.9"/><rect x="715" y="355" width="15" height="20" fill="url(%23windowGlow)" opacity="0.6"/><rect x="710" y="165" width="25" height="5" fill="%2300FFFF30"/><rect x="745" y="150" width="30" height="250" fill="%23000B14"/><rect x="750" y="160" width="20" height="20" fill="url(%23windowGlow)" opacity="0.8"/><rect x="750" y="185" width="20" height="20" fill="url(%23windowGlow)" opacity="0.6"/><rect x="750" y="210" width="20" height="20" fill="url(%23windowGlow)" opacity="0.9"/><rect x="750" y="235" width="20" height="20" fill="url(%23windowGlow)" opacity="0.7"/><rect x="750" y="260" width="20" height="20" fill="url(%23windowGlow)" opacity="0.5"/><rect x="750" y="285" width="20" height="20" fill="url(%23windowGlow)" opacity="0.8"/><rect x="750" y="310" width="20" height="20" fill="url(%23windowGlow)" opacity="0.6"/><rect x="750" y="335" width="20" height="20" fill="url(%23windowGlow)" opacity="0.9"/><rect x="750" y="360" width="20" height="20" fill="url(%23windowGlow)" opacity="0.7"/><rect x="745" y="145" width="30" height="5" fill="%2300FFFF30"/><line x1="760" y1="120" x2="760" y2="145" stroke="%2300FFFF40" stroke-width="1"/><circle cx="760" cy="120" r="2" fill="%2300FFFF60"/><rect x="785" y="190" width="15" height="210" fill="%23000B14"/><rect x="790" y="200" width="5" height="10" fill="url(%23windowGlow)" opacity="0.7"/><rect x="790" y="215" width="5" height="10" fill="url(%23windowGlow)" opacity="0.9"/><rect x="790" y="230" width="5" height="10" fill="url(%23windowGlow)" opacity="0.6"/><rect x="790" y="245" width="5" height="10" fill="url(%23windowGlow)" opacity="0.8"/><rect x="790" y="260" width="5" height="10" fill="url(%23windowGlow)" opacity="0.5"/><rect x="790" y="275" width="5" height="10" fill="url(%23windowGlow)" opacity="0.7"/><rect x="790" y="290" width="5" height="10" fill="url(%23windowGlow)" opacity="0.9"/><rect x="790" y="305" width="5" height="10" fill="url(%23windowGlow)" opacity="0.6"/><rect x="790" y="320" width="5" height="10" fill="url(%23windowGlow)" opacity="0.8"/><rect x="790" y="335" width="5" height="10" fill="url(%23windowGlow)" opacity="0.5"/><rect x="790" y="350" width="5" height="10" fill="url(%23windowGlow)" opacity="0.7"/><rect x="790" y="365" width="5" height="10" fill="url(%23windowGlow)" opacity="0.9"/><rect x="785" y="185" width="15" height="5" fill="%2300FFFF30"/></svg>');
  background-size: cover;
  background-position: top;
  opacity: 0.5;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.data-streams {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(3deg, transparent 0%, transparent 95%, rgb(var(--color-primary) / 0.2) 100%),
    linear-gradient(93deg, transparent 0%, transparent 95%, rgb(var(--color-primary) / 0.2) 100%);
  background-size: 50px 200px, 150px 50px;
  animation: data-flow 20s linear infinite;
}

@keyframes data-flow {
  0% {
    background-position: 0 0, 0 0;
  }

  100% {
    background-position: 0 200px, 150px 0;
  }
}
</style>
