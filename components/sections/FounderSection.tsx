import Image from 'next/image';

export default function FounderSection() {
  return (
    <section id="majitelka" className="py-24 md:py-32 px-6 md:px-12 bg-white min-h-screen flex items-center">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-5/12">
            <div className="aspect-[3/4] relative">
              <Image
                src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/eab40de0-94a4-45eb-b924-345850d0201b_800w.jpg"
                alt="Sabina - Majitelka"
                fill
                className="w-full h-full object-cover shadow-xl shadow-stone-200/50 grayscale-[10%]"
              />
            </div>
          </div>
          <div className="w-full md:w-7/12">
            <h3 className="text-3xl md:text-4xl mb-6 tracking-tight font-medium font-cormorant">Slovo zakladatelky</h3>
            <p className="text-xl md:text-lg text-stone-600 font-light leading-relaxed mb-6 font-geist">
              "Mým cílem bylo vytvořit prostor, který propojuje medicínskou efektivitu s atmosférou luxusního spa."
            </p>
            <p className="hidden md:block text-lg text-stone-600 font-light leading-relaxed mb-8 font-geist">
              Specializuji se na procedury, které přináší reálné výsledky. Každou klientku vnímám individuálně.
            </p>
            <div className="font-cormorant text-2xl italic text-stone-900">Sabina, SW Beauty</div>
          </div>
        </div>
      </div>
    </section>
  );
}