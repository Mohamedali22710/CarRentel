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
  class?: string;
  cylinders?: number;
  displacement?: number;
  city_mpg?: number;
  highway_mpg?: number;
  combination_mpg?: number;
}

interface AppContextType {
  user: User | null;
  isLoggedIn: boolean;
  fleet: CarData[];
  login: (email: string, password?: string) => { success: boolean; error?: string };
  register: (email: string, password?: string) => { success: boolean; error?: string };
  logout: () => void;
  addCar: (car: Omit<CarData, "id">) => void;
  updateCar: (id: string, car: Partial<CarData>) => void;
  deleteCar: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const fallbackFleet: CarData[] = [
  {
    id: "premium-1",
    make: "Tesla",
    model: "Model S Plaid",
    year: 2024,
    fuel_type: "Electric",
    transmission: "Automatic",
    drive: "awd",
    price: 150,
  },
  {
    id: "premium-2",
    make: "Porsche",
    model: "911 Carrera S",
    year: 2023,
    fuel_type: "Gasoline",
    transmission: "Automatic",
    drive: "rwd",
    price: 220,
  },
  {
    id: "premium-3",
    make: "BMW",
    model: "M4 Competition",
    year: 2024,
    fuel_type: "Gasoline",
    transmission: "Automatic",
    drive: "awd",
    price: 180,
  },
  {
    id: "premium-4",
    make: "Audi",
    model: "RS e-tron GT",
    year: 2023,
    fuel_type: "Electric",
    transmission: "Automatic",
    drive: "awd",
    price: 190,
  },
  {
    id: "premium-5",
    make: "Mercedes-Benz",
    model: "AMG GT 63",
    year: 2024,
    fuel_type: "Gasoline",
    transmission: "Automatic",
    drive: "awd",
    price: 250,
  },
  {
    id: "premium-6",
    make: "Range Rover",
    model: "Sport SV",
    year: 2024,
    fuel_type: "Mild Hybrid",
    transmission: "Automatic",
    drive: "awd",
    price: 210,
  }
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [fleet, setFleet] = useState<CarData[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<{ email: string; password?: string; role: UserRole }[]>([]);

  // Load initial data from localStorage
  useEffect(() => {
    // 1. Load users
    const storedUsers = localStorage.getItem("registeredUsers");
    let usersList = [];
    if (storedUsers) {
      usersList = JSON.parse(storedUsers);
      setRegisteredUsers(usersList);
    } else {
      // Default accounts for easy testing
      const defaultUsers = [
        { email: "admin@carrent.com", password: "admin123", role: "admin" as UserRole },
        { email: "user@carrent.com", password: "user123", role: "user" as UserRole }
      ];
      setRegisteredUsers(defaultUsers);
      localStorage.setItem("registeredUsers", JSON.stringify(defaultUsers));
      usersList = defaultUsers;
    }

    // 2. Load fleet
    const storedFleet = localStorage.getItem("carFleet");
    if (storedFleet) {
      setFleet(JSON.parse(storedFleet));
    } else {
      setFleet(fallbackFleet);
      localStorage.setItem("carFleet", JSON.stringify(fallbackFleet));
    }

    // 3. Load active session
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isLoggedIn = user !== null;

  const register = (email: string, password?: string) => {
    const normalizedEmail = email.toLowerCase().trim();
    const exists = registeredUsers.some((u) => u.email.toLowerCase().trim() === normalizedEmail);
    if (exists) {
      return { success: false, error: "Email is already registered" };
    }

    // Grant admin role if email contains "admin"
    const role: UserRole = normalizedEmail.includes("admin") ? "admin" : "user";
    const newUser = {
      email: normalizedEmail,
      password,
      role,
    };

    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
    return { success: true };
  };

  const login = (email: string, password?: string) => {
    const normalizedEmail = email.toLowerCase().trim();
    const matchedUser = registeredUsers.find(
      (u) => u.email.toLowerCase().trim() === normalizedEmail && u.password === password
    );

    if (!matchedUser) {
      return { success: false, error: "Invalid email or password" };
    }

    const sessionUser = {
      id: Math.random().toString(36).substring(7),
      email: matchedUser.email,
      role: matchedUser.role,
    };

    setUser(sessionUser);
    localStorage.setItem("currentUser", JSON.stringify(sessionUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  const addCar = (carData: Omit<CarData, "id">) => {
    const newCar: CarData = {
      ...carData,
      id: `local-${Math.random().toString(36).substring(7)}`,
    };
    setFleet((prev) => {
      const updated = [newCar, ...prev];
      localStorage.setItem("carFleet", JSON.stringify(updated));
      return updated;
    });
  };

  const updateCar = (id: string, updatedFields: Partial<CarData>) => {
    setFleet((prev) => {
      const updated = prev.map((car) => (car.id === id ? { ...car, ...updatedFields } : car));
      localStorage.setItem("carFleet", JSON.stringify(updated));
      return updated;
    });
  };

  const deleteCar = (id: string) => {
    setFleet((prev) => {
      const updated = prev.filter((car) => car.id !== id);
      localStorage.setItem("carFleet", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isLoggedIn,
        fleet,
        login,
        register,
        logout,
        addCar,
        updateCar,
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

