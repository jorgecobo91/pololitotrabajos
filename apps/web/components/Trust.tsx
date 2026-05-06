const items = [
  {
    icon: '⭐',
    gradient: 'linear-gradient(to bottom right, #FBBF24, #F97316)',
    title: 'Calificaciones reales',
    desc: 'Cada trabajo se califica por ambas partes. Sin reseñas falsas ni infladas.',
  },
  {
    icon: '🛡️',
    gradient: 'linear-gradient(to bottom right, #7C3AED, #5B21B6)',
    title: 'Historial transparente',
    desc: 'Mira pegas anteriores, fotos del trabajo y reseñas de otros clientes.',
  },
  {
    icon: '📞',
    gradient: 'linear-gradient(to bottom right, #60A5FA, #06B6D4)',
    title: 'Contacto directo',
    desc: 'Llama o escribe por WhatsApp al maestro que elegiste. Sin comisiones, sin intermediarios.',
  },
];

export default function Trust() {
  return (
    <section className="bg-grad-dark relative overflow-hidden py-32">
      <div
        className="absolute top-0 left-0 w-96 h-96 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,107,53,0.12), transparent 60%)' }}
      />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2
            className="font-extrabold tracking-[-0.03em] text-white"
            style={{ fontSize: 'clamp(36px, 5vw, 72px)', lineHeight: 1 }}
          >
            Más confianza,{' '}
            <span className="text-gradient">menos riesgo.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.title}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6"
                style={{ background: item.gradient }}
              >
                {item.icon}
              </div>
              <h3 className="font-extrabold text-2xl text-white">{item.title}</h3>
              <p className="text-white/70 text-base mt-3" style={{ lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
