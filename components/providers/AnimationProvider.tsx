'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { animate, scroll } from 'motion';

export default function AnimationProvider({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Skip animations on mobile devices for better performance
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      return; // Exit early, no animations on mobile
    }

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // RAF with visibility pause
    let rafId: number;
    function raf(time: number) {
      if (!document.hidden) {
        lenis.raf(time);
      }
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Hero parallax
    const heroVideo = document.querySelector('header video');
    if (heroVideo) {
      scroll(animate(heroVideo, {
        transform: ["translateY(0%)", "translateY(20%)"]
      }), {
        target: document.querySelector("header") as Element,
        offset: ["start start", "end start"]
      });
    }

    // Philosophy section parallax
    const philosophySection = document.querySelector('#filozofie');
    const philosophyImage = philosophySection?.querySelector('.aspect-\\[4\\/5\\]');
    if (philosophySection && philosophyImage) {
      scroll(animate(philosophyImage, {
        transform: ["translateY(30px)", "translateY(-30px)"]
      }), {
        target: philosophySection as Element,
        offset: ["start end", "end start"]
      });
    }

    // Founder section parallax
    const founderSection = document.querySelector('#majitelka');
    const founderImage = founderSection?.querySelector('.aspect-\\[3\\/4\\]');
    if (founderSection && founderImage) {
      scroll(animate(founderImage, {
        transform: ["translateY(40px)", "translateY(-40px)"]
      }), {
        target: founderSection as Element,
        offset: ["start end", "end start"]
      });
    }

    // Gallery section - subtle parallax on grid items
    const gallerySection = document.querySelector('#galerie');
    if (gallerySection) {
      const galleryItems = gallerySection.querySelectorAll('.grid > div');
      galleryItems.forEach((item, index) => {
        const intensity = (index % 3 + 1) * 10; // Vary intensity: 10, 20, or 30px
        scroll(animate(item, {
          transform: [`translateY(${intensity}px)`, `translateY(-${intensity}px)`]
        }), {
          target: item as Element,
          offset: ["start end", "end start"]
        });
      });
    }

    // Gift cards section parallax
    const giftSection = document.querySelector('#poukazy');
    const giftImage = giftSection?.querySelector('.shadow-2xl');
    if (giftSection && giftImage) {
      scroll(animate(giftImage, {
        transform: ["translateY(50px) scale(0.98)", "translateY(-50px) scale(1.02)"]
      }), {
        target: giftSection as Element,
        offset: ["start end", "end start"]
      });
    }

    // Services section - parallax on image card
    const servicesSection = document.querySelector('#sluzby');
    const serviceImageCard = servicesSection?.querySelector('#serviceImageCard');
    if (servicesSection && serviceImageCard) {
      scroll(animate(serviceImageCard, {
        transform: ["translateY(20px)", "translateY(-20px)"]
      }), {
        target: servicesSection as Element,
        offset: ["start end", "end start"]
      });
    }

    // Other animations...
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}