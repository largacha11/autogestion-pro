import React from 'react';

interface VehicleCardProps {
  vehicle: any;
  appMode: 'interno' | 'cliente';
  onSelect: (vehicle: any) => void;
  stockInfo: { days: number; badge: string };
}

export default function VehicleCard({ vehicle, appMode, onSelect, stockInfo }: VehicleCardProps) {
  return (
    <div onClick={() => onSelect(vehicle)} className="cursor-pointer bg-white rounded-2xl shadow-md overflow-hidden flex h-32 active:scale-[0.98] transition-transform">
      <div className="w-1/3 h-full relative">
        <img src={vehicle.coverPhoto} alt={vehicle.model} className="w-full h-full object-cover" />
        {appMode === 'interno' && stockInfo.days > 45 && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-lg uppercase">Estancado</div>
        )}
      </div>
      <div className="p-3 w-2/3 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-md font-black leading-tight text-gray-900">{vehicle.brand} {vehicle.model}</h3>
            {appMode === 'interno' && (
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${stockInfo.badge}`}>
                {stockInfo.days}d
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 font-medium">{vehicle.year} • {vehicle.transmission}</p>
        </div>
        <span className="text-lg font-black text-blue-600">$ {vehicle.salePrice.toLocaleString()}</span>
      </div>
    </div>
  );
}
