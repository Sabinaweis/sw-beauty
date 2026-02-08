'use client';

import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setMessage('✓ Děkujeme! Byli jste úspěšně přihlášeni k odběru newsletteru.');
        setEmail('');
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(data.error || 'Nepodařilo se odeslat. Zkuste to prosím znovu.');
      }
    } catch {
      setMessage('Nepodařilo se odeslat. Zkuste to prosím znovu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Váš email"
        aria-label="Váš email pro odběr newsletteru"
        required
        suppressHydrationWarning
        className="w-full px-4 py-3 border border-stone-300 bg-white text-stone-900 font-geist text-sm focus:outline-none focus:border-stone-900 transition-colors"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-stone-900 text-white px-6 py-3 hover:bg-stone-800 transition-colors duration-300 font-geist uppercase tracking-widest text-xs disabled:opacity-50"
      >
        {loading ? 'Odesílám...' : 'Odebírat'}
      </button>
      {message && <div className={`mt-3 text-xs font-geist ${message.includes('✓') ? 'text-green-600' : 'text-red-600'}`}>{message}</div>}
    </form>
  );
}
