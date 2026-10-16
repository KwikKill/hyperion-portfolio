// French for French-speaking browsers, English for everyone else.
// Browser-only: the site is prerendered, so there is no request to read headers from.
export function detectBrowserLanguage(): 'en' | 'fr' {
  return navigator.language?.toLowerCase().startsWith('fr') ? 'fr' : 'en';
}
