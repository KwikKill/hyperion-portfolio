<template>
  <section id="about" class="relative min-h-screen bg-bg py-20">
    <!-- Planetary hologram, in the free right-hand side of the section from 1024 px -->
    <CyberpunkBackground scene="hologram" :wide-focus="HOLOGRAM_FOCUS"/>

    <!-- From 1024 px, every panel stacks in a column on the left (58 %) and the right-hand side
         stays free for the hologram; below that, free bands between the blocks show it. -->
    <div class="container relative mx-auto px-4">
      <!-- Terminal header -->
      <CyberpunkSectionHeader
        class="mb-8 lg:w-[58%]"
        :title="isEnglish ? 'HYPERION v1.0 - USER PROFILE' : 'HYPERION v1.0 - PROFIL UTILISATEUR'"
      />

      <div class="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:w-[58%] lg:grid-cols-1">
        <!-- Profile: facts, role and short bio -->
        <CyberpunkNeofetch v-reveal="150"/>

        <!-- About Me Terminal -->
        <CyberpunkTerminalWindow v-reveal="250">
          <template #title>
            {{ isEnglish ? 'ABOUT_ME.EXE' : 'A_PROPOS_DE_MOI.EXE' }}
          </template>

          <template #body>
            <div class="mb-4">
              <span class="text-secondary">kwikkill@hyperion:~$</span>
              <span class="ml-2 text-primary">{{ isEnglish ? 'cat interests.txt' : 'cat interets.txt' }}</span>
            </div>

            <div class="mb-4 leading-relaxed text-terminal ">
              <template v-if="isEnglish">
                When I'm not coding, you can find me exploring new technologies, or expanding my knowledge in various
                computer science domains.
                <br/>
                Apart from these subjects, I enjoy video games, films and books (mainly science fiction), board games,
                role-playing games and Greek mythology.
                <br/>
                I also played table tennis in a club for 5 years.
              </template>
              <template v-else>
                Quand je ne code pas, vous pouvez me trouver en train d'explorer de nouvelles technologies, ou d'élargir
                mes connaissances dans divers domaines de l'informatique.
                <br/>
                En dehors de ces sujets, j'apprécie les jeux vidéo, les films et les livres (principalement la
                science-fiction), les jeux de société, les jeux de rôles et la mythologie grecque.
                <br/>
                J'ai également fait 5 ans de tennis de table en club.
              </template>
            </div>

            <div class="mb-4">
              <span class="text-secondary">kwikkill@hyperion:~$</span>
              <span class="ml-2 text-primary">
                {{
                  isEnglish
                    ? 'cat associations.txt'
                    : 'cat associations.txt'
                }}
              </span>
            </div>

            <div class="mb-4 leading-relaxed text-terminal">
              <div v-if="isEnglish">
                <p>
                  Being actively involved in associations has been a significant part of my life. I have been an active
                  member of
                  several student and technology-focused organizations. These experiences have allowed me to develop
                  skills in
                  project management, teamwork, and event organization.
                </p>
                <ul class="ml-4 mt-4 list-inside list-disc">
                  <li>
                    Development Manager INSALAN (2023-2025)
                  </li>
                  <li>
                    Volunteer Secur'INSA (2023-2024)
                  </li>
                  <li>
                    Treasurer Night Fury (2023-2024)
                  </li>
                  <li>
                    Development Manager Night Fury (2022-2023)
                  </li>
                  <li>
                    E-sport LoL Manager Night Fury (2021-2022)
                  </li>
                  <li>
                    Volunteer FOG (2021)
                  </li>
                </ul>
              </div>
              <div v-else>
                <p>
                  L'associatif étant une part importante de ma vie, j'ai été membre actif de plusieurs associations
                  étudiantes et
                  technologiques. Ces expériences m'ont permis de développer des compétences en gestion de projet, en
                  travail
                  d'équipe et en organisation d'événements.
                </p>
                <ul class="ml-4 mt-4 list-inside list-disc">
                  <li>
                    Responsable Développement INSALAN (2023-2025)
                  </li>
                  <li>
                    Bénévole Secur'INSA (2023-2024)
                  </li>
                  <li>
                    Trésorier Night Fury (2023-2024)
                  </li>
                  <li>
                    Responsable Développement Night Fury (2022-2023)
                  </li>
                  <li>
                    Responsable E-sport LoL Night Fury (2021-2022)
                  </li>
                  <li>
                    Bénévole FOG (2021)
                  </li>
                </ul>
              </div>
            </div>
          </template>
        </CyberpunkTerminalWindow>

      </div>

      <!-- Skills: htop -->
      <CyberpunkSkills v-reveal="100" class="mb-8 lg:w-[58%]"/>

      <!-- Call to Action Terminal -->
      <CyberpunkTerminalWindow v-reveal="100" class="lg:w-[58%]">
        <template #title>
          FREELANCE.EXE
        </template>

        <template #body>
          <div class="mb-6 text-center">
            <!-- Cyberpunk icon -->
            <div class="mx-auto mb-4 flex size-20 items-center justify-center rounded-lg border-2 border-primary bg-bg/50">
              <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" class="text-primary">
                <!-- Define Hexagon as Clip Path -->
                <defs>
                  <clipPath id="hexClip">
                    <polygon points="50,10 86.6,30 86.6,70 50,90 13.4,70 13.4,30"/>
                  </clipPath>
                </defs>

                <!-- Outer Hexagon -->
                <polygon points="50,10 86.6,30 86.6,70 50,90 13.4,70 13.4,30" stroke-width="4" fill="none"/>

                <!-- Clipped Content: Rounded globe and horizontal lines -->
                <g clip-path="url(#hexClip)">
                  <!-- Vertical ellipses (longitude lines) -->
                  <ellipse cx="50" cy="50" rx="25" ry="40" stroke-width="2" fill="none"/>
                  <ellipse cx="50" cy="50" rx="10" ry="40" stroke-width="1.5" fill="none"/>

                  <!-- Horizontal latitude lines -->
                  <line x1="13.4" y1="30" x2="86.6" y2="30" stroke-width="1.5"/>
                  <line x1="13.4" y1="50" x2="86.6" y2="50" stroke-width="2"/>
                  <line x1="13.4" y1="70" x2="86.6" y2="70" stroke-width="1.5"/>
                </g>
              </svg>
            </div>

            <h3 class="mb-3 text-xl font-bold text-primary">
              {{ isEnglish ? 'NEED A WEBSITE?' : 'BESOIN D\'UN SITE WEB ?' }}
            </h3>

            <p class="mb-6 text-terminal">
              {{ isEnglish ? 'Access my complete service catalog and get a personalized quote.' : 'Accédez à mon catalogue complet de services et obtenez un devis personnalisé.' }}
            </p>
          </div>

          <div class="text-center">
            <a
              href="https://freelance.somi.blaisot.org"
              target="_blank"
              rel="noopener noreferrer"
              class="cyberpunk-button inline-flex items-center rounded-none bg-primary px-6 py-3 font-medium uppercase tracking-wider text-on-primary transition-all duration-300 hover:scale-105 hover:bg-hover"
            >
              {{ isEnglish ? 'VIEW SERVICES & PRICING' : 'VOIR SERVICES & TARIFS' }}
              <svg class="ml-2 size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          </div>
        </template>
      </CyberpunkTerminalWindow>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { vReveal } from '../../directives/reveal';
import { usePreferencesStore } from '../../stores/preferences';
import type { Focus } from '../../utils/backgrounds/core';
import CyberpunkBackground from './CyberpunkBackground.vue';
import CyberpunkNeofetch from './CyberpunkNeofetch.vue';
import CyberpunkSectionHeader from './CyberpunkSectionHeader.vue';
import CyberpunkSkills from './CyberpunkSkills.vue';
import CyberpunkTerminalWindow from './CyberpunkTerminalWindow.vue';

const preferencesStore = usePreferencesStore();
const isEnglish = computed(() => preferencesStore.isEnglish);

// Centre of the free 42 % on the right of the panel column
const HOLOGRAM_FOCUS: Focus = { fx: 0.79, fy: 0.5, fw: 0.38 };
</script>
