<template>
  <section id="home" class="relative mt-0 flex min-h-screen items-center overflow-hidden py-20 md:mt-10 lg:mt-0">
    <!-- Cyberpunk background with grid and glow effects -->
    <div class="absolute inset-0 z-0 bg-bg">
      <div class="cyberpunk-grid"/>
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-bg/50 to-bg"/>
    </div>

    <div class="container relative z-10 mx-auto px-4">
      <div class="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
        <div>
          <div class="mb-4 inline-block rounded-md border-2 border-primary/70 bg-black/70 px-3 py-1">
            <span class="text-sm font-medium uppercase tracking-widest text-primary">
              hyperion: {{ isEnglish ? 'System Online' : 'Système en Ligne' }}
            </span>
          </div>

          <h1 class="mb-4 text-5xl font-bold md:text-6xl">
            <span class="cyberpunk-text-glow text-primary">Gabriel </span>
            <span class="text-gray-500">Blaisot</span>
          </h1>

          <h2 class="mb-6 text-2xl font-semibold md:text-3xl ">
            {{
              isEnglish
                ? 'Computer Science Student'
                : 'Étudiant en Informatique'
            }}
            <br/>
            INSA Rennes
          </h2>

          <CyberpunkTerminalWindow class="md:max-w-lg">
            <template #title>
              {{ isEnglish ? 'welcome to my portfolio' : 'bienvenue sur mon portfolio' }}
            </template>

            <template #body>
              <!-- Description section -->
              <div class="mb-4 text-justify">
                <p class="">
                  <template
                    v-if="isEnglish"
                  >
                    Passionate about web development and software engineering.
                    I love video games, technology, and learning new things. Also passionate about Greek mythology.
                  </template>
                  <template
                    v-else
                  >
                    Etudiant en Informatique passionné par le développement web et l'ingénierie logicielle.
                    J'adore les jeux vidéo, la technologie et apprendre de nouvelles choses.
                    Également passionné par la mythologie grecque.
                  </template>
                </p>
              </div>

              <!-- Contact section -->
              <div>
                <div class="mb-2 flex items-center border-b border-primary/30">
                  <span class="font-mono text-sm uppercase text-primary">
                    {{
                      isEnglish
                        ? 'CONTACT INFORMATION'
                        : 'INFORMATIONS DE CONTACT'
                    }}
                  </span>
                </div>

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
                </div>
                <button
                  v-else
                  class="glitch-container flex w-full cursor-pointer items-center justify-center border-l border-cyan-800 py-3 pl-4"
                  type="button"
                  data-umami-event="contact clicked"
                  @click="contact_reveal = true"
                  @keydown.enter="contact_reveal = true"
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
              </div>
            </template>
          </CyberpunkTerminalWindow>

          <div class="flex flex-row gap-4">
            <div class="mt-8 flex space-x-4">
              <a
                href="#projects"
                class="cyberpunk-button rounded-none bg-primary px-6 py-3 font-medium uppercase tracking-wider text-black transition-colors hover:bg-hover"
              >
                {{ isEnglish ? 'View Projects' : 'Voir les Projets' }}
              </a>
            </div>
            <div class="mt-8 flex space-x-4">
              <a
                href="#experience"
                class="cyberpunk-button rounded-none bg-primary px-6 py-3 font-medium uppercase tracking-wider text-black transition-colors hover:bg-hover"
              >
                {{ isEnglish ? 'View past experiences' : 'Voir les expériences passées' }}
              </a>
            </div>
          </div>
        </div>

        <div class="h-full">
          <CyberpunkTerminal/>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import { usePreferencesStore } from '../../stores/preferences';
import CyberpunkTerminal from './CyberpunkTerminal.vue';
import CyberpunkTerminalWindow from './CyberpunkTerminalWindow.vue';

const preferencesStore = usePreferencesStore();
const isEnglish = computed(() => preferencesStore.isEnglish);
const contact_reveal = ref(false);
</script>

<style scoped>
.cyberpunk-grid {
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, rgb(var(--color-primary) / 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgb(var(--color-primary) / 0.1) 1px, transparent 1px);
  width: 100%;
  height: 100%;
  transform: perspective(500px) rotateX(60deg);
  transform-origin: center top;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: -50%;
  animation: pulse-wave 5s infinite linear;
}

@keyframes pulse-wave {
  0% {
    background-size: 40px 40px;
    transform: perspective(500px) rotateX(60deg) translateZ(0);
  }

  50% {
    background-size: 40px 40px;
    transform: perspective(500px) rotateX(60deg) translateZ(5px);
  }

  100% {
    background-size: 40px 40px;
    transform: perspective(500px) rotateX(60deg) translateZ(0);
  }
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
  text-shadow: -1px 0 #00ffff;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-text-before 2s infinite linear alternate-reverse;
}

.glitch-text::after {
  left: -2px;
  text-shadow: -1px 0 #ff00ff;
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
