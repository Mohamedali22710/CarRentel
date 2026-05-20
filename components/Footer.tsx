import Link from "next/link";
import Image from "next/image";
import { footerLinks } from "./index"; 

const Footer = () => {
  return (
    /* 1. شيلنا border-t من هنا (الخط اللي فوق)
      2. أضفنا text-black صريح للايت مود، وفي الدارك يقلب gray-300
    */
    <footer className="flex flex-col text-black dark:text-gray-300 mt-5 transition-colors duration-300">
   
      {/* الجزء العلوي: اللوجو والروابط */}
      <div className="max-w-[1440px] mx-auto w-full flex max-md:flex-col flex-wrap justify-between gap-5 sm:px-16 px-6 py-10">
        
        {/* اللوجو والحقوق الجانبية */}
        <div className="flex flex-col justify-start items-start gap-6">
          <Image 
            src="/logo.svg" 
            alt="logo" 
            width={118} 
            height={18} 
            /* dark:invert بتخلي اللوجو الأسود يقلب أبيض في الدارك مود تلقائياً */
            className="object-contain dark:invert" 
          />
          {/* النص هنا بقى أسود صريح text-black وفي الدارك gray-400 */}
          <p className="text-base text-black dark:text-gray-400">
            Carhub 2026 <br />
            All Rights Reserved &copy;
          </p>
        </div>

        {/* روابط الفوتر */}
        <div className="flex-1 w-full flex md:justify-end flex-wrap max-md:mt-10 gap-20">
          {footerLinks.map((item) => (
            <div key={item.title} className="flex flex-col gap-6 text-base min-w-[170px]">
              {/* العناوين الرئيسية (About, Company, Socials) سوداء صريحة */}
              <h3 className="font-bold text-black dark:text-white">{item.title}</h3>
              
              <ul className="flex flex-col gap-4 list-none p-0 m-0">
                {item.links.map((link) => (
                  <li key={link.title}>
                    <Link 
                      href={link.url} 
                      /* text-black: أسود صريح في اللايت مود
                        dark:text-gray-400: رمادي واضح في الدارك مود
                        hover:text-primary-blue: هوفر أزرق في اللايت مود
                        dark:hover:text-red-500: هوفر أحمر في الدارك مود
                      */
                      className="text-black dark:text-gray-400 hover:text-primary-blue dark:hover:text-red-500 transition-colors duration-200"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* الجزء السفلي الأخير: شيلنا منه الـ border-t أيضاً (الخط اللي في النص) */}
      <div className="max-w-[1440px] mx-auto w-full flex justify-between items-center flex-wrap mt-10 sm:px-16 px-6 py-10 text-black dark:text-gray-400">
        <p>@2026 CarHub. All Rights Reserved</p>
        
        <div className="flex-1 flex sm:justify-end justify-center max-sm:mt-4 gap-10">
          <Link 
            href="/" 
            className="hover:text-primary-blue dark:hover:text-red-500 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link 
            href="/" 
            className="hover:text-primary-blue dark:hover:text-red-500 transition-colors"
          >
            Terms of Use
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;