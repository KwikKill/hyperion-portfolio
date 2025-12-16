
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T


export const ClassicAbout: typeof import("../app/components/Classic/ClassicAbout.vue").default
export const ClassicContact: typeof import("../app/components/Classic/ClassicContact.vue").default
export const ClassicExperience: typeof import("../app/components/Classic/ClassicExperience.vue").default
export const ClassicFooter: typeof import("../app/components/Classic/ClassicFooter.vue").default
export const ClassicHeader: typeof import("../app/components/Classic/ClassicHeader.vue").default
export const ClassicHero: typeof import("../app/components/Classic/ClassicHero.vue").default
export const ClassicInterests: typeof import("../app/components/Classic/ClassicInterests.vue").default
export const ClassicPortfolio: typeof import("../app/components/Classic/ClassicPortfolio.vue").default
export const ClassicProjects: typeof import("../app/components/Classic/ClassicProjects.vue").default
export const ClassicTerminal: typeof import("../app/components/Classic/ClassicTerminal.vue").default
export const CyberpunkAbout: typeof import("../app/components/Cyberpunk/CyberpunkAbout.vue").default
export const CyberpunkExperience: typeof import("../app/components/Cyberpunk/CyberpunkExperience.vue").default
export const CyberpunkFooter: typeof import("../app/components/Cyberpunk/CyberpunkFooter.vue").default
export const CyberpunkHeader: typeof import("../app/components/Cyberpunk/CyberpunkHeader.vue").default
export const CyberpunkHero: typeof import("../app/components/Cyberpunk/CyberpunkHero.vue").default
export const CyberpunkInterests: typeof import("../app/components/Cyberpunk/CyberpunkInterests.vue").default
export const CyberpunkPortfolio: typeof import("../app/components/Cyberpunk/CyberpunkPortfolio.vue").default
export const CyberpunkProjects: typeof import("../app/components/Cyberpunk/CyberpunkProjects.vue").default
export const CyberpunkSelfDestruct: typeof import("../app/components/Cyberpunk/CyberpunkSelfDestruct.vue").default
export const CyberpunkTerminal: typeof import("../app/components/Cyberpunk/CyberpunkTerminal.vue").default
export const CyberpunkTerminalWindow: typeof import("../app/components/Cyberpunk/CyberpunkTerminalWindow.vue").default
export const CyberpunkThemeSelector: typeof import("../app/components/Cyberpunk/CyberpunkThemeSelector.vue").default
export const LanguageVersionModal: typeof import("../app/components/LanguageVersionModal.vue").default
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue").default
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout").default
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue").default
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only").default
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only").default
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder").default
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link").default
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator").default
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue").default
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer").default
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtImg
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtPicture
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page").default
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components").NoScript
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components").Link
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components").Base
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components").Title
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components").Meta
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components").Style
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components").Head
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components").Html
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components").Body
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island").default
export const LazyClassicAbout: LazyComponent<typeof import("../app/components/Classic/ClassicAbout.vue").default>
export const LazyClassicContact: LazyComponent<typeof import("../app/components/Classic/ClassicContact.vue").default>
export const LazyClassicExperience: LazyComponent<typeof import("../app/components/Classic/ClassicExperience.vue").default>
export const LazyClassicFooter: LazyComponent<typeof import("../app/components/Classic/ClassicFooter.vue").default>
export const LazyClassicHeader: LazyComponent<typeof import("../app/components/Classic/ClassicHeader.vue").default>
export const LazyClassicHero: LazyComponent<typeof import("../app/components/Classic/ClassicHero.vue").default>
export const LazyClassicInterests: LazyComponent<typeof import("../app/components/Classic/ClassicInterests.vue").default>
export const LazyClassicPortfolio: LazyComponent<typeof import("../app/components/Classic/ClassicPortfolio.vue").default>
export const LazyClassicProjects: LazyComponent<typeof import("../app/components/Classic/ClassicProjects.vue").default>
export const LazyClassicTerminal: LazyComponent<typeof import("../app/components/Classic/ClassicTerminal.vue").default>
export const LazyCyberpunkAbout: LazyComponent<typeof import("../app/components/Cyberpunk/CyberpunkAbout.vue").default>
export const LazyCyberpunkExperience: LazyComponent<typeof import("../app/components/Cyberpunk/CyberpunkExperience.vue").default>
export const LazyCyberpunkFooter: LazyComponent<typeof import("../app/components/Cyberpunk/CyberpunkFooter.vue").default>
export const LazyCyberpunkHeader: LazyComponent<typeof import("../app/components/Cyberpunk/CyberpunkHeader.vue").default>
export const LazyCyberpunkHero: LazyComponent<typeof import("../app/components/Cyberpunk/CyberpunkHero.vue").default>
export const LazyCyberpunkInterests: LazyComponent<typeof import("../app/components/Cyberpunk/CyberpunkInterests.vue").default>
export const LazyCyberpunkPortfolio: LazyComponent<typeof import("../app/components/Cyberpunk/CyberpunkPortfolio.vue").default>
export const LazyCyberpunkProjects: LazyComponent<typeof import("../app/components/Cyberpunk/CyberpunkProjects.vue").default>
export const LazyCyberpunkSelfDestruct: LazyComponent<typeof import("../app/components/Cyberpunk/CyberpunkSelfDestruct.vue").default>
export const LazyCyberpunkTerminal: LazyComponent<typeof import("../app/components/Cyberpunk/CyberpunkTerminal.vue").default>
export const LazyCyberpunkTerminalWindow: LazyComponent<typeof import("../app/components/Cyberpunk/CyberpunkTerminalWindow.vue").default>
export const LazyCyberpunkThemeSelector: LazyComponent<typeof import("../app/components/Cyberpunk/CyberpunkThemeSelector.vue").default>
export const LazyLanguageVersionModal: LazyComponent<typeof import("../app/components/LanguageVersionModal.vue").default>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue").default>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout").default>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue").default>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only").default>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only").default>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder").default>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link").default>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator").default>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue").default>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer").default>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtImg>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtPicture>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page").default>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").NoScript>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").Link>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").Base>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").Title>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").Meta>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").Style>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").Head>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").Html>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").Body>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island").default>

export const componentNames: string[]
