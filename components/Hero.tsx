import Image from "next/image";

const Hero = () => {
  return (
    <section className="flex xl:flex-row flex-col gap-5 relative z-0 max-w-[1440px] mx-auto transition-colors">
      <div className="flex-1 pt-36 sm:px-16 px-6">
        {/* استخدمنا black-100 المعرف في الثيم */}
        <h1 className="2xl:text-[72px] sm:text-[64px] text-[50px] font-extrabold text-black-100">
          Find, book, or rent a car — quickly and easily!
        </h1>
        <p className="text-[27px] text-black-100 font-light mt-5">
          Streamline your car rental experience with our effortless booking process.
        </p>

        <button className="bg-primary-blue text-white rounded-full mt-10 py-3 px-6 outline-none font-semibold shadow-md hover:shadow-lg transition-all active:scale-95">
          Explore Cars
        </button>
      </div>

      <div className="xl:flex-[1.5] flex justify-end items-end w-full xl:h-screen">
        <div className="relative xl:w-full w-[90%] xl:h-full h-[590px] z-0">
          <Image src="/hero.png" alt="hero" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-contain" priority />
        </div>
        
        {/* الخلفية الزرقاء (تأكد أن bg-hero-bg معرفة في @theme) */}
        <div className="absolute xl:-top-24 xl:-right-1/2 -right-1/4 bg-hero-bg bg-repeat-round -z-10 w-full xl:h-screen h-[590px] overflow-hidden transition-all duration-500" />
      </div>
    </section>
  );
};

export default Hero;