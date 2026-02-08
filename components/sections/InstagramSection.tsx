import Image from 'next/image';

const images = [
  '/images/rasy-2.jpg',
  '/images/skin-calming-with-propolis1.jpg',
  '/images/endos-2.jpg',
  '/images/hair-bef:after2.jpg',
  '/images/kavitace-2.jpg',
  '/images/hifu-3.jpg'
];

export default function InstagramSection() {
  return (
    <section id="instagram" className="py-24 md:py-32 bg-stone-50">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <span className="text-stone-400 uppercase tracking-widest text-sm md:text-xs mb-3 block font-geist">Sledujte nás</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight font-cormorant text-stone-900">@swbeautysalons</h2>
        </div>

        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {images.map((src, index) => (
              <a
                key={index}
                href="https://instagram.com/swbeautysalons"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden bg-stone-100 cursor-pointer"
              >
                <Image
                  src={src}
                  alt="SW Beauty Instagram"
                  fill
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/40 transition-all duration-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <a
            href="https://instagram.com/swbeautysalons"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 border border-stone-900 text-stone-900 px-8 py-4 hover:bg-stone-900 hover:text-white transition-all duration-300 font-geist uppercase tracking-widest text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            <span>Sledovat na Instagramu</span>
          </a>
        </div>
      </div>
    </section>
  );
}