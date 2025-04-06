<template>
  <div class="bg-white py-4 shadow-sm dark:bg-gray-800">
    <div v-if="contact_revealed" class="container mx-auto px-4">
      <div class="flex flex-col flex-wrap items-center justify-center gap-2">
        <a
          href="tel:+33652411416"
          class="flex items-center text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
        >
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
          <span>+33 6 52 41 14 16</span>
        </a>

        <a
          href="mailto:gabriel@blaisot.org"
          class="flex items-center text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
        >
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
          <span>gabriel@blaisot.org</span>
        </a>

        <a
          href="https://www.linkedin.com/in/gabriel-blaisot-a89480233/"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 size-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
            />
          </svg>
          <span>LinkedIn</span>
        </a>
      </div>
    </div>
    <div v-else class="container mx-auto px-4">
      <div class="flex flex-col flex-wrap items-center justify-center gap-2">
        <p class="text-gray-700 dark:text-gray-300">
          {{ isEnglish ? 'Contact me for more information!' : 'Contactez-moi pour plus d\'informations !' }}
        </p>
        <button
          class="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          type="button"
          @click="contact_revealed = true"
        >
          {{ isEnglish ? 'Reveal Contact' : 'Révéler mon contact' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import { usePreferencesStore } from '../../stores/preferences';

const preferencesStore = usePreferencesStore();
const isEnglish = computed(() => preferencesStore.isEnglish);

const contact_revealed = ref(false);
</script>
