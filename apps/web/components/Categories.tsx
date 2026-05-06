'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const APP_URL = '/app';

// Nombres deben matchear EXACTAMENTE OFICIOS en lib/constants.ts para que el filtro funcione
const categories = [
  { emoji: '⚡', name: 'Electricista', count: '320+', gradient: 'linear-gradient(to bottom right, #FBBF24, #F97316)' },
  { emoji: '🔧', name: 'Gasfitería', count: '180+', gradient: 'linear-gradient(to bottom right, #60A5FA, #06B6D4)' },
  { emoji: '🏗️', name: 'Construcción', count: '240+', gradient: 'linear-gradient(to bottom right, #A8A29E, #57534E)' },
  { emoji: '🪚', name: 'Carpintería', count: '150+', gradient: 'linear-gradient(to bottom right, #FB923C, #EF4444)' },
  { emoji: '🎨', name: 'Pintura', count: '120+', gradient: 'linear-gradient(to bottom right, #F472B6, #D946EF)' },
  { emoji: '🏠', name: 'Techumbre', count: '90+', gradient: 'linear-gradient(to bottom right, #94A3B8, #475569)' },
  { emoji: '🔐', name: 'Cerrajería', count: '80+', gradient: 'linear-gradient(to bottom right, #A1A1AA, #52525B)' },
  { emoji: '🌿', name: 'Jardinería', count: '60+', gradient: 'linear-gradient(to bottom right, #34D399, #16A34A)' },
  { emoji: '🛋️', name: 'Mueblería', count: '70+', gradient: 'linear-gradient(to bottom right, #C084FC, #7C3AED)' },
  { emoji: '🚿', name: 'Plomería', count: '110+', gradient: 'linear-gradient(to bottom right, #38BDF8, #0EA5E9)' },
  { emoji: '🧱', name: 'Albañilería', count: '140+', gradient: 'linear-gradient(to bottom right, #F59E0B, #B45309)' },
  { emoji: '🛠️', name: 'Herrería', count: '40+', gradient: 'linear-gradient(to bottom right, #71717A, #27272A)' },
  { emoji: '🔥', name: 'Calefacción', count: '50+', gradient: 'linear-gradient(to bottom right, #FB7185, #DC2626)' },
  { emoji: '❄️', name: 'Ventilación y aire acondicionado', count: '45+', gradient: 'linear-gradient(to bottom right, #67E8F9, #0891B2)' },
  { emoji: '📺', name: 'Reparación de electrodomésticos', count: '85+', gradient: 'linear-gradient(to bottom right, #A78BFA, #6D28D9)' },
  { emoji: '🪟', name: 'Vidriería', count: '35+', gradient: 'linear-gradient(to bottom right, #BAE6FD, #0284C7)' },
  { emoji: '💧', name: 'Mantenimiento de piscinas', count: '25+', gradient: 'linear-gradient(to bottom right, #5EEAD4, #0D9488)' },
  { emoji: '🛡️', name: 'Desinfección', count: '30+', gradient: 'linear-gradient(to bottom right, #86EFAC, #15803D)' },
  { emoji: '✨', name: 'Limpieza especializada', count: '55+', gradient: 'linear-gradient(to bottom right, #D8B4FE, #9333EA)' },
  { emoji: '🪡', name: 'Tapicería', count: '20+', gradient: 'linear-gradient(to bottom right, #FCA5A5, #B91C1C)' },
];

function CategoryCard({ cat, idx }: { cat: typeof categories[number]; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: (idx % 6) * 0.05, ease: 'easeOut' }}
    >
      <Link
        href={`${APP_URL}?oficio=${encodeURIComponent(cat.name)}`}
        className="block bg-white rounded-3xl p-6 border border-divider relative overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer group h-full"
      >
        <div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10 blur-2xl pointer-events-none transition-opacity duration-500 group-hover:opacity-25"
          style={{ background: cat.gradient }}
        />
        <div
          className="relative w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3"
          style={{ background: cat.gradient }}
        >
          {cat.emoji}
        </div>
        <h3 className="font-extrabold text-lg text-ink leading-tight">{cat.name}</h3>
        <p className="text-sm text-muted mt-1">{cat.count} maestros</p>
      </Link>
    </motion.div>
  );
}

export default function Categories() {
  return (
    <section id="categorias" className="bg-cream py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-bold tracking-[0.2em] uppercase text-violet">
            CATEGORÍAS
          </span>
          <h2
            className="font-extrabold tracking-[-0.03em] text-ink mt-4"
            style={{ fontSize: 'clamp(36px, 5vw, 72px)', lineHeight: 1 }}
          >
            Cualquier pega.{' '}
            <span className="text-gradient">Ahora.</span>
          </h2>
          <p className="text-lg text-muted mt-4 max-w-lg mx-auto" style={{ lineHeight: 1.6 }}>
            Desde un panel solar hasta el calefón roto un domingo en la noche.
            Más de 1.000 maestros disponibles.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.name} cat={cat} idx={i} />
          ))}

          {/* CTA card "Y muchos más" — siempre como último */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <Link
              href={APP_URL}
              className="relative block bg-grad-cta rounded-3xl p-6 overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer group h-full text-white"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

              <div className="relative w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3">
                ✨
              </div>
              <h3 className="font-extrabold text-lg leading-tight">Y muchos más</h3>
              <p className="text-sm text-white/80 mt-1">Maestros para todo lo que necesites</p>

              <div className="flex items-center gap-1 mt-3 text-sm font-bold">
                Ver catálogo completo
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
