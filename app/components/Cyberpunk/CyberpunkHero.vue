<template>
  <section id="home" class="relative flex min-h-screen items-center overflow-clip py-20">
    <!-- Wireframe relief scrolling towards the viewer -->
    <CyberpunkBackground scene="gridTerrain"/>

    <div class="container relative z-10 mx-auto px-4">
      <div class="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
        <div class="hero-copy">
          <div class="mb-4 inline-block rounded-md border-2 border-primary/70 bg-bg/70 px-3 py-1">
            <span class="text-sm font-medium uppercase tracking-widest text-primary">
              hyperion: {{ isEnglish ? 'System Online' : 'Système en Ligne' }}
            </span>
          </div>

          <h1 class="mb-4 text-5xl font-bold md:text-6xl">
            <span class="cyberpunk-text-glow text-primary">Gabriel </span>
            <span class="text-gray-500">Blaisot</span>
          </h1>

          <!-- The role under the name: a paragraph, the h2 level belongs to the sections -->
          <p class="mb-6 text-2xl font-semibold md:text-3xl ">
            {{
              isEnglish
                ? 'Software Engineer - Web Developer'
                : 'Ingénieur logiciel - Développeur Web'
            }}
            <br/>
            Sopra Steria & Freelance
          </p>

          <!-- Bio and contact sit on the relief, without a window: a dark halo behind them keeps them readable -->
          <div class="md:max-w-lg">
            <p class="mb-6 text-lg leading-relaxed text-text">
              <template v-if="isEnglish">
                Software engineer at <span class="font-semibold text-primary">{{ company }}</span> in Rennes, I build web
                applications end to end. Trained at {{ school }}: {{ internshipCount }}&nbsp;internships, a freelance activity and
                <span class="font-semibold text-primary">{{ projects.length }}&nbsp;projects</span> published since {{ sinceYear }}.
              </template>
              <template v-else>
                Ingénieur logiciel chez <span class="font-semibold text-primary">{{ company }}</span> à Rennes, je conçois des
                applications web de bout en bout. Formé à l'{{ school }}&nbsp;: {{ internshipCount }}&nbsp;stages, une activité freelance et
                <span class="font-semibold text-primary">{{ projects.length }}&nbsp;projets</span> publiés depuis {{ sinceYear }}.
              </template>
            </p>

            <!-- Contact, in a small terminal window titled like the section -->
            <CyberpunkTerminalWindow>
              <template #title>
                {{ isEnglish ? 'contact information' : 'informations de contact' }}
              </template>

              <template #body>
                <div v-if="contact_reveal" class="font-mono space-y-2 border-l border-cyan-800 pl-4">
                  <div class="flex items-center">
                    <span class="mr-2 text-secondary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="mr-2 size-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </span>
                    <a href="tel:+33652411416" class="text-primary transition-colors hover:text-hover">
                      +33 6 52 41 14 16
                    </a>
                  </div>

                  <div class="flex items-center">
                    <span class="mr-2 text-secondary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="mr-2 size-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </span>
                    <a
                      href="mailto:gabriel@blaisot.org"
                      class="text-primary transition-colors hover:text-hover"
                    >
                      gabriel@blaisot.org
                    </a>
                  </div>

                  <div class="flex items-center">
                    <span class="mr-2 text-secondary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="mr-2 size-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                        />
                      </svg>
                    </span>
                    <a
                      href="https://www.linkedin.com/in/gabriel-blaisot-a89480233/"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-primary transition-colors hover:text-hover"
                    >
                      gabriel-blaisot
                    </a>
                  </div>

                  <div class="flex items-center">
                    <span class="mr-2 text-secondary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="mr-2 size-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </span>
                    <a
                      href="https://github.com/KwikKill"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-primary transition-colors hover:text-hover"
                    >
                      KwikKill
                    </a>
                  </div>
                </div>
                <button
                  v-else
                  class="glitch-container flex w-full cursor-pointer items-center justify-center border-l border-cyan-800 py-3 pl-4"
                  type="button"
                  data-umami-event="contact clicked"
                  @click="contact_reveal = true"
                >
                  <div class="glitch-text" :data-text="isEnglish ? 'CLICK TO REVEAL' : 'CLIQUER POUR RÉVÉLER'">
                    {{ isEnglish ? 'CLICK TO REVEAL' : 'CLIQUER POUR RÉVÉLER' }}
                  </div>
                  <div class="glitch-blocks">
                    <div class="glitch-block"/>
                    <div class="glitch-block"/>
                    <div class="glitch-block"/>
                  </div>
                </button>
              </template>
            </CyberpunkTerminalWindow>
          </div>

          <!-- Same buttons as the classic version: CV and projects first, experience as the secondary one -->
          <div class="mt-8 flex flex-wrap gap-4">
            <a
              :href="CV_URL"
              target="_blank"
              rel="noopener noreferrer"
              class="cyberpunk-button inline-flex items-center gap-2 rounded-none bg-primary px-6 py-3 font-medium uppercase tracking-wider text-on-primary transition-colors hover:bg-hover"
            >
              {{ isEnglish ? 'View my CV' : 'Voir mon CV' }}
              <svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
            <!-- Scroll without writing the hash to the URL (see utils/scroll.ts) -->
            <a
              href="#projects"
              class="cyberpunk-button rounded-none bg-primary px-6 py-3 font-medium uppercase tracking-wider text-on-primary transition-colors hover:bg-hover"
              @click.prevent="scrollToSection('projects')"
            >
              {{ isEnglish ? 'View my projects' : 'Voir mes projets' }}
            </a>
            <a
              href="#experience"
              class="cyberpunk-button rounded-none border-2 border-primary px-6 py-3 font-medium uppercase tracking-wider text-primary transition-colors hover:bg-primary/10"
              @click.prevent="scrollToSection('experience')"
            >
              {{ isEnglish ? 'View my experience' : 'Voir mes expériences' }}
            </a>
          </div>
        </div>

        <div class="h-full">
          <!-- The terminal writes its lines once, on mount: remount it when the language changes -->
          <CyberpunkTerminal :key="isEnglish ? 'en' : 'fr'"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import { useProfile } from '../../composables/useProfile';
import { usePreferencesStore } from '../../stores/preferences';
import { CV_URL } from '../../utils/links';
import { scrollToSection } from '../../utils/scroll';
import CyberpunkBackground from './CyberpunkBackground.vue';
import CyberpunkTerminal from './CyberpunkTerminal.vue';
import CyberpunkTerminalWindow from './CyberpunkTerminalWindow.vue';

const preferencesStore = usePreferencesStore();
// The bio's facts, from the store, like the neofetch's
const {
  projects, job, formation, internshipCount, sinceYear,
} = useProfile();
const isEnglish = computed(() => preferencesStore.isEnglish);
const company = computed(() => job.value?.company ?? '');
const school = computed(() => formation.value.school);
const contact_reveal = ref(false);
</script>

<style scoped>
/* Dark halo behind the name, the bio and the contact: they sit directly on the relief. No stacking
   context here (no isolation, no z-index): the contact window, once full screen, must cover the
   terminal on the right. The halo stays behind the text in the container's stacking context. */
.hero-copy {
  position: relative;
}

.hero-copy::before {
  content: '';
  position: absolute;
  z-index: -1;
  inset: -60px -80px -60px -120px;
  background: radial-gradient(closest-side, rgb(var(--color-background) / 0.75), rgb(var(--color-background) / 0.4) 70%, transparent);
  pointer-events: none;
}

.cyberpunk-button {
  position: relative;
  overflow: hidden;
}

.cyberpunk-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent);
  transition: 0.5s;
}

.cyberpunk-button:hover::before {
  left: 100%;
}

.glitch-container {
  position: relative;
  overflow: hidden;
  height: 88px;
}

.glitch-text {
  color: rgb(var(--color-primary));
  font-family: monospace;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  position: relative;
  animation: glitch-text 2.5s infinite;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch-text::before {
  left: 2px;
  text-shadow: -1px 0 rgb(var(--color-secondary));
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-text-before 2s infinite linear alternate-reverse;
}

.glitch-text::after {
  left: -2px;
  text-shadow: -1px 0 rgb(var(--color-accent));
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-text-after 3s infinite linear alternate-reverse;
}

.glitch-blocks {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0.3;
}

.glitch-block {
  position: absolute;
  background: rgb(var(--color-primary));
  animation: glitch-block 1.5s infinite;
}

.glitch-block:nth-child(1) {
  width: 20px;
  height: 5px;
  top: 30%;
  left: 30%;
  animation-delay: 0.2s;
}

.glitch-block:nth-child(2) {
  width: 40px;
  height: 3px;
  top: 60%;
  left: 10%;
  animation-delay: 0.5s;
}

.glitch-block:nth-child(3) {
  width: 10px;
  height: 10px;
  top: 40%;
  left: 60%;
  animation-delay: 0.8s;
}

@keyframes glitch-text {

  0%,
  100% {
    opacity: 1;
  }

  72.5%,
  75% {
    opacity: 0.7;
  }
}

@keyframes glitch-text-before {
  0% {
    clip: rect(44px, 450px, 56px, 0);
  }

  5% {
    clip: rect(17px, 450px, 94px, 0);
  }

  10% {
    clip: rect(12px, 450px, 18px, 0);
  }

  15% {
    clip: rect(89px, 450px, 100px, 0);
  }

  20% {
    clip: rect(30px, 450px, 65px, 0);
  }

  25% {
    clip: rect(20px, 450px, 40px, 0);
  }

  30% {
    clip: rect(54px, 450px, 73px, 0);
  }

  35% {
    clip: rect(10px, 450px, 25px, 0);
  }

  40% {
    clip: rect(38px, 450px, 50px, 0);
  }

  45% {
    clip: rect(75px, 450px, 85px, 0);
  }

  50% {
    clip: rect(5px, 450px, 15px, 0);
  }

  55% {
    clip: rect(82px, 450px, 90px, 0);
  }

  60% {
    clip: rect(28px, 450px, 39px, 0);
  }

  65% {
    clip: rect(60px, 450px, 72px, 0);
  }

  70% {
    clip: rect(15px, 450px, 30px, 0);
  }

  75% {
    clip: rect(45px, 450px, 55px, 0);
  }

  80% {
    clip: rect(70px, 450px, 80px, 0);
  }

  85% {
    clip: rect(8px, 450px, 20px, 0);
  }

  90% {
    clip: rect(50px, 450px, 62px, 0);
  }

  95% {
    clip: rect(78px, 450px, 87px, 0);
  }

  100% {
    clip: rect(32px, 450px, 47px, 0);
  }
}

@keyframes glitch-text-after {
  0% {
    clip: rect(32px, 450px, 47px, 0);
  }

  5% {
    clip: rect(78px, 450px, 87px, 0);
  }

  10% {
    clip: rect(50px, 450px, 62px, 0);
  }

  15% {
    clip: rect(8px, 450px, 20px, 0);
  }

  20% {
    clip: rect(70px, 450px, 80px, 0);
  }

  25% {
    clip: rect(45px, 450px, 55px, 0);
  }

  30% {
    clip: rect(15px, 450px, 30px, 0);
  }

  35% {
    clip: rect(60px, 450px, 72px, 0);
  }

  40% {
    clip: rect(28px, 450px, 39px, 0);
  }

  45% {
    clip: rect(82px, 450px, 90px, 0);
  }

  50% {
    clip: rect(5px, 450px, 15px, 0);
  }

  55% {
    clip: rect(75px, 450px, 85px, 0);
  }

  60% {
    clip: rect(38px, 450px, 50px, 0);
  }

  65% {
    clip: rect(10px, 450px, 25px, 0);
  }

  70% {
    clip: rect(54px, 450px, 73px, 0);
  }

  75% {
    clip: rect(20px, 450px, 40px, 0);
  }

  80% {
    clip: rect(30px, 450px, 65px, 0);
  }

  85% {
    clip: rect(89px, 450px, 100px, 0);
  }

  90% {
    clip: rect(12px, 450px, 18px, 0);
  }

  95% {
    clip: rect(17px, 450px, 94px, 0);
  }

  100% {
    clip: rect(44px, 450px, 56px, 0);
  }
}

@keyframes glitch-block {

  0%,
  100% {
    transform: translate(0);
    opacity: 0.3;
  }

  25% {
    transform: translate(-10px, 2px);
    opacity: 0.5;
  }

  50% {
    transform: translate(8px, -5px);
    opacity: 0.1;
  }

  75% {
    transform: translate(-5px, 3px);
    opacity: 0.4;
  }
}
</style>
