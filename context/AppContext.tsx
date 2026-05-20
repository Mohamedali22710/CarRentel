"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "user" | "admin" | null;

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export interface CarData {
  id: string;
  make: string;
  model: string;
  year: number;
  fuel_type: string;
  transmission: string;
  drive: string;
  price: number;
  image?: string;
}

interface AppContextType {
  user: User | null;
  isLoggedIn: boolean;
  fleet: CarData[];
  login: (email: string, password?: string) => void;
  logout: () => void;
  addCar: (car: Omit<CarData, "id">) => void;
  deleteCar: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [fleet, setFleet] = useState<CarData[]>([]);

  // Simulation logic: fetch initial fleet from API
  useEffect(() => {
    async function fetchInitialFleet() {
      try {
        const url = new URL("https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?limit=15");
        const response = await fetch(url.toString(), {
          headers: {
            "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY || process.env.RAPIDAPI_KEY || "",
            "X-RapidAPI-Host": "cars-by-api-ninjas.p.rapidapi.com",
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            const parsedCars = data.map((car: any, index: number) => ({
              id: `api-${index}`,
              make: car.make || "Unknown",
              model: car.model || "Model",
              year: car.year || new Date().getFullYear(),
              fuel_type: car.fuel_type || "Gasoline",
              transmission: car.transmission === "a" ? "Automatic" : car.transmission === "m" ? "Manual" : car.transmission || "Automatic",
              drive: car.drive || "fwd",
              price: 30 + ((car.model?.charCodeAt(0) || 0 + (car.year || 0)) % 150), // Simulation pricing
            }));
            setFleet(parsedCars);
          }
        }
      } catch (error) {
        console.error("Failed to fetch initial fleet:", error);
      }
    }
    fetchInitialFleet();
  }, []);

  const isLoggedIn = user !== null;

  const login = (email: string, password?: string) => {
    // Simulation: if email contains 'admin', grant admin role
    const role: UserRole = email.toLowerCase().includes("admin") ? "admin" : "user";
    setUser({
      id: Math.random().toString(36).substring(7),
      email,
      role,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const addCar = (carData: Omit<CarData, "id">) => {
    const newCar: CarData = {
      ...carData,
      id: `local-${Math.random().toString(36).substring(7)}`,
    };
    setFleet((prev) => [newCar, ...prev]);
  };

  const deleteCar = (id: string) => {
    setFleet((prev) => prev.filter((car) => car.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isLoggedIn,
        fleet,
        login,
        logout,
        addCar,
        deleteCar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
