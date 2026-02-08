'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getImageUrl, Service } from '@/lib/data';

interface ServiceImagesProps {
  services: Service[];
}

export default function ServiceImages({ services }: ServiceImagesProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let throttleTimer: NodeJS.Timeout | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if ((window as any).isModalOpen) return;
      if (throttleTimer) return;

      throttleTimer = setTimeout(() => {
        throttleTimer = null;
      }, 16);

      const serviceItems = document.querySelectorAll('#servicesList .service-item');
      const mouseY = e.clientY;
      let targetIndex = 0;
      let minDistance = Infinity;

      serviceItems.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const itemCenterY = rect.top + rect.height / 2;
        const distance = Math.abs(mouseY - itemCenterY);

        if (distance < minDistance) {
          minDistance = distance;
          targetIndex = index;
        }
      });

      if (targetIndex !== activeIndex) {
        setActiveIndex(targetIndex);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [activeIndex]);

  return (
    <div id="serviceImages" className="w-full h-full relative">
      {services.map((service, index) => {
        const images = service.image.split(';');
        const firstImage = images[0];
        const imageId = `img-${service.service_id}`;

        return (
          <Image
            key={imageId}
            id={imageId}
            src={getImageUrl(firstImage)}
            alt={service.category_name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={`object-cover transition-opacity duration-700 ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
            priority={index === 0}
            loading={index === 0 ? 'eager' : 'lazy'}
            quality={85}
          />
        );
      })}
      <div className="absolute inset-0 bg-stone-900/5 pointer-events-none"></div>
    </div>
  );
}