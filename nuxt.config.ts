// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss"],
  css: ['~/assets/css/tailwind.css'],
  nitro: {
    prerender: {
      // These pages are reached through navigateTo(), so the `nuxt generate`
      // crawler never discovers them: list them explicitly. One copy per language; /cyberpunk,
      // /classic, /fr, /en and /version are former addresses, which redirect. The sitemap is
      // built from server/routes/sitemap.xml.ts, so its dates follow each build.
      routes: [
        '/fr/cyberpunk', '/en/cyberpunk', '/fr/classic', '/en/classic',
        '/cyberpunk', '/classic', '/fr', '/en', '/version', '/sitemap.xml',
      ],
    },
  },
  app: {
    head: {
      // Title, description and link preview: composables/useShareMeta.ts, in each language.
      htmlAttrs: { lang: 'fr' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'keywords', content: 'Gabriel Blaisot, Portfolio, Développeur, Ingénieur Informatique, Sopra Steria, Freelance, Informatique, Data Science, Web, Applications Web' },
        { name: 'google-site-verification', content: '0N3KiBJueVNiIVXQ5JOPdmZ9-83xFFU8vGkdaLqvyL8' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/logo.png' }
      ],
      script: [
        {
          // Applies the theme before the first paint (?theme=, else the last one picked,
          // see stores/preferences.ts): the prerendered page never shows the default one first.
          tagPriority: 'critical',
          innerHTML: `try {
  var theme = new URLSearchParams(location.search).get('theme') || localStorage.getItem('theme');
  if (theme === 'ghost' || theme === 'matrix' || theme === 'solarpunk') document.documentElement.classList.add('theme-' + theme);
} catch (e) {}`,
        },
        {
          src: 'https://um.somi.blaisot.org/script.js',
          defer: true,
          'data-website-id': '53342678-6638-496c-961b-c1a14cfe1e8a'
        },
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Gabriel Blaisot",
            "url": "https://gabriel.blaisot.org",
            "sameAs": [
              "https://github.com/KwikKill",
              "https://www.linkedin.com/in/gabriel-blaisot-a89480233/"
            ],
            "jobTitle": "Ingénieur Informatique (Développeur Web)",
            "worksFor": {
              "@type": "Organization",
              "name": "Sopra Steria"
            },
            "description": "Ingénieur informatique et développeur web freelance, spécialisé en data science et développement d'applications web.",
            "image": "https://gabriel.blaisot.org/logo.png"
          }, null, 2)
        }
      ]
    }
  }
})
