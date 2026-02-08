'use client';

import { useState, useEffect, useRef } from 'react';
import { useModal } from '../providers/ModalProvider';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoScale, setLogoScale] = useState(1);
  const [containerPadding, setContainerPadding] = useState({ top: '1.25rem', bottom: '1.25rem' });
  const [isPastHero, setIsPastHero] = useState(false); // Nový state pro sledování pozice

  const { openModal } = useModal();
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;

      ticking.current = true;
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const scrollProgress = Math.min(currentScrollY / 150, 1);
        const viewportHeight = window.innerHeight;

        // Zjistit jestli jsme scrollovali za hero sekci (80vh)
        setIsPastHero(currentScrollY > viewportHeight * 0.8);

        // Zjistit směr scrollování
        if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
          // Scrollování dolů - skrýt navbar
          setHidden(true);
        } else {
          // Scrollování nahoru - zobrazit navbar
          setHidden(false);
        }

        // Aktualizovat poslední pozici
        lastScrollY.current = currentScrollY;

        // Změna velikosti loga po určitém scrollu
        if (scrollProgress > 0.1) {
          setScrolled(true);
          setLogoScale(1 - (scrollProgress * 0.5));
          setContainerPadding({ top: '0.75rem', bottom: '0.75rem' });
        } else {
          setScrolled(false);
          setLogoScale(1);
          setContainerPadding({ top: '1.25rem', bottom: '1.25rem' });
        }

        ticking.current = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
    document.body.style.overflow = mobileOpen ? 'auto' : 'hidden';
  };

  const navbarStyle = {
    transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
    backgroundColor: 'transparent',
    backdropFilter: 'none',
  };

  const logoStyle = {
    transform: `scale(${logoScale})`,
    transformOrigin: 'left center' as const,
  };

  return (
    <>
      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-white transform transition-transform duration-500 ease-in-out ${mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <button
          onClick={toggleMobileMenu}
          className="absolute top-8 right-8 text-stone-900 p-2 hover:bg-stone-100 rounded-full transition-colors"
          aria-label="Zavřít menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
        <nav className="flex flex-col text-center mt-24">
          <Link href="#sluzby" onClick={toggleMobileMenu} className="text-3xl font-cormorant text-stone-900 hover:text-stone-500 transition-colors py-4">
            Služby
          </Link>
          <Link href="#galerie" onClick={toggleMobileMenu} className="text-3xl font-cormorant text-stone-900 hover:text-stone-500 transition-colors py-4">
            Galerie
          </Link>
          <Link href="#poukazy" onClick={toggleMobileMenu} className="text-3xl font-cormorant text-stone-900 hover:text-stone-500 transition-colors py-4">
            Poukazy
          </Link>
          <Link href="#reviews" onClick={toggleMobileMenu} className="text-3xl font-cormorant text-stone-900 hover:text-stone-500 transition-colors py-4">
            Recenze
          </Link>
          <Link href="#kontakt" onClick={toggleMobileMenu} className="text-3xl font-cormorant text-stone-900 hover:text-stone-500 transition-colors py-4">
            Kontakt
          </Link>
          <button
            onClick={() => {
              toggleMobileMenu();
              openModal('price-list');
            }}
            className="text-3xl font-cormorant text-stone-900 hover:text-stone-500 transition-colors py-4"
          >
            Ceník
          </button>
        </nav>

        <div className="mt-12 flex flex-col gap-3 w-full max-w-xs mx-auto px-6">
          <button
            onClick={() => {
              toggleMobileMenu();
              openModal('booking');
            }}
            className="flex items-center justify-center gap-3 bg-stone-900 text-white px-6 py-4 hover:bg-stone-800 transition-all duration-300 font-geist text-sm uppercase tracking-widest"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <span>Rezervovat termín</span>
          </button>
          <a
            href="tel:+420776632498"
            className="flex items-center justify-center gap-3 border border-stone-300 text-stone-900 px-6 py-3 hover:border-stone-900 transition-all duration-300 font-geist text-sm uppercase tracking-widest"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>Zavolat</span>
          </a>
          <a
            href="https://maps.google.com/?q=U+Cihelny+1326/4,+695+01+Hodonín"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 border border-stone-300 text-stone-900 px-6 py-3 hover:border-stone-900 transition-all duration-300 font-geist text-sm uppercase tracking-widest"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>Navigovat</span>
          </a>
        </div>
      </div>

      {/* Desktop Navbar */}
      <nav
        className={`fixed w-full top-0 left-0 z-40 transition-all duration-300`}
        style={navbarStyle}
      >
        <div
          className="max-w-screen-2xl mx-auto flex items-center justify-between px-6 md:px-12 transition-all duration-300"
          style={{
            paddingTop: containerPadding.top,
            paddingBottom: containerPadding.bottom,
          }}
        >
          <Link href="#" id="navbarLogo" className="relative z-50 origin-left flex items-center" style={logoStyle}>
            <Image
              src="/logo.svg"
              alt="SW Beauty"
              width={64}
              height={64}
              className={`h-12 md:h-16 w-auto transition-all duration-300 ${isPastHero
                ? 'md:filter-none'
                : '[filter:invert(1)_brightness(2)] md:filter-none'
                }`}
            />
          </Link>

          <div className="hidden md:flex gap-8 lg:gap-10 items-center text-xs lg:text-sm uppercase tracking-widest text-stone-800 font-medium font-geist">
            <Link href="#sluzby" className="hover:text-stone-900 transition-colors py-2">
              Služby
            </Link>
            <button
              onClick={() => openModal('price-list')}
              className="hover:text-stone-900 transition-colors uppercase py-2"
            >
              Ceník
            </button>
            <Link href="#poukazy" className="hover:text-stone-900 transition-colors py-2">
              Poukazy
            </Link>
            <Link href="#galerie" className="hover:text-stone-900 transition-colors py-2">
              Galerie
            </Link>
            <Link href="#kontakt" className="hover:text-stone-900 transition-colors py-2">
              Kontakt
            </Link>
            <button
              onClick={() => openModal('booking')}
              className="border border-stone-900 text-stone-900 px-6 py-2.5 hover:bg-stone-900 hover:text-white transition-all duration-300 uppercase font-medium"
            >
              Rezervace
            </button>
          </div>

          <button
            onClick={toggleMobileMenu}
            className={`md:hidden p-4 -mr-4 transition-colors duration-300 ${isPastHero ? 'text-stone-900' : 'text-white'
              }`}
            aria-label="Otevřít menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 5h16" />
              <path d="M4 12h16" />
              <path d="M4 19h16" />
            </svg>
          </button>
        </div>
      </nav>
    </>
  );
}