<template>
  <section id="projects" class="cyberpunk-terminal py-20 bg-black relative min-h-screen">
    <!-- Enhanced cyberpunk background with depth and better grid effects -->
    <div class="absolute inset-0 z-0 overflow-hidden">
      <!-- Improved grid background with perspective -->
      <div class="cyber-grid-bg"></div>
      <!-- Radial overlay for better depth -->
      <div class="absolute inset-0 bg-gradient-radial from-transparent via-black/70 to-black"></div>
      <!-- Scan lines effect -->
      <div class="absolute inset-0 scan-lines opacity-10"></div>
    </div>

    <div class="container mx-auto px-4 relative z-10">
      <!-- File explorer header with improved styling -->
      <CyberpunkTerminalWindow class="mb-4 explorer-header" :showIcon="false" noBody>
        <template #title>
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            <span class="text-theme-foreground cyberpunk-text-glow">
              {{ isEnglish ? 'HYPERION OS v1.0 - PROJECT EXPLORER' : 'HYPERION OS v1.0 - EXPLORATEUR DE PROJETS' }}
            </span>
          </div>
        </template>
      </CyberpunkTerminalWindow>

      <!-- Enhanced search bar with cyberpunk styling -->
      <CyberpunkTerminalWindow class="mb-8 search-bar" :noTitle="true">
        <template #body>
          <div class="flex items-center">
            <div class="text-cyan-400 mr-2 font-mono flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div class="relative flex-1">
              <input type="text" v-model="searchQuery"
                :placeholder="isEnglish ? 'SEARCH PROJECTS, TECHNOLOGIES, KEYWORDS...' : 'RECHERCHER PROJETS, TECHNOLOGIES, MOTS-CLÉS...'"
                class="w-full bg-transparent border-none outline-none text-theme-foreground font-mono uppercase placeholder-gray-500 focus:ring-0"
                @focus="isSearchFocused = true" @blur="isSearchFocused = false" />
              <div v-if="searchQuery" @click="clearSearch"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-theme-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <div class="text-cyan-400 ml-2 font-mono text-sm flex items-center">
              <span class="mr-1">{{ filteredProjects.length }}</span>
              <span>{{ isEnglish ? 'FILES' : 'FICHIERS' }}</span>
            </div>
          </div>
        </template>
      </CyberpunkTerminalWindow>

      <!-- Search status message with improved styling -->
      <div v-if="searchQuery && filteredProjects.length === 0"
        class="text-center mb-6 p-4 border border-red-500/50 bg-black/50 rounded">
        <div class="text-red-400 font-mono uppercase cyberpunk-text-glow flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {{ isEnglish ? 'NO FILES FOUND' : 'AUCUN FICHIER TROUVÉ' }}
        </div>
        <div class="text-gray-400 text-sm font-mono mt-2">
          <template
            v-if="isEnglish"
          >
            TRY ANOTHER SEARCH TERM OR CLEAR FILTER
          </template>
          <template
            v-else
          >
            UN AUTRE TERME DE RECHERCHE OU EFFACEZ LE FILTRE
          </template>
        </div>
      </div>

      <!-- File explorer view with improved styling -->
      <div
        class="file-explorer-container border-2 border-theme-foreground/50 rounded-md bg-black/70 p-4 backdrop-blur-sm">
        <!-- Explorer header with column titles -->
        <div
          class="explorer-header grid grid-cols-12 gap-2 mb-4 text-xs uppercase font-mono text-cyan-400 border-b border-theme-foreground/30 pb-2">
          <div class="col-span-6 md:col-span-5 flex items-center">
            <span class="mr-2">{{ isEnglish ? 'Filename' : 'Nom du fichier' }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div class="col-span-3 md:col-span-2 hidden md:block">{{ isEnglish ? 'Date' : 'Date' }}</div>
          <div class="col-span-3 md:col-span-3 hidden md:block">{{ isEnglish ? 'Type' : 'Type' }}</div>
          <div class="col-span-6 md:col-span-2">{{ isEnglish ? 'Links' : 'Liens' }}</div>
        </div>

        <!-- Project items as file entries -->
        <div class="space-y-2">
          <div v-for="project in filteredProjects" :key="project.id"
            class="file-item grid grid-cols-12 gap-2 p-2 rounded cursor-pointer transition-all duration-300 hover:bg-theme-foreground/10 border border-transparent hover:border-theme-foreground/30"
            :class="{ 'search-match': isSearchMatch(project) }" @click="openProject(project)"
            :id="'project-' + project.file[language]">
            <!-- File name and icon -->
            <div class="col-span-6 md:col-span-5 flex items-center">
              <div class="file-icon mr-3 relative">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                  class="w-6 h-6 text-theme-foreground">
                  <path
                    d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.146V6a3 3 0 013-3h5.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 013 3v1.146A4.483 4.483 0 0019.5 9h-15a4.483 4.483 0 00-3 1.146z" />
                </svg>
                <!-- Star badge for starred projects -->
                <div v-if="project.starred" class="absolute -top-1 -right-1 star-badge">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <div class="file-name truncate font-mono text-theme-foreground">
                {{ project.localizedName }}
              </div>
            </div>

            <!-- Date -->
            <div class="col-span-3 md:col-span-2 hidden md:flex items-center text-gray-400 text-sm">
              {{ project.date }}
            </div>

            <!-- Type - showing first technology -->
            <div class="col-span-3 md:col-span-3 hidden md:flex items-center">
              <span
                class="px-2 py-0.5 bg-black text-theme-foreground text-xs font-mono uppercase border border-theme-foreground/50 rounded-sm">
                {{ project.technologies[0] }}
              </span>
            </div>

            <!-- Status - links available -->
            <div class="col-span-6 md:col-span-2 flex items-center justify-start space-x-2">
              <div v-if="project.github" class="status-icon text-green-400 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </div>
              <div v-if="project.link" class="status-icon text-cyan-400 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Project Modal -->
    <div v-if="selectedProject"
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      @click.self="closeProject">
      <CyberpunkTerminalWindow class="max-w-4xl w-full max-h-[85vh] overflow-y-auto">
        <template #title>
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
              class="w-5 h-5 mr-2 text-theme-foreground">
              <path
                d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.146V6a3 3 0 013-3h5.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 013 3v1.146A4.483 4.483 0 0019.5 9h-15a4.483 4.483 0 00-3 1.146z" />
            </svg>
            <span>{{ selectedProject.localizedName }}</span>
            <span v-if="selectedProject.starred" class="ml-2 text-theme-foreground star-badge-modal flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span class="text-xs ml-1">{{ isEnglish ? 'FEATURED PROJECT' : 'PROJET MIS EN AVANT' }}</span>
            </span>
          </div>
        </template>

        <template #buttons>
          <div class="flex justify-end">
            <button @click="closeProject" class="text-theme-foreground hover:text-yellow-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </template>

        <template #body>
          <div class="project-modal-content">
            <div class="flex flex-col md:flex-row gap-6">
              <!-- Project image with enhanced styling -->
              <div class="md:w-1/2">
                <div class="project-image-container relative">
                  <img :src="selectedProject.image" :alt="selectedProject.localizedName"
                    class="w-full h-auto object-cover rounded-md border border-theme-foreground/70 z-10 relative glow-effect border-2 border-theme-foreground/70 rounded-md" />
                  <div
                    class="absolute top-2 right-2 bg-black/70 text-xs text-theme-foreground px-2 py-1 rounded font-mono z-20">
                    {{ selectedProject.date }}
                  </div>
                </div>
              </div>

              <!-- Project details with enhanced styling -->
              <div class="md:w-1/2">
                <!-- Description with terminal-like styling -->
                <div class="bg-black/50 p-4 border border-theme-foreground/30 rounded-md mb-4">
                  <div class="text-gray-300 font-mono text-justify leading-relaxed">
                    {{ selectedProject.localizedDescription }}
                  </div>
                </div>

                <!-- Technologies with improved styling -->
                <div class="mb-4">
                  <h4 class="text-cyan-400 font-mono uppercase text-sm mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {{ isEnglish ? 'TECHNOLOGIES' : 'TECHNOLOGIES' }}
                  </h4>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="(tech, index) in selectedProject.technologies" :key="index"
                      class="px-2 py-1 bg-black text-theme-foreground text-xs font-mono uppercase border border-theme-foreground/50 rounded-sm hover:bg-theme-foreground/10 transition-colors">
                      {{ tech }}
                    </span>
                  </div>
                </div>

                <!-- Action buttons with improved styling -->
                <div class="flex space-x-4 mb-2 justify-end">
                  <a :href="selectedProject.link" v-if="selectedProject.link" target="_blank" rel="noopener noreferrer"
                    class="px-4 py-2 bg-theme-foreground hover:bg-yellow-400 text-black font-mono uppercase text-sm flex items-center transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {{ isEnglish ? 'VIEW PROJECT' : 'VOIR LE PROJET' }}
                  </a>
                  <a :href="selectedProject.github" v-if="selectedProject.github" target="_blank"
                    rel="noopener noreferrer"
                    class="px-4 py-2 bg-theme-foreground hover:bg-yellow-400 text-black font-mono uppercase text-sm flex items-center transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </template>
      </CyberpunkTerminalWindow>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia';
import { usePreferencesStore } from '../../stores/preferences'
import { useProjectsStore } from '../../stores/projects'
import CyberpunkTerminalWindow from './CyberpunkTerminalWindow.vue'

const preferencesStore = usePreferencesStore()
const projectsStore = useProjectsStore()

const isEnglish = computed(() => preferencesStore.isEnglish)
const language = computed(() => preferencesStore.language)
const projects = computed(() => projectsStore.getLocalizedProjects)

const { selectedProject } = storeToRefs(projectsStore)

const searchQuery = ref('')
const isSearchFocused = ref(false)
const lastSearchTime = ref(Date.now())

// Filter projects based on search query
const filteredProjects = computed(() => {
  if (!searchQuery.value) return projects.value

  const query = searchQuery.value.toLowerCase()
  return projects.value.filter(project => {
    return project.localizedName.toLowerCase().includes(query) ||
      project.localizedDescription.toLowerCase().includes(query) ||
      project.technologies.some(tech => tech.toLowerCase().includes(query))
  })
})

// Check if a project is a new match for animation purposes
function isSearchMatch(project) {
  if (!searchQuery.value) return false

  const query = searchQuery.value.toLowerCase()
  return project.localizedName.toLowerCase().includes(query) ||
    project.localizedDescription.toLowerCase().includes(query) ||
    project.technologies.some(tech => tech.toLowerCase().includes(query))
}

// Clear search
function clearSearch() {
  searchQuery.value = ''
}

// Update last search time when query changes (for animation timing)
watch(searchQuery, () => {
  lastSearchTime.value = Date.now()
})

function openProject(project) {
  selectedProject.value = project
}

function closeProject() {
  selectedProject.value = null
}
</script>

<style scoped>
/* Enhanced cyberpunk grid background */
.cyber-grid-bg {
  background-color: #000;
  background-image:
    linear-gradient(to right, rgba(254, 238, 59, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(254, 238, 59, 0.1) 1px, transparent 1px);
  background-size: 30px 30px;
  width: 100%;
  height: 100%;
  transform: perspective(500px) rotateX(60deg);
  transform-origin: center top;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: -50%;
  animation: grid-pulse 8s infinite linear;
}

/* Scan lines effect */
.scan-lines {
  background: linear-gradient(to bottom,
      transparent 50%,
      rgba(254, 238, 59, 0.05) 50%);
  background-size: 100% 4px;
  pointer-events: none;
}

/* File explorer container with enhanced styling */
.file-explorer-container {
  box-shadow: 0 0 20px rgba(254, 238, 59, 0.2);
  position: relative;
  overflow: hidden;
}

.file-explorer-container::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, rgba(254, 238, 59, 0.3), transparent 60%);
  z-index: -1;
  pointer-events: none;
}

/* File item hover effects */
.file-item {
  position: relative;
  overflow: hidden;
}

.file-item:hover::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(254, 238, 59, 0.1), transparent);
  animation: scan-effect 1.5s linear;
}

/* Star badge styling with enhanced glow */
.star-badge {
  color: #FFDA63;
  filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.7));
  animation: star-pulse 3s infinite;
}

.star-badge-modal {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  background-color: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 4px;
}

/* Project image container with glow effect */
.project-image-container {
  position: relative;
}

.glow-effect {
  box-shadow: 0 0 15px rgba(254, 238, 59, 0.3);
  animation: glow-pulse 2s infinite alternate;
}

/* Animation keyframes */
@keyframes grid-pulse {
  0% {
    background-size: 30px 30px;
    opacity: 0.8;
  }

  50% {
    background-size: 32px 32px;
    opacity: 1;
  }

  100% {
    background-size: 30px 30px;
    opacity: 0.8;
  }
}

@keyframes star-pulse {

  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.1);
    opacity: 0.9;
  }
}

@keyframes scan-effect {
  0% {
    left: -100%;
  }

  100% {
    left: 100%;
  }
}

@keyframes glow-pulse {
  0% {
    box-shadow: 0 0 15px rgba(254, 238, 59, 0.3);
  }

  100% {
    box-shadow: 0 0 25px rgba(254, 238, 59, 0.5);
  }
}

/* Search match animation */
.search-match {
  animation: search-highlight 1.5s ease-in-out;
}

@keyframes search-highlight {
  0% {
    background-color: rgba(254, 238, 59, 0.2);
  }

  50% {
    background-color: rgba(254, 238, 59, 0);
  }

  100% {
    background-color: rgba(254, 238, 59, 0.2);
  }
}

/* Explorer header styling */
.explorer-header {
  border-bottom: 1px solid rgba(254, 238, 59, 0.3);
}

/* Search bar styling */
.search-bar {
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
}

/* Project modal content styling */
.project-modal-content {
  position: relative;
}

.project-modal-content::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(254, 238, 59, 0.5), transparent);
}
</style>
