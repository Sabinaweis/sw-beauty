'use client';

import Image from 'next/image';
import { useModal } from '../providers/ModalProvider';

interface GiftCardsSectionProps {
  onOpenGiftCard: () => void;
}

export default function GiftCardsSection({ onOpenGiftCard }: GiftCardsSectionProps) {
  const { openModal } = useModal();

  return (
    <section id="poukazy" className="relative bg-white">
      <div className="flex flex-col lg:flex-row min-h-screen">

        {/* Left Side: Sticky Image */}
        <div className="hidden lg:flex w-1/2 h-screen sticky top-0 left-0 items-center justify-center bg-stone-50">
          <div className="relative w-[500px] aspect-[4/3] overflow-hidden shadow-2xl">
            <Image
              src="/images/gift-card-main.webp"
              alt="SW Beauty dárkový poukaz"
              fill
              sizes="500px"
              className="object-cover"
              loading="lazy"
              quality={80}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-stone-900/5 to-transparent"></div>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="w-full lg:w-1/2 py-32 px-6 md:px-12 lg:pl-16 xl:pl-24 flex flex-col justify-center z-10 bg-stone-50">

          {/* Mobile Image */}
          <div className="lg:hidden mb-12 -mx-6 md:-mx-12">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/gift-card-main.webp"
                alt="SW Beauty dárkový poukaz"
                fill
                sizes="100vw"
                className="object-cover"
                loading="lazy"
                quality={80}
              />
            </div>
          </div>

          <div className="max-w-lg">
            <span className="text-stone-600 uppercase tracking-widest text-sm md:text-xs mb-6 block font-geist font-medium">
              Dárkové poukazy
            </span>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-medium font-cormorant text-stone-900 mb-8 tracking-tight leading-[1.1]">
              Darujte krásu
            </h2>

            <p className="text-stone-600 text-2xl md:text-xl font-light mb-12 leading-relaxed font-geist">
              Nejkrásnějším dárkem je čas a péče.
            </p>

            <button
              onClick={onOpenGiftCard}
              className="inline-flex items-center gap-3 bg-stone-900 text-white px-8 py-4 hover:bg-stone-800 transition-all duration-300 tracking-widest text-sm uppercase font-geist font-medium"
            >
              <span>Vytvořit poukaz</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-right w-4 h-4"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}