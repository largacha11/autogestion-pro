'use client';
import React, { useState } from 'react';

export default function AdminVehicleForm({ vehicles, setVehicles, setActiveTab }: { vehicles: any[], setVehicles: any, setActiveTab: any }) {
  const [formData, setFormData] = useState({
    brand: 'Chevrolet', model: '', version: '', year: 2024, 
    salePrice: '', color: '', mileageKm: '', plate: '', 
    purchaseCost: '', reconditioningCost: '', minimumPrice: '', advisorBonus: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.model || !formData.salePrice) return alert('El modelo y el precio de venta son obligatorios.');

    const newVehicle = {
      id: `VEH-${Date.now()}`,
      ...formData,
      year: Number(formData.year),
      salePrice: Number(formData.salePrice),
      mileageKm: Number(formData.mileageKm),
      purchaseCost: Number(formData.purchaseCost) || 0,
      reconditioningCost: Number(formData.reconditioningCost) || 0,
      minimumPrice: Number(formData.minimumPrice) || Number(formData.salePrice),
      advisorBonus: Number(formData.advisorBonus) || 0,
      plate: formData.plate.toUpperCase(),
      status: 'Disponible',
      createdAt: new Date().toISOString(),
      coverPhoto: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80', // Foto por defecto temporal
      gallery: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80']
    };

    const updatedVehicles = [newVehicle, ...vehicles];
    setVehicles(updatedVehicles);
    localStorage.setItem('concesionario_inventario', JSON.stringify(updatedVehicles));
    setActiveTab('inventory'); // Te devuelve a la vitrina al terminar
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-2">
      <h2 className="text-xl font-black text-gray-900">Registrar Vehículo</h2>
      
      <form onSubmit={handleSave} className="space-y-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Marca</label>
            <select name="brand" value={formData.brand} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm bg-gray-50">
              {['Chevrolet', 'Renault', 'Mazda', 'Kia', 'Toyota', 'Suzuki', 'Nissan', 'Ford', 'BMW'].map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase">Modelo</label>
            <input name="model" value={formData.model} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm bg-gray-50" placeholder="Ej. Tracker" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase">Versión</label>
            <input name="version" value={formData.version} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm bg-gray-50" placeholder="Ej. LS MT" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase">Año</label>
            <input type="number" name="year" value={formData.year} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm bg-gray-50" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase">Placa</label>
            <input name="plate" value={formData.plate} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm bg-gray-50 uppercase" placeholder="XYZ123" />
          </div>
          <div className="col-span-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Kilometraje</label>
            <input type="number" name="mileageKm" value={formData.mileageKm} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm bg-gray-50" />
          </div>
        </div>

        <div className="bg-gray-900 p-5 rounded-2xl grid grid-cols-2 gap-4 text-white shadow-lg">
          <div className="col-span-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Precio Venta (COP)</label>
            <input type="number" name="salePrice" value={formData.salePrice} onChange={handleInputChange} className="w-full p-2 bg-gray-800 rounded-lg text-lg font-black" placeholder="Ej. 65000000" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase">Costo Compra</label>
            <input type="number" name="purchaseCost" value={formData.purchaseCost} onChange={handleInputChange} className="w-full p-2 bg-gray-800 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase">Arreglos</label>
            <input type="number" name="reconditioningCost" value={formData.reconditioningCost} onChange={handleInputChange} className="w-full p-2 bg-gray-800 rounded-lg text-sm" />
          </div>
        </div>

        <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl shadow-lg transition-colors">
          Guardar en Inventario
        </button>
      </form>
    </div>
  );
}
