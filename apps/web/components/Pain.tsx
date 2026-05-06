'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const painsCliente = [
  {
    emoji: '🔥',
    title: 'Tu calefón murió en pleno invierno',
    desc: 'Llamas y nadie contesta. Marcas a 5 gasfiteros del grupo del condominio y todos están copados o mañana, mañana, mañana.',
    color: 'from-orange-500/20 to-red-500/10',
    accent: '#FF6B35',
  },
  {
    emoji: '🏗️',
    title: 'Quieres ampliar tu casa',
    desc: 'Te dan tres precios distintos sin saber a cuál creer. ¿Quién es el maestro bueno y quién está improvisando con tu plata?',
    color: 'from-violet-500/20 to-purple-500/10',
    accent: '#7C3AED',
  },
  {
    emoji: '🔌',
    title: 'Buscas eléctrico en Marketplace',
    desc: 'El primero que responde te dice "voy mañana al tiro" y nunca aparece. Sin reseñas, sin garantía, sin cara conocida.',
    color: 'from-pink-500/20 to-rose-500/10',
    accent: '#EC4899',
  },
];

const painsMaestro = [
  {
    emoji: '👀',
    title: 'Eres bueno pero nadie te conoce',
    desc: 'Trabajas serio hace años, pero solo te llaman los conocidos. Tu agenda depende de a quién recomiende tu compadre.',
    color: 'from-amber-500/20 to-orange-500/10',
    accent: '#F59E0B',
  },
  {
    emoji: '📅',
    title: 'Una semana muerta sin pega',
    desc: 'Las redes sociales no llegan a nadie de tu comuna. Te postulas en grupos de Facebook y compites con 30 más por el mismo trabajo.',
    color: 'from-cyan-500/20 to-blue-500/10',
    accent: '#0EA5E9',
  },
  {
    emoji: '⭐',
    title: 'Tu mejor trabajo no se ve',
    desc: 'Llevas 15 años poniendo cerámicas como nadie, pero los clientes nuevos te miran con dudas. Tus pegas pasadas viven en tu celular, no en un perfil que te ayude a vender.',
    color: 'from-emerald-500/20 to-teal-500/10',
    accent: '#10B981',
  },
];

function PainCard({ pain, idx }: { pain: typeof painsCliente[number]; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: idx * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="relative bg-white rounded-3xl p-8 border border-divider overflow-hidden group h-full"
    >
      <div
        className={`absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-40 bg-gradient-to-br ${pain.color} pointer-events-none transition-opacity duration-500 group-hover:opacity-70`}
      />
      <div className="relative">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5 transition-transform group-hover:scale-110"
          style={{ background: `${pain.accent}15` }}
        >
          {pain.emoji}
        </div>
        <h3 className="font-extrabold text-xl text-ink leading-tight mb-3">
          {pain.title}
        </h3>
        <p className="text-base text-muted" style={{ lineHeight: 1.55 }}>
          {pain.desc}
        </p>
      </div>
    </motion.div>
  );
}

function SubHeading({ kicker, accent }: { kicker: string; accent: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-3 mb-6"
    >
      <div className="h-[2px] w-10 rounded-full" style={{ background: accent }} />
      <span className="text-xs font-bold tracking-[0.25em] uppercase" style={{ color: accent }}>
        {kicker}
      </span>
    </motion.div>
  );
}

export default function Pain() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <section ref={ref} className="relative bg-cream py-32 overflow-hidden">
      {/* Animated background blobs */}
      <motion.div
        style={{ y: yBg }}
        className="absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-300/20 to-violet-400/10 blur-3xl" />
      </motion.div>
      <motion.div
        style={{ y: yBg }}
        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-300/15 to-violet-400/15 blur-3xl" />
      </motion.div>

      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-sm font-bold tracking-[0.2em] uppercase text-violet">
            ¿Te suena familiar?
          </span>
          <h2
            className="font-extrabold tracking-[-0.03em] text-ink mt-4"
            style={{ fontSize: 'clamp(36px, 5vw, 72px)', lineHeight: 1 }}
          >
            Conectar con el maestro indicado{' '}
            <span className="text-gradient">no debería ser un parto.</span>
          </h2>
          <p className="text-lg text-muted mt-6 max-w-2xl mx-auto" style={{ lineHeight: 1.6 }}>
            Lo mismo del lado del cliente que del maestro: nadie tiene tiempo para perder en grupos
            de WhatsApp, llamadas que no contestan o promesas vacías.
          </p>
        </motion.div>

        {/* CLIENTE */}
        <div className="mb-16">
          <SubHeading kicker="Si eres cliente" accent="#FF6B35" />
          <div className="grid md:grid-cols-3 gap-6">
            {painsCliente.map((p, i) => (
              <PainCard key={p.title} pain={p} idx={i} />
            ))}
          </div>
        </div>

        {/* MAESTRO */}
        <div>
          <SubHeading kicker="Si eres maestro" accent="#7C3AED" />
          <div className="grid md:grid-cols-3 gap-6">
            {painsMaestro.map((p, i) => (
              <PainCard key={p.title} pain={p} idx={i} />
            ))}
          </div>
        </div>

        {/* Bottom highlight strip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-20 bg-grad-cta rounded-3xl p-8 lg:p-10 text-center text-white relative overflow-hidden"
        >
          <p className="text-2xl lg:text-3xl font-extrabold tracking-tight relative">
            Acá hay <span className="underline decoration-white/30 underline-offset-4">cara, reseñas y teléfono</span> de los dos lados.
          </p>
          <p className="text-white/80 text-base lg:text-lg mt-3 max-w-xl mx-auto relative">
            El cliente elige al maestro indicado. El maestro suma reputación que le trae más pega.
            Sin intermediarios, sin comisión.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
