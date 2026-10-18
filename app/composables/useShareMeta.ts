import { useHead, useRoute, useSeoMeta } from 'nuxt/app';
import { computed } from 'vue';

import { usePreferencesStore } from '../stores/preferences';
import { useProjectsStore } from '../stores/projects';
import { isLanguage, type Language } from '../utils/language';
import { SITE_URL } from '../utils/links';

const TEXT: Record<Language, { title: string; description: (projects: number) => string; imageAlt: string }> = {
  fr: {
    title: 'Gabriel Blaisot · Ingénieur logiciel',
    description: (projects) => `Portfolio de Gabriel Blaisot, ingénieur logiciel chez Sopra Steria à Rennes : ${projects} projets, un terminal interactif et 4 thèmes.`,
    imageAlt: 'Gabriel Blaisot, ingénieur logiciel chez Sopra Steria à Rennes',
  },
  en: {
    title: 'Gabriel Blaisot · Software engineer',
    description: (projects) => `Portfolio of Gabriel Blaisot, software engineer at Sopra Steria in Rennes: ${projects} projects, an interactive terminal and 4 themes.`,
    imageAlt: 'Gabriel Blaisot, software engineer at Sopra Steria in Rennes',
  },
};

// Title, description and link preview (LinkedIn, Discord, Slack…) in the page's language.
// Previews read these tags without running JavaScript, so they must be in the prerendered
// HTML of every page, the redirecting ones (/, /cyberpunk) included.
export function useShareMeta() {
  const preferencesStore = usePreferencesStore();
  const projectsStore = useProjectsStore();
  const route = useRoute();

  const lang = computed(() => preferencesStore.lang);
  const text = computed(() => TEXT[lang.value]);
  const description = computed(() => text.value.description(projectsStore.projects.length));
  const path = computed(() => route.path.replace(/\/+$/, '') || '/');
  // /fr, /en/classic…: the pages that exist in both languages.
  const isLocalized = computed(() => isLanguage(route.params.lang));
  const inLanguage = (target: Language) => `${SITE_URL}${path.value.replace(/^\/(fr|en)/, `/${target}`)}`;

  useSeoMeta({
    title: () => text.value.title,
    description: () => description.value,
    ogTitle: () => text.value.title,
    ogDescription: () => description.value,
    ogUrl: () => `${SITE_URL}${path.value}`,
    ogSiteName: 'Gabriel Blaisot',
    ogType: 'profile',
    profileFirstName: 'Gabriel',
    profileLastName: 'Blaisot',
    profileUsername: 'KwikKill',
    ogLocale: () => (lang.value === 'fr' ? 'fr_FR' : 'en_US'),
    ogLocaleAlternate: () => (lang.value === 'fr' ? 'en_US' : 'fr_FR'),
    // 1200 × 630 images in public/, one per language.
    ogImage: () => `${SITE_URL}/og-${lang.value}.png`,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageType: 'image/png',
    ogImageAlt: () => text.value.imageAlt,
    twitterCard: 'summary_large_image',
    twitterImageAlt: () => text.value.imageAlt,
  });

  // The same page in the other language, for search engines. x-default is the root, which
  // redirects to the visitor's language.
  useHead({
    link: () => (isLocalized.value
      ? [
        { key: 'canonical', rel: 'canonical', href: `${SITE_URL}${path.value}` },
        { key: 'alternate-fr', rel: 'alternate', hreflang: 'fr', href: inLanguage('fr') },
        { key: 'alternate-en', rel: 'alternate', hreflang: 'en', href: inLanguage('en') },
        { key: 'alternate-default', rel: 'alternate', hreflang: 'x-default', href: `${SITE_URL}/` },
      ]
      : []),
  });
}
