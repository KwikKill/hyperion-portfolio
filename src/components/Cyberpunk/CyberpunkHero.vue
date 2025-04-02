<template>
  <section id="home" class="cyberpunk-terminal min-h-screen flex items-center py-20 relative overflow-hidden">
    <!-- Cyberpunk background with grid and glow effects -->
    <div class="absolute inset-0 bg-black z-0">
      <div class="cyberpunk-grid"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>
    </div>

    <div class="container mx-auto px-4 z-10 relative">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <div class="mb-4 inline-block border-2 border-theme-foreground/70 rounded-md px-3 py-1 bg-black/70">
            <span class="text-theme-foreground uppercase tracking-widest text-sm font-medium">
              hyperion: {{ isEnglish ? 'System Online' : 'Système en Ligne' }}
            </span>
          </div>

          <h1 class="text-5xl md:text-6xl font-bold mb-4 text-white">
            <span class="text-theme-foreground cyberpunk-text-glow">Gabriel </span>
            <span class="text-gray-500">Blaisot</span>
          </h1>

          <h2 class="text-2xl md:text-3xl font-semibold mb-6 ">
            {{
              isEnglish
              ? 'Computer Science Student'
              : 'Étudiant en Informatique'
            }}
            <br />
            INSA Rennes
          </h2>

          <div class="cyberpunk-terminal rounded-sm border-2 border-theme-foreground/70 rounded-md p-4 bg-black/70 mb-8 max-w-lg">
            <p class="text-gray-300">
              {{ isEnglish
                ? 'Passionate about web development and software engineering. I love video games, technology, and learning new things. Also passionate about Greek mythology.'
                : 'Etudiant en Informatique passionné par le développement web et l\'ingénierie logicielle. J\'adore les jeux vidéo, la technologie et apprendre de nouvelles choses. Passionné également par la mythologie grecque.'
              }}
            </p>
          </div>

          <div class="flex space-x-4">
            <a
              href="#projects"
              class="px-6 py-3 bg-theme-foreground hover:bg-yellow-600 text-black font-medium rounded-none transition-colors uppercase tracking-wider cyberpunk-button"
            >
              {{ isEnglish ? 'View Projects' : 'Voir les Projets' }}
            </a>
          </div>
        </div>

        <div class="h-full">
          <CyberpunkTerminal />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { usePreferencesStore } from '../../stores/preferences'
import CyberpunkTerminal from './CyberpunkTerminal.vue'

const preferencesStore = usePreferencesStore()
const isEnglish = computed(() => preferencesStore.isEnglish)
</script>

<style scoped>
.cyberpunk-grid {
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, rgba(255, 213, 0, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 213, 0, 0.1) 1px, transparent 1px);
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
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: 0.5s;
}

.cyberpunk-button:hover::before {
  left: 100%;
}
</style>

