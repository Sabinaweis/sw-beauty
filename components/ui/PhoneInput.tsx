'use client';

import { useState, useEffect, useCallback } from 'react';

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

/**
 * Formátuje telefonní číslo do formátu XXX XXX XXX
 * Vstup může být s nebo bez +420, výstup je vždy jen čísla pro state
 */
function formatPhoneDisplay(value: string): string {
    // Odstraníme vše kromě čísel
    const digitsOnly = value.replace(/\D/g, '');

    // Odstraníme prefix 420 na začátku pokud existuje
    const withoutPrefix = digitsOnly.startsWith('420')
        ? digitsOnly.slice(3)
        : digitsOnly;

    // Omezíme na 9 číslic (české telefonní číslo bez předvolby)
    const limited = withoutPrefix.slice(0, 9);

    // Formátujeme po 3 číslicích
    const parts = [];
    for (let i = 0; i < limited.length; i += 3) {
        parts.push(limited.slice(i, i + 3));
    }

    return parts.join(' ');
}

/**
 * Vrátí čisté číslo bez mezer pro uložení
 */
function getCleanPhone(displayValue: string): string {
    return displayValue.replace(/\s/g, '');
}

export default function PhoneInput({ value, onChange, placeholder, className }: PhoneInputProps) {
    const [displayValue, setDisplayValue] = useState('');

    // Synchronizace když se změní value zvenku
    useEffect(() => {
        const formatted = formatPhoneDisplay(value);
        setDisplayValue(formatted);
    }, [value]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;

        // Pokud uživatel maže, povolíme to
        if (input.length < displayValue.length) {
            const formatted = formatPhoneDisplay(input);
            setDisplayValue(formatted);
            onChange(getCleanPhone(formatted));
            return;
        }

        // Formátujeme nový vstup
        const formatted = formatPhoneDisplay(input);
        setDisplayValue(formatted);
        onChange(getCleanPhone(formatted));
    }, [displayValue, onChange]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        // Povolíme pouze čísla, backspace, delete, šipky, tab
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
        const isNumber = /^[0-9]$/.test(e.key);

        if (!isNumber && !allowedKeys.includes(e.key)) {
            e.preventDefault();
        }
    }, []);

    return (
        <div className="relative">
            {/* +420 prefix - vždy zobrazený */}
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-700 font-geist font-medium pointer-events-none select-none">
                +420
            </span>
            <input
                type="tel"
                inputMode="numeric"
                value={displayValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder || '777 123 456'}
                className={`pl-14 ${className || 'w-full p-3 border border-stone-200 font-geist focus:outline-none focus:border-stone-900 transition-colors'}`}
                maxLength={11} // 9 číslic + 2 mezery
                autoComplete="tel-national"
            />
        </div>
    );
}
