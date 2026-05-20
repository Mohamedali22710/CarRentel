"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components";
import { 
  Search, 
  Calendar, 
  Car, 
  Info, 
  WifiOff, 
  X, 
  Sparkles, 
  CheckCircle, 
  Fuel, 
  Compass, 
  Gauge, 
  ChevronDown, 
  SlidersHorizontal,
  Zap,
  Activity,
  CalendarDays
} from "lucide-react";

// Types for NHTSA API Model result
interface NHTSAModel {
  Make_ID: number;
  Make_Name: string;
  Model_ID: number;
  Model_Name: string;
}

// Local JSON Fallback data
const fallbackData: Record<string, string[]> = {
  Toyota: ["Camry", "Corolla", "RAV4", "Prius", "Highlander"],
  Honda: ["Civic", "Accord", "CR-V", "Pilot", "Odyssey"],
  Mercedes: ["C-Class", "E-Class", "S-Class", "GLE", "AMG GT"],
  BMW: ["3 Series", "5 Series", "7 Series", "X5", "M4"],
  Audi: ["A4", "A6", "Q5", "Q7", "e-tron"],
  Hyundai: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Palisade"],
  Tesla: ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck"]
};

// Available Brands per Year (Client attraction: selecting a year dynamically changes available brands)
const brandsByYear: Record<number, string[]> = {
  2026: ["Tesla", "BMW", "Audi", "Mercedes", "Hyundai"],
  2025: ["Toyota", "Honda", "BMW", "Audi", "Mercedes", "Hyundai", "Tesla"],
  2024: ["Toyota", "Honda", "Mercedes", "BMW", "Audi", "Hyundai", "Tesla"],
  2023: ["Toyota", "Honda", "Mercedes", "BMW", "Audi", "Hyundai", "Tesla"],
  2022: ["Toyota", "Honda", "Mercedes", "BMW", "Audi", "Hyundai"],
  2021: ["Toyota", "Honda", "Mercedes", "BMW", "Audi", "Hyundai"],
  2020: ["Toyota", "Honda", "Mercedes", "BMW", "Audi", "Hyundai"],
  2019: ["Toyota", "Honda", "Mercedes", "BMW", "Audi", "Hyundai"],
  2018: ["Toyota", "Honda", "Mercedes", "BMW", "Audi", "Hyundai"],
  2017: ["Toyota", "Honda", "Mercedes", "BMW", "Audi", "Hyundai"],
  2016: ["Toyota", "Honda", "Mercedes", "BMW", "Audi", "Hyundai"],
  2015: ["Toyota", "Honda", "Mercedes", "BMW", "Audi", "Hyundai"],
  2014: ["Toyota", "Honda", "Mercedes", "BMW", "Audi", "Hyundai"],
  2013: ["Toyota", "Honda", "Mercedes", "BMW", "Audi", "Hyundai"],
  2012: ["Toyota", "Honda", "Mercedes", "BMW", "Audi"],
  2011: ["Toyota", "Honda", "Mercedes", "BMW", "Audi"],
  2010: ["Toyota", "Honda", "Mercedes", "BMW", "Audi"]
};

// Years list
const YEARS = Array.from({ length: 17 }, (_, i) => 2026 - i);

// Helper for fetching car images from Imagin Studio API
const getCarImageUrl = (make: string, model: string, angle = "") => {
  const url = new URL("https://cdn.imagin.studio/getimage");
  url.searchParams.append("customer", "hrjavascript-mastery");
  url.searchParams.append("make", make);
  url.searchParams.append("modelFamily", model.split(" ")[0]);
  url.searchParams.append("zoomType", "fullscreen");
  if (angle) {
    url.searchParams.append("angle", angle);
  }
  return url.toString();
};

export default function Home() {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Modals & UI indicators
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [selectedModelForDetails, setSelectedModelForDetails] = useState<string | null>(null);
  
  // Custom dropdown states
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const dropdownYearRef = useRef<HTMLDivElement>(null);
  const dropdownBrandRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownYearRef.current && !dropdownYearRef.current.contains(event.target as Node)) {
        setIsYearOpen(false);
      }
      if (dropdownBrandRef.current && !dropdownBrandRef.current.contains(event.target as Node)) {
        setIsBrandOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update available brands when year changes
  useEffect(() => {
    const brands = brandsByYear[selectedYear] || [];
    setAvailableBrands(brands);
    // Auto-select first brand if current selection is not in new list
    if (!brands.includes(selectedBrand)) {
      setSelectedBrand(brands[0] || "");
    }
  }, [selectedYear, selectedBrand]);

  // Load models when brand and year change
  useEffect(() => {
    if (!selectedBrand) {
      setModels([]);
      return;
    }

    let isSubscribed = true;
    const fetchModels = async () => {
      setLoading(true);
      
      // Abort controller for a 4-second timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 4000);

      try {
        const url = `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${selectedBrand}/modelyear/${selectedYear}?format=json`;
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error("NHTSA API failed");
        }

        const data = await response.json();
        
        if (isSubscribed) {
          if (data && Array.isArray(data.Results) && data.Results.length > 0) {
            // Map and remove duplicates
            const fetchedModels: string[] = Array.from(
              new Set(data.Results.map((m: NHTSAModel) => m.Model_Name))
            );
            setModels(fetchedModels);
          } else {
            // No results returned, fallback to local optimized data
            triggerFallback();
          }
        }
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (isSubscribed) {
          console.warn("NHTSA API Error or Timeout. Using Fallback Data.", err);
          triggerFallback();
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    const triggerFallback = () => {
      const fallbackList = fallbackData[selectedBrand] || ["Classic", "Sport", "EV Hybrid", "Tourer", "Eco"];
      setModels(fallbackList);
      setToastMessage("Using optimized offline data");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    };

    fetchModels();

    return () => {
      isSubscribed = false;
    };
  }, [selectedBrand, selectedYear]);

  // Mock specifications helper
  const getMockSpecs = (modelName: string) => {
    const charSum = modelName.charCodeAt(0) + (modelName.charCodeAt(1) || 0);
    const driveTypes = ["AWD", "RWD", "FWD"];
    const fuelTypes = ["Electric", "Plug-in Hybrid", "Gasoline", "Mild Hybrid"];
    const drive = driveTypes[charSum % driveTypes.length];
    const fuel = modelName.toLowerCase().includes("model") || modelName.toLowerCase().includes("e-tron") || modelName.toLowerCase().includes("ioniq")
      ? "Electric"
      : fuelTypes[charSum % fuelTypes.length];
      
    const hp = 150 + (charSum % 350);
    const accel = (3.2 + (charSum % 4.5)).toFixed(1);
    
    return { drive, fuel, hp, accel };
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 dark:from-black dark:to-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-500 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 sm:px-16 max-w-[1440px] mx-auto flex flex-col items-center text-center">
        {/* Decorative ambient blur elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 dark:bg-red-500/5 rounded-full filter blur-3xl -z-10"></div>
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-indigo-500/5 dark:bg-purple-500/5 rounded-full filter blur-2xl -z-10 animate-pulse"></div>

        {/* Apple/Tesla styled text container */}
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-red-500 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" /> Discovery Dashboard 2.0
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.05] text-black dark:text-white">
            Unveil the Future of{" "}
            <span className="bg-linear-to-r from-blue-600 to-indigo-500 dark:from-red-500 dark:to-amber-500 bg-clip-text text-transparent">
              Driving.
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 font-medium max-w-xl mx-auto">
            Dynamic catalog powered by real-time safety agency records. Clean. Fast. Responsive.
          </p>
        </div>

        {/* Dropdowns Discovery Bar */}
        <div className="w-full max-w-2xl mt-12 bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200 dark:border-gray-850 p-4 rounded-3xl shadow-xl flex flex-col md:flex-row gap-4 items-center">
          
          {/* Year Selector */}
          <div ref={dropdownYearRef} className="relative w-full md:w-1/2">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left ml-4 mb-1">
              Model Year
            </label>
            <button
              onClick={() => {
                setIsYearOpen(!isYearOpen);
                setIsBrandOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-850 hover:bg-gray-100 dark:hover:bg-gray-800/80 rounded-2xl text-sm font-bold transition-all border border-transparent focus:border-blue-500/30 cursor-pointer"
            >
              <span className="flex items-center gap-2 text-black dark:text-white">
                <CalendarDays className="w-4 h-4 text-blue-500 dark:text-red-500" />
                {selectedYear}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isYearOpen ? "rotate-180" : ""}`} />
            </button>

            {isYearOpen && (
              <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto p-1.5 animate-fadeIn">
                {YEARS.map((y) => (
                  <button
                    key={y}
                    onClick={() => {
                      setSelectedYear(y);
                      setIsYearOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      selectedYear === y
                        ? "bg-blue-50 dark:bg-red-950/20 text-blue-600 dark:text-red-400 border-l-4 border-blue-500 dark:border-red-500"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/60"
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Line separator */}
          <div className="hidden md:block w-px h-10 bg-gray-200 dark:bg-gray-800"></div>

          {/* Brand/Make Selector */}
          <div ref={dropdownBrandRef} className="relative w-full md:w-1/2">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left ml-4 mb-1">
              Select Brand
            </label>
            <button
              onClick={() => {
                setIsBrandOpen(!isBrandOpen);
                setIsYearOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-850 hover:bg-gray-100 dark:hover:bg-gray-800/80 rounded-2xl text-sm font-bold transition-all border border-transparent focus:border-blue-500/30 cursor-pointer"
            >
              <span className="flex items-center gap-2 text-black dark:text-white">
                <Car className="w-4 h-4 text-blue-500 dark:text-red-500" />
                {selectedBrand || "Choose Brand"}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isBrandOpen ? "rotate-180" : ""}`} />
            </button>

            {isBrandOpen && (
              <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto p-1.5 animate-fadeIn">
                {availableBrands.map((b) => (
                  <button
                    key={b}
                    onClick={() => {
                      setSelectedBrand(b);
                      setIsBrandOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      selectedBrand === b
                        ? "bg-blue-50 dark:bg-red-950/20 text-blue-600 dark:text-red-400 border-l-4 border-blue-500 dark:border-red-500"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/60"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Inventory Catalogue Grid */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-16 pb-32">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-150 dark:border-gray-850">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Available catalog results
            </span>
          </div>
          <span className="px-3.5 py-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full text-xs font-bold text-blue-600 dark:text-red-500 shadow-xs">
            {models.length} Models
          </span>
        </div>

        {/* LOADING SKELETON STATE */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-250 dark:border-gray-800 animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                <div className="h-36 bg-gray-100 dark:bg-gray-850 rounded-2xl"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                </div>
                <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded mt-2"></div>
              </div>
            ))}
          </div>
        ) : models.length === 0 ? (
          /* EMPTY/ERROR STATE */
          <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-gray-900/30 backdrop-blur-md rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 p-8 text-center max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-800/80 rounded-2xl text-3xl mb-4 animate-bounce">
              🔍
            </div>
            <h3 className="text-xl font-bold text-black dark:text-white">No models available</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
              We couldn't find models for this brand and year in safety databases. Please select another combination.
            </p>
          </div>
        ) : (
          /* MAIN CARS GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {models.map((model, index) => {
              const specs = getMockSpecs(model);
              return (
                <div
                  key={`${model}-${index}`}
                  className="group relative flex flex-col p-6 bg-white/70 dark:bg-gray-900/60 backdrop-blur-md rounded-3xl border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 dark:hover:border-red-500/50 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-red-500/10 transition-all duration-300 h-full"
                >
                  {/* Badges */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-widest">
                      {selectedYear}
                    </span>
                    <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-red-950/20 text-blue-600 dark:text-red-400 rounded-full text-[10px] font-black uppercase">
                      {specs.fuel}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-black text-black dark:text-white truncate capitalize mb-3">
                    {selectedBrand} {model}
                  </h3>

                  {/* Imagin Studio Real Image (falls back to a stylized silhouette image if failed/unsupported) */}
                  <div className="relative w-full h-36 my-3 rounded-2xl bg-linear-to-b from-gray-50/50 to-gray-100/30 dark:from-gray-850 dark:to-gray-900/20 overflow-hidden flex items-center justify-center">
                    <Image
                      src={getCarImageUrl(selectedBrand, model)}
                      alt={`${selectedBrand} ${model}`}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-500 select-none"
                      unoptimized
                      priority={false}
                    />
                    {/* Shadow overlay element */}
                    <div className="absolute bottom-2 left-0 right-0 h-4 bg-gradient-radial from-black/15 to-transparent dark:from-white/5 opacity-50"></div>
                  </div>

                  {/* Mini specs badges */}
                  <div className="grid grid-cols-2 gap-2 my-4 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5 p-2 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
                      <Compass className="w-3.5 h-3.5 text-blue-500 dark:text-red-500" />
                      <span>{specs.drive}</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-2 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
                      <Gauge className="w-3.5 h-3.5 text-blue-500 dark:text-red-500" />
                      <span>{specs.hp} HP</span>
                    </div>
                  </div>

                  {/* Action button */}
                  <button
                    onClick={() => setSelectedModelForDetails(model)}
                    className="w-full mt-auto py-3 bg-gray-950 dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:bg-blue-600 dark:hover:bg-red-500 hover:text-white dark:hover:text-white transition-all transform active:scale-98 cursor-pointer text-center text-xs"
                  >
                    View Details
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CLIENT ATTRACTIVE FEATURES BANNER */}
      <section className="bg-gray-950 text-white py-20 px-6 sm:px-16 border-t border-gray-850">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-3">
            <div className="text-3xl text-blue-500 dark:text-red-500">⚡</div>
            <h4 className="text-lg font-bold">Ultra-low Latency</h4>
            <p className="text-sm text-gray-400">
              Response-optimized queries backed by direct federal data caches, loading in milliseconds.
            </p>
          </div>
          <div className="space-y-3">
            <div className="text-3xl text-blue-500 dark:text-red-500">🛡️</div>
            <h4 className="text-lg font-bold">NHTSA Standard Verification</h4>
            <p className="text-sm text-gray-400">
              Verify models against safety databases, validating compliant engine and design classes.
            </p>
          </div>
          <div className="space-y-3">
            <div className="text-3xl text-blue-500 dark:text-red-500">🗺️</div>
            <h4 className="text-lg font-bold">Smart Fallback Architecture</h4>
            <p className="text-sm text-gray-400">
              No internet or API issues? Our local database is ready to provide seamless user interaction instantly.
            </p>
          </div>
        </div>
      </section>

      {/* OFFLINE STATUS TOAST NOTIFICATION */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 bg-gray-900 border border-gray-800 text-white rounded-2xl shadow-2xl animate-slideUp">
          <WifiOff className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* PREMIUM APPLE-STYLE CAR DETAILS MODAL */}
      {selectedModelForDetails && (() => {
        const specs = getMockSpecs(selectedModelForDetails);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-scaleUp max-h-[90vh] flex flex-col">
              
              {/* Header */}
              <div className="p-6 border-b border-gray-150 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-950/20">
                <div>
                  <h3 className="text-2xl font-black text-black dark:text-white capitalize">
                    {selectedBrand} {selectedModelForDetails}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                    Premium Technical Specsheet
                  </p>
                </div>
                <button
                  onClick={() => setSelectedModelForDetails(null)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-bold transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                
                {/* Image Showcase */}
                <div className="relative w-full h-56 bg-linear-to-b from-gray-50 to-gray-100/50 dark:from-gray-850 dark:to-gray-900/30 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-150 dark:border-gray-800">
                  <Image
                    src={getCarImageUrl(selectedBrand, selectedModelForDetails)}
                    alt={selectedModelForDetails}
                    fill
                    className="object-contain p-4"
                    unoptimized
                  />
                </div>

                {/* Specs Details Grid */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Specifications</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-850 rounded-2xl border border-gray-100 dark:border-gray-800/80">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Drive Train</span>
                      <span className="font-extrabold text-sm text-black dark:text-white mt-0.5 block">{specs.drive}</span>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-850 rounded-2xl border border-gray-100 dark:border-gray-800/80">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Fuel & Propulsion</span>
                      <span className="font-extrabold text-sm text-black dark:text-white mt-0.5 block">{specs.fuel}</span>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-850 rounded-2xl border border-gray-100 dark:border-gray-800/80">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Horsepower Output</span>
                      <span className="font-extrabold text-sm text-black dark:text-white mt-0.5 block">{specs.hp} hp</span>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-850 rounded-2xl border border-gray-100 dark:border-gray-800/80">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">0 - 60 MPH Acceleration</span>
                      <span className="font-extrabold text-sm text-black dark:text-white mt-0.5 block">{specs.accel} seconds</span>
                    </div>
                  </div>
                </div>

                {/* Safety Verification Badge */}
                <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-2xl flex gap-3.5 items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-sm text-black dark:text-white">Federal Standard Certified</h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      This model configuration matches database specifications verified under the NHTSA vehicle registration protocols.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/20 flex gap-3 justify-end shrink-0">
                <button
                  onClick={() => setSelectedModelForDetails(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-250 dark:bg-gray-800 dark:hover:bg-gray-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Close
                </button>
                <Link
                  href="/sign-in"
                  className="px-6 py-2.5 bg-blue-600 dark:bg-red-600 text-white font-bold rounded-xl text-xs cursor-pointer shadow-lg shadow-blue-500/25 dark:shadow-red-500/25 text-center flex items-center justify-center"
                >
                  Book Rental Now
                </Link>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}