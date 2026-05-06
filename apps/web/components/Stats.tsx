const stats = [
  { value: '+1.240', label: 'Maestros activos' },
  { value: '15K+', label: 'Trabajos completados' },
  { value: '4.8★', label: 'Calificación promedio' },
  { value: '<2h', label: 'Tiempo de respuesta' },
];

export default function Stats() {
  return (
    <section className="bg-cream2 py-24">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div
              className="font-extrabold text-gradient tracking-tight"
              style={{ fontSize: 'clamp(48px, 6vw, 96px)' }}
            >
              {s.value}
            </div>
            <div className="text-base text-muted mt-2">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
