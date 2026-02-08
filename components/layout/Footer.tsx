'use client';

import Link from 'next/link';
import Image from 'next/image';
import NewsletterForm from '../ui/NewsletterForm';
import { useModal } from '../providers/ModalProvider';

export default function Footer() {
  const { openModal } = useModal();

  return (
    <footer className="overflow-hidden text-stone-900 border-stone-100 border-t pt-24 pb-6 md:pb-16 lg:pb-6 relative">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24 md:mb-48">
          <div className="md:col-span-1">
            <h3 className="font-cormorant text-2xl md:text-3xl mb-6 text-stone-900">Navigace</h3>
            <ul className="space-y-3 font-geist text-stone-700 font-normal text-sm tracking-wide">
              <li><Link href="#sluzby" className="hover:text-stone-900 transition-colors py-1">Služby</Link></li>
              <li><button onClick={() => openModal('price-list')} className="hover:text-stone-900 transition-colors py-1">Ceník</button></li>
              <li><Link href="#poukazy" className="hover:text-stone-900 transition-colors py-1">Dárkové poukazy</Link></li>
              <li><Link href="#galerie" className="hover:text-stone-900 transition-colors py-1">Galerie</Link></li>
              <li><Link href="#kontakt" className="hover:text-stone-900 transition-colors py-1">Kontakt</Link></li>
            </ul>
          </div>

          <div className="md:col-span-1" id="kontakt">
            <h3 className="font-cormorant text-2xl md:text-3xl mb-6 text-stone-900">Kontakt</h3>
            <div className="space-y-3 font-geist text-stone-700 font-normal text-sm tracking-wide">
              <p className="font-semibold text-stone-800">SW Beauty s.r.o.</p>
              <p>U Cihelny 1326/4<br />695 01 Hodonín</p>
              <p><Link href="mailto:info@swbeauty.cz" className="hover:text-stone-900 transition-colors">info@swbeauty.cz</Link></p>
              <p><Link href="tel:+420776632498" className="hover:text-stone-900 transition-colors">+420 776 632 498</Link></p>
              <p className="text-xs text-stone-600 mt-4">Otevírací doba: na objednávku</p>
            </div>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-cormorant text-2xl md:text-3xl mb-6 text-stone-900">Sociální sítě</h3>
            <ul className="space-y-3 font-geist text-stone-700 font-normal text-sm tracking-wide">
              <li><Link href="https://instagram.com/swbeautysalons" className="hover:text-stone-900 transition-colors">Instagram</Link></li>
              <li><Link href="https://www.facebook.com/p/SW-Beauty-kosmetick%C3%BD-salon-Hodon%C3%ADn-61564161444740/" target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 transition-colors">Facebook</Link></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-cormorant text-2xl md:text-3xl mb-6 text-stone-900">Newsletter</h3>
            <p className="text-stone-700 font-geist font-normal text-sm mb-4">
              Přihlaste se k odběru a získejte exkluzivní tipy.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-end justify-between border-t border-stone-200 pt-8 md:pt-0 md:border-none">
          <div className="order-2 md:order-1 mt-12 md:mt-0 self-start md:self-end">
            <p className="text-xs text-stone-600 font-geist tracking-widest uppercase">© {new Date().getFullYear()} SW Beauty. Všechna práva vyhrazena.</p>
          </div>
          <div className="order-1 md:order-2 w-full md:w-auto flex justify-center md:justify-end">
            <Image src="/logo.svg" alt="SW Beauty" width={200} height={80} className="h-24 md:h-40 lg:h-48 w-auto opacity-20" />
          </div>
        </div>
      </div>
    </footer>
  );
}
