'use client';

export default function MaintenancePage() {
    return (
        <div className="min-h-screen bg-stone-100 flex items-center justify-center p-6">
            <div className="bg-white max-w-md w-full p-8 shadow-lg text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-stone-200 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-stone-600">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                    </svg>
                </div>

                <h1 className="text-2xl font-semibold text-stone-900 mb-3">
                    Web je dočasně pozastaven
                </h1>

                <p className="text-stone-600 mb-6">
                    Omlouváme se za komplikace. Web je momentálně v údržbě.
                </p>

                <div className="text-sm text-stone-400">
                    SW Beauty
                </div>
            </div>
        </div>
    );
}
