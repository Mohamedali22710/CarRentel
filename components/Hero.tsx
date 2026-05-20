"use client";

import Image from "next/image";

const Hero = () => {
  const handleScroll = () => {
    const nextSection = document.getElementById("discover");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="flex xl:flex-row flex-col gap-8 relative z-0 max-w-[1440px] mx-auto min-h-screen items-center px-6 sm:px-16 pt-36 xl:pt-0">
      
      {/* Text Content */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-50 dark:bg-red-950/20 border border-blue-100 dark:border-red-900/40 text-blue-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider self-start mb-6 animate-pulse">
          <span>✨</span> Experience the Pinnacle of Rentals
        </div>
        
        <h1 className="2xl:text-[72px] sm:text-[64px] text-[48px] font-black leading-[1.1] text-black dark:text-white">
          Find, book, or rent a car —{" "}
          <span className="bg-linear-to-r from-blue-600 to-indigo-500 dark:from-red-500 dark:to-amber-500 bg-clip-text text-transparent">
            quickly and easily!
          </span>
        </h1>
        
        <p className="text-[20px] text-gray-500 dark:text-gray-400 font-medium mt-6 max-w-xl">
          Streamline your car rental experience with our effortless booking process and hand-picked premium fleet.
        </p>

        <div className="flex flex-wrap gap-4 mt-10">
          <button
            onClick={handleScroll}
            className="px-8 py-4 bg-blue-600 dark:bg-red-600 text-white rounded-2xl font-bold hover:bg-blue-700 dark:hover:bg-red-700 transition-all hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-red-500/25 cursor-pointer shadow-md"
          >
            Explore Fleet
          </button>
          <button
            onClick={handleScroll}
            className="px-8 py-4 bg-gray-100 dark:bg-gray-800 text-black dark:text-white rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs"
          >
            How it Works
          </button>
        </div>
      </div>

      {/* Hero Visual Area */}
      <div className="xl:flex-[1.3] flex justify-end items-center w-full relative h-[450px] sm:h-[600px] xl:h-screen">
        <div className="relative w-full h-[90%] xl:h-full z-10 animate-float">
          <Image
            src="/hero.png"
            alt="hero car"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            className="object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_15px_30px_rgba(255,255,255,0.05)]"
            priority
          />
        </div>
        
        {/* Curved visual shape background */}
        <div className="absolute xl:-top-24 xl:-right-1/3 -right-1/4 bg-hero-bg bg-repeat-round -z-0 w-full xl:h-[110%] h-[550px] overflow-hidden opacity-90 dark:opacity-40 transition-opacity" />
      </div>
    </section>
  );
};

export default Hero;