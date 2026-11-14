export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: 'https://codepath-zeta.vercel.app/sitemap.xml',
  };
}
