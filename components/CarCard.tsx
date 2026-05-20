"use client";

import { useState } from "react";
import Image from "next/image";

export interface CarData {
  id?: string;
  make: string;
  model: string;
  year: number;
  fuel_type: string;
  transmission: string;
  drive: string;
  price?: number;
  city_mpg?: number;
  class?: string;
  combination_mpg?: number;
  cylinders?: number;
  displacement?: number;
  highway_mpg?: number;
}

interface CarCardProps {
  car: CarData;
}

const getCarImageUrl = (car: CarData, angle?: string) => {
  const url = new URL("https://cdn.imagin.studio/getimage");
  url.searchParams.append("customer", "hrjavascript-mastery");
  url.searchParams.append("make", car.make);
  url.searchParams.append("modelFamily", car.model.split(" ")[0]);
  url.searchParams.append("zoomType", "fullscreen");
  if (angle) {
    url.searchParams.append("angle", angle);
  }
  return url.toString();
};

const CarCard = ({ car }: CarCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeAngle, setActiveAngle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Dynamic price calculation
  const pricePerDay = car.price || (30 + ((car.model.charCodeAt(0) + car.year) % 150));

  const calculateTotalPrice = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    return diffDays * pricePerDay;
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setIsBooked(true);
      setIsOpen(false);
    }, 1500);
  };

  return (
    <div className="group relative flex flex-col p-6 bg-white/70 dark:bg-gray-900/60 backdrop-blur-md rounded-3xl border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 dark:hover:border-red-500/50 hover:shadow-[0_10px_30px_rgba(59,130,246,0.15)] dark:hover:shadow-[0_10px_30px_rgba(239,68,68,0.15)] transition-all duration-300 h-full">
      {/* Header */}
      <div className="flex justify-between items-start gap-2 mb-2">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white truncate capitalize group-hover:text-blue-600 dark:group-hover:text-red-500 transition-colors">
            {car.make} {car.model}
          </h3>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{car.year}</p>
        </div>
        <button className="p-2 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 hover:scale-110 active:scale-95 transition-all">
          ❤️
        </button>
      </div>

      {/* Pricing */}
      <div className="flex items-baseline gap-1 my-2">
        <span className="text-3xl font-black text-black dark:text-white">${pricePerDay}</span>
        <span className="text-sm font-semibold text-gray-500">/day</span>
      </div>

      {/* Image Container with Hover Scale */}
      <div className="relative w-full h-40 my-4 shrink-0 bg-linear-to-b from-gray-50/50 to-gray-100/30 dark:from-gray-800/40 dark:to-gray-800/10 rounded-2xl overflow-hidden flex items-center justify-center">
        <Image
          src={getCarImageUrl(car)}
          alt={`${car.make} ${car.model}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
          priority={false}
          unoptimized
        />
      </div>

      {/* Specs Grid */}
      <div className="grid grid-cols-2 gap-3 my-4 text-xs font-semibold text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
          <span className="text-sm">⛽</span>
          <span className="capitalize truncate">{car.fuel_type === "gas" ? "Gasoline" : car.fuel_type || "Gasoline"}</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
          <span className="text-sm">⚙️</span>
          <span className="capitalize truncate">{car.transmission === "a" ? "Auto" : car.transmission === "m" ? "Manual" : car.transmission || "Auto"}</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
          <span className="text-sm">🚗</span>
          <span className="uppercase truncate">{car.drive || "FWD"}</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
          <span className="text-sm">🛣️</span>
          <span>{car.highway_mpg || 30} MPG</span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => {
          setActiveAngle("");
          setIsOpen(true);
        }}
        className="w-full mt-auto py-3 bg-blue-600 dark:bg-red-600 text-white font-bold rounded-2xl hover:bg-blue-700 dark:hover:bg-red-700 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-red-500/25 active:scale-98 transition-all cursor-pointer text-center text-sm"
      >
        {isBooked ? "Reserved ✅" : "Rent Now"}
      </button>

      {/* DETAILED CHECKOUT MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-scaleUp max-h-[95vh] flex flex-col">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-150 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-950/20 shrink-0">
              <div>
                <h3 className="text-2xl font-black text-black dark:text-white capitalize">
                  {car.make} {car.model}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                  Premium Specifications & Booking
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Multi-angle Image Viewer */}
              <div className="space-y-4">
                <div className="relative w-full h-64 bg-linear-to-b from-gray-50 to-gray-100/50 dark:from-gray-850 dark:to-gray-900/30 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-150 dark:border-gray-800">
                  <Image
                    src={getCarImageUrl(car, activeAngle)}
                    alt={`${car.make} ${car.model}`}
                    fill
                    className="object-contain p-4"
                    unoptimized
                  />
                </div>
                
                {/* Thumbnails */}
                <div className="grid grid-cols-4 gap-3">
                  <button
                    onClick={() => setActiveAngle("")}
                    className={`h-16 relative rounded-xl border-2 overflow-hidden bg-gray-50 dark:bg-gray-800 transition-all ${
                      activeAngle === "" ? "border-blue-600 dark:border-red-500 ring-2 ring-blue-500/20" : "border-transparent"
                    }`}
                  >
                    <Image src={getCarImageUrl(car, "")} alt="angle1" fill className="object-contain p-1" unoptimized />
                  </button>
                  <button
                    onClick={() => setActiveAngle("29")}
                    className={`h-16 relative rounded-xl border-2 overflow-hidden bg-gray-50 dark:bg-gray-800 transition-all ${
                      activeAngle === "29" ? "border-blue-600 dark:border-red-500 ring-2 ring-blue-500/20" : "border-transparent"
                    }`}
                  >
                    <Image src={getCarImageUrl(car, "29")} alt="angle2" fill className="object-contain p-1" unoptimized />
                  </button>
                  <button
                    onClick={() => setActiveAngle("33")}
                    className={`h-16 relative rounded-xl border-2 overflow-hidden bg-gray-50 dark:bg-gray-800 transition-all ${
                      activeAngle === "33" ? "border-blue-600 dark:border-red-500 ring-2 ring-blue-500/20" : "border-transparent"
                    }`}
                  >
                    <Image src={getCarImageUrl(car, "33")} alt="angle3" fill className="object-contain p-1" unoptimized />
                  </button>
                  <button
                    onClick={() => setActiveAngle("21")}
                    className={`h-16 relative rounded-xl border-2 overflow-hidden bg-gray-50 dark:bg-gray-800 transition-all ${
                      activeAngle === "21" ? "border-blue-600 dark:border-red-500 ring-2 ring-blue-500/20" : "border-transparent"
                    }`}
                  >
                    <Image src={getCarImageUrl(car, "21")} alt="angle4" fill className="object-contain p-1" unoptimized />
                  </button>
                </div>
              </div>

              {/* Specifications Table */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                  Vehicle details
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-gray-50 dark:bg-gray-850 border border-gray-150 dark:border-gray-800/80 rounded-xl">
                    <span className="text-xs text-gray-400 block font-semibold uppercase">Class</span>
                    <span className="font-bold text-sm text-black dark:text-white capitalize">{car.class || "Sedan"}</span>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-850 border border-gray-150 dark:border-gray-800/80 rounded-xl">
                    <span className="text-xs text-gray-400 block font-semibold uppercase">Engine Cylinders</span>
                    <span className="font-bold text-sm text-black dark:text-white">{car.cylinders || 4} Cyl</span>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-850 border border-gray-150 dark:border-gray-800/80 rounded-xl">
                    <span className="text-xs text-gray-400 block font-semibold uppercase">Displacement</span>
                    <span className="font-bold text-sm text-black dark:text-white">{car.displacement ? `${car.displacement.toFixed(1)} L` : "N/A"}</span>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-850 border border-gray-150 dark:border-gray-800/80 rounded-xl">
                    <span className="text-xs text-gray-400 block font-semibold uppercase">City MPG</span>
                    <span className="font-bold text-sm text-black dark:text-white">{car.city_mpg || 25} MPG</span>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-850 border border-gray-150 dark:border-gray-800/80 rounded-xl">
                    <span className="text-xs text-gray-400 block font-semibold uppercase">Highway MPG</span>
                    <span className="font-bold text-sm text-black dark:text-white">{car.highway_mpg || 32} MPG</span>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-850 border border-gray-150 dark:border-gray-800/80 rounded-xl">
                    <span className="text-xs text-gray-400 block font-semibold uppercase">Drive Unit</span>
                    <span className="font-bold text-sm text-black dark:text-white uppercase">{car.drive || "FWD"}</span>
                  </div>
                </div>
              </div>

              {/* Checkout / Booking Form */}
              <div className="border-t border-gray-150 dark:border-gray-800 pt-6">
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                  Reservation checkout
                </h4>

                {bookingSuccess ? (
                  <div className="p-6 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 rounded-2xl text-center space-y-2 animate-pulse">
                    <span className="text-3xl block">🎉</span>
                    <h5 className="font-black text-lg">Booking Confirmed!</h5>
                    <p className="text-sm opacity-90">Your premium car is reserved. Redirecting...</p>
                  </div>
                ) : (
                  <form onSubmit={handleBooking} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pick-up Date</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-700 rounded-xl text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Drop-off Date</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          min={startDate || new Date().toISOString().split("T")[0]}
                          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-700 rounded-xl text-sm"
                          required
                        />
                      </div>
                    </div>

                    {/* Booking Cost Breakdown */}
                    {startDate && endDate && (
                      <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-2xl space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500 font-semibold">Daily Rate:</span>
                          <span className="font-bold text-black dark:text-white">${pricePerDay}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 font-semibold">Taxes & Fees (10%):</span>
                          <span className="font-bold text-black dark:text-white">${(calculateTotalPrice() * 0.1).toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between border-t border-blue-200/50 dark:border-blue-900/50 pt-2 text-base font-black text-black dark:text-white">
                          <span>Total Amount:</span>
                          <span>${(calculateTotalPrice() * 1.1).toFixed(0)}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-150 dark:border-gray-800">
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-850 dark:hover:bg-gray-800 text-gray-800 dark:text-white font-bold rounded-xl text-sm cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-red-600 dark:hover:bg-red-700 text-white font-bold rounded-xl text-sm cursor-pointer shadow-lg shadow-blue-500/25"
                      >
                        Confirm Booking
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarCard;
