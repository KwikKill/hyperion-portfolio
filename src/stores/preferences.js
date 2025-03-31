import { defineStore } from "pinia"

export const usePreferencesStore = defineStore("preferences", {
  state: () => ({
    language: null, // 'en' or 'fr'
    version: null, // 'classic' or 'cyberpunk'
    showModal: true,
  }),

  actions: {
    setPreferences(language, version) {
      this.language = language
      this.version = version
      this.showModal = false

      // Apply appropriate class for styling
      if (version === "cyberpunk") {
        document.documentElement.classList.add("cyberpunk")
        document.documentElement.classList.remove("dark")
      } else if (version === "classic") {
        document.documentElement.classList.remove("cyberpunk")
        // You could add dark mode toggle in the classic version
      }
    },
  },

  getters: {
    getLanguage: (state) => state.language,
    getVersion: (state) => state.version,
    isEnglish: (state) => state.language === "en",
    isFrench: (state) => state.language === "fr",
    isClassic: (state) => state.version === "classic",
    isCyberpunk: (state) => state.version === "cyberpunk",
  },
})

