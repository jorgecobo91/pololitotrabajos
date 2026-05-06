import Link from 'next/link';
import PhoneMockup from './PhoneMockup';

const APP_URL = '/app';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Backgrounds */}
      <div className="absolute inset-0 bg-grad-hero pointer-events-none" />
      <div className="absolute inset-0 bg-grad-radial pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text content */}
          <div className="animate-fadeIn">
            {/* Pill */}
            <div className="inline-flex items-center gap-3 bg-lavender rounded-full px-5 py-2 mb-8">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full border-2 border-white" style={{ background: 'rgba(255,107,53,0.6)' }} />
                <div className="w-7 h-7 rounded-full border-2 border-white" style={{ background: 'rgba(244,114,182,0.5)' }} />
                <div className="w-7 h-7 rounded-full border-2 border-white" style={{ background: 'rgba(124,58,237,0.6)' }} />
              </div>
              <span className="text-xs font-bold tracking-[0.15em] uppercase text-violet2">
                +1.240 maestros activos hoy
              </span>
            </div>

            {/* H1 */}
            <h1
              className="font-extrabold tracking-[-0.04em] leading-[0.95] text-ink mb-8"
              style={{ fontSize: 'clamp(48px, 6vw, 88px)' }}
            >
              Tu próximo<br />
              <span className="text-gradient">pololito</span>
              <br />
              empieza acá.
            </h1>

            {/* Subtitle */}
            <p className="text-muted text-lg lg:text-xl max-w-xl mb-10" style={{ lineHeight: 1.6 }}>
              ¿Se te corta la luz un domingo? ¿Necesitas ampliar tu casa y no sabes a quién llamar?
              Acá están los maestros de tu zona, listos para cotizarte al tiro.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                href={APP_URL}
                className="bg-grad-cta text-white font-extrabold text-[16px] rounded-2xl py-5 px-10 hover:opacity-90 transition-opacity shadow-lg text-center"
              >
                Buscar un maestro
              </Link>
              <Link
                href="/maestro/login"
                className="bg-white text-violet font-extrabold text-[16px] rounded-2xl py-5 px-10 border-2 border-violet hover:bg-lavender2 transition-colors text-center"
              >
                Soy maestro, busco pololitos
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3 text-sm">
              <span className="text-amber text-base">★★★★★</span>
              <span className="font-bold text-ink">4.8/5</span>
              <span className="text-divider">|</span>
              <span className="text-muted">+15.000 trabajos completados</span>
            </div>
          </div>

          {/* Right: Phone mockup */}
          <div className="hidden lg:flex justify-center">
            <PhoneMockup floatingBadges />
          </div>
        </div>

        {/* Mobile: Phone mockup below */}
        <div className="lg:hidden flex justify-center mt-16">
          <PhoneMockup floatingBadges />
        </div>
      </div>
    </section>
  );
}
