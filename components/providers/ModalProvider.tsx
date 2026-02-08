'use client';

import { useState, ReactNode, lazy, Suspense } from 'react';
import { ModalContext, useModal } from './ModalContext';

const GiftCardModal = lazy(() => import('../modals/GiftCardModal'));
const BookingModal = lazy(() => import('../modals/BookingModal'));
const PriceListModal = lazy(() => import('../modals/PriceListModal'));
const ServiceDetailModal = lazy(() => import('../modals/ServiceDetailModal'));

type ModalType = 'gift-card' | 'booking' | 'price-list' | 'service-detail' | null;

export default function ModalProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [modalData, setModalData] = useState<any>(null);

  const openModal = (type: ModalType, data?: any) => {
    setActiveModal(type);
    setModalData(data);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Suspense fallback={<div className="fixed inset-0 bg-black/50 z-50" />}>
        {activeModal === 'gift-card' && <GiftCardModal />}
        {activeModal === 'booking' && <BookingModal initialData={modalData} />}
        {activeModal === 'price-list' && <PriceListModal onClose={closeModal} />}
        {activeModal === 'service-detail' && <ServiceDetailModal serviceId={modalData?.serviceId} onClose={closeModal} />}
      </Suspense>
    </ModalContext.Provider>
  );
}

export { useModal };