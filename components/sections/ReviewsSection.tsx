'use client';

import { useState, useEffect } from 'react';

const reviews = [
  {
    text: "Absolutně profesionální přístup. Po sérii ošetření Endosphere se cítím jako znovuzrozená. Prostředí je nádherné a uklidňující.",
    author: "Petra K."
  },
  {
    text: "SW Beauty navštěvuji pravidelně. Sabina přesně ví, co moje pleť potřebuje. Není to jen kosmetika, je to zážitek.",
    author: "Veronika M."
  },
  {
    text: "Konečně místo, kde se snoubí medicínská efektivita s luxusním relaxem. Výsledky HIFU ošetření předčily má očekávání.",
    author: "Jana S."
  }
];

export default function ReviewsSection() {
  const [currentReview, setCurrentReview] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="reviews" className="py-24 md:py-32 bg-white relative overflow-hidden min-h-[80vh] md:min-h-screen flex items-center">
      <div className="max-w-3xl mx-auto px-6 md:px-12 text-center relative z-10 w-full">
        <h2 className="sr-only">Reference klientů</h2>

        <div className="relative min-h-[500px] md:min-h-[600px] flex flex-col justify-center items-center">
          {reviews.map((review, index) => (
            <div
              key={index}
              className={`review-slide absolute inset-0 flex flex-col justify-center items-center transition-opacity duration-1000 ease-in-out px-4 ${index === currentReview ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className="text-[120px] md:text-[180px] lg:text-[200px] leading-none text-stone-300/40 font-cormorant mb-4 md:mb-6 select-none">"</div>
              <blockquote className="w-full">
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-relaxed md:leading-relaxed font-normal font-cormorant text-stone-900 mb-8 md:mb-12 max-w-2xl mx-auto">
                  {review.text}
                </p>
              </blockquote>
              <cite className="not-italic">
                <span className="block text-[10px] md:text-xs font-geist uppercase tracking-[0.2em] text-stone-600 font-medium mb-2">Klientka</span>
                <span className="block text-base md:text-lg font-cormorant text-stone-900">{review.author}</span>
              </cite>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-1 mt-8 z-20 relative">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentReview(index)}
              className="p-4 flex items-center justify-center group"
              aria-label={`Zobrazit recenzi ${index + 1}`}
            >
              <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 group-hover:scale-125 ${index === currentReview ? 'bg-stone-800' : 'bg-stone-300'}`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}