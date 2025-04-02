<template>
  <div v-if="preferencesStore.showModal" class="inset-0 flex items-center justify-center z-50">
    <!-- Animated background with gradient overlay -->
    <div
      class="fixed inset-0 bg-gradient-to-br overflow-hidden"
      :class="{
        'from-indigo-900 via-gray-900 to-black': version !== 'cyberpunk',
        'from-yellow-900 via-gray-800 to-black': version === 'cyberpunk',
      }"
    >
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-0 left-0 w-full h-full grid bggrid grid-cols-12 grid-rows-12 gap-4">
          <div v-for="i in 144" :key="i" class="bg-white rounded-md"></div>
        </div>
      </div>
      <div class="absolute inset-0 bg-black/40"></div>
    </div>

    <!-- Modal content with glass effect -->
    <div
      class="relative max-w-4xl w-full mx-4 my-8 rounded-xl overflow-hidden backdrop-blur-md bg-gray-900/95 border  shadow-2xl transition-all duration-500 transform"
      :class="{
        'scale-95 opacity-0': !isModalReady,
        'scale-100 opacity-100': isModalReady,
        'cyberpunk-terminal border-theme-foreground/70': version === 'cyberpunk',
        'border-white/20': version !== 'cyberpunk'
      }"
    >
      <!-- Cyberpunk terminal header -->
      <div
        class="terminal-header flex justify-between items-center mb-2 pb-2 border-b border-theme-foreground/30 p-2"
        :class="{
          'invisible': version !== 'cyberpunk',
        }"
      >
        <div class="text-theme-foreground"></div>
        <div class="flex items-center space-x-2">
          <div class="w-3 h-3 rounded-full bg-green-500"></div>
          <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div class="w-3 h-3 rounded-full bg-red-500"></div>
        </div>
      </div>

      <div class="px-8 pb-8 bt-2">
        <!-- Header -->
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-white mb-3">
            {{ isEnglish ? 'Welcome to My Portfolio' : 'Bienvenue sur Mon Portfolio' }}
          </h2>
          <p class="text-gray-300 max-w-2xl mx-auto">
            {{ isEnglish
              ? 'Choose your preferred language and experience style to continue'
              : 'Choisissez votre langue et style d\'expérience préférés pour continuer'
            }}
          </p>
          <div class="mt-4">
            <img
              src="../assets/logo.png"
              alt="Logo"
              class="w-24 h-24 mx-auto rounded-full border-4 shadow-lg"
              :class="{
                'border-white/20': version !== 'cyberpunk',
                'border-theme-foreground/30 animate-pulse': version === 'cyberpunk',
              }"
            />
          </div>
          <p class="text-gray-300 mt-2">
            {{ isEnglish
              ? 'This portfolio is still under construction, but you can already see my projects and skills.'
              : 'Ce portfolio est encore en construction, mais vous pouvez déjà voir mes projets et compétences.'
            }}
          </p>
        </div>

        <!-- Selection Sections -->
        <div
          class="grid md:grid-cols-2 gap-6 mb-8 overflow-x-auto"
        >
          <!-- Language Selection -->
          <div
            class="bg-black rounded-xl pb-6 border transition-all duration-500"
            :class="{
              'cyberpunk-terminal border-theme-foreground/70': version === 'cyberpunk',
              'border-white/50': version !== 'cyberpunk'
            }"
          >
            <!-- Cyberpunk terminal header -->
            <div
              class="terminal-header flex justify-between items-center mb-2 pb-2 border-b border-theme-foreground/30 p-2"
              :class="{
                'invisible': version !== 'cyberpunk',
              }"
            >
              <div class="text-theme-foreground"></div>
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 rounded-full bg-green-500"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div class="w-3 h-3 rounded-full bg-red-500"></div>
              </div>
            </div>

            <h3 class="text-xl font-semibold mb-4 text-white flex items-center mx-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <path d="M2 12h20"></path>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              {{ isEnglish ? 'Select Language' : 'Sélectionner la Langue' }}
            </h3>

            <div class="space-y-4 mx-6">
              <button
                @click="setLanguage('en')"
                class="language-btn w-full relative overflow-hidden group"
                :class="language === 'en' ? 'active-language' : ''"
              >
                <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  :class="{'opacity-100': language === 'en'}"></div>
                <div class="relative z-10 flex items-center p-4">
                  <div class="flex-shrink-0 w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center mr-4 overflow-hidden">
                    <img
                      src="../assets/Flag_UK.svg"
                      alt="English"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div class="text-left">
                    <div class="text-lg font-medium text-white">English</div>
                  </div>
                </div>
              </button>

              <button
                @click="setLanguage('fr')"
                class="language-btn w-full relative overflow-hidden group"
                :class="language === 'fr' ? 'active-language' : ''"
              >
                <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  :class="{'opacity-100': language === 'fr'}"></div>
                <div class="relative z-10 flex items-center p-4">
                  <div class="flex-shrink-0 w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center mr-4 overflow-hidden">
                    <img
                      src="../assets/Flag_FR.svg"
                      alt="Français"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div class="text-left">
                    <div class="text-lg font-medium text-white">Français</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!-- Version Selection -->
          <div
            class="bg-black rounded-xl pb-6 border transition-all duration-500"
            :class="{
              'cyberpunk-terminal border-theme-foreground/70': version === 'cyberpunk',
              'border-white/50': version !== 'cyberpunk'
            }"
          >
            <!-- Cyberpunk terminal header -->
            <div
              class="terminal-header flex justify-between items-center mb-2 pb-2 border-b border-theme-foreground/30 p-2"
              :class="{
                'invisible': version !== 'cyberpunk',
              }"
            >
              <div class="text-theme-foreground"></div>
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 rounded-full bg-green-500"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div class="w-3 h-3 rounded-full bg-red-500"></div>
              </div>
            </div>

            <h3 class="text-xl font-semibold mb-4 text-white flex items-center mx-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
              {{
                isEnglish
                ? 'Select Version'
                : 'Sélectionner la version'
              }}
            </h3>

            <div class="space-y-4 mx-6">
              <button
                @click="setVersion('classic')"
                class="version-btn w-full relative overflow-hidden group"
                :class="version === 'classic' ? 'active-version-classic' : ''"
              >
                <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  :class="{'opacity-100': version === 'classic'}"></div>
                <div class="relative z-10 flex items-center p-4">
                  <div class="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div class="text-left">
                    <div class="text-lg font-medium text-white">
                      {{ isEnglish ? 'Classic' : 'Classique' }}
                    </div>
                    <div class="text-sm text-gray-300">
                      {{
                        isEnglish
                        ? 'Classic and traditional design'
                        : 'Design classique et traditionnel'
                      }}
                    </div>
                  </div>
                </div>
              </button>

              <button
                @click="setVersion('cyberpunk')"
                class="version-btn w-full relative overflow-hidden group"
                :class="version === 'cyberpunk' ? 'active-version-cyber' : ''"
              >
                <div class="absolute inset-0 bg-gradient-to-r from-yellow-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  :class="{'opacity-100': version === 'cyberpunk'}"></div>
                <div class="relative z-10 flex items-center p-4">
                  <div class="flex-shrink-0 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div class="text-left flex flex-col">
                    <div class="text-lg font-medium text-white flex min-[450px]:items-center min-[450px]:flex-row flex-col min-[450px]:gap-2">
                      Cyberpunk
                      <span class="text-yellow-400 font-bold text-sm star-badge-modal max-[370px]:hidden max-w-min">
                        {{
                          isEnglish
                          ? 'Recommended'
                          : 'Recommandé'
                        }}
                      </span>
                    </div>
                    <div class="text-sm text-gray-300">
                      {{
                        isEnglish
                        ? 'fantasy and futuristic Interface'
                        : 'Interface fantaisie et futuriste'
                      }}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Confirm Button -->
        <div class="flex justify-center">
          <button
            @click="confirmSelection"
            class="confirm-btn relative overflow-hidden group w-full"
            :disabled="!language || !version"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-gray-800 opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              :class="{'opacity-50': !language || !version}"></div>
            <div class="relative z-10 py-4 px-8 text-white font-medium text-lg flex items-center justify-center">
              {{
                isEnglish
                ? 'View Portfolio'
                : 'Voir le Portfolio'
              }}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePreferencesStore } from '../stores/preferences'

// Update the setPreferences method to also update URL parameters
const handleSetPreferences = (lang, version) => {
  preferencesStore.setPreferences(lang, version)
  preferencesStore.updateUrlParameters()
}

const preferencesStore = usePreferencesStore()
const language = ref(null)
const version = ref(null)
const isModalReady = ref(false)

const isEnglish = computed(() => language.value === 'en' || !language.value)

function setLanguage(lang) {
  language.value = lang
}

function setVersion(ver) {
  version.value = ver
}

function confirmSelection() {
  if (language.value && version.value) {
    handleSetPreferences(language.value, version.value)
  }
}

onMounted(() => {
  // Add a small delay for entrance animation
  setTimeout(() => {
    isModalReady.value = true
  }, 100)
})
</script>

<style scoped>
.language-btn, .version-btn {
  @apply border border-white/20 rounded-lg transition-all duration-300;
}

.language-btn:hover, .version-btn:hover {
  @apply border-white/40 shadow-lg transform scale-[1.02];
}

.active-language, .active-version-classic, .active-version-cyber {
  @apply border-white/50 shadow-lg;
}

.confirm-btn {
  @apply rounded-lg transition-all duration-300 shadow-lg;
}

.confirm-btn:hover:not(:disabled) {
  @apply transform scale-[1.02] shadow-xl;
}

.confirm-btn:disabled {
  @apply cursor-not-allowed;
}

/* Animation for background grid */
@keyframes pulse {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.3; }
}

.bggrid > div {
  animation: pulse 10s infinite;
  animation-delay: calc(var(--index) * 0.1s);
}

.bggrid > div:nth-child(3n) {
  animation-delay: calc(var(--index) * 0.2s + 1s);
}

.bggrid > div:nth-child(5n) {
  animation-delay: calc(var(--index) * 0.3s + 2s);
}
</style>

