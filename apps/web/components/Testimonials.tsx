const testimonials = [
  {
    stars: 5,
    quote: 'Encontré un electricista en 10 minutos. Llegó al otro día y dejó todo impecable. La app es súper fácil de usar.',
    name: 'Carolina Muñoz',
    role: 'Cliente',
    location: 'Las Condes',
    initial: 'C',
  },
  {
    stars: 5,
    quote: 'Desde que me registré no he parado de recibir pegas. Los clientes te contactan directo, sin vueltas. Bacán.',
    name: 'Pedro Soto',
    role: 'Gasfíter',
    location: 'Puente Alto',
    initial: 'P',
  },
  {
    stars: 5,
    quote: 'Me tincó porque puedes ver las calificaciones de antes. Contraté un carpintero y quedó filete el mueble.',
    name: 'Francisca Reyes',
    role: 'Cliente',
    location: 'Ñuñoa',
    initial: 'F',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonios" className="bg-white py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-bold tracking-[0.2em] uppercase text-violet">
            TESTIMONIOS
          </span>
          <h2
            className="font-extrabold tracking-[-0.03em] text-ink mt-4"
            style={{ fontSize: 'clamp(36px, 5vw, 72px)', lineHeight: 1 }}
          >
            Historias{' '}
            <span className="text-gradient">reales.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white border border-divider rounded-3xl p-8"
            >
              <div className="text-lg text-amber">
                {'★'.repeat(t.stars)}
              </div>
              <p className="text-lg text-ink mt-4 leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>
              <hr className="border-divider my-6" />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-grad-cta flex items-center justify-center text-white font-bold">
                  {t.initial}
                </div>
                <div>
                  <div className="font-bold text-ink">{t.name}</div>
                  <div className="text-sm text-muted">
                    {t.role} · {t.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
