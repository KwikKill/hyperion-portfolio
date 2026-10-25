<template>
  <!-- Same structure as the cyberpunk header: sticky bar, active section, reading progress, mobile menu -->
  <header class="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/90">
    <div class="container mx-auto flex h-16 items-center gap-6 px-4">
      <NuxtLink
        to="/"
        class="shrink-0 whitespace-nowrap text-xl font-bold text-gray-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
        :title="isEnglish ? 'Change language or version' : 'Changer de langue ou de version'"
      >
        Gabriel Blaisot<span class="hidden xl:inline"> - Portfolio</span>
      </NuxtLink>

      <!-- Desktop navigation -->
      <nav class="hidden lg:block" :aria-label="isEnglish ? 'Main navigation' : 'Navigation principale'">
        <ul class="flex gap-6">
          <li v-for="item in navLinks" :key="item.id">
            <a
              :href="`#${item.id}`"
              class="relative transition-colors hover:text-blue-600 dark:hover:text-blue-400"
              :class="activeSection === item.id ? 'active-nav-link text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'"
              :aria-current="activeSection === item.id ? 'location' : undefined"
              @click.prevent="goToSection(item.id)"
            >
              {{ item.name }}
            </a>
          </li>
        </ul>
      </nav>

      <div class="ml-auto hidden items-center gap-5 lg:flex">
        <ClassicLanguageSwitch/>
      </div>

      <!-- Mobile menu toggle -->
      <button
        ref="menuButton"
        type="button"
        class="ml-auto flex size-11 shrink-0 items-center justify-center rounded-md border border-gray-300 text-gray-900 transition-colors hover:border-blue-600 dark:border-gray-600 dark:text-white dark:hover:border-blue-400 lg:hidden"
        aria-controls="mobile-menu"
        :aria-expanded="isMenuOpen"
        :aria-label="menuButtonLabel"
        @click="setMenuOpen(!isMenuOpen)"
      >
        <span class="burger" :class="{ open: isMenuOpen }" aria-hidden="true"/>
      </button>
    </div>

    <!-- Reading progress -->
    <div
      class="absolute inset-x-0 -bottom-px h-0.5 origin-left bg-blue-600 dark:bg-blue-400"
      :style="{ transform: `scaleX(${scrollProgress})` }"
      aria-hidden="true"
    />

    <!-- Mobile menu -->
    <Transition name="menu">
      <div
        v-if="isMenuOpen"
        id="mobile-menu"
        class="mobile-menu absolute inset-x-0 top-full flex flex-col overflow-y-auto border-t border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 lg:hidden"
      >
        <nav :aria-label="isEnglish ? 'Main navigation' : 'Navigation principale'">
          <ul>
            <li v-for="item in navLinks" :key="item.id">
              <a
                :href="`#${item.id}`"
                class="flex min-h-[44px] items-center border-b border-gray-200 text-lg transition-colors hover:text-blue-600 dark:border-gray-700 dark:hover:text-blue-400"
                :class="activeSection === item.id ? 'font-semibold text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'"
                :aria-current="activeSection === item.id ? 'location' : undefined"
                @click.prevent="goToSection(item.id)"
              >
                {{ item.name }}
              </a>
            </li>
          </ul>
        </nav>

        <div class="mt-8 flex items-center justify-between gap-4">
          <span class="text-sm text-gray-600 dark:text-gray-400">{{ isEnglish ? 'Language' : 'Langue' }}</span>
          <ClassicLanguageSwitch large/>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import {
  computed, onMounted, onUnmounted, ref,
} from 'vue';

import { usePreferencesStore } from '../../stores/preferences';
import { portfolioPath } from '../../utils/routes';
import { scrollToSection } from '../../utils/scroll';
import ClassicLanguageSwitch from './ClassicLanguageSwitch.vue';

const preferencesStore = usePreferencesStore();

const isEnglish = computed(() => preferencesStore.isEnglish);
const activeSection = ref('home');
const scrollProgress = ref(0);
const isMenuOpen = ref(false);
const menuButton = ref<HTMLButtonElement | null>(null);

const navLinks = computed(() => [
  { id: 'home', name: isEnglish.value ? 'Home' : 'Accueil' },
  { id: 'about', name: isEnglish.value ? 'About' : 'À Propos' },
  { id: 'experience', name: isEnglish.value ? 'Experience' : 'Expérience' },
  { id: 'projects', name: isEnglish.value ? 'Projects' : 'Projets' },
  { id: 'interests', name: isEnglish.value ? 'Interests' : 'Intérêts' },
]);

const cyberpunkLink = computed(() => portfolioPath(preferencesStore.lang, 'cyberpunk'));

const menuButtonLabel = computed(() => {
  if (isEnglish.value) return isMenuOpen.value ? 'Close menu' : 'Open menu';
  return isMenuOpen.value ? 'Fermer le menu' : 'Ouvrir le menu';
});

// The last section whose top has passed, a little ahead of the header
function determineActiveSection() {
  const scrollPosition = window.scrollY + 100;
  const current = [...navLinks.value].reverse().find((link) => {
    const section = document.getElementById(link.id);
    return section && scrollPosition >= section.offsetTop;
  });
  activeSection.value = current?.id ?? 'home';
}

function updateScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.value = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
}

function onScroll() {
  determineActiveSection();
  updateScrollProgress();
}

function setMenuOpen(open: boolean) {
  isMenuOpen.value = open;
  // Keep the page from scrolling behind the open menu.
  document.body.style.overflow = open ? 'hidden' : '';
}

function goToSection(id: string) {
  if (isMenuOpen.value) setMenuOpen(false);
  scrollToSection(id);
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isMenuOpen.value) {
    setMenuOpen(false);
    menuButton.value?.focus();
  }
}

// Tailwind's `lg` breakpoint, where the desktop navigation takes over.
let desktopQuery: MediaQueryList | null = null;
function onBreakpointChange(event: MediaQueryListEvent) {
  if (event.matches && isMenuOpen.value) setMenuOpen(false);
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateScrollProgress, { passive: true });
  window.addEventListener('keydown', onKeydown);
  desktopQuery = window.matchMedia('(min-width: 1024px)');
  desktopQuery.addEventListener('change', onBreakpointChange);
  onScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', updateScrollProgress);
  window.removeEventListener('keydown', onKeydown);
  desktopQuery?.removeEventListener('change', onBreakpointChange);
  if (isMenuOpen.value) document.body.style.overflow = '';
});
</script>

<style scoped>
.active-nav-link::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 100%;
  height: 2px;
  border-radius: 1px;
  background-color: currentColor;
}

/* The header row is h-16 (4rem); the menu fills the rest of the screen. */
.mobile-menu {
  height: calc(100vh - 4rem);
  height: calc(100dvh - 4rem);
}

.burger,
.burger::before,
.burger::after {
  display: block;
  width: 18px;
  height: 2px;
  background-color: currentColor;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.burger {
  position: relative;
}

.burger::before,
.burger::after {
  content: '';
  position: absolute;
  left: 0;
}

.burger::before {
  top: -6px;
}

.burger::after {
  top: 6px;
}

.burger.open {
  background-color: transparent;
}

.burger.open::before {
  transform: translateY(6px) rotate(45deg);
}

.burger.open::after {
  transform: translateY(-6px) rotate(-45deg);
}

.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (prefers-reduced-motion: reduce) {
  .burger,
  .burger::before,
  .burger::after,
  .menu-enter-active,
  .menu-leave-active {
    transition: none;
  }
}
</style>
