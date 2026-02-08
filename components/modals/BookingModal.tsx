'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { useModal } from '../providers/ModalProvider';
import { Service, Price, loadData } from '@/lib/data';
import PhoneInput from '../ui/PhoneInput';
import { Calendar } from '@/components/ui/calendar';

interface BookingModalProps {
  initialData?: {
    serviceId?: string;
    packageName?: string;
    price?: string;
  };
}

export default function BookingModal({ initialData }: BookingModalProps) {
  const { closeModal } = useModal();
  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [prices, setPrices] = useState<Price[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Price | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    const load = async () => {
      const { services, prices } = await loadData();
      setServices(services);
      setPrices(prices);

      // Pokud přicházíme z ServiceDetailModal s předvybranými daty
      if (initialData?.serviceId && initialData?.packageName && !isInitialized) {
        const foundService = services.find(s => s.service_id === initialData.serviceId);
        const foundPackage = prices.find(p =>
          p.service_id === initialData.serviceId && p.name === initialData.packageName
        );

        if (foundService && foundPackage) {
          setSelectedService(foundService);
          setSelectedPackage(foundPackage);
          setCurrentStep(3); // Přeskočit na výběr termínu
        }
        setIsInitialized(true);
      }
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
  }, [initialData, isInitialized]);

  const getTomorrowDate = (): Date => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/booking-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: selectedService?.category_name,
          packageName: selectedPackage?.name,
          date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
          time: selectedTime,
          name,
          email,
          phone,
          note
        }),
      });
      if (res.ok) {
        alert('Rezervace odeslána! Brzy vám zavoláme s potvrzením.');
        closeModal();
      } else {
        const data = await res.json();
        alert(data.error || 'Chyba při odesílání rezervace. Zkuste to prosím znovu.');
      }
    } catch (error) {
      alert('Chyba při odesílání rezervace. Zkuste to prosím znovu.');
    }
  };

  const servicePrices = selectedService
    ? prices.filter(p => p.service_id === selectedService.service_id)
    : [];

  const steps = ['Služba', 'Balíček', 'Termín', 'Kontakt'];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center md:p-4 isolate"
      onClick={closeModal}
    >
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" />

      <div
        className="bg-white w-full h-full md:h-auto md:max-w-2xl md:max-h-[90vh] shadow-2xl relative animate-fade-in-up overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-4 py-4 md:px-6 md:py-6 md:pb-4 border-b border-stone-100">
          <div className="flex justify-between items-start mb-3 md:mb-4">
            <h2 className="text-lg md:text-xl font-cormorant text-stone-900">Rezervace termínu</h2>
            <button
              onClick={closeModal}
              className="text-stone-600 hover:text-stone-900 transition-colors p-4 -m-4"
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
                <div className={`text-[10px] md:text-xs uppercase tracking-wider font-geist transition-colors ${i < currentStep ? 'text-stone-900 font-semibold' : 'text-stone-600'}`}>
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

          {/* Step 1: Služby */}
          {currentStep === 1 && (
            <div>
              <p className="text-xs md:text-sm text-stone-700 text-center mb-4 md:mb-6 font-geist font-medium">Vyberte si službu, která odpovídá vašim požadavkům</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                {services.map(service => {
                  const svcPrices = prices.filter(p => p.service_id === service.service_id);
                  const minPrice = svcPrices.length > 0 ? Math.min(...svcPrices.map(p => parseInt(p.price_in_czk))) : null;
                  const isSelected = selectedService?.service_id === service.service_id;

                  return (
                    <button
                      key={service.service_id}
                      onClick={() => setSelectedService(service)}
                      className={`p-4 md:p-4 text-left border transition-all min-h-[80px] ${isSelected ? 'border-stone-900 bg-stone-50' : 'border-stone-200 hover:border-stone-400 active:border-stone-900'}`}
                    >
                      <div className="font-medium text-stone-900 mb-1 text-base md:text-base">{service.category_name}</div>
                      <div className="text-xs text-stone-600 font-medium mb-2 line-clamp-2">{service.short_description}</div>
                      {minPrice && <div className="text-xs text-stone-700 font-semibold">od {minPrice.toLocaleString()} Kč</div>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Balíčky */}
          {currentStep === 2 && selectedService && (
            <div>
              <p className="text-xs md:text-sm text-stone-700 text-center mb-4 md:mb-6 font-geist font-medium">Vyberte balíček, který vám vyhovuje</p>
              <div className="flex justify-between items-center mb-3 md:mb-4 pb-3 md:pb-4 border-b border-stone-200">
                <h3 className="text-base md:text-lg font-medium text-stone-900">{selectedService.category_name}</h3>
                <button
                  onClick={() => { setSelectedService(null); setSelectedPackage(null); setCurrentStep(1); }}
                  className="text-[10px] md:text-xs text-stone-600 hover:text-stone-900 font-geist uppercase tracking-wider font-semibold p-2 -m-2"
                >
                  ← Změnit
                </button>
              </div>
              <div className="space-y-2">
                {servicePrices.map(pkg => {
                  const isSelected = selectedPackage?.name === pkg.name;
                  return (
                    <button
                      key={pkg.name}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`w-full p-3 md:p-4 border transition-all cursor-pointer active:border-stone-900 text-left min-h-[60px] ${isSelected ? 'border-stone-900 bg-stone-50' : 'border-stone-200 hover:border-stone-400'}`}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-stone-900 font-medium mb-0.5">{pkg.name}</div>
                          {pkg.duration_in_minutes && (
                            <div className="text-stone-600 text-xs font-medium">({pkg.duration_in_minutes} min)</div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span className="text-stone-900 font-medium whitespace-nowrap">{parseInt(pkg.price_in_czk).toLocaleString()} Kč</span>
                          {isSelected && (
                            <span className="text-[10px] uppercase tracking-wider font-geist text-stone-900">✓ Vybráno</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Termín */}
          {currentStep === 3 && (
            <div>
              {/* Kompaktní shrnutí vybrané služby */}
              {selectedService && selectedPackage && (
                <div className="mb-3 md:mb-4 pb-3 md:pb-4 border-b border-stone-200 flex justify-between items-center">
                  <div className="text-xs md:text-sm text-stone-700 font-geist font-medium">
                    {selectedPackage.name}
                    {selectedPackage.duration_in_minutes && <span className="text-stone-600"> ({selectedPackage.duration_in_minutes} min)</span>}
                  </div>
                  <div className="text-sm md:text-sm font-medium text-stone-900">{parseInt(selectedPackage.price_in_czk).toLocaleString()} Kč</div>
                </div>
              )}

              {/* Kalendář a časy - stack na mobilu, side-by-side na tabletu */}
              <div className="flex flex-col md:flex-row gap-4">
                {/* Kalendář */}
                <div className="flex justify-center md:flex-shrink-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < getTomorrowDate()}
                    locale={cs}
                    className="border border-stone-200 !p-2 [--cell-size:2.25rem] md:[--cell-size:1.75rem]"
                  />
                </div>

                {/* Časy */}
                <div className="flex-1 flex flex-col">
                  <label className="block text-xs uppercase tracking-widest text-stone-600 mb-2 font-geist text-center md:text-left font-semibold">Čas</label>
                  <div className="grid grid-cols-3 md:grid-cols-2 gap-2 md:gap-1.5 flex-1 content-start">
                    {times.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 md:py-2 border text-sm font-geist transition-all min-h-[44px] md:min-h-0 ${selectedTime === time
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'border-stone-200 hover:border-stone-900 active:border-stone-900 text-stone-900'
                          }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Kontakt */}
          {currentStep === 4 && (
            <div>
              <p className="text-sm text-stone-700 text-center mb-6 font-geist font-medium">Zanechte nám prosím své kontaktní údaje</p>
              <h3 className="text-lg font-medium text-stone-900 mb-4">Kontaktní údaje</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-600 mb-2 font-geist font-semibold">Jméno a příjmení</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jana Nováková"
                    className="w-full p-3 border border-stone-300 text-stone-900 font-geist focus:outline-none focus:border-stone-900 transition-colors placeholder:text-stone-400"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-600 mb-2 font-geist font-semibold">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jana@example.com"
                    className="w-full p-3 border border-stone-300 text-stone-900 font-geist focus:outline-none focus:border-stone-900 transition-colors placeholder:text-stone-400"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-600 mb-2 font-geist font-semibold">Telefon</label>
                  <PhoneInput
                    value={phone}
                    onChange={setPhone}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-600 mb-2 font-geist font-semibold">Poznámka (volitelné)</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-stone-300 text-stone-900 font-geist focus:outline-none focus:border-stone-900 transition-colors resize-none placeholder:text-stone-400"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer - sticky na mobilu */}
        <div
          className="flex-shrink-0 px-4 py-3 md:px-6 md:py-4 border-t border-stone-100 flex justify-between items-center bg-white"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0.75rem))" }}
        >
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="text-xs md:text-sm text-stone-700 hover:text-stone-900 active:text-stone-900 font-geist uppercase tracking-wider font-semibold py-2 px-3 -ml-3 min-h-[44px] flex items-center"
            >
              ← Zpět
            </button>
          ) : <div />}

          {currentStep < 4 ? (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={
                (currentStep === 1 && !selectedService) ||
                (currentStep === 2 && !selectedPackage) ||
                (currentStep === 3 && (!selectedDate || !selectedTime))
              }
              className="px-6 md:px-6 py-3 md:py-3 min-h-[44px] bg-stone-900 text-white font-geist uppercase tracking-wider text-xs md:text-sm hover:bg-stone-800 active:bg-stone-800 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed"
            >
              Pokračovat
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!name || !email || !phone}
              className="px-6 md:px-6 py-3 md:py-3 min-h-[44px] bg-stone-900 text-white font-geist uppercase tracking-wider text-xs md:text-sm hover:bg-stone-800 active:bg-stone-800 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed"
            >
              Odeslat rezervaci
            </button>
          )}
        </div>
      </div>
    </div>
  );
}