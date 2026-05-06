import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pololitotrabajos.vercel.app'),
  title: {
    default: 'POLOLITOTRABAJOS — Encuentra al maestro indicado, al tiro',
    template: '%s | POLOLITOTRABAJOS',
  },
  description:
    'Catálogo de maestros chilenos para cualquier pega del hogar: gasfitería, electricidad, construcción, calefacción y más. Cara, reseñas y teléfono. Sin comisiones, sin intermediarios.',
  keywords: [
    'maestros chile', 'gasfiter', 'electricista', 'carpintero', 'maestro hogar',
    'pololito', 'reparación', 'construcción', 'pintor', 'cerrajero', 'jardinero',
    'antofagasta', 'santiago', 'valparaíso', 'arreglos hogar',
  ],
  authors: [{ name: 'POLOLITOTRABAJOS' }],
  openGraph: {
    title: 'POLOLITOTRABAJOS — Tu próximo pololito empieza acá',
    description: 'Catálogo de maestros confiables. Cara, reseñas y teléfono. Para cualquier pega del hogar.',
    type: 'website',
    locale: 'es_CL',
    siteName: 'POLOLITOTRABAJOS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'POLOLITOTRABAJOS',
    description: 'Encuentra al maestro indicado para tu próximo pololito.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-CL" className={jakarta.variable}>
      <body className="font-sans bg-white text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
