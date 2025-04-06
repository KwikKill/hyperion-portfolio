<template>
  <div v-if="preferencesStore.showModal" class="inset-0 z-50 flex items-center justify-center">
    <!-- Animated background with gradient overlay -->
    <div
      class="fixed inset-0 overflow-hidden bg-gradient-to-br"
      :class="{
        'from-indigo-900 via-gray-900 to-black': version !== 'cyberpunk',
        'from-theme-foreground via-yellow-900 to-black': version === 'cyberpunk',
      }"
    >
      <div class="absolute inset-0 opacity-20">
        <div class="bggrid absolute left-0 top-0 grid size-full grid-cols-12 grid-rows-12 gap-4">
          <div v-for="i in 144" :key="i" class="rounded-md bg-white"/>
        </div>
      </div>
      <div class="absolute inset-0 bg-black/40"/>
    </div>

    <!-- Modal content with glass effect -->
    <div
      class="relative mx-4 my-8 w-full max-w-4xl overflow-hidden rounded-xl border bg-gray-900/95 shadow-2xl  backdrop-blur-md transition-all duration-500"
      :class="{
        'scale-95 opacity-0': !isModalReady,
        'scale-100 opacity-100': isModalReady,
        'cyberpunk-terminal border-theme-foreground/70': version === 'cyberpunk',
        'border-white/20': version !== 'cyberpunk',
      }"
    >
      <!-- Cyberpunk terminal header -->
      <div
        class="terminal-header mb-2 flex items-center justify-between border-b border-theme-foreground/30 p-2"
        :class="{
          invisible: version !== 'cyberpunk',
        }"
      >
        <div class="text-theme-foreground"/>
        <div class="flex items-center space-x-2">
          <div class="size-3 rounded-full bg-green-500"/>
          <div class="size-3 rounded-full bg-yellow-500"/>
          <div class="size-3 rounded-full bg-red-500"/>
        </div>
      </div>

      <div class="bt-2 px-8 pb-8">
        <!-- Header -->
        <div class="mb-8 text-center">
          <h2 class="mb-3 text-3xl font-bold text-white">
            {{ isEnglish ? 'Welcome to My Portfolio' : 'Bienvenue sur Mon Portfolio' }}
          </h2>
          <p class="mx-auto max-w-2xl text-gray-300">
            {{ isEnglish
              ? 'Choose your preferred language and experience style to continue'
              : 'Choisissez votre langue et style d\'expérience préférés pour continuer'
            }}
          </p>
          <div class="mt-4">
            <img
              src="@/assets/logo.png"
              alt="Logo"
              class="mx-auto size-24 rounded-full border-4 shadow-lg"
              :class="{
                'border-white/20': version !== 'cyberpunk',
                'animate-pulse border-theme-foreground/30': version === 'cyberpunk',
              }"
            />
          </div>
          <p class="mt-2 text-gray-300">
            {{ isEnglish
              ? 'This portfolio is still under construction, but you can already see my projects and skills.'
              : 'Ce portfolio est encore en construction, mais vous pouvez déjà voir mes projets et compétences.'
            }}
          </p>
        </div>

        <!-- Selection Sections -->
        <div class="mb-8 grid gap-6 overflow-x-auto md:grid-cols-2">
          <!-- Language Selection -->
          <div
            class="rounded-xl border bg-black pb-6 transition-all duration-500"
            :class="{
              'cyberpunk-terminal border-theme-foreground/70': version === 'cyberpunk',
              'border-white/50': version !== 'cyberpunk',
            }"
          >
            <!-- Cyberpunk terminal header -->
            <div
              class="terminal-header mb-2 flex items-center justify-between border-b border-theme-foreground/30 p-2"
              :class="{
                invisible: version !== 'cyberpunk',
              }"
            >
              <div class="text-theme-foreground"/>
              <div class="flex items-center space-x-2">
                <div class="size-3 rounded-full bg-green-500"/>
                <div class="size-3 rounded-full bg-yellow-500"/>
                <div class="size-3 rounded-full bg-red-500"/>
              </div>
            </div>

            <h3 class="mx-6 mb-4 flex items-center text-xl font-semibold text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mr-2 size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                <path d="M2 12h20"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              {{ isEnglish ? 'Select Language' : 'Sélectionner la Langue' }}
            </h3>

            <div class="mx-6 space-y-4">
              <button
                class="language-btn group relative w-full overflow-hidden"
                type="button"
                :class="language === 'en' ? 'active-language' : ''"
                @click="setLanguage('en')"
              >
                <div
                  class="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  :class="{ 'opacity-100': language === 'en' }"
                />
                <div class="relative z-10 flex items-center p-4">
                  <div
                    class="mr-4 flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600/20"
                  >
                    <img src="@/assets/Flag_UK.svg" alt="English" class="size-full object-cover"/>
                  </div>
                  <div class="text-left">
                    <div class="text-lg font-medium text-white">
                      English
                    </div>
                  </div>
                </div>
              </button>

              <button
                class="language-btn group relative w-full overflow-hidden"
                type="button"
                :class="language === 'fr' ? 'active-language' : ''"
                @click="setLanguage('fr')"
              >
                <div
                  class="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  :class="{ 'opacity-100': language === 'fr' }"
                />
                <div class="relative z-10 flex items-center p-4">
                  <div
                    class="mr-4 flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600/20"
                  >
                    <img src="@/assets/Flag_FR.svg" alt="Français" class="size-full object-cover"/>
                  </div>
                  <div class="text-left">
                    <div class="text-lg font-medium text-white">
                      Français
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!-- Version Selection -->
          <div
            class="rounded-xl border bg-black pb-6 transition-all duration-500"
            :class="{
              'cyberpunk-terminal border-theme-foreground/70': version === 'cyberpunk',
              'border-white/50': version !== 'cyberpunk',
            }"
          >
            <!-- Cyberpunk terminal header -->
            <div
              class="terminal-header mb-2 flex items-center justify-between border-b border-theme-foreground/30 p-2"
              :class="{
                invisible: version !== 'cyberpunk',
              }"
            >
              <div class="text-theme-foreground"/>
              <div class="flex items-center space-x-2">
                <div class="size-3 rounded-full bg-green-500"/>
                <div class="size-3 rounded-full bg-yellow-500"/>
                <div class="size-3 rounded-full bg-red-500"/>
              </div>
            </div>

            <h3 class="mx-6 mb-4 flex items-center text-xl font-semibold text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mr-2 size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="3" y1="9" x2="21" y2="9"/>
                <line x1="9" y1="21" x2="9" y2="9"/>
              </svg>
              {{
                isEnglish
                  ? 'Select Version'
                  : 'Sélectionner la version'
              }}
            </h3>

            <div class="mx-6 space-y-4">
              <button
                class="version-btn group relative w-full overflow-hidden"
                type="button"
                :class="version === 'classic' ? 'active-version-classic' : ''"
                @click="setVersion('classic')"
              >
                <div
                  class="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  :class="{ 'opacity-100': version === 'classic' }"
                />
                <div class="relative z-10 flex items-center p-4">
                  <div class="mr-4 flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="size-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
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
                class="version-btn group relative w-full overflow-hidden"
                type="button"
                :class="version === 'cyberpunk' ? 'active-version-cyber' : ''"
                @click="setVersion('cyberpunk')"
              >
                <div
                  class="absolute inset-0 bg-gradient-to-r from-yellow-500 to-red-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  :class="{ 'opacity-100': version === 'cyberpunk' }"
                />
                <div class="relative z-10 flex items-center p-4">
                  <div class="mr-4 flex size-12 shrink-0 items-center justify-center rounded-full bg-yellow-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="size-6 text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div class="flex flex-col text-left">
                    <div
                      class="flex flex-col text-lg font-medium text-white min-[450px]:flex-row min-[450px]:items-center min-[450px]:gap-2"
                    >
                      Cyberpunk
                      <span class="star-badge-modal max-w-min text-sm font-bold text-yellow-400 max-[370px]:hidden">
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
            class="confirm-btn group relative w-full overflow-hidden"
            type="button"
            :disabled="!language || !version"
            @click="confirmSelection"
          >
            <div
              class="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-gray-800 opacity-90 transition-opacity duration-300 group-hover:opacity-100"
              :class="{ 'opacity-50': !language || !version }"
            />
            <div class="relative z-10 flex items-center justify-center px-8 py-4 text-lg font-medium text-white">
              {{
                isEnglish
                  ? 'View Portfolio'
                  : 'Voir le Portfolio'
              }}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="ml-2 size-5 animate-pulse"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { usePreferencesStore } from '../stores/preferences';

const preferencesStore = usePreferencesStore();
const language = ref<'en' | 'fr' | null>(null);
const version = ref<'classic' | 'cyberpunk' | null>(null);
const isModalReady = ref(false);

const isEnglish = computed(() => language.value === 'en' || !language.value);

// Update the setPreferences method to also update URL parameters
const handleSetPreferences = (
  lang: 'en' | 'fr',
  selectedVersion: 'classic' | 'cyberpunk',
) => {
  preferencesStore.setPreferences(lang, selectedVersion);
  preferencesStore.updateUrlParameters();
};

function setLanguage(lang: 'en' | 'fr') {
  language.value = lang;
}

function setVersion(ver: 'classic' | 'cyberpunk') {
  version.value = ver;
}

function confirmSelection() {
  if (language.value && version.value) {
    handleSetPreferences(language.value, version.value);
  }
}

onMounted(() => {
  // Add a small delay for entrance animation
  setTimeout(() => {
    isModalReady.value = true;
  }, 100);
});
</script>

<style scoped>
.language-btn,
.version-btn {
  @apply border border-white/20 rounded-lg transition-all duration-300;
}

.language-btn:hover,
.version-btn:hover {
  @apply border-white/40 shadow-lg transform scale-[1.02];
}

.active-language,
.active-version-classic,
.active-version-cyber {
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

  0%,
  100% {
    opacity: 0.1;
  }

  50% {
    opacity: 0.3;
  }
}

.bggrid>div {
  animation: pulse 10s infinite;
  animation-delay: calc(var(--index) * 0.1s);
}

.bggrid>div:nth-child(3n) {
  animation-delay: calc(var(--index) * 0.2s + 1s);
}

.bggrid>div:nth-child(5n) {
  animation-delay: calc(var(--index) * 0.3s + 2s);
}
</style>
