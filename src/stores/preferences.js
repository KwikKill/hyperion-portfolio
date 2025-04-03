import { defineStore } from "pinia"

export const usePreferencesStore = defineStore("preferences", {
  state: () => ({
    language: null, // 'en' or 'fr'
    version: null, // 'classic' or 'cyberpunk'
    showModal: true,
    isAnyFullScreen: false,
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
        document.documentElement.classList.add("dark")
      }
    },
    resetPreferences() {
      this.language = null
      this.version = null
      this.showModal = true
      document.documentElement.classList.remove("cyberpunk")
      document.documentElement.classList.remove("dark")
    },
    checkUrlParameters() {
      // Get URL parameters
      const urlParams = new URLSearchParams(window.location.search)
      const langParam = urlParams.get("lang")
      const versionParam = urlParams.get("version")

      // Check if both parameters are valid
      const validLang = ["en", "fr"].includes(langParam)
      const validVersion = ["classic", "cyberpunk"].includes(versionParam)

      // If both parameters are valid, set preferences
      if (validLang && validVersion) {
        this.setPreferences(langParam, versionParam)
        return true
      }

      return false
    },
    updateUrlParameters() {
      // Only update URL if preferences are set
      if (this.language && this.version) {
        const url = new URL(window.location.href)
        url.searchParams.set("lang", this.language)
        url.searchParams.set("version", this.version)
        window.history.replaceState({}, "", url)
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

