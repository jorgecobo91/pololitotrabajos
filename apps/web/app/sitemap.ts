import type { MetadataRoute } from 'next';

const BASE = 'https://pololitotrabajos.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/app`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/app/publicar`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/maestro/login`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/recuperar-publicacion`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/legal/terminos`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/legal/privacidad`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/legal/seguridad`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];
  return staticRoutes;
}
