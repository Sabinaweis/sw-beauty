'use client';

import { createContext, useContext } from 'react';

type ModalType = 'gift-card' | 'booking' | 'price-list' | 'service-detail' | null;

interface ModalContextType {
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within ModalProvider');
  return context;
};