import { navigateTo, useRoute } from 'nuxt/app';
import { defineStore } from 'pinia';

export const usePreferencesStore = defineStore('preferences', {
  state: () => ({
    language: null as 'en' | 'fr' | null,
    cyberpunkTheme: 'default' as 'default' | 'ghost' | 'matrix' | 'solarpunk',
    isAnyFullScreen: false,
  }),

  actions: {
    setPreferences(
      language: 'en' | 'fr',
    ) {
      this.language = language;
    },
    resetPreferences() {
      this.language = null;
      document.documentElement.classList.remove('cyberpunk');
      document.documentElement.classList.remove('dark');
    },
    checkUrlParameters() {
      // Get URL parameters
      const urlParams = useRoute().query;
      const langParam = urlParams.lang as string | null;
      const themeParam = urlParams.theme as string | null;

      // Check if both parameters are valid
      const validLang = langParam !== null && ['en', 'fr'].includes(langParam);

      // If both parameters are valid, set preferences
      if (validLang) {
        this.setPreferences(langParam as 'en' | 'fr');

        // Check if theme parameter is valid and set it
        if (themeParam && ['default', 'ghost', 'matrix', 'solarpunk'].includes(themeParam)) {
          this.setCyberpunkTheme(themeParam as 'default' | 'ghost' | 'matrix' | 'solarpunk');
        }

        return true;
      }

      return false;
    },
    updateUrlParameters() {
      // Only update URL if preferences are set
      if (this.language) {
        const url = useRoute().fullPath
          .replace(/([?&])lang=[^&]*/g, '') // Remove existing lang param
          .replace(/([?&])theme=[^&]*/g, ''); // Remove existing theme param

        const separator = url.includes('?') ? '&' : '?';
        const newUrl = `${url}${separator}lang=${this.language}&theme=${this.cyberpunkTheme}`;

        navigateTo(newUrl, { replace: true });
      }
    },
    setCyberpunkTheme(theme: 'default' | 'ghost' | 'matrix' | 'solarpunk') {
      this.cyberpunkTheme = theme;
      this.applyCyberpunkTheme(theme);

      // Update URL parameters
      this.updateUrlParameters();
    },

    // Helper method to apply the cyberpunk theme
    applyCyberpunkTheme(theme: 'default' | 'ghost' | 'matrix' | 'solarpunk') {
      // Remove all theme classes first
      const cyberpunkRoot = document.getElementById('cyberpunkroot') as HTMLElement | null;
      if (!cyberpunkRoot) return;

      cyberpunkRoot.classList.remove('theme-ghost', 'theme-matrix', 'theme-solarpunk');

      // Apply the selected theme class
      if (theme === 'ghost') {
        cyberpunkRoot.classList.add('theme-ghost');
      } else if (theme === 'matrix') {
        cyberpunkRoot.classList.add('theme-matrix');
      } else if (theme === 'solarpunk') {
        cyberpunkRoot.classList.add('theme-solarpunk');
      }
      // Default theme doesn't need an additional class as it's the base cyberpunk
    },
  },

  getters: {
    getLanguage: (state) => state.language,
    getCyberpunkTheme: (state) => state.cyberpunkTheme,
    isEnglish: (state) => state.language === 'en',
    isFrench: (state) => state.language === 'fr',
  },
});
