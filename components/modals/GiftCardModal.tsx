'use client';

import { useState, useEffect } from 'react';
import { useModal } from '../providers/ModalContext';
import { Service, Price, loadData } from '@/lib/data';
import Image from 'next/image';
import PhoneInput from '../ui/PhoneInput';

interface FormData {
  voucherType: 'cash' | 'service';
  amount: number;
  selectedService: Service | null;
  selectedPackage: Price | null;
  recipientName: string;
  dedication: string;
  giftMessage: string;
  buyerEmail: string;
  buyerPhone: string;
  paymentMethod: 'transfer' | 'cash';
}

// Live voucher preview component
function VoucherPreview({ formData }: { formData: FormData }) {
  // Pro proceduru zobrazujeme jen kategorii služby, ne celý název balíčku
  const voucherValue = formData.voucherType === 'cash'
    ? `${formData.amount.toLocaleString()} Kč`
    : formData.selectedService?.category_name || '—';

  const validUntil = new Date();
  validUntil.setFullYear(validUntil.getFullYear() + 1);
  const formattedDate = validUntil.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="bg-stone-100 p-4 lg:p-6 flex items-center justify-center w-full h-full">
      <div className="bg-white w-full max-w-[280px] lg:max-w-[320px] shadow-lg relative overflow-visible scale-90 lg:scale-100">
        {/* Decorative corners */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-stone-300" />
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-stone-300" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-stone-300" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-stone-300" />

        {/* Content */}
        <div className="flex flex-col items-center justify-between px-6 py-6 text-center">
          {/* Logo */}
          <div className="mb-3">
            <Image
              src="/logo.svg"
              alt="SW Beauty"
              width={60}
              height={60}
              className="h-10 w-auto opacity-80"
            />
          </div>

          {/* Title */}
          <span className="text-[9px] uppercase tracking-[0.2em] text-stone-400 font-geist mb-3">
            Dárkový poukaz
          </span>

          {/* Divider */}
          <div className="w-12 h-px bg-stone-300 mb-4" />

          {/* For label + Recipient Name */}
          <span className="text-[9px] uppercase tracking-[0.2em] text-stone-400 font-geist">
            Pro
          </span>
          <h2 className="text-xl lg:text-2xl font-cormorant font-medium text-stone-900 mb-2 tracking-tight min-h-[1.5em]">
            {formData.recipientName || 'Jméno příjemce'}
          </h2>

          {/* Message */}
          {formData.giftMessage && (
            <p className="text-stone-500 font-geist font-light italic text-[10px] max-w-[90%] mb-3">
              „{formData.giftMessage}"
            </p>
          )}

          {/* Value */}
          <div className="mt-3 pt-4 border-t border-stone-200 w-full">
            <span className="text-[9px] uppercase tracking-[0.2em] text-stone-400 font-geist block mb-2">
              {formData.voucherType === 'cash' ? 'V hodnotě' : 'Na proceduru'}
            </span>
            <span className="text-lg lg:text-xl font-cormorant font-medium text-stone-900 leading-tight block px-2">
              {voucherValue}
            </span>
          </div>

          {/* Validity */}
          <div className="mt-4 pt-3">
            <span className="text-[8px] text-stone-400 font-geist">
              Platnost do {formattedDate} · swbeauty.cz
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GiftCardModal() {
  const { closeModal } = useModal();
  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [prices, setPrices] = useState<Price[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    voucherType: 'cash',
    amount: 2000,
    selectedService: null,
    selectedPackage: null,
    recipientName: '',
    dedication: '',
    giftMessage: '',
    buyerEmail: '',
    buyerPhone: '',
    paymentMethod: 'transfer',
  });

  useEffect(() => {
    const load = async () => {
      const { services, prices } = await loadData();
      setServices(services);
      setPrices(prices);
    };
    load();

    // Lock body scroll (better iOS support)
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

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const servicePrices = formData.selectedService
    ? prices.filter(p => p.service_id === formData.selectedService!.service_id)
    : [];

  const handleSubmit = async () => {
    if (!termsAccepted) {
      alert('Prosím potvrďte podmínky');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/voucher-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: formData.recipientName,
          recipientEmail: formData.buyerEmail,
          recipientPhone: formData.buyerPhone,
          message: formData.giftMessage,
          voucherType: formData.voucherType,
          amount: formData.voucherType === 'cash' ? formData.amount.toString() : undefined,
          service: formData.voucherType === 'service' ? formData.selectedService?.category_name : undefined,
          packageName: formData.voucherType === 'service' ? formData.selectedPackage?.name : undefined,
          paymentMethod: formData.paymentMethod,
        }),
      });
      if (res.ok) {
        alert('Objednávka odeslána! Brzy vás budeme kontaktovat.');
        closeModal();
      }
    } catch (error) {
      alert('Chyba při odesílání. Zkuste to prosím znovu.');
    }
    setIsSubmitting(false);
  };

  const steps = ['Typ', 'Údaje', 'Platba'];

  const canProceed = () => {
    if (currentStep === 1) {
      return formData.voucherType === 'cash' || (formData.voucherType === 'service' && formData.selectedPackage);
    }
    if (currentStep === 2) {
      return formData.recipientName.trim() && formData.buyerEmail.trim() && formData.buyerPhone.trim();
    }
    return true;
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center md:p-4 isolate"
      onClick={closeModal}
    >
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" />

      <div
        className="bg-white w-full h-full md:h-auto md:max-w-4xl md:max-h-[90vh] shadow-2xl relative animate-fade-in-up overflow-hidden flex flex-col lg:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Desktop: Voucher Preview (left side) */}
        <div className="hidden lg:flex lg:w-1/2 bg-stone-100 border-r border-stone-200">
          <VoucherPreview formData={formData} />
        </div>

        {/* Mobile: Toggle preview button */}
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="lg:hidden flex items-center justify-center gap-2 py-3 bg-stone-100 text-stone-600 text-xs md:text-sm font-geist border-b border-stone-200 min-h-[44px]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          {showPreview ? 'Skrýt náhled' : 'Zobrazit náhled poukazu'}
        </button>

        {/* Mobile: Collapsible preview */}
        {showPreview && (
          <div className="lg:hidden border-b border-stone-200">
            <VoucherPreview formData={formData} />
          </div>
        )}

        {/* Form section */}
        <div className="flex-1 flex flex-col lg:w-1/2">
          {/* Header */}
          <div className="flex-shrink-0 px-4 py-4 md:px-6 md:py-6 md:pb-4 border-b border-stone-100">
            <div className="flex justify-between items-start mb-3 md:mb-4">
              <h2 className="text-lg md:text-xl font-cormorant text-stone-900">Dárkový poukaz</h2>
              <button
                onClick={closeModal}
                className="text-stone-400 hover:text-stone-900 transition-colors p-1 -m-1"
                aria-label="Zavřít"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            {/* Progress bar with labels */}
            <div className="flex gap-1 md:gap-2">
              {steps.map((step, i) => (
                <div key={i} className="flex-1 flex flex-col gap-1">
                  <div className={`h-1 w-full transition-colors ${i < currentStep ? 'bg-stone-900' : 'bg-stone-200'}`} />
                  <div className={`text-[10px] md:text-xs uppercase tracking-wider font-geist transition-colors ${i < currentStep ? 'text-stone-900' : 'text-stone-400'}`}>
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div
            className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 md:p-6 touch-pan-y"
            style={{ WebkitOverflowScrolling: 'touch' }}
            data-lenis-prevent
          >

            {/* Step 1: Typ poukazu */}
            {currentStep === 1 && (
              <div>
                <p className="text-xs md:text-sm text-stone-500 text-center mb-4 md:mb-6 font-geist">Vyberte typ dárkového poukazu</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-6">
                  <button
                    onClick={() => updateFormData('voucherType', 'cash')}
                    className={`p-4 text-left border transition-all min-h-[80px] ${formData.voucherType === 'cash' ? 'border-stone-900 bg-stone-50' : 'border-stone-200 hover:border-stone-400 active:border-stone-900'}`}
                  >
                    <div className="font-medium text-stone-900 mb-1">💎 Na částku</div>
                    <div className="text-xs text-stone-500">Obdarovaný si vybere sám</div>
                  </button>
                  <button
                    onClick={() => updateFormData('voucherType', 'service')}
                    className={`p-4 text-left border transition-all min-h-[80px] ${formData.voucherType === 'service' ? 'border-stone-900 bg-stone-50' : 'border-stone-200 hover:border-stone-400 active:border-stone-900'}`}
                  >
                    <div className="font-medium text-stone-900 mb-1">✨ Na službu</div>
                    <div className="text-xs text-stone-500">Konkrétní procedura</div>
                  </button>
                </div>

                {/* Cash amount */}
                {formData.voucherType === 'cash' && (
                  <div className="p-4 bg-stone-50 border border-stone-200">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-stone-600 font-geist">Hodnota poukazu</span>
                      <span className="text-lg font-medium text-stone-900">{formData.amount.toLocaleString()} Kč</span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="20000"
                      step="500"
                      value={formData.amount}
                      onChange={(e) => updateFormData('amount', parseInt(e.target.value))}
                      className="w-full accent-stone-900"
                    />
                    <div className="flex justify-between text-xs text-stone-400 mt-1">
                      <span>1 000 Kč</span>
                      <span>20 000 Kč</span>
                    </div>
                  </div>
                )}

                {/* Service selection */}
                {formData.voucherType === 'service' && (
                  <div className="space-y-4">
                    {/* Pokud není vybraná služba, zobrazíme grid služeb */}
                    {!formData.selectedService && (
                      <>
                        <h3 className="text-sm font-medium text-stone-700 mb-3">Vyberte službu</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {services.map(service => {
                            const svcPrices = prices.filter(p => p.service_id === service.service_id);
                            const minPrice = svcPrices.length > 0 ? Math.min(...svcPrices.map(p => parseInt(p.price_in_czk))) : null;

                            return (
                              <button
                                key={service.service_id}
                                onClick={() => { updateFormData('selectedService', service); updateFormData('selectedPackage', null); }}
                                className="p-3 text-left border transition-all border-stone-200 hover:border-stone-400"
                              >
                                <div className="font-medium text-stone-900 text-sm">{service.category_name}</div>
                                {minPrice && <div className="text-xs text-stone-500">od {minPrice.toLocaleString()} Kč</div>}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}

                    {/* Pokud je vybraná služba, zobrazíme jen balíčky */}
                    {formData.selectedService && (
                      <>
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-sm font-medium text-stone-700">{formData.selectedService.category_name}</h3>
                          <button
                            onClick={() => { updateFormData('selectedService', null); updateFormData('selectedPackage', null); }}
                            className="text-xs text-stone-500 hover:text-stone-900 font-geist uppercase tracking-wider"
                          >
                            ← Změnit službu
                          </button>
                        </div>
                        <div className="space-y-2">
                          {servicePrices.map(pkg => {
                            const isSelected = formData.selectedPackage?.name === pkg.name;
                            return (
                              <button
                                key={pkg.name}
                                onClick={() => updateFormData('selectedPackage', pkg)}
                                className={`w-full p-3 border flex justify-between items-center transition-all cursor-pointer hover:border-stone-400 text-left ${isSelected ? 'border-stone-900 bg-stone-50' : 'border-stone-200'}`}
                              >
                                <div className="flex-1 min-w-0 pr-3">
                                  <span className="text-stone-900 text-sm">{pkg.name}</span>
                                  {pkg.duration_in_minutes && <span className="text-stone-400 text-xs ml-2">({pkg.duration_in_minutes} min)</span>}
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                  <span className="text-stone-900 font-medium text-sm whitespace-nowrap">{parseInt(pkg.price_in_czk).toLocaleString()} Kč</span>
                                  <span
                                    className={`text-xs uppercase tracking-wider font-geist whitespace-nowrap ${isSelected ? 'text-stone-900 font-medium' : 'text-stone-500'}`}
                                  >
                                    {isSelected ? '✓' : 'Vybrat'}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Údaje */}
            {currentStep === 2 && (
              <div>
                <p className="text-sm text-stone-500 text-center mb-6 font-geist">Vyplňte údaje pro obdarovaného</p>
                <h3 className="text-lg font-medium text-stone-900 mb-4">Osobní údaje</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2 font-geist">Jméno obdarovaného *</label>
                    <input
                      type="text"
                      value={formData.recipientName}
                      onChange={(e) => updateFormData('recipientName', e.target.value)}
                      placeholder="Např. Jana Nováková"
                      className="w-full p-3 border border-stone-200 font-geist focus:outline-none focus:border-stone-900 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2 font-geist">Krátké věnování</label>
                    <input
                      type="text"
                      value={formData.giftMessage}
                      onChange={(e) => updateFormData('giftMessage', e.target.value.slice(0, 60))}
                      placeholder="Všechno nejlepší..."
                      maxLength={60}
                      className="w-full p-3 border border-stone-200 font-geist focus:outline-none focus:border-stone-900 transition-colors"
                    />
                    <div className="text-right text-xs text-stone-400 mt-1">{formData.giftMessage.length}/60</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2 font-geist">Váš email *</label>
                      <input
                        type="email"
                        value={formData.buyerEmail}
                        onChange={(e) => updateFormData('buyerEmail', e.target.value)}
                        placeholder="vas@email.cz"
                        className="w-full p-3 border border-stone-200 font-geist focus:outline-none focus:border-stone-900 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2 font-geist">Váš telefon *</label>
                      <PhoneInput
                        value={formData.buyerPhone}
                        onChange={(val) => updateFormData('buyerPhone', val)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Platba */}
            {currentStep === 3 && (
              <div>
                <p className="text-sm text-stone-500 text-center mb-6 font-geist">Vyberte způsob platby</p>
                <h3 className="text-lg font-medium text-stone-900 mb-4">Způsob platby</h3>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    onClick={() => updateFormData('paymentMethod', 'transfer')}
                    className={`p-4 text-left border transition-all ${formData.paymentMethod === 'transfer' ? 'border-stone-900 bg-stone-50' : 'border-stone-200 hover:border-stone-400'}`}
                  >
                    <div className="font-medium text-stone-900 mb-1">🏦 Bankovní převod</div>
                    <div className="text-xs text-stone-500">Platbu pošlete na účet</div>
                  </button>
                  <button
                    onClick={() => updateFormData('paymentMethod', 'cash')}
                    className={`p-4 text-left border transition-all ${formData.paymentMethod === 'cash' ? 'border-stone-900 bg-stone-50' : 'border-stone-200 hover:border-stone-400'}`}
                  >
                    <div className="font-medium text-stone-900 mb-1">💵 Hotově v salonu</div>
                    <div className="text-xs text-stone-500">Zaplatíte při vyzvednutí</div>
                  </button>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 mb-4">
                  <p className="text-sm text-amber-800 font-geist">
                    {formData.paymentMethod === 'transfer'
                      ? 'Poukaz vám zašleme po připsání platby na náš účet.'
                      : 'Poukaz si vyzvednete a zaplatíte přímo v salonu.'}
                  </p>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-stone-900"
                  />
                  <span className="text-xs font-geist text-stone-600">
                    Souhlasím s podmínkami poukazu (platnost 12 měsíců)
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="flex-shrink-0 px-4 py-3 md:px-6 md:py-4 border-t border-stone-100 flex justify-between items-center bg-white"
            style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0.75rem))" }}
          >
            {currentStep > 1 ? (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="text-xs md:text-sm text-stone-500 hover:text-stone-900 active:text-stone-900 font-geist uppercase tracking-wider py-2 px-3 -ml-3 min-h-[44px] flex items-center"
              >
                ← Zpět
              </button>
            ) : <div />}

            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!canProceed()}
                className="px-6 py-3 min-h-[44px] bg-stone-900 text-white font-geist uppercase tracking-wider text-xs md:text-sm hover:bg-stone-800 active:bg-stone-800 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed"
              >
                Pokračovat
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!termsAccepted || isSubmitting}
                className="px-6 py-3 min-h-[44px] bg-stone-900 text-white font-geist uppercase tracking-wider text-xs md:text-sm hover:bg-stone-800 active:bg-stone-800 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Odesílám...' : 'Odeslat objednávku'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}