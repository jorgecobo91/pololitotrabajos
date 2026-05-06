'use client';

import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

type Mode = 'cliente' | 'maestro';

const stepsCliente = [
  {
    num: '01',
    icon: '🔍',
    title: 'Buscas o publicas',
    desc: 'Elige un maestro del catálogo según oficio, comuna y reseñas. O publica tu pega en 30 segundos sin crear cuenta.',
  },
  {
    num: '02',
    icon: '⭐',
    title: 'Comparas y eliges',
    desc: 'Revisa el perfil completo: foto, portafolio, calificaciones reales y especialidades. Tú decides quién entra a tu casa.',
  },
  {
    num: '03',
    icon: '📞',
    title: 'Contactas directo',
    desc: 'Llamas o le escribes por WhatsApp al maestro. Acuerdas precio y horario sin intermediarios ni comisiones.',
  },
  {
    num: '04',
    icon: '✅',
    title: 'Calificas el trabajo',
    desc: 'Cuando termina la pega, marcas como completada y le das tu reseña. Así otros clientes saben en quién confiar.',
  },
];

const stepsMaestro = [
  {
    num: '01',
    icon: '✍️',
    title: 'Te registras gratis',
    desc: 'Crea tu cuenta de maestro con email. Sin comisiones, sin suscripción, sin letra chica.',
  },
  {
    num: '02',
    icon: '📸',
    title: 'Armas tu perfil',
    desc: 'Sube tu foto, especialidades, comunas donde trabajas y portafolio de pegas anteriores. Mientras más completo, más clientes.',
  },
  {
    num: '03',
    icon: '🔔',
    title: 'Te llegan pololitos',
    desc: 'Ves las publicaciones de tu zona y oficio. Mandas tu propuesta con precio y tiempo, o el cliente te contacta directo.',
  },
  {
    num: '04',
    icon: '⭐',
    title: 'Acumulas reputación',
    desc: 'Cada cliente te califica al terminar. Tu rating te trae más pega y mejor pagada. Tu trabajo se convierte en tu mejor publicidad.',
  },
];

function StepCard({ step, idx }: { step: typeof stepsCliente[number]; idx: number }) {
  return (
    <motion.div
      key={step.num}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, delay: idx * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="bg-white border border-divider rounded-3xl p-8 relative overflow-hidden group"
    >
      <span className="absolute top-6 right-8 text-[80px] font-extrabold text-ink/[0.05] leading-none pointer-events-none select-none">
        {step.num}
      </span>
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-lavender flex items-center justify-center text-2xl mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3">
          {step.icon}
        </div>
        <h3 className="font-extrabold text-2xl text-ink">{step.title}</h3>
        <p className="text-base text-muted mt-3" style={{ lineHeight: 1.6 }}>
          {step.desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  const [mode, setMode] = useState<Mode>('cliente');
  const steps = mode === 'cliente' ? stepsCliente : stepsMaestro;

  return (
    <section id="como-funciona" className="bg-white py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-bold tracking-[0.2em] uppercase text-violet">
            CÓMO FUNCIONA
          </span>
          <h2
            className="font-extrabold tracking-[-0.03em] text-ink mt-4"
            style={{ fontSize: 'clamp(36px, 5vw, 72px)', lineHeight: 1 }}
          >
            Cuatro pasos.{' '}
            <span className="text-gradient">Cero vueltas.</span>
          </h2>
        </motion.div>

        {/* Toggle */}
        <LayoutGroup>
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-cream border border-divider rounded-full p-1.5 relative">
              {(['cliente', 'maestro'] as const).map((m) => {
                const active = mode === m;
                return (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className="relative px-6 lg:px-8 py-2.5 rounded-full text-sm font-bold transition-colors z-10"
                  >
                    {active && (
                      <motion.div
                        layoutId="modeToggle"
                        className="absolute inset-0 bg-grad-cta rounded-full shadow-md"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className={`relative ${active ? 'text-white' : 'text-ink/60'}`}>
                      {m === 'cliente' ? 'Soy cliente' : 'Soy maestro'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </LayoutGroup>

        {/* Cards grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {steps.map((step, i) => (
              <StepCard key={`${mode}-${step.num}`} step={step} idx={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
