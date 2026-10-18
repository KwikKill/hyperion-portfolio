import { defineNuxtRouteMiddleware } from 'nuxt/app';

import { usePreferencesStore } from '../stores/preferences';
import { isLanguage } from '../utils/language';

// Portfolio pages carry their language in the path (/fr, /en/classic). Setting it before
// rendering means the prerendered HTML is already in that language: no switch on load.
export default defineNuxtRouteMiddleware((to) => {
  const { lang } = to.params;
  if (isLanguage(lang)) usePreferencesStore().setPreferences(lang);
});
