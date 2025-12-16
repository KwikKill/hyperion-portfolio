// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss"],
  css: ['~/assets/css/tailwind.css'],
  app: {
    head: {
      title: 'Gabriel Blaisot | Portfolio Développeur',
      htmlAttrs: { lang: 'fr' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'description', content: 'Portfolio de Gabriel Blaisot, étudiant en informatique à l\'INSA Rennes, spécialisé en data science et développement d\'applications web.' },
        { name: 'keywords', content: 'Gabriel Blaisot, Portfolio, Développeur, INSA Rennes, Informatique, Data Science, Web, Applications Web' },
        { name: 'google-site-verification', content: '0N3KiBJueVNiIVXQ5JOPdmZ9-83xFFU8vGkdaLqvyL8' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/logo.png' }
      ],
      script: [
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
            "jobTitle": "Étudiant en Informatique",
            "worksFor": {
              "@type": "EducationalOrganization",
              "name": "INSA Rennes"
            },
            "description": "Étudiant en informatique à l’INSA Rennes, spécialisé en data science et développement d'applications web.",
            "image": "https://gabriel.blaisot.org/logo.png"
          }, null, 2)
        }
      ]
    }
  }
})
