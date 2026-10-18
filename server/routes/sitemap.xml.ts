import { defineEventHandler, setResponseHeader } from 'h3';

const SITE_URL = 'https://gabriel.blaisot.org';

// Each portfolio page in both languages, with its translation (hreflang) and the build date.
// Prerendered by `nuxt generate` (nuxt.config.ts), so the static site gets a fresh sitemap.
const PAGES = [
  { path: '/cyberpunk', priority: '1.0' },
  { path: '/classic', priority: '0.5' },
];

export default defineEventHandler((event) => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const alternates = (path: string) => ['fr', 'en']
    .map((lang) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${SITE_URL}/${lang}${path}"/>`)
    .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/"/>`)
    .join('\n');
  const urls = PAGES.flatMap(({ path, priority }) => ['fr', 'en'].map((lang) => `  <url>
    <loc>${SITE_URL}/${lang}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
${alternates(path)}
  </url>`));

  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
});
