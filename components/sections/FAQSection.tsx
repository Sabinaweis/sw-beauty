'use client';

import { useState } from 'react';

const faqs = [
  {
    question: 'Je ošetření Endosphere bolestivé?',
    answer: 'Vůbec ne. Endospheres Therapy je neinvazivní a klienti ji často popisují jako intenzivní hlubokou masáž. Intenzitu vždy přizpůsobujeme vašemu prahu citlivosti.'
  },
  {
    question: 'Jak dlouho trvá rekonvalescence po HIFU?',
    answer: 'HIFU je tzv. "lunch-time" procedura. Můžete se okamžitě vrátit do práce nebo společnosti. Mírné zarudnutí zmizí do hodiny po ošetření.'
  },
  {
    question: 'Musím se objednat předem?',
    answer: 'Ano, pracujeme výhradně na objednávku, abychom každé klientce zaručili 100% soukromí a čas. Rezervaci můžete provést online nebo telefonicky.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 md:py-32 px-6 md:px-12 bg-stone-50 min-h-screen flex items-center">
      <div className="max-w-3xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight font-cormorant mb-4">Časté dotazy</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="group border-b border-stone-200 pb-4" open={openIndex === index}>
              <summary
                className="flex justify-between items-center cursor-pointer py-4 list-none text-xl font-cormorant text-stone-900"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span>{faq.question}</span>
                <span className={`transition-transform ${openIndex === index ? 'rotate-180' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </summary>
              <p className="text-stone-700 font-normal font-geist mt-2 leading-relaxed pb-4">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}