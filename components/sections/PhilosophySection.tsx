import Image from 'next/image';

export default function PhilosophySection() {
  return (
    <section id="filozofie" className="bg-stone-50 py-24 md:py-32 min-h-screen flex items-center">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        <div className="w-full lg:w-1/2 relative">
          <div className="aspect-[4/5] bg-stone-100 overflow-hidden">
            <Image
              src="/images/woman-about-sw.png"
              alt="SW Beauty Interior"
              fill
              className="w-full h-full object-cover grayscale-[10%]"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#F5F2EA] -z-10"></div>
        </div>

        <div className="w-full lg:w-1/2 lg:pr-12">
          <span className="text-stone-600 uppercase tracking-widest text-sm md:text-xs mb-6 block font-geist font-medium">O SW Beauty</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tight mb-8 leading-tight font-medium font-cormorant">
            Každá žena si zaslouží cítit se <span className="text-stone-600 italic">výjimečně</span>.
          </h2>
          <div className="space-y-6 text-xl md:text-lg text-stone-600 font-light leading-relaxed font-geist">
            <p>
              Nejsme jen další kosmetický salon. Jsme místem, kde se zastaví čas a pozornost se obrací jen k vám.
            </p>
            <p className="hidden md:block">
              V SW Beauty věříme, že péče o sebe není luxus, ale základní kámen zdravého sebevědomí. Kombinujeme high-tech přístroje s dotekem lidské ruky.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}