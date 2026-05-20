"use client";

import Image from "next/image";
import { CarData } from "@/context/AppContext";

interface CarCardProps {
  car: CarData;
}

const CarCard = ({ car }: CarCardProps) => {
  return (
    <div className="flex flex-col p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 h-full">
      {/* Header */}
      <div className="flex justify-between items-start gap-2 mb-2">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-black dark:text-white truncate capitalize">
            {car.make} {car.model}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{car.year}</p>
        </div>
      </div>

      {/* Car Image Placeholder */}
      <div className="relative w-full h-40 my-4 shrink-0 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <Image
          src={car.image || "/hero.png"}
          alt={`${car.make} ${car.model}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-contain p-2"
        />
      </div>

      {/* Specifications */}
      <div className="grid grid-cols-2 gap-3 my-4 text-sm mt-auto">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <div className="w-5 h-5 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400 text-xs">⛽</div>
          <span className="capitalize">{car.fuel_type}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <div className="w-5 h-5 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400 text-xs">⚙️</div>
          <span className="capitalize">{car.transmission}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <div className="w-5 h-5 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400 text-xs">🚗</div>
          <span className="uppercase">{car.drive}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <div className="w-5 h-5 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400 text-xs">📅</div>
          <span>{car.year}</span>
        </div>
      </div>

      {/* Action / Pricing */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-extrabold text-black dark:text-white">${car.price}</span>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">/day</span>
        </div>
        <button className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">
          Rent Now
        </button>
      </div>
    </div>
  );
};

export default CarCard;
