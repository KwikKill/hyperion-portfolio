export type Language = 'en' | 'fr';

export function isLanguage(value: unknown): value is Language {
  return value === 'en' || value === 'fr';
}

// French for French-speaking browsers, English for everyone else.
// Browser-only: the site is prerendered, so there is no request to read headers from.
export function detectBrowserLanguage(): Language {
  return navigator.language?.toLowerCase().startsWith('fr') ? 'fr' : 'en';
}
