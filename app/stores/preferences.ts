import { navigateTo, useRoute } from 'nuxt/app';
import { defineStore } from 'pinia';

import type { Language } from '../utils/language';
import type { SelfDestructSequenceId } from '../utils/selfDestructSequences';
import { sweepTheme } from '../utils/themeSweep';

type Theme = 'default' | 'ghost' | 'matrix' | 'solarpunk';

const THEMES: Theme[] = ['default', 'ghost', 'matrix', 'solarpunk'];
const isTheme = (value: unknown): value is Theme => THEMES.includes(value as Theme);

// Last theme picked. The inline script of nuxt.config.ts reads it before the first paint.
const THEME_KEY = 'theme';

export const usePreferencesStore = defineStore('preferences', {
  state: () => ({
    language: null as Language | null,
    cyberpunkTheme: 'default' as Theme,
    isAnyFullScreen: false,
    // Shared so the terminal's `sudo rm -rf /` can open the self-destruct confirmation.
    showSelfDestructAlarm: false,
    // Sequence picked in the self-destruct panel, shared for the same reason.
    selfDestructSequence: 'megapolis' as SelfDestructSequenceId,
  }),

  actions: {
    setPreferences(
      language: Language,
    ) {
      this.language = language;
    },
    resetPreferences() {
      this.language = null;
      document.documentElement.classList.remove('cyberpunk');
      document.documentElement.classList.remove('dark');
    },
    // Puts the store in line with the theme the inline script of nuxt.config.ts applied
    // before the first paint: the URL's ?theme=, else the last one picked. Browser-only.
    restoreTheme() {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem(THEME_KEY);
      } catch {
        // Storage unavailable (private window, blocked site data): the URL alone decides.
      }
      const theme = [useRoute().query.theme, saved].find(isTheme) ?? 'default';
      this.cyberpunkTheme = theme;
      this.applyCyberpunkTheme(theme);
    },
    // The language lives in the path (/fr, /en/classic), the theme in the query. No hash:
    // with one, the router would scroll back to it.
    updateUrlParameters() {
      const route = useRoute();
      const query = { ...route.query, theme: this.cyberpunkTheme === 'default' ? undefined : this.cyberpunkTheme };
      delete query.lang;

      navigateTo({ path: route.path.replace(/^\/(fr|en)(?=\/|$)/, `/${this.lang}`), query }, { replace: true });
    },
    // syncUrl: false on a page whose address must stay as it is (the 404, where rewriting the
    // URL would route to the missing page again). The theme is still saved for the next visit.
    setCyberpunkTheme(theme: Theme, syncUrl = true) {
      const changed = theme !== this.cyberpunkTheme;
      this.cyberpunkTheme = theme;
      const apply = () => this.applyCyberpunkTheme(theme);
      if (changed) sweepTheme(apply);
      else apply();
      try {
        localStorage.setItem(THEME_KEY, theme);
      } catch {
        // Storage unavailable: the theme still lives in the URL.
      }

      // Update URL parameters
      if (syncUrl) this.updateUrlParameters();
    },

    // The theme class goes on <html>, where the inline script of nuxt.config.ts puts it
    // on load; tailwind.css scopes the theme variables to #cyberpunkroot.
    applyCyberpunkTheme(theme: Theme) {
      const root = document.documentElement;
      root.classList.remove('theme-ghost', 'theme-matrix', 'theme-solarpunk');
      // Default theme doesn't need an additional class as it's the base cyberpunk
      if (theme !== 'default') root.classList.add(`theme-${theme}`);
    },
  },

  getters: {
    getLanguage: (state) => state.language,
    getCyberpunkTheme: (state) => state.cyberpunkTheme,
    // Language to render in. The single fallback for when none is set yet (e.g. a
    // page outside /fr and /en): interface and content must agree on it.
    lang: (state): Language => state.language ?? 'fr',
    isEnglish(): boolean {
      return this.lang === 'en';
    },
    isFrench(): boolean {
      return this.lang === 'fr';
    },
  },
});
