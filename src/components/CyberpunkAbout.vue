<template>
  <section id="about" class="cyberpunk-terminal py-20 bg-black relative min-h-screen">
    <!-- Cyberpunk background with grid -->
    <div class="absolute inset-0 z-0">
      <!-- Circuit board pattern background -->
      <div class="circuit-board-bg h-full"></div>
      <!-- Overlay with radial gradient -->
      <div class="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/90"></div>
      <!-- Animated scan lines -->
      <div class="absolute inset-0 scanlines opacity-20"></div>
    </div>

    <div class="container mx-auto px-4 relative z-10">
      <!-- Terminal header -->
      <div class="cyberpunk-terminal border-2 border-theme-foreground/70 rounded-md bg-black/80 p-2 mb-8 flex justify-between items-center">
        <div class="text-theme-foreground font-mono uppercase tracking-wider">
          {{ isEnglish ? 'HYPERION v1.0 - USER PROFILE' : 'HYPERION v1.0 - PROFIL UTILISATEUR' }}
        </div>
        <div class="flex space-x-2">
          <div class="w-3 h-3 rounded-full bg-green-500"></div>
          <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div class="w-3 h-3 rounded-full bg-red-500"></div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- About Me Terminal -->
        <div class="cyberpunk-terminal border-2 border-theme-foreground/70 rounded-md bg-black/80 p-2">
          <div class="terminal-header mb-4 pb-2 border-b border-theme-foreground/30 flex justify-between items-center">
            <div class="flex items-center">
              <div class="w-4 h-4 bg-theme-foreground mr-2"></div>
              <div class="text-theme-foreground font-mono uppercase">
                {{ isEnglish ? 'ABOUT_ME.EXE' : 'A_PROPOS_DE_MOI.EXE' }}
              </div>
            </div>
            <div class="flex space-x-2">
              <div class="w-3 h-3 rounded-full bg-green-500"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div class="w-3 h-3 rounded-full bg-red-500"></div>
            </div>
          </div>

          <div class="terminal-content font-mono">
            <div class="mb-4">
              <span class="text-cyan-400">kwikkill@hyperion:~$</span>
              <span class="text-theme-foreground ml-2">{{ isEnglish ? 'cat profile.txt' : 'cat profil.txt' }}</span>
            </div>

            <div class="text-green-400 mb-4 leading-relaxed">
              {{ isEnglish
                ? 'I\'m a computer science student from France, passionate about web development and software engineering. I love creating innovative solutions to complex problems and continuously learning new technologies.'
                : 'Je suis un étudiant en informatique français, passionné par le développement web et l\'ingénierie logicielle. J\'aime créer des solutions innovantes à des problèmes complexes et apprendre continuellement de nouvelles technologies.'
              }}
            </div>

            <div class="mb-4">
              <span class="text-cyan-400">kwikkill@system:~$</span>
              <span class="text-theme-foreground ml-2">{{ isEnglish ? 'cat interests.txt' : 'cat interets.txt' }}</span>
            </div>

            <div class="text-green-400 leading-relaxed">
              {{ isEnglish
                ? 'When I\'m not coding, you can find me exploring new technologies, contributing to open-source projects, or expanding my knowledge in various computer science domains.'
                : 'Quand je ne code pas, vous pouvez me trouver en train d\'explorer de nouvelles technologies, de contribuer à des projets open-source, ou d\'élargir mes connaissances dans divers domaines de l\'informatique.'
              }}
            </div>
          </div>
        </div>

        <!-- Skills Terminal -->
        <div class="cyberpunk-terminal border-2 border-theme-foreground/70 rounded-md bg-black/80 p-2">
          <div class="terminal-header mb-4 pb-2 border-b border-theme-foreground/30 flex justify-between items-center">
            <div class="flex items-center">
              <div class="w-4 h-4 bg-theme-foreground mr-2"></div>
              <div class="text-theme-foreground font-mono uppercase">
                {{ isEnglish ? 'SKILLS.EXE' : 'COMPETENCES.EXE' }}
              </div>
            </div>
            <div class="flex space-x-2">
              <div class="w-3 h-3 rounded-full bg-green-500"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div class="w-3 h-3 rounded-full bg-red-500"></div>
            </div>
          </div>

          <div class="terminal-content font-mono">
            <div class="mb-4">
              <span class="text-cyan-400">kwikkill@system:~$</span>
              <span class="text-theme-foreground ml-2">{{ isEnglish ? './list_skills.sh' : './lister_competences.sh' }}</span>
            </div>

            <div class="space-y-4">
              <div v-for="(category, index) in skills" :key="index">
                <!-- Foldable category header -->
                <div
                  class="text-theme-foreground uppercase mb-2 flex items-center cursor-pointer hover:bg-gray-900/30 p-1"
                  @click="toggleCategory(index)"
                >
                  <span class="text-cyan-400 mr-2 transition-transform duration-200" :class="{'rotate-90': expandedCategories[index]}">
                    ▶
                  </span>
                  {{ category.name }}
                </div>

                <!-- Skills list (collapsible) -->
                <div
                  v-if="expandedCategories[index]"
                  class="ml-6 space-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div
                    v-for="(skill, skillIndex) in category.skills"
                    :key="skillIndex"
                    class="skill-item flex items-center"
                  >
                    <span class="text-cyan-400 mr-2">></span>
                    <span class="text-green-400">{{ skill }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4 text-green-400 pt-4 border-t border-theme-foreground/30">
              <div class="flex items-center">
                <span class="text-cyan-400 mr-2">kwikkill@system:~$</span>
                <span class="text-theme-foreground">
                  {{
                    isEnglish
                    ? 'echo "Always learning new technologies"'
                    : 'echo "Toujours en train d\'apprendre de nouvelles technologies"'
                  }}
                </span>
              </div>
              <div class="mt-1">
                {{
                  isEnglish
                  ? 'Always learning new technologies'
                  : 'Toujours en train d\'apprendre de nouvelles technologies'
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { usePreferencesStore } from '../stores/preferences'
import { useProjectsStore } from '../stores/projects'

const projectsStore = useProjectsStore()

const skills = computed(() => projectsStore.getLocalizedSkills)
const preferencesStore = usePreferencesStore()
const isEnglish = computed(() => preferencesStore.isEnglish)

// Track which categories are expanded
const expandedCategories = ref({})

// Toggle category expansion
function toggleCategory(index) {
  expandedCategories.value[index] = !expandedCategories.value[index]
}

// Initialize with first category expanded
onMounted(() => {
  expandedCategories.value[0] = true
})
</script>

<style scoped>
.circuit-board-bg {
  background-color: #111;
  background-image:
    radial-gradient(circle at 25px 25px, rgba(255, 215, 0, 0.2) 2px, transparent 0),
    linear-gradient(to right, rgba(255, 215, 0, 0.2) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 215, 0, 0.2) 1px, transparent 1px);
  background-size: 50px 50px, 25px 25px, 25px 25px;
  background-position: 0 0;
  position: relative;
  overflow: hidden;
}

.circuit-board-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(to right, transparent 24px, rgba(255, 215, 0, 0.15) 25px, transparent 26px),
    linear-gradient(to bottom, transparent 24px, rgba(255, 215, 0, 0.15) 25px, transparent 26px);
  background-size: 50px 50px;
  background-position: 0 0;
}

.circuit-board-bg::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 25px 0, rgba(0, 255, 255, 0.2) 5px, transparent 6px),
    radial-gradient(circle at 0 25px, rgba(0, 255, 255, 0.2) 5px, transparent 6px),
    radial-gradient(circle at 50px 25px, rgba(0, 255, 255, 0.2) 5px, transparent 6px),
    radial-gradient(circle at 25px 50px, rgba(0, 255, 255, 0.2) 5px, transparent 6px);
  background-size: 50px 50px;
}

.scanlines {
  background: linear-gradient(
    to bottom,
    transparent 50%,
    rgba(0, 0, 0, 0.5) 50%
  );
  background-size: 100% 4px;
  pointer-events: none;
}

.skill-item {
  position: relative;
}

/* Remove the ::before pseudo-element since we're using > character directly in the template */
</style>

