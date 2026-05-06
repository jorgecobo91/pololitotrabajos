import Link from 'next/link';

const APP_URL = '/app';

export default function Footer() {
  return (
    <footer className="bg-cream py-20 border-t border-divider">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand column */}
          <div className="md:col-span-1">
            <span className="font-extrabold tracking-tight text-ink text-[15px]">
              POLOLITOTRABAJOS
            </span>
            <p className="text-sm text-muted mt-4 leading-relaxed">
              POLOLITOTRABAJOS es <strong className="text-ink">solo intermediaria</strong>. No garantizamos calidad ni
              respondemos por incumplimientos, problemas de pago o resultados. Cada usuario es
              responsable de sus acuerdos. Revisa calificaciones antes de contratar.
            </p>
            <p className="text-sm text-muted mt-6">
              © 2024 POLOLITOTRABAJOS. Hecho en Chile 🇨🇱
            </p>
          </div>

          {/* Product column */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-ink mb-4">
              Producto
            </h4>
            <nav className="flex flex-col">
              <a href="#como-funciona" className="block py-1 text-muted hover:text-ink transition-colors text-sm">
                Cómo funciona
              </a>
              <a href="#categorias" className="block py-1 text-muted hover:text-ink transition-colors text-sm">
                Categorías
              </a>
              <a href="#testimonios" className="block py-1 text-muted hover:text-ink transition-colors text-sm">
                Testimonios
              </a>
              <Link href={APP_URL} className="block py-1 text-muted hover:text-ink transition-colors text-sm">
                Para maestros
              </Link>
              <a href="mailto:coboandres@live.cl" className="block py-1 text-muted hover:text-ink transition-colors text-sm">
                Soporte
              </a>
            </nav>
          </div>

          {/* Legal column */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-ink mb-4">
              Legal
            </h4>
            <nav className="flex flex-col">
              <Link href="/legal/terminos" className="block py-1 text-muted hover:text-ink transition-colors text-sm">
                Términos de servicio
              </Link>
              <Link href="/legal/privacidad" className="block py-1 text-muted hover:text-ink transition-colors text-sm">
                Política de privacidad
              </Link>
              <a href="mailto:coboandres@live.cl" className="block py-1 text-muted hover:text-ink transition-colors text-sm">
                Contacto
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
