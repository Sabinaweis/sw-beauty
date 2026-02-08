'use client';

import { useEffect, useState } from 'react';
import { useModal } from '../providers/ModalProvider';
import { Service, Price, loadData, getImageUrl } from '@/lib/data';
import Image from 'next/image';

interface ServiceDetailModalProps {
  serviceId?: string;
  onClose: () => void;
}

export default function ServiceDetailModal({ serviceId, onClose }: ServiceDetailModalProps) {
  const { openModal } = useModal();
  const [service, setService] = useState<Service | null>(null);
  const [servicePrices, setServicePrices] = useState<Price[]>([]);

  useEffect(() => {
    const load = async () => {
      const { services, prices } = await loadData();
      const foundService = services.find(s => s.service_id === serviceId);
      const foundPrices = prices.filter(p => p.service_id === serviceId);
      setService(foundService || null);
      setServicePrices(foundPrices);
    };
    load();

    // Lock body scroll
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, [serviceId]);

  if (!service) return null;

  const benefits = service.benefits.split(',').filter(b => b.trim());
  const indications = service.indications.split(',').filter(i => i.trim());
  const contraindications = service.contraindications.split(',').filter(c => c.trim());
  const images = service.image.split(';').filter(img => img.trim());

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 isolate"
      onClick={onClose}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" />
      <div
        className="bg-white w-full max-w-5xl max-h-[90vh] shadow-2xl flex flex-col relative animate-fade-in-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-2 right-2 z-10 p-4 text-stone-700 hover:text-stone-900 transition-colors" aria-label="Zavřít">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <div
          className="overflow-y-auto flex-1 overscroll-contain touch-pan-y"
          style={{ WebkitOverflowScrolling: 'touch' }}
          data-lenis-prevent
        >
          <div className="w-full h-48 md:h-96 bg-stone-100 relative overflow-hidden">
            {images.length > 0 && (
              <Image
                src={getImageUrl(images[0])}
                alt={service.category_name}
                fill
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 md:p-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-cormorant text-white font-medium">{service.category_name}</h2>
            </div>
          </div>

          <div className="p-6 md:p-12 space-y-6 md:space-y-8">
            <div>
              <p className="text-lg md:text-xl text-stone-700 font-normal font-geist italic">{service.short_description}</p>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-cormorant text-stone-900 mb-3 md:mb-4">O ošetření</h3>
              <p className="text-base md:text-base text-stone-700 font-normal font-geist leading-relaxed">{service.full_description}</p>
            </div>

            {benefits.length > 0 && (
              <div>
                <h3 className="text-xl md:text-2xl font-cormorant text-stone-900 mb-3 md:mb-4">Přínosy</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {benefits.map(b => (
                    <li key={b} className="flex items-start gap-2 text-base md:text-base text-stone-700 font-geist">
                      <svg className="w-5 h-5 text-stone-900 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-normal">{b.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {indications.length > 0 && (
              <div>
                <h3 className="text-xl md:text-2xl font-cormorant text-stone-900 mb-3 md:mb-4">Vhodné pro</h3>
                <div className="flex flex-wrap gap-2">
                  {indications.map(i => (
                    <span key={i} className="px-3 py-2 bg-stone-100 text-stone-700 text-sm md:text-sm font-geist">{i.trim()}</span>
                  ))}
                </div>
              </div>
            )}

            {contraindications.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-cormorant text-amber-900 mb-3">Kontraindikace</h3>
                <ul className="space-y-2">
                  {contraindications.map(c => (
                    <li key={c} className="flex items-start gap-2 text-amber-800 text-base md:text-sm font-geist">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>{c.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {servicePrices.length > 0 && (
              <div>
                <h3 className="text-xl md:text-2xl font-cormorant text-stone-900 mb-3 md:mb-4">Ceník</h3>
                <div className="space-y-4">
                  {servicePrices.map(price => (
                    <div key={price.name} className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-4 border-b border-stone-100 pb-4">
                      <div>
                        <p className="font-geist text-stone-900 text-base md:text-base">{price.name}</p>
                        <p className="text-sm md:text-sm text-stone-600 font-medium mt-1">
                          {price.duration_in_minutes && <span>{price.duration_in_minutes} min</span>}
                          {price.duration_in_minutes && price.session && <span> • </span>}
                          {price.session && <span>{price.session}x ošetření</span>}
                        </p>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-3 md:gap-4">
                        <span className="font-geist font-medium text-stone-900 text-lg md:text-base whitespace-nowrap">{price.price_in_czk} Kč</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                            openModal('booking', { serviceId, packageName: price.name, price: price.price_in_czk });
                          }}
                          className="px-4 py-3 md:py-2 text-sm md:text-xs min-h-[48px] md:min-h-0 uppercase tracking-widest font-geist border border-stone-300 text-stone-700 font-medium hover:border-stone-900 hover:bg-stone-900 hover:text-white transition-all"
                        >
                          Rezervovat
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 md:pt-6 flex gap-3 md:gap-4">
              <button onClick={() => { onClose(); openModal('booking'); }} className="flex-1 bg-stone-900 text-white px-6 md:px-8 py-4 hover:bg-stone-800 transition-colors font-geist text-base md:text-sm uppercase tracking-widest min-h-[52px]">
                Rezervovat termín
              </button>
              <button onClick={onClose} className="flex-1 border border-stone-300 text-stone-900 px-6 md:px-8 py-4 hover:border-stone-900 transition-colors font-geist text-base md:text-sm uppercase tracking-widest min-h-[52px]">
                Zavřít
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}