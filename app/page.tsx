'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import AnimationProvider from '@/components/providers/AnimationProvider';
import { useModal } from '@/components/providers/ModalContext';
import LoadingScreen from '@/components/ui/LoadingScreen';
const Navbar = dynamic(() => import('@/components/layout/Navbar'), { ssr: true });
const HeroSection = dynamic(() => import('@/components/sections/HeroSection'), { ssr: true });
const ServicesSection = dynamic(() => import('@/components/sections/ServicesSection'));
const PhilosophySection = dynamic(() => import('@/components/sections/PhilosophySection'));
const FounderSection = dynamic(() => import('@/components/sections/FounderSection'));
const FAQSection = dynamic(() => import('@/components/sections/FAQSection'));
const GallerySection = dynamic(() => import('@/components/sections/GallerySection'));
const GiftCardsSection = dynamic(() => import('@/components/sections/GiftCardsSection'));
const ReviewsSection = dynamic(() => import('@/components/sections/ReviewsSection'));
const InstagramSection = dynamic(() => import('@/components/sections/InstagramSection'));
const Footer = dynamic(() => import('@/components/layout/Footer'));

// Dynamic import for ModalProvider to reduce initial bundle
const ModalProvider = dynamic(() => import('@/components/providers/ModalProvider'), {
  ssr: false,
});

function HomeContent() {
  const { openModal } = useModal();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    (window as any).isModalOpen = isModalOpen;
  }, [isModalOpen]);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection onOpenBooking={() => { setIsModalOpen(true); openModal('booking'); }} />
        <ServicesSection
          onOpenPriceList={() => { setIsModalOpen(true); openModal('price-list'); }}
          onOpenServiceDetail={(id) => { setIsModalOpen(true); openModal('service-detail', { serviceId: id }); }}
        />
        <PhilosophySection />
        <FounderSection />
        <FAQSection />
        <GallerySection />
        <GiftCardsSection onOpenGiftCard={() => { setIsModalOpen(true); openModal('gift-card'); }} />
        <ReviewsSection />
        <InstagramSection />
      </main>
      <Footer />
    </>
  );
}

export default function HomePage() {
  return (
    <AnimationProvider>
      <ModalProvider>
        <LoadingScreen />
        <HomeContent />
      </ModalProvider>
    </AnimationProvider>
  );
}