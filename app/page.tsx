import { Suspense } from "react";
import Image from "next/image";
import { Navbar, Hero, SearchBar, CustomFilter } from "@/components";
import type { FilterOption } from "@/components/CustomFilter";

// Types for car data
interface CarData {
  id?: string;
  make: string;
  model: string;
  year: number;
  fuel_type: string;
  transmission: string;
  drive: string;
  price?: number;
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Fetch cars from API based on filters
async function fetchCars(params: Record<string, string | string[] | undefined>): Promise<CarData[]> {
  try {
    const manufacturer = Array.isArray(params.manufacturer)
      ? params.manufacturer[0]
      : params.manufacturer;
    const model = Array.isArray(params.model) ? params.model[0] : params.model;
    const fuel = Array.isArray(params.fuel) ? params.fuel[0] : params.fuel;
    const year = Array.isArray(params.year) ? params.year[0] : params.year;

    // Build RapidAPI request
    const url = new URL("https://cars-by-api-ninjas.p.rapidapi.com/v1/cars");

    if (manufacturer) url.searchParams.append("make", manufacturer);
    if (model) url.searchParams.append("model", model);
    if (fuel && fuel !== "all") url.searchParams.append("fuel_type", fuel);
    if (year && year !== "all") url.searchParams.append("year", year);

    const response = await fetch(url.toString(), {
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY || "",
        "X-RapidAPI-Host": "cars-by-api-ninjas.p.rapidapi.com",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data.slice(0, 12) : []; // Limit to 12 results
  } catch (error) {
    console.error("Error fetching cars:", error);
    return [];
  }
}

// Car Card Component
const CarCard: React.FC<{ car: CarData }> = ({ car }) => {
  // Use a stable price calculation based on car model to avoid purity violations
  const pricePerDay = 30 + ((car.model.charCodeAt(0) + car.year) % 150);

  return (
    <div className="flex flex-col p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 h-full">
      {/* Header */}
      <div className="flex justify-between items-start gap-2 mb-2">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-black dark:text-white truncate">
            {car.make} {car.model}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{car.year}</p>
        </div>
        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors shrink-0">
          <Image
            src="/heart-outline.svg"
            alt="favorite"
            width={20}
            height={20}
            className="dark:invert"
          />
        </button>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-1 my-4">
        <span className="text-3xl font-extrabold text-black dark:text-white">${pricePerDay}</span>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">/day</span>
      </div>

      {/* Car Image */}
      <div className="relative w-full h-40 my-4 shrink-0">
        <Image
          src="/hero.png"
          alt={`${car.make} ${car.model}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-contain"
        />
      </div>

      {/* Car Details */}
      <div className="grid grid-cols-2 gap-3 my-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Image src="/gas.svg" alt="fuel" width={16} height={16} className="dark:invert" />
          <span className="capitalize">{car.fuel_type}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Image
            src="/steering-wheel.svg"
            alt="transmission"
            width={16}
            height={16}
            className="dark:invert"
          />
          <span className="capitalize">{car.transmission}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Image src="/tire.svg" alt="drive" width={16} height={16} className="dark:invert" />
          <span className="capitalize">{car.drive}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Image src="/window.svg" alt="model" width={16} height={16} className="dark:invert" />
          <span>{car.model}</span>
        </div>
      </div>

      {/* CTA Button */}
      <button className="w-full mt-auto py-3 rounded-lg bg-blue-500 dark:bg-red-500 text-white font-semibold hover:bg-blue-600 dark:hover:bg-red-600 transition-colors active:scale-95">
        Rent Now
      </button>
    </div>
  );
};

// Skeleton Loader Component
const SkeletonCard = () => (
  <div className="flex flex-col p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 animate-pulse">
    <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2" />
    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-4" />
    <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-4" />
    <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded mb-4" />
    <div className="space-y-2 mb-4">
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded" />
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded" />
    </div>
    <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded mt-auto" />
  </div>
);

// Empty State Component
const EmptyState = ({ hasFilters }: { hasFilters: boolean }) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
    <div className="text-6xl mb-4">🚗</div>
    <h3 className="text-2xl font-bold text-black dark:text-white">
      {hasFilters ? "No Cars Found" : "Start Searching"}
    </h3>
    <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-md text-center">
      {hasFilters
        ? "Try adjusting your filters or search criteria to find available cars."
        : "Use the search bar above and apply filters to discover amazing cars available for rent."}
    </p>
  </div>
);

// Car Grid Component (Client-side loading state)
async function CarGrid({ params }: { params: Record<string, string | string[] | undefined> }) {
  const cars = await fetchCars(params);
  const hasFilters = Object.keys(params).some(
    (key) => params[key] && !["undefined"].includes(String(params[key]))
  );

  return (
    <div>
      {cars.length > 0 ? (
        <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 w-full gap-8">
          {cars.map((car, idx) => (
            <CarCard key={`${car.make}-${car.model}-${idx}`} car={car} />
          ))}
        </div>
      ) : (
        <EmptyState hasFilters={hasFilters} />
      )}
    </div>
  );
}

// Filter Options
const FUEL_OPTIONS: FilterOption[] = [
  { title: "Gasoline", value: "Gasoline" },
  { title: "Diesel", value: "Diesel" },
  { title: "Hybrid", value: "Hybrid" },
  { title: "Electric", value: "Electric" },
  { title: "Natural Gas", value: "Natural Gas" },
  { title: "LPG", value: "LPG" },
];

const YEAR_OPTIONS: FilterOption[] = Array.from({ length: 30 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return { title: String(year), value: String(year) };
});

// Main Page Component
export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <main className="overflow-hidden bg-white dark:bg-black transition-colors duration-300">
      {/* Navbar & Hero */}
      <Navbar />
      <Hero />

      {/* Car Catalogue Section */}
      <section id="discover" className="mt-12 padding-x padding-y max-width">
        {/* Section Title */}
        <div className="flex flex-col items-start justify-start gap-y-2.5 text-black dark:text-white mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Car Catalogue</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Explore and filter through our collection of premium rental cars
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar />
        </div>

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <CustomFilter title="Fuel Type" options={FUEL_OPTIONS} paramKey="fuel" />
          <CustomFilter title="Year" options={YEAR_OPTIONS} paramKey="year" />
        </div>

        {/* Car Grid with Suspense Boundary */}
        <Suspense
          fallback={
            <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 w-full gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          }
        >
          <CarGrid params={params} />
        </Suspense>
      </section>

      {/* Why Choose Us Section */}
      <section
        id="about"
        className="mt-20 padding-x max-width min-h-125 bg-gray-50 dark:bg-gray-900/50 rounded-3xl p-10 flex flex-col md:flex-row gap-10 items-center border border-gray-200 dark:border-gray-800"
      >
        <div className="flex-1 flex flex-col gap-6 text-black dark:text-white">
          <h2 className="text-4xl font-extrabold">Why Choose Us?</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="text-3xl shrink-0">⚡</div>
              <div>
                <h3 className="font-bold text-lg">Instant Booking</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Reserve your car in seconds with our streamlined process.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl shrink-0">💰</div>
              <div>
                <h3 className="font-bold text-lg">Best Prices</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Competitive rates with no hidden fees or surprises.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl shrink-0">🛡️</div>
              <div>
                <h3 className="font-bold text-lg">Full Protection</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Comprehensive insurance coverage included in all rentals.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl shrink-0">🚀</div>
              <div>
                <h3 className="font-bold text-lg">24/7 Support</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Round-the-clock customer service ready to assist you.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 relative h-96">
          <Image
            src="/hero.png"
            alt="premium car"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
            priority
          />
        </div>
      </section>

      {/* Spacing */}
      <div className="pb-20" />
    </main>
  );
}