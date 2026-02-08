'use client';

import Image from 'next/image';
import { Service, Price, getImageUrl } from '@/lib/data';

interface Props {
  services: Service[];
  prices: Price[];
  onOpenServiceDetail: (id: string) => void;
}

export default function MobileServiceCards({ services, prices, onOpenServiceDetail }: Props) {
  return (
    <div className="space-y-4">
      {services.map((service) => {
        const images = service.image.split(';').filter(img => img.trim());
        const firstImage = images[0] || '';
        const servicePrices = prices.filter(p => p.service_id === service.service_id);
        const lowestPrice = servicePrices.length > 0
          ? Math.min(...servicePrices.map(p => parseInt(p.price_in_czk)))
          : null;

        return (
          <div
            key={service.service_id}
            className="relative w-full h-80 overflow-hidden group cursor-pointer bg-stone-100"
            onClick={() => onOpenServiceDetail(service.service_id)}
          >
            <Image
              src={getImageUrl(firstImage)}
              alt={service.category_name}
              fill
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
              <h3 className="text-4xl md:text-5xl font-medium font-cormorant text-white mb-3 drop-shadow-lg">
                {service.category_name}
              </h3>
              <div className="flex items-end justify-between">
                {lowestPrice && (
                  <span className="text-xs md:text-sm uppercase tracking-widest font-geist text-white/80">
                    od {lowestPrice} Kč
                  </span>
                )}
                <span className="flex items-center gap-2 text-xs md:text-sm uppercase tracking-widest font-geist text-white group-hover:gap-3 transition-all">
                  Zobrazit detail
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}