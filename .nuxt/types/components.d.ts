
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

interface _GlobalComponents {
  'ClassicAbout': typeof import("../../app/components/Classic/ClassicAbout.vue").default
  'ClassicContact': typeof import("../../app/components/Classic/ClassicContact.vue").default
  'ClassicExperience': typeof import("../../app/components/Classic/ClassicExperience.vue").default
  'ClassicFooter': typeof import("../../app/components/Classic/ClassicFooter.vue").default
  'ClassicHeader': typeof import("../../app/components/Classic/ClassicHeader.vue").default
  'ClassicHero': typeof import("../../app/components/Classic/ClassicHero.vue").default
  'ClassicInterests': typeof import("../../app/components/Classic/ClassicInterests.vue").default
  'ClassicPortfolio': typeof import("../../app/components/Classic/ClassicPortfolio.vue").default
  'ClassicProjects': typeof import("../../app/components/Classic/ClassicProjects.vue").default
  'ClassicTerminal': typeof import("../../app/components/Classic/ClassicTerminal.vue").default
  'CyberpunkAbout': typeof import("../../app/components/Cyberpunk/CyberpunkAbout.vue").default
  'CyberpunkExperience': typeof import("../../app/components/Cyberpunk/CyberpunkExperience.vue").default
  'CyberpunkFooter': typeof import("../../app/components/Cyberpunk/CyberpunkFooter.vue").default
  'CyberpunkHeader': typeof import("../../app/components/Cyberpunk/CyberpunkHeader.vue").default
  'CyberpunkHero': typeof import("../../app/components/Cyberpunk/CyberpunkHero.vue").default
  'CyberpunkInterests': typeof import("../../app/components/Cyberpunk/CyberpunkInterests.vue").default
  'CyberpunkPortfolio': typeof import("../../app/components/Cyberpunk/CyberpunkPortfolio.vue").default
  'CyberpunkProjects': typeof import("../../app/components/Cyberpunk/CyberpunkProjects.vue").default
  'CyberpunkSelfDestruct': typeof import("../../app/components/Cyberpunk/CyberpunkSelfDestruct.vue").default
  'CyberpunkTerminal': typeof import("../../app/components/Cyberpunk/CyberpunkTerminal.vue").default
  'CyberpunkTerminalWindow': typeof import("../../app/components/Cyberpunk/CyberpunkTerminalWindow.vue").default
  'CyberpunkThemeSelector': typeof import("../../app/components/Cyberpunk/CyberpunkThemeSelector.vue").default
  'LanguageVersionModal': typeof import("../../app/components/LanguageVersionModal.vue").default
  'NuxtWelcome': typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue").default
  'NuxtLayout': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout").default
  'NuxtErrorBoundary': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue").default
  'ClientOnly': typeof import("../../node_modules/nuxt/dist/app/components/client-only").default
  'DevOnly': typeof import("../../node_modules/nuxt/dist/app/components/dev-only").default
  'ServerPlaceholder': typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder").default
  'NuxtLink': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link").default
  'NuxtLoadingIndicator': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator").default
  'NuxtTime': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue").default
  'NuxtRouteAnnouncer': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer").default
  'NuxtImg': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtImg
  'NuxtPicture': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtPicture
  'NuxtPage': typeof import("../../node_modules/nuxt/dist/pages/runtime/page").default
  'NoScript': typeof import("../../node_modules/nuxt/dist/head/runtime/components").NoScript
  'Link': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Link
  'Base': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Base
  'Title': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Title
  'Meta': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Meta
  'Style': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Style
  'Head': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Head
  'Html': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Html
  'Body': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Body
  'NuxtIsland': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island").default
  'LazyClassicAbout': LazyComponent<typeof import("../../app/components/Classic/ClassicAbout.vue").default>
  'LazyClassicContact': LazyComponent<typeof import("../../app/components/Classic/ClassicContact.vue").default>
  'LazyClassicExperience': LazyComponent<typeof import("../../app/components/Classic/ClassicExperience.vue").default>
  'LazyClassicFooter': LazyComponent<typeof import("../../app/components/Classic/ClassicFooter.vue").default>
  'LazyClassicHeader': LazyComponent<typeof import("../../app/components/Classic/ClassicHeader.vue").default>
  'LazyClassicHero': LazyComponent<typeof import("../../app/components/Classic/ClassicHero.vue").default>
  'LazyClassicInterests': LazyComponent<typeof import("../../app/components/Classic/ClassicInterests.vue").default>
  'LazyClassicPortfolio': LazyComponent<typeof import("../../app/components/Classic/ClassicPortfolio.vue").default>
  'LazyClassicProjects': LazyComponent<typeof import("../../app/components/Classic/ClassicProjects.vue").default>
  'LazyClassicTerminal': LazyComponent<typeof import("../../app/components/Classic/ClassicTerminal.vue").default>
  'LazyCyberpunkAbout': LazyComponent<typeof import("../../app/components/Cyberpunk/CyberpunkAbout.vue").default>
  'LazyCyberpunkExperience': LazyComponent<typeof import("../../app/components/Cyberpunk/CyberpunkExperience.vue").default>
  'LazyCyberpunkFooter': LazyComponent<typeof import("../../app/components/Cyberpunk/CyberpunkFooter.vue").default>
  'LazyCyberpunkHeader': LazyComponent<typeof import("../../app/components/Cyberpunk/CyberpunkHeader.vue").default>
  'LazyCyberpunkHero': LazyComponent<typeof import("../../app/components/Cyberpunk/CyberpunkHero.vue").default>
  'LazyCyberpunkInterests': LazyComponent<typeof import("../../app/components/Cyberpunk/CyberpunkInterests.vue").default>
  'LazyCyberpunkPortfolio': LazyComponent<typeof import("../../app/components/Cyberpunk/CyberpunkPortfolio.vue").default>
  'LazyCyberpunkProjects': LazyComponent<typeof import("../../app/components/Cyberpunk/CyberpunkProjects.vue").default>
  'LazyCyberpunkSelfDestruct': LazyComponent<typeof import("../../app/components/Cyberpunk/CyberpunkSelfDestruct.vue").default>
  'LazyCyberpunkTerminal': LazyComponent<typeof import("../../app/components/Cyberpunk/CyberpunkTerminal.vue").default>
  'LazyCyberpunkTerminalWindow': LazyComponent<typeof import("../../app/components/Cyberpunk/CyberpunkTerminalWindow.vue").default>
  'LazyCyberpunkThemeSelector': LazyComponent<typeof import("../../app/components/Cyberpunk/CyberpunkThemeSelector.vue").default>
  'LazyLanguageVersionModal': LazyComponent<typeof import("../../app/components/LanguageVersionModal.vue").default>
  'LazyNuxtWelcome': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue").default>
  'LazyNuxtLayout': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout").default>
  'LazyNuxtErrorBoundary': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue").default>
  'LazyClientOnly': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/client-only").default>
  'LazyDevOnly': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/dev-only").default>
  'LazyServerPlaceholder': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder").default>
  'LazyNuxtLink': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link").default>
  'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator").default>
  'LazyNuxtTime': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue").default>
  'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer").default>
  'LazyNuxtImg': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtImg>
  'LazyNuxtPicture': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtPicture>
  'LazyNuxtPage': LazyComponent<typeof import("../../node_modules/nuxt/dist/pages/runtime/page").default>
  'LazyNoScript': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").NoScript>
  'LazyLink': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Link>
  'LazyBase': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Base>
  'LazyTitle': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Title>
  'LazyMeta': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Meta>
  'LazyStyle': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Style>
  'LazyHead': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Head>
  'LazyHtml': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Html>
  'LazyBody': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Body>
  'LazyNuxtIsland': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island").default>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
