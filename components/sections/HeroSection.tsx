"use client"

import { useEffect, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Dynamický import videí bez SSR, aby se kód a tagy načetly až po hydrataci na klientovi
const VideoPlayer = dynamic(() => import('../ui/VideoPlayer'), {
  ssr: false,
  loading: () => null // Během načítání neukazujeme nic, zůstane poster image
});

export default function HeroSection({ onOpenBooking }: { onOpenBooking: () => void }) {
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <header
      className="relative w-full flex flex-col pt-16 lg:pt-0 lg:flex-row lg:items-center overflow-hidden bg-transparent"
      style={{ minHeight: "100dvh" }}
    >
      {/* --- MOBILE VIEW --- */}
      {(!isClient || isMobile) && (
        <div className="lg:hidden absolute inset-0 w-full h-full">
          {/* Always show image first (LCP optimization) */}
          <div className="absolute inset-0 -z-10">
            <Image
              src="/images/hero-image.jpg"
              alt="SW Beauty"
              fill
              priority
              quality={85}
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>

          {/* Show mobile video only on client and if actually mobile */}
          {isClient && isMobile && (
            <VideoPlayer
              src="/images/hero_1_mobile.mp4"
              label="Video pozadí salonu"
              poster="/images/hero-image.jpg"
              className="absolute inset-0 w-full h-full object-cover object-center -z-10"
            />
          )}

          <div className="absolute inset-0 bg-black/45 -z-[5]" />

          <div
            className="absolute inset-x-0 bottom-0 z-10 flex flex-col px-6 pb-20"
            style={{ paddingBottom: "max(5rem, env(safe-area-inset-bottom, 5rem))" }}
          >
            <h1 className="text-5xl leading-[1.1] font-medium text-white tracking-tighter font-cormorant mb-6">
              Místo, kde se vnější krása spojí s <em className="italic">vnitřní</em>.
            </h1>

            <button
              onClick={onOpenBooking}
              className="w-full text-center bg-white text-stone-900 px-4 py-4 hover:bg-stone-100 transition-colors duration-300 font-geist text-sm tracking-widest uppercase min-h-[52px]"
            >
              Rezervovat termín
            </button>
          </div>

          <div className="w-full h-[100dvh]" />
        </div>
      )}

      {/* --- DESKTOP/TABLET VIEW --- */}
      {(!isClient || !isMobile) && (
        <div className="hidden lg:flex max-w-screen-2xl mx-auto w-full h-full flex-row items-center flex-1 pr-8 xl:pr-16">
          {/* Text Content */}
          <div className="w-1/2 xl:w-5/12 flex flex-col justify-center px-8 xl:px-12">
            <h1 className="text-left text-5xl xl:text-7xl leading-[1.1] font-medium text-stone-900 tracking-tighter font-cormorant mb-8">
              Místo, kde se vnější krása spojí s vnitřní.
            </h1>

            <div className="flex flex-row gap-4">
              <button
                onClick={onOpenBooking}
                className="min-w-[160px] xl:min-w-[180px] text-center bg-stone-900 text-white px-6 py-4 hover:bg-stone-800 transition-colors duration-300 font-geist text-sm tracking-widest uppercase"
              >
                Rezervovat termín
              </button>
              <a
                href="#sluzby"
                className="min-w-[160px] xl:min-w-[180px] text-center border border-stone-300 text-stone-900 px-6 py-4 hover:border-stone-900 transition-colors duration-300 font-geist text-sm tracking-widest uppercase"
              >
                Prohlédnout služby
              </a>
            </div>
          </div>

          {/* Video/Image Container */}
          <div className="w-1/2 xl:w-7/12 flex items-center justify-center py-20 xl:py-32">
            <div className="relative w-full max-w-sm xl:max-w-md aspect-[2/3] shadow-2xl overflow-hidden bg-stone-100">
              {/* Show image during loading or SSR */}
              <Image
                src="/images/hero-image.jpg"
                alt="SW Beauty"
                fill
                priority
                className={`object-cover object-center opacity-90 transition-opacity duration-700 ${isClient ? 'opacity-0' : 'opacity-100'}`}
                sizes="(max-width: 1280px) 40vw, 500px"
              />

              {/* Responsive Video */}
              {isClient && !isMobile && (
                <VideoPlayer
                  src="/images/hero_1.mp4"
                  label="Video interiér salonu"
                  poster="/images/hero-image.jpg"
                  className="w-full h-full object-cover object-center opacity-90 animate-fade-in-up"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
