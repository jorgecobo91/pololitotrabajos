import Link from 'next/link';

const APP_URL = '/app';

export default function FinalCTA() {
  return (
    <section className="bg-grad-pill py-32">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2
          className="font-extrabold tracking-[-0.03em] text-ink mb-6"
          style={{ fontSize: 'clamp(40px, 6vw, 96px)', lineHeight: 1 }}
        >
          Empieza{' '}
          <span className="text-gradient italic">al tiro.</span>
        </h2>
        <p className="text-xl text-muted mb-10" style={{ lineHeight: 1.6 }}>
          Es gratis. Toma 2 minutos. Sin compromiso.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={APP_URL}
            className="bg-grad-cta text-white font-extrabold text-[16px] rounded-2xl py-5 px-10 hover:opacity-90 transition-opacity shadow-lg"
          >
            Buscar un maestro
          </Link>
          <Link
            href={APP_URL}
            className="bg-white text-violet font-extrabold text-[16px] rounded-2xl py-5 px-10 border-2 border-violet hover:bg-lavender2 transition-colors"
          >
            Publicar trabajo
          </Link>
        </div>
      </div>
    </section>
  );
}
