<template>
  <div class="relative">
    <button
      class="flex items-center space-x-1 rounded border border-primary/30 bg-bg/50 px-2 py-1 text-sm transition-colors hover:border-primary/60"
      type="button"
      :aria-expanded="isOpen"
      aria-haspopup="true"
      @click="toggleDropdown"
    >
      <span class="hidden sm:inline">{{ isEnglish ? 'Theme' : 'Thème' }}:</span>
      <span class="theme-indicator">
        <span
          class="inline-block size-3 rounded-full"
          :class="getThemeColorClass"
        />
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="size-4"
      >
        <path
          fill-rule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-48 origin-top-right rounded border border-primary/30 bg-bg/90 shadow-lg backdrop-blur-sm"
    >
      <div class="py-1">
        <button
          v-for="theme in themes"
          :key="theme.value"
          type="button"
          class="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-primary/10"
          :class="{ 'bg-primary/20': preferencesStore.cyberpunkTheme === theme.value }"
          @click="selectTheme(theme.value)"
        >
          <span
            class="mr-2 inline-block size-3 rounded-full"
            :style="theme.colorStyle"
          />
          <span>{{ isEnglish ? theme.nameEn : theme.nameFr }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { usePreferencesStore } from '@/stores/preferences';

const preferencesStore = usePreferencesStore();
const isOpen = ref(false);
const isEnglish = computed(() => preferencesStore.isEnglish);

const themes: { value: 'default' | 'ghost' | 'matrix' | 'solarpunk'; nameEn: string; nameFr: string; colorStyle: string }[] = [
  {
    value: 'default',
    nameEn: 'Cyberpunk',
    nameFr: 'Cyberpunk',
    colorStyle: 'background: linear-gradient(135deg, #ffeb3b 0%, #ffff00 100%)',
  },
  {
    value: 'ghost',
    nameEn: 'Ghost in the Shell',
    nameFr: 'Ghost in the Shell',
    colorStyle: 'background: linear-gradient(135deg, #ff00ff 0%, #8a2be2 100%)',
  },
  {
    value: 'matrix',
    nameEn: 'Matrix',
    nameFr: 'Matrix',
    colorStyle: 'background: #00ff00',
  },
  {
    value: 'solarpunk',
    nameEn: 'Solarpunk',
    nameFr: 'Solarpunk',
    colorStyle: 'background: #ffffff',
  },
];

const getThemeColorClass = computed(() => {
  switch (preferencesStore.cyberpunkTheme) {
    case 'solarpunk':
      return 'bg-white';
    case 'ghost':
      return 'bg-fuchsia-500';
    case 'matrix':
      return 'bg-green-500';
    default:
      return 'bg-yellow-400';
  }
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectTheme = (theme: 'default' | 'ghost' | 'matrix' | 'solarpunk') => {
  preferencesStore.setCyberpunkTheme(theme);
  isOpen.value = false;
};
</script>

<style scoped>
.theme-indicator {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.theme-indicator::after {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  background: rgba(var(--color-primary), 0.2);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.3;
  }
}
</style>
