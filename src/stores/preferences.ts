import { defineStore } from 'pinia';

export const usePreferencesStore = defineStore('preferences', {
  state: () => ({
    language: null as 'en' | 'fr' | null,
    version: null as 'classic' | 'cyberpunk' | null,
    cyberpunkTheme: 'default' as 'default' | 'ghost' | 'matrix' | 'solarpunk',
    showModal: true,
    isAnyFullScreen: false,
  }),

  actions: {
    setPreferences(
      language: 'en' | 'fr',
      version: 'classic' | 'cyberpunk',
    ) {
      this.language = language;
      this.version = version;
      this.showModal = false;

      // Apply appropriate class for styling
      if (version === 'cyberpunk') {
        document.documentElement.classList.add('cyberpunk');
        document.documentElement.classList.remove('dark');
        // Apply the default cyberpunk theme
        this.applyCyberpunkTheme(this.cyberpunkTheme);
      } else if (version === 'classic') {
        document.documentElement.classList.remove('cyberpunk');
        document.documentElement.classList.add('dark');
        // Remove any cyberpunk theme classes
        document.documentElement.classList.remove('theme-ghost', 'theme-matrix', 'theme-solarpunk');
      }
    },
    resetPreferences() {
      this.language = null;
      this.version = null;
      this.showModal = true;
      document.documentElement.classList.remove('cyberpunk');
      document.documentElement.classList.remove('dark');
    },
    checkUrlParameters() {
      // Get URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const langParam = urlParams.get('lang');
      const versionParam = urlParams.get('version');
      const themeParam = urlParams.get('theme');

      // Check if both parameters are valid
      const validLang = langParam !== null && ['en', 'fr'].includes(langParam);
      const validVersion = versionParam !== null && ['classic', 'cyberpunk'].includes(versionParam);

      // If both parameters are valid, set preferences
      if (validLang && validVersion) {
        this.setPreferences(langParam as 'en' | 'fr', versionParam as 'classic' | 'cyberpunk');

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
      if (this.language && this.version) {
        const url = new URL(window.location.href);
        url.searchParams.set('lang', this.language);
        url.searchParams.set('version', this.version);

        // Add theme parameter if in cyberpunk mode
        if (this.version === 'cyberpunk') {
          url.searchParams.set('theme', this.cyberpunkTheme);
        }

        window.history.replaceState({}, '', url);
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
      document.documentElement.classList.remove('theme-ghost', 'theme-matrix', 'theme-solarpunk');

      // Apply the selected theme class
      if (theme === 'ghost') {
        document.documentElement.classList.add('theme-ghost');
      } else if (theme === 'matrix') {
        document.documentElement.classList.add('theme-matrix');
      } else if (theme === 'solarpunk') {
        document.documentElement.classList.add('theme-solarpunk');
      }
      // Default theme doesn't need an additional class as it's the base cyberpunk
    },
  },

  getters: {
    getLanguage: (state) => state.language,
    getVersion: (state) => state.version,
    getCyberpunkTheme: (state) => state.cyberpunkTheme,
    isEnglish: (state) => state.language === 'en',
    isFrench: (state) => state.language === 'fr',
    isClassic: (state) => state.version === 'classic',
    isCyberpunk: (state) => state.version === 'cyberpunk',
  },
});
