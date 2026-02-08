'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Image from 'next/image';

function VoucherContent() {
    const searchParams = useSearchParams();

    const name = searchParams.get('name') || 'Jméno příjemce';
    const type = searchParams.get('type') || 'cash';
    const amount = searchParams.get('amount') || '';
    const service = searchParams.get('service') || '';
    const message = searchParams.get('message') || '';

    const voucherValue = type === 'cash' ? `${parseInt(amount).toLocaleString()} Kč` : service;
    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + 1);
    const formattedDate = validUntil.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4 md:p-8 voucher-page">
            {/* Print button - hidden when printing */}
            <div className="fixed top-6 right-6 no-print flex gap-3">
                <button
                    onClick={() => window.print()}
                    className="bg-stone-900 text-white px-6 py-3 font-geist text-sm uppercase tracking-widest hover:bg-stone-800 transition-colors flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 6 2 18 2 18 9" />
                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                        <rect width="12" height="8" x="6" y="14" />
                    </svg>
                    Vytisknout
                </button>
            </div>

            {/* Voucher Card */}
            <div className="bg-white w-full max-w-2xl aspect-[3/2] shadow-2xl voucher-card-print relative overflow-hidden">
                {/* Decorative corners */}
                <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-stone-300" />
                <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-stone-300" />
                <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-stone-300" />
                <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-stone-300" />

                {/* Content */}
                <div className="h-full flex flex-col items-center justify-center px-12 py-10 text-center">
                    {/* Logo */}
                    <div className="mb-4">
                        <Image
                            src="/logo.svg"
                            alt="SW Beauty"
                            width={80}
                            height={80}
                            className="h-14 w-auto opacity-80"
                        />
                    </div>

                    {/* Title */}
                    <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-geist mb-6">
                        Dárkový poukaz
                    </span>

                    {/* Divider */}
                    <div className="w-16 h-px bg-stone-300 mb-6" />

                    {/* For label + Recipient Name */}
                    <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-geist mb-1">
                        Pro
                    </span>
                    <h1 className="text-4xl md:text-5xl font-cormorant font-medium text-stone-900 mb-4 tracking-tight">
                        {name}
                    </h1>

                    {/* Message */}
                    {message && (
                        <p className="text-stone-500 font-geist font-light italic text-sm max-w-md mb-4">
                            „{message}"
                        </p>
                    )}

                    {/* Value */}
                    <div className="mt-4 pt-6 border-t border-stone-200 w-full max-w-xs">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-geist block mb-2">
                            {type === 'cash' ? 'V hodnotě' : 'Na proceduru'}
                        </span>
                        <span className="text-3xl md:text-4xl font-cormorant font-medium text-stone-900">
                            {voucherValue}
                        </span>
                    </div>

                    {/* Validity */}
                    <div className="mt-auto pt-6">
                        <span className="text-[10px] text-stone-400 font-geist">
                            Platnost do {formattedDate} · swbeauty.cz
                        </span>
                    </div>
                </div>
            </div>

            {/* Instructions - hidden when printing */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 no-print">
                <p className="text-stone-400 text-xs font-geist text-center">
                    Klikněte na tlačítko "Vytisknout" nebo stiskněte Ctrl+P / Cmd+P
                </p>
            </div>
        </div>
    );
}

export default function VoucherPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-stone-100 flex items-center justify-center">
                <div className="text-stone-400 font-geist">Načítání poukazu...</div>
            </div>
        }>
            <VoucherContent />
        </Suspense>
    );
}
