import { navigateTo } from 'nuxt/app';
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router';

import { isLanguage, type Language } from './language';

export type Version = 'cyberpunk' | 'classic';

// Every portfolio page lives under its language: /fr/cyberpunk, /en/classic… Each one is
// prerendered in that language, so nothing switches language once loaded. The root (/)
// is the language and version picker.
export function portfolioPath(lang: Language, version: Version = 'cyberpunk'): string {
  return `/${lang}/${version}`;
}

// Where a former or shortened address goes: the given language, else the ?lang= of older
// links, else French. Other parameters and the hash are kept (#project-polis opens it).
function portfolioLocation(to: RouteLocationNormalized, version: Version, lang?: Language): RouteLocationRaw {
  const query = { ...to.query };
  delete query.lang;
  delete query.version;
  return {
    path: portfolioPath(lang ?? (isLanguage(to.query.lang) ? to.query.lang : 'fr'), version),
    query,
    hash: to.hash,
  };
}

// Sends the visitor to a portfolio page with a full page load, not an in-app navigation.
// The redirecting pages are prerendered as an empty <div>; redirecting while the app
// hydrates would reuse that <div> as the portfolio's root, and hydration does not add
// its id and classes: no #cyberpunkroot, no .cyberpunk, no theme. Browser-only.
export function redirectToPortfolio(to: RouteLocationNormalized, version: Version, lang?: Language) {
  return navigateTo(portfolioLocation(to, version, lang), { replace: true, external: true });
}
