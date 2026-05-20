"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useApp, CarData } from "@/context/AppContext";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoggedIn, fleet, addCar, updateCar, deleteCar } = useApp();
  
  // Guard check
  const [mounted, setMounted] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCarToEdit, setCurrentCarToEdit] = useState<CarData | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    fuel_type: "Gasoline",
    transmission: "Automatic",
    drive: "fwd",
    price: 50,
  });

  // Load state and redirect if not logged in
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoggedIn) {
      router.push("/sign-in");
    }
  }, [mounted, isLoggedIn, router]);

  if (!mounted || !isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-black transition-colors duration-300">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Checking authorization...</p>
        </div>
      </div>
    );
  }

  // Statistics calculation
  const totalCars = fleet.length;
  const avgPrice = totalCars > 0 ? fleet.reduce((acc, car) => acc + car.price, 0) / totalCars : 0;
  const electricCount = fleet.filter((car) => car.fuel_type.toLowerCase() === "electric").length;

  const handleOpenAddModal = () => {
    setFormData({
      make: "",
      model: "",
      year: new Date().getFullYear(),
      fuel_type: "Gasoline",
      transmission: "Automatic",
      drive: "fwd",
      price: 60,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (car: CarData) => {
    setCurrentCarToEdit(car);
    setFormData({
      make: car.make,
      model: car.model,
      year: car.year,
      fuel_type: car.fuel_type,
      transmission: car.transmission,
      drive: car.drive,
      price: car.price,
    });
    setIsEditModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year" || name === "price" ? Number(value) : value,
    }));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.make || !formData.model) return;
    addCar(formData);
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCarToEdit || !formData.make || !formData.model) return;
    updateCar(currentCarToEdit.id, formData);
    setIsEditModalOpen(false);
    setCurrentCarToEdit(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this car?")) {
      deleteCar(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header Space for Absolute Navbar */}
      <div className="h-20" />

      <main className="max-w-[1440px] mx-auto px-6 sm:px-16 py-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-black dark:text-white">
              Fleet Management Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Logged in as: <span className="font-semibold text-blue-600 dark:text-blue-400">{user?.email}</span>
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="self-start md:self-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <span>➕</span> Add New Car
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {/* Stat 1 */}
          <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider block">Total Fleet</span>
              <span className="text-3xl font-black text-black dark:text-white mt-1 block">{totalCars} cars</span>
            </div>
            <div className="text-3xl bg-blue-50 dark:bg-blue-950/40 p-3.5 rounded-2xl">🚗</div>
          </div>

          {/* Stat 2 */}
          <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider block">Avg Rent Price</span>
              <span className="text-3xl font-black text-black dark:text-white mt-1 block">
                ${avgPrice.toFixed(0)}/day
              </span>
            </div>
            <div className="text-3xl bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-2xl">💰</div>
          </div>

          {/* Stat 3 */}
          <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider block">Electric Cars</span>
              <span className="text-3xl font-black text-black dark:text-white mt-1 block">
                {electricCount} vehicles
              </span>
            </div>
            <div className="text-3xl bg-purple-50 dark:bg-purple-950/40 p-3.5 rounded-2xl">⚡</div>
          </div>
        </div>

        {/* Cars List / Table */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden mb-12">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
            <h3 className="font-extrabold text-lg text-black dark:text-white">Active Car Inventory</h3>
            <span className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-400">
              Live State
            </span>
          </div>

          {fleet.length === 0 ? (
            <div className="p-16 text-center">
              <span className="text-4xl block mb-2">📁</span>
              <h4 className="text-lg font-bold text-gray-800 dark:text-white">No Cars in Fleet</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 max-w-sm mx-auto">
                Get started by clicking the "Add New Car" button to populate your inventory.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-400 uppercase bg-gray-50/30 dark:bg-gray-900/30">
                    <th className="px-6 py-4">Car Model</th>
                    <th className="px-6 py-4">Year</th>
                    <th className="px-6 py-4">Details</th>
                    <th className="px-6 py-4">Price / Day</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 dark:divide-gray-800/60">
                  {fleet.map((car) => (
                    <tr
                      key={car.id}
                      className="hover:bg-gray-50/75 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 relative bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-lg">
                            🚘
                          </div>
                          <div>
                            <span className="font-bold text-black dark:text-white block">
                              {car.make} {car.model}
                            </span>
                            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                              ID: {car.id.replace("local-", "")}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4.5 text-sm font-semibold">{car.year}</td>
                      <td className="px-6 py-4.5">
                        <div className="flex flex-wrap gap-1.5">
                          <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-md text-xs font-bold capitalize">
                            {car.fuel_type}
                          </span>
                          <span className="px-2 py-0.5 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-md text-xs font-bold capitalize">
                            {car.transmission}
                          </span>
                          <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-md text-xs font-bold uppercase">
                            {car.drive}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4.5">
                        <span className="text-lg font-black text-black dark:text-white">${car.price}</span>
                        <span className="text-xs text-gray-500 font-medium">/day</span>
                      </td>
                      <td className="px-6 py-4.5 text-right">
                        <div className="flex justify-end gap-2.5">
                          <button
                            onClick={() => handleOpenEditModal(car)}
                            className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold rounded-lg text-sm transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(car.id)}
                            className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 font-bold rounded-lg text-sm transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ADD CAR MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-lg rounded-3xl shadow-2xl p-6 relative animate-scaleUp max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-extrabold text-black dark:text-white mb-6 flex items-center gap-2">
              <span>🚗</span> Add New Fleet Vehicle
            </h3>
            
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Make</label>
                  <input
                    type="text"
                    name="make"
                    value={formData.make}
                    onChange={handleFormChange}
                    placeholder="e.g. Tesla"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Model</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleFormChange}
                    placeholder="e.g. Model Y"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Year</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleFormChange}
                    min={1990}
                    max={2030}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rental Price / Day ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    min={1}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fuel Type</label>
                <select
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm"
                >
                  <option value="Gasoline">Gasoline</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                  <option value="Mild Hybrid">Mild Hybrid</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Transmission</label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Drive Train</label>
                  <select
                    name="drive"
                    value={formData.drive}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm"
                  >
                    <option value="fwd">FWD (Front Wheel Drive)</option>
                    <option value="rwd">RWD (Rear Wheel Drive)</option>
                    <option value="awd">AWD (All Wheel Drive)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-150 dark:border-gray-800 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-850 dark:hover:bg-gray-800 font-bold rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-blue-500/25 cursor-pointer"
                >
                  Create Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CAR MODAL */}
      {isEditModalOpen && currentCarToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-lg rounded-3xl shadow-2xl p-6 relative animate-scaleUp max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-extrabold text-black dark:text-white mb-6 flex items-center gap-2">
              <span>✏️</span> Edit Fleet Vehicle
            </h3>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Make</label>
                  <input
                    type="text"
                    name="make"
                    value={formData.make}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Model</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Year</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleFormChange}
                    min={1990}
                    max={2030}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rental Price / Day ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    min={1}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fuel Type</label>
                <select
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm"
                >
                  <option value="Gasoline">Gasoline</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                  <option value="Mild Hybrid">Mild Hybrid</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Transmission</label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Drive Train</label>
                  <select
                    name="drive"
                    value={formData.drive}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm"
                  >
                    <option value="fwd">FWD (Front Wheel Drive)</option>
                    <option value="rwd">RWD (Rear Wheel Drive)</option>
                    <option value="awd">AWD (All Wheel Drive)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-150 dark:border-gray-800 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setCurrentCarToEdit(null);
                  }}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-850 dark:hover:bg-gray-800 font-bold rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-blue-500/25 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
