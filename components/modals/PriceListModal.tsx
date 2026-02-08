'use client';

import { useEffect, useState } from 'react';
import { useModal } from '../providers/ModalProvider';
import { Service, Price, loadData, getImageUrl } from '@/lib/data';

interface PriceListModalProps {
  onClose: () => void;
}

export default function PriceListModal({ onClose }: PriceListModalProps) {
  const { openModal } = useModal();
  const [services, setServices] = useState<Service[]>([]);
  const [prices, setPrices] = useState<Price[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const load = async () => {
      const { services, prices } = await loadData();
      setServices(services);
      setPrices(prices);
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
  }, []);

  const filterPriceList = (category: string) => {
    setSelectedCategory(category);
  };

  const groupedPrices = prices.reduce((acc: any, price) => {
    if (!acc[price.service_id]) acc[price.service_id] = [];
    acc[price.service_id].push(price);
    return acc;
  }, {});

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-0 md:p-4 isolate"
      onClick={onClose}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" />
      <div
        className="bg-white w-full h-full md:h-auto md:max-h-[85vh] md:max-w-3xl shadow-2xl flex flex-col relative animate-fade-in-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <div className="px-6 md:px-8 py-4 md:py-6 border-b border-stone-100 flex justify-between items-center bg-white z-10">
          <h2 className="text-2xl md:text-3xl font-cormorant text-stone-900">Ceník služeb</h2>
          <button onClick={onClose} className="p-4 -mr-2 text-stone-600 hover:text-stone-900 transition-colors" aria-label="Zavřít">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div
          className="flex-1 overflow-y-auto overscroll-contain touch-pan-y px-6 md:px-8 lg:px-12 pb-6 md:pb-8 lg:pb-12"
          style={{ WebkitOverflowScrolling: 'touch' }}
          data-lenis-prevent
        >
          {/* Filter buttons */}
          <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-20 pb-4 mb-6 border-b border-stone-200 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <button onClick={() => filterPriceList('all')} className={`px-5 py-3 text-xs uppercase tracking-widest font-geist border transition-colors ${selectedCategory === 'all' ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-200 text-stone-700 hover:border-stone-900'}`}>
                Vše
              </button>
              {services.map(service => (
                <button
                  key={service.service_id}
                  onClick={() => filterPriceList(service.service_id)}
                  className={`px-5 py-3 text-xs uppercase tracking-widest font-geist border transition-colors ${selectedCategory === service.service_id ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-200 text-stone-700 hover:border-stone-900'}`}
                >
                  {service.category_name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-10 md:space-y-12 pb-24 md:pb-12">
            {Object.entries(groupedPrices).map(([serviceId, servicePrices]: [string, any]) => {
              const service = services.find(s => s.service_id === serviceId);
              if (!service) return null;
              if (selectedCategory !== 'all' && serviceId !== selectedCategory) return null;

              return (
                <div key={serviceId} className="price-category">
                  <h3
                    className="font-cormorant text-2xl text-stone-900 mb-6 border-b border-stone-100 pb-2 cursor-pointer hover:text-stone-600 transition-colors"
                    onClick={() => openModal('service-detail', { serviceId })}
                  >
                    {service.category_name}
                  </h3>
                  <div className="space-y-4">
                    {servicePrices.map((price: Price) => (
                      <div key={price.name} className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-4 group border-b border-stone-100 pb-4">
                        <div className="cursor-pointer" onClick={() => openModal('service-detail', { serviceId })}>
                          <p className="font-geist text-stone-800 group-hover:text-stone-900 transition-colors text-base">
                            {price.name}
                          </p>
                          <p className="text-sm text-stone-400 mt-1">
                            {price.duration_in_minutes && <span>{price.duration_in_minutes} min</span>}
                            {price.duration_in_minutes && price.session && <span> • </span>}
                            {price.session && <span>{price.session}x ošetření</span>}
                          </p>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-4">
                          <span className="font-geist font-medium text-stone-900 text-lg md:text-base whitespace-nowrap">
                            {price.price_in_czk} Kč
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onClose();
                              openModal('booking', { serviceId, packageName: price.name, price: price.price_in_czk });
                            }}
                            className="px-4 py-2 text-xs uppercase tracking-widest font-geist border border-stone-300 text-stone-600 hover:border-stone-900 hover:bg-stone-900 hover:text-white transition-all"
                          >
                            Rezervovat
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 border-t border-stone-100 bg-stone-50 flex justify-center items-center z-10">
          <button
            onClick={() => { onClose(); openModal('booking'); }}
            className="text-stone-900 border-b border-stone-900 pb-0.5 hover:text-stone-600 hover:border-stone-600 transition-colors font-geist text-sm uppercase tracking-widest"
          >
            Rezervovat termín
          </button>
        </div>
      </div>
    </div>
  );
}