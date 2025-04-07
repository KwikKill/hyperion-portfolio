<template>
  <header
    class="border-b border-primary/50 bg-bg/80 py-4 backdrop-blur-sm"
    :class="{
      'top-0 z-50 w-full md:fixed': !isAnyFullScreen,
    }"
  >
    <div class="container mx-auto flex items-center justify-between px-4">
      <div
        class="cyberpunk-text-glow cursor-pointer text-4xl font-bold text-primary transition-colors hover:text-hover"
        @click="preferencesStore.resetPreferences"
        @keydown.enter="preferencesStore.resetPreferences"
      >
        <span class="text-gray-500">&lt;</span>
        <img src="@/assets/logo.png" alt="Logo" class="inline-block size-8"/>
        KwikKill - Porfolio
        <span class="text-gray-500">/&gt;</span>
      </div>

      <div class="flex items-center space-x-4">
        <!-- Theme Selector -->
        <CyberpunkThemeSelector/>

        <nav>
          <ul class="hidden space-x-6 md:flex">
            <li v-for="item in navLinks" :key="item.href">
              <a
                :href="item.href"
                :class="[
                  'text-md relative font-medium uppercase tracking-wider transition-colors hover:text-hover',
                  activeSection === item.href.substring(1)
                    ? 'active-nav-link text-primary'
                    : '',
                ]"
              >
                {{ item.name }}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import {
  computed, onMounted, onUnmounted, ref,
} from 'vue';

import { usePreferencesStore } from '../../stores/preferences';
import CyberpunkThemeSelector from './CyberpunkThemeSelector.vue';

const preferencesStore = usePreferencesStore();

const isEnglish = computed(() => preferencesStore.isEnglish);
const isAnyFullScreen = computed(() => preferencesStore.isAnyFullScreen);
const activeSection = ref('home');

// Find the navigation links array and add the Experience link
const navLinks = computed(() => [
  { name: isEnglish.value ? 'Home' : 'Accueil', href: '#home' },
  { name: isEnglish.value ? 'About' : 'À Propos', href: '#about' },
  { name: isEnglish.value ? 'Experience' : 'Expérience', href: '#experience' },
  { name: isEnglish.value ? 'Projects' : 'Projets', href: '#projects' },
  { name: isEnglish.value ? 'Interests' : 'Intérêts', href: '#interests' },
]);

// Function to determine which section is currently in view
const determineActiveSection = () => {
  const sections = navLinks.value.map((link) => link.href.substring(1));

  // Get all section elements
  const sectionElements = sections.map((id) => document.getElementById(id));

  // Get current scroll position with a small offset to trigger slightly before reaching the section
  const scrollPosition = window.scrollY + 100;

  // Find the current section
  for (let i = sectionElements.length - 1; i >= 0; i -= 1) {
    const section = sectionElements[i];
    if (section) {
      const sectionTop = section.offsetTop;
      if (scrollPosition >= sectionTop) {
        activeSection.value = sections[i];
        return;
      }
    }
  }

  // Default to home if no section is active
  activeSection.value = 'home';
};

// Add scroll event listener
onMounted(() => {
  window.addEventListener('scroll', determineActiveSection);
  // Initial check
  determineActiveSection();
});

// Clean up event listener
onUnmounted(() => {
  window.removeEventListener('scroll', determineActiveSection);
});
</script>

<style scoped>
.active-nav-link {
  position: relative;
  text-shadow: 0 0 10px rgb(var(--color-primary) / 0.8);
}

.active-nav-link::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: rgb(var(--color-primary));
  box-shadow: 0 0 8px 1px rgb(var(--color-primary) / 0.8);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scaleX(1);
  }
  50% {
    opacity: 0.6;
    transform: scaleX(0.85);
  }
}
</style>
