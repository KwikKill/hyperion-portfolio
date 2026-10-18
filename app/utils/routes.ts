import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router';

import { detectBrowserLanguage, isLanguage, type Language } from './language';

export type Version = 'cyberpunk' | 'classic';

// The language is the first segment of every portfolio page (/fr, /en/classic). Each page
// is prerendered in its own language, so nothing switches language once loaded.
export function portfolioPath(lang: Language, version: Version = 'cyberpunk'): string {
  return version === 'classic' ? `/${lang}/classic` : `/${lang}`;
}

// Former addresses carried the language in the query (/cyberpunk?lang=en&theme=matrix#project-polis):
// same page under its new path, keeping the other parameters and the hash. Browser-only.
export function legacyLocation(to: RouteLocationNormalized, version: Version): RouteLocationRaw {
  const query = { ...to.query };
  delete query.lang;
  delete query.version;
  return {
    path: portfolioPath(isLanguage(to.query.lang) ? to.query.lang : detectBrowserLanguage(), version),
    query,
    hash: to.hash,
  };
}
