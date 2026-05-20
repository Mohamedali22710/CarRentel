"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export interface FilterOption {
  title: string;
  value: string;
}

interface CustomFilterProps {
  title: string;
  options: FilterOption[];
  paramKey: string;
}

const CustomFilter: React.FC<CustomFilterProps> = ({ title, options, paramKey }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get selected value directly from search params (no state)
  const selectedValue = searchParams.get(paramKey) || "";
  const selectedOption = selectedValue 
    ? options.find((opt) => opt.value === selectedValue) 
    : null;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: FilterOption) => {
    setIsOpen(false);

    // Update URL search params
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramKey, option.value);
    const queryString = params.toString();
    router.push(`/?${queryString}`);
  };

  const handleClearFilter = () => {
    setIsOpen(false);

    const params = new URLSearchParams(searchParams.toString());
    params.delete(paramKey);
    const queryString = params.toString();
    router.push(`/${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <div ref={dropdownRef} className="relative w-full md:w-64">
      {/* Dropdown Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-black dark:text-white font-semibold hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200"
      >
        <span className="flex items-center gap-2">
          {selectedOption ? (
            <>
              <span className="text-sm text-gray-500 dark:text-gray-400">{title}:</span>
              <span>{selectedOption.title}</span>
            </>
          ) : (
            <>
              <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
              <span className="text-xs text-gray-400">Filter</span>
            </>
          )}
        </span>
        <Image
          src="/chevron-up-down.svg"
          alt="chevron"
          width={20}
          height={20}
          className={`transition-transform duration-200 dark:invert ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {/* Clear Filter Option */}
          {selectedOption && (
            <>
              <button
                onClick={handleClearFilter}
                className="w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800 font-semibold text-sm"
              >
                ✕ Clear {title}
              </button>
            </>
          )}

          {/* Options */}
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option)}
              className={`w-full px-4 py-3 text-left transition-all duration-150 ${
                selectedOption?.value === option.value
                  ? "bg-blue-50 dark:bg-red-950/20 text-blue-600 dark:text-red-400 font-semibold border-l-4 border-blue-500 dark:border-red-500"
                  : "text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {option.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomFilter;
