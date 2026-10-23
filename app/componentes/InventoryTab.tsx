'use client';
import React, { useState } from 'react';
import { Search, Car } from 'lucide-react';

export default function InventoryTab({ vehicles, appMode }: { vehicles: any[], appMode: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const availableVehicles = vehicles.filter(v => v.status === 'Disponible');
  const filteredVehicles = availableVehicles.filter((v) => 
    v.model.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-in fade-in">
      {/* Buscador */}
      <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2">
        <Search className="w-5 h-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Buscar por marca o modelo..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      {/* Lista de Vehículos */}
      <div className="space-y-3">
        {filteredVehicles.map((v) => (
          <div key={v.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex h-32 cursor-pointer hover:shadow-md transition-shadow">
            <div className="w-1/3 h-full bg-gray-200">
              <img src={v.coverPhoto} alt={v.model} className="w-full h-full object-cover" />
            </div>
            <div className="p-3 w-2/3 flex flex-col justify-between">
              <div>
                <h3 className="text-md font-black text-gray-900 leading-tight">{v.brand} {v.model}</h3>
                <p className="text-xs text-gray-500 font-medium">{v.year} • {v.mileageKm.toLocaleString()} km</p>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-lg font-black text-blue-600">$ {v.salePrice.toLocaleString()}</span>
                {appMode === 'interno' && (
                  <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded font-bold uppercase">{v.plate}</span>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredVehicles.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <Car className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p className="text-sm font-medium">No hay vehículos en vitrina.</p>
          </div>
        )}
      </div>
    </div>
  );
}
