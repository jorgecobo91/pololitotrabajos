import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/calificar/', '/mi-publicacion/', '/app/perfil/'],
      },
    ],
    sitemap: 'https://pololitotrabajos.vercel.app/sitemap.xml',
  };
}
