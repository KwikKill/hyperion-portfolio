<template>
  <header
    class="border-b border-primary/50 bg-bg/80 backdrop-blur-sm"
    :class="isAnyFullScreen ? 'relative' : 'fixed inset-x-0 top-0 z-50'"
  >
    <div class="container mx-auto flex h-16 items-center gap-6 px-4">
      <NuxtLink
        to="/"
        class="flex shrink-0 items-center gap-2 cyberpunk-text-glow whitespace-nowrap text-lg font-bold uppercase tracking-wide text-primary sm:text-xl"
        :title="isEnglish ? 'Change language or version' : 'Changer de langue ou de version'"
      >
        <span class="text-gray-500">&lt;</span>
        <img src="@/assets/logo.png" alt="" class="size-8"/>
        <span class="hidden sm:inline">
          Gabriel Blaisot - Portfolio
        </span>
        <span class="inline sm:hidden">
          Gabriel Blaisot
        </span>
        <span class="text-gray-500">&gt;</span>
      </NuxtLink>

      <!-- Desktop navigation -->
      <nav class="hidden xl:block" :aria-label="isEnglish ? 'Main navigation' : 'Navigation principale'">
        <ul class="flex gap-6">
          <li v-for="item in navLinks" :key="item.id">
            <a
              :href="`#${item.id}`"
              :class="[
                'relative text-sm font-medium uppercase tracking-wider transition-colors hover:text-hover',
                activeSection === item.id ? 'active-nav-link text-primary' : '',
              ]"
              :aria-current="activeSection === item.id ? 'location' : undefined"
              @click.prevent="goToSection(item.id)"
            >
              {{ item.name }}
            </a>
          </li>
        </ul>
      </nav>

      <div class="ml-auto hidden items-center gap-4 xl:flex">
        <CyberpunkLanguageSwitch/>
        <CyberpunkThemeSelector/>
      </div>

      <!-- Mobile menu toggle -->
      <button
        ref="menuButton"
        type="button"
        class="ml-auto flex size-11 shrink-0 items-center justify-center border border-primary/50 text-primary transition-colors hover:border-primary xl:hidden"
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
      class="scroll-progress absolute inset-x-0 -bottom-px h-0.5 origin-left bg-primary"
      :style="{ transform: `scaleX(${scrollProgress})` }"
      aria-hidden="true"
    />

    <!-- Mobile menu -->
    <Transition name="menu">
      <div
        v-if="isMenuOpen"
        id="mobile-menu"
        class="mobile-menu absolute inset-x-0 top-full flex flex-col overflow-y-auto border-t border-primary/30 bg-bg p-6 xl:hidden"
      >
        <p class="font-mono mb-2 text-xs tracking-wider text-gray-500" aria-hidden="true">
          ~/hyperion
        </p>
        <nav :aria-label="isEnglish ? 'Main navigation' : 'Navigation principale'">
          <ul>
            <li v-for="item in navLinks" :key="item.id">
              <a
                :href="`#${item.id}`"
                class="font-mono flex min-h-[44px] items-center gap-2 border-b border-primary/15 text-base transition-colors hover:text-hover"
                :class="activeSection === item.id ? 'text-primary' : ''"
                :aria-current="activeSection === item.id ? 'location' : undefined"
                @click.prevent="goToSection(item.id)"
              >
                <span class="text-secondary" aria-hidden="true">&gt;</span>
                cd {{ item.slug }}
              </a>
            </li>
          </ul>
        </nav>
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
import CyberpunkLanguageSwitch from './CyberpunkLanguageSwitch.vue';
import CyberpunkThemeSelector from './CyberpunkThemeSelector.vue';

const preferencesStore = usePreferencesStore();

const isEnglish = computed(() => preferencesStore.isEnglish);
const isAnyFullScreen = computed(() => preferencesStore.isAnyFullScreen);
const activeSection = ref('home');
const scrollProgress = ref(0);
const isMenuOpen = ref(false);
const menuButton = ref<HTMLButtonElement | null>(null);

// `slug` is the folder name shown in the mobile menu's `cd` commands.
const navLinks = computed(() => [
  { id: 'home', name: isEnglish.value ? 'Home' : 'Accueil', slug: isEnglish.value ? 'home' : 'accueil' },
  { id: 'about', name: isEnglish.value ? 'About' : 'À Propos', slug: isEnglish.value ? 'about' : 'a-propos' },
  { id: 'experience', name: isEnglish.value ? 'Experience' : 'Expérience', slug: 'experience' },
  { id: 'projects', name: isEnglish.value ? 'Projects' : 'Projets', slug: isEnglish.value ? 'projects' : 'projets' },
  { id: 'interests', name: isEnglish.value ? 'Interests' : 'Intérêts', slug: isEnglish.value ? 'interests' : 'interets' },
]);

const classicLink = computed(() => portfolioPath(preferencesStore.lang, 'classic'));

const menuButtonLabel = computed(() => {
  if (isEnglish.value) return isMenuOpen.value ? 'Close menu' : 'Open menu';
  return isMenuOpen.value ? 'Fermer le menu' : 'Ouvrir le menu';
});

// Function to determine which section is currently in view
const determineActiveSection = () => {
  const sections = navLinks.value.map((link) => link.id);

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

const updateScrollProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.value = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
};

const onScroll = () => {
  determineActiveSection();
  updateScrollProgress();
};

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

// Tailwind's `xl` breakpoint, where the desktop navigation takes over.
let desktopQuery: MediaQueryList | null = null;
const onBreakpointChange = (event: MediaQueryListEvent) => {
  if (event.matches && isMenuOpen.value) setMenuOpen(false);
};

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateScrollProgress, { passive: true });
  window.addEventListener('keydown', onKeydown);
  desktopQuery = window.matchMedia('(min-width: 1280px)');
  desktopQuery.addEventListener('change', onBreakpointChange);
  // Initial check
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

.scroll-progress {
  box-shadow: 0 0 8px rgb(var(--color-primary) / 0.8);
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
