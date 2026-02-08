'use client';

import { useState } from 'react';
import Image from 'next/image';

const galleryItems = [
    {
        type: 'image' as const,
        src: '/images/salon_cekarna.jpg',
        alt: 'Čekárna salonu SW Beauty',
        span: 'col-span-2 row-span-2'
    },
    {
        type: 'image' as const,
        src: '/images/salon_room1.jpg',
        alt: 'Místnost salonu',
        span: ''
    },
    {
        type: 'image' as const,
        src: '/images/hero-image.jpg',
        alt: 'Recepce',
        span: ''
    },
    {
        type: 'image' as const,
        src: '/images/kreslomistnostnaprocedury.jpg',
        alt: 'Místnost na procedury',
        span: 'col-span-2'
    },
    {
        type: 'image' as const,
        src: '/images/rasy-1.jpg',
        alt: 'Místnost na nehty',
        span: ''
    },
    {
        type: 'image' as const,
        src: '/images/skin-calming-with-propolis1.jpg',
        alt: 'Detail interiéru',
        span: ''
    },
    {
        type: 'image' as const,
        src: '/images/towel.jpg',
        alt: 'Detail salonu',
        span: ''
    },
    {
        type: 'image' as const,
        src: '/images/woman-about-sw.png',
        alt: 'Logo SW Beauty',
        span: ''
    }
];

export default function GallerySection() {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const openLightbox = (index: number) => {
        setActiveIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const nextImage = () => {
        setActiveIndex((prev) => (prev + 1) % galleryItems.length);
    };

    const prevImage = () => {
        setActiveIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
    };

    return (
        <>
            <section id="galerie" className="py-24 md:py-32 px-6 md:px-12 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-sm md:text-xs uppercase tracking-widest text-stone-600 font-medium font-geist mb-4 block">Náš salon</span>
                        <h2 className="text-4xl md:text-5xl font-medium tracking-tight font-cormorant mb-4 text-stone-900">Galerie</h2>
                        <p className="text-stone-700 font-normal font-geist max-w-2xl mx-auto leading-relaxed">
                            Nahlédněte do prostředí, kde se staráme o vaši krásu a pohodu.
                        </p>
                    </div>

                    {/* Masonry Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
                        {galleryItems.map((item, index) => (
                            <div
                                key={index}
                                className={`relative overflow-hidden cursor-pointer group ${item.span}`}
                                onClick={() => openLightbox(index)}
                            >
                                <Image
                                    src={item.src}
                                    alt={item.alt}
                                    fill
                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 350px"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                    quality={80}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="m21 21-4.3-4.3" />
                                        <path d="M11 8v6" />
                                        <path d="M8 11h6" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lightbox */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
                    onClick={closeLightbox}
                >
                    {/* Close button */}
                    <button
                        className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors p-4 min-h-[48px] min-w-[48px] flex items-center justify-center"
                        onClick={closeLightbox}
                        aria-label="Zavřít galerii"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>

                    {/* Previous button */}
                    <button
                        className="absolute left-6 text-white/80 hover:text-white transition-colors p-4 min-h-[48px] min-w-[48px] flex items-center justify-center bg-black/20 rounded-full"
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        aria-label="Předchozí obrázek"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </button>

                    {/* Image */}
                    <div className="relative max-w-[90vw] max-h-[85vh] w-[1200px] h-[800px]" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={galleryItems[activeIndex].src}
                            alt={galleryItems[activeIndex].alt}
                            fill
                            className="object-contain"
                            quality={90}
                            priority
                            sizes="90vw"
                        />
                    </div>

                    {/* Next button */}
                    <button
                        className="absolute right-6 text-white/80 hover:text-white transition-colors p-4 min-h-[48px] min-w-[48px] flex items-center justify-center bg-black/20 rounded-full"
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        aria-label="Následující obrázek"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </button>

                    {/* Image counter */}
                    <div className="absolute bottom-6 text-white/60 font-geist text-sm">
                        {activeIndex + 1} / {galleryItems.length}
                    </div>
                </div>
            )}
        </>
    );
}
