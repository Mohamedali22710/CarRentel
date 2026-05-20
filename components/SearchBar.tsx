"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

interface SearchBarProps {
  onSearch?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [manufacturer, setManufacturer] = useState(searchParams.get("manufacturer") || "");
  const [model, setModel] = useState(searchParams.get("model") || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Build query parameters, preserving existing params like fuel, year, etc.
    const params = new URLSearchParams(searchParams.toString());
    
    if (manufacturer.trim()) {
      params.set("manufacturer", manufacturer.trim().toLowerCase());
    } else {
      params.delete("manufacturer");
    }
    
    if (model.trim()) {
      params.set("model", model.trim().toLowerCase());
    } else {
      params.delete("model");
    }

    // Update URL with new search params
    const queryString = params.toString();
    router.push(`/?${queryString}`);
    
    setTimeout(() => setIsSubmitting(false), 300);
    onSearch?.();
  };

  const handleClear = () => {
    setManufacturer("");
    setModel("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("manufacturer");
    params.delete("model");
    const queryString = params.toString();
    router.push(`/${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full flex flex-col md:flex-row gap-4 items-stretch md:items-end justify-between bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm"
    >
      {/* Manufacturer Input */}
      <div className="flex-1 flex flex-col gap-2">
        <label htmlFor="manufacturer" className="text-sm font-semibold text-black dark:text-white">
          Manufacturer
        </label>
        <div className="relative flex items-center">
          <Image
            src="/magnifying-glass.svg"
            alt="search"
            width={20}
            height={20}
            className="absolute left-4 text-gray-400 dark:invert"
          />
          <input
            id="manufacturer"
            type="text"
            placeholder="Toyota"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500 transition-all"
          />
        </div>
      </div>

      {/* Model Input */}
      <div className="flex-1 flex flex-col gap-2">
        <label htmlFor="model" className="text-sm font-semibold text-black dark:text-white">
          Model
        </label>
        <div className="relative flex items-center">
          <Image
            src="/magnifying-glass.svg"
            alt="search"
            width={20}
            height={20}
            className="absolute left-4 text-gray-400 dark:invert"
          />
          <input
            id="model"
            type="text"
            placeholder="Camry"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500 transition-all"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 w-full md:w-auto">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 md:flex-none px-8 py-3 bg-blue-500 dark:bg-red-500 text-white font-semibold rounded-lg hover:bg-blue-600 dark:hover:bg-red-600 disabled:opacity-50 transition-all duration-200 active:scale-95"
        >
          {isSubmitting ? "Searching..." : "Search"}
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="flex-1 md:flex-none px-6 py-3 bg-gray-100 dark:bg-gray-800 text-black dark:text-white font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
