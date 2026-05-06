'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const APP_URL = '/app';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${
        scrolled ? 'border-b border-black/5 shadow-sm' : ''
      }`}
      style={{ background: 'rgba(255,255,255,0.95)', height: 72 }}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link
          href="/"
          onClick={closeMenu}
          className="font-extrabold tracking-tight text-ink text-[15px]"
        >
          POLOLITOTRABAJOS
        </Link>

        {/* Desktop center links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#como-funciona" className="text-sm font-medium text-muted hover:text-ink transition-colors">
            Cómo funciona
          </a>
          <a href="#categorias" className="text-sm font-medium text-muted hover:text-ink transition-colors">
            Categorías
          </a>
          <a href="#testimonios" className="text-sm font-medium text-muted hover:text-ink transition-colors">
            Testimonios
          </a>
        </div>

        {/* Desktop right CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href={APP_URL}
            className="text-sm font-semibold text-violet hover:text-violet2 transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/maestro/login"
            className="bg-grad-cta text-white text-sm font-bold rounded-full py-3 px-6 hover:opacity-90 transition-opacity"
          >
            Soy maestro
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          className="md:hidden w-10 h-10 rounded-xl border border-black/10 bg-white flex items-center justify-center"
        >
          {open ? <X size={20} className="text-ink" /> : <Menu size={20} className="text-ink" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <>
          <div
            className="md:hidden fixed inset-0 top-[72px] bg-black/30 backdrop-blur-sm z-40"
            onClick={closeMenu}
          />
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-black/5 shadow-xl z-50">
            <div className="px-6 py-5 flex flex-col">
              <a
                href="#como-funciona"
                onClick={closeMenu}
                className="block py-[14px] text-[15px] font-semibold text-ink border-b border-black/5"
              >
                Cómo funciona
              </a>
              <a
                href="#categorias"
                onClick={closeMenu}
                className="block py-[14px] text-[15px] font-semibold text-ink border-b border-black/5"
              >
                Categorías
              </a>
              <a
                href="#testimonios"
                onClick={closeMenu}
                className="block py-[14px] text-[15px] font-semibold text-ink border-b border-black/5"
              >
                Testimonios
              </a>

              <div className="mt-5 flex flex-col gap-3">
                <Link
                  href={APP_URL}
                  onClick={closeMenu}
                  className="w-full text-center py-[14px] rounded-full border-[1.5px] border-violet text-violet font-bold text-[14px]"
                >
                  Entrar
                </Link>
                <Link
                  href="/maestro/login"
                  onClick={closeMenu}
                  className="w-full text-center bg-grad-cta text-white text-[14px] font-bold rounded-full py-[14px]"
                >
                  Soy maestro
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
