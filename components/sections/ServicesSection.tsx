'use client';

import { useEffect, useState } from 'react';
import { Service, Price, loadData } from '@/lib/data';
import ServiceImages from '../ui/ServiceImages';
import MobileServiceCards from '../ui/MobileServiceCards';

export default function ServicesSection({ onOpenPriceList, onOpenServiceDetail }: {
  onOpenPriceList: () => void;
  onOpenServiceDetail: (id: string) => void;
}) {
  const [services, setServices] = useState<Service[]>([]);
  const [prices, setPrices] = useState<Price[]>([]);

  useEffect(() => {
    const load = async () => {
      const { services, prices } = await loadData();
      setServices(services);
      setPrices(prices);
    };
    load();
  }, []);

  return (
    <section id="sluzby" className="relative bg-white">
      {/* Mobile verze */}
      <div className="lg:hidden">
        <div className="py-16 px-6 md:px-12 text-center bg-white">
          <span className="text-stone-600 uppercase tracking-widest text-sm md:text-xs mb-3 block font-geist font-medium">Naše péče</span>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight font-cormorant text-stone-900">Služby</h2>
        </div>
        <div className="px-6 md:px-12 space-y-4 pb-4">
          <MobileServiceCards services={services} prices={prices} onOpenServiceDetail={onOpenServiceDetail} />
        </div>
        <div className="py-16 px-6 md:px-12 text-center bg-white">
          <button onClick={onOpenPriceList} className="inline-block border-b border-stone-900 text-stone-900 pb-1 font-geist text-sm uppercase tracking-widest hover:text-stone-600 hover:border-stone-600 transition-colors">
            Zobrazit ceník
          </button>
        </div>
      </div>

      {/* Desktop verze */}
      <div className="hidden lg:flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 py-40 md:py-48 px-6 md:px-12 lg:pl-24 xl:pl-32 z-10 bg-white">
          <div className="mb-32">
            <span className="text-stone-600 uppercase tracking-widest text-sm md:text-xs mb-3 block font-geist font-medium">Naše péče</span>
            <h2 className="text-2xl md:text-3xl font-medium tracking-tight font-cormorant text-stone-700">Služby</h2>
          </div>
          <div className="space-y-16 md:space-y-20" id="servicesList">
            {services.map((service, index) => (
              <div
                key={service.service_id}
                className="service-item group cursor-pointer"
                data-service-index={index}
                data-image-id={`img-${service.service_id}`}
                onClick={() => onOpenServiceDetail(service.service_id)}
              >
                <h3 className="text-5xl md:text-6xl lg:text-7xl font-medium font-cormorant text-stone-200 group-hover:text-stone-900 transition-colors duration-500">
                  {service.category_name}
                </h3>
              </div>
            ))}
          </div>
          <div className="mt-32 md:mt-40">
            <button onClick={onOpenPriceList} className="inline-block border-b border-stone-900 text-stone-900 pb-1 font-geist text-sm uppercase tracking-widest hover:text-stone-600 hover:border-stone-600 transition-colors">
              Zobrazit ceník
            </button>
          </div>
        </div>

        <div className="hidden lg:flex w-1/2 h-screen sticky top-0 items-center justify-center pointer-events-none">
          <div id="serviceImageCard" className="relative w-[460px] aspect-[3/4] overflow-hidden shadow-2xl bg-stone-100 will-change-transform">
            <ServiceImages services={services} />
          </div>
        </div>
      </div>
    </section>
  );
}