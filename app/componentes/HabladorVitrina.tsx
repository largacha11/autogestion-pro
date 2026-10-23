import React from 'react';

export default function HabladorVitrina({ vehicle }: { vehicle: any }) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://tu-concesionario.com/vehiculo/${vehicle.id}`;
  
  return (
    <div className="bg-white w-full min-h-screen p-8 print:p-0 flex flex-col justify-between" style={{ width: '210mm', height: '297mm', margin: 'auto' }}>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tighter">AutoGestión <span className="text-blue-600">PRO</span></h1>
        <p className="text-gray-500 uppercase font-bold tracking-widest mt-1">Vehículo Verificado y Certificado</p>
      </div>
      
      <div className="w-full h-80 bg-gray-100 rounded-3xl overflow-hidden mb-8 border-4 border-gray-900 shadow-xl">
        <img src={vehicle.coverPhoto} className="w-full h-full object-cover" alt="Carro" />
      </div>

      <div className="text-center mb-8">
        <h2 className="text-6xl font-black text-gray-900 mb-2">{vehicle.brand} {vehicle.model}</h2>
        <h3 className="text-2xl text-gray-600 font-medium">{vehicle.version} • {vehicle.year}</h3>
      </div>

      <div className="bg-gray-900 text-white rounded-3xl p-8 mb-8 text-center shadow-2xl">
        <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Precio de Oportunidad</p>
        <p className="text-7xl font-black">$ {vehicle.salePrice.toLocaleString()}</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-12 text-center">
        <div className="p-4 border-2 border-gray-200 rounded-2xl"><p className="text-xs text-gray-500 font-bold uppercase">Kilometraje</p><p className="text-xl font-black mt-1">{vehicle.mileageKm.toLocaleString()}</p></div>
        <div className="p-4 border-2 border-gray-200 rounded-2xl"><p className="text-xs text-gray-500 font-bold uppercase">Transmisión</p><p className="text-xl font-black mt-1">{vehicle.transmission}</p></div>
        <div className="p-4 border-2 border-gray-200 rounded-2xl"><p className="text-xs text-gray-500 font-bold uppercase">Motor</p><p className="text-xl font-black mt-1">{vehicle.engineCapacity}</p></div>
        <div className="p-4 border-2 border-gray-200 rounded-2xl"><p className="text-xs text-gray-500 font-bold uppercase">Combustible</p><p className="text-xl font-black mt-1">{vehicle.fuelType}</p></div>
      </div>

      <div className="flex justify-center items-center gap-8 bg-gray-50 p-6 rounded-3xl border border-gray-200">
        <img src={qrUrl} alt="QR Code" className="w-40 h-40 rounded-xl" />
        <div className="text-left">
          <h4 className="text-2xl font-black text-gray-900">Escanea y Compra</h4>
          <p className="text-gray-500 font-medium mt-2">Abre la cámara de tu celular, enfoca este<br/>código QR y mira más fotos, simula<br/>tu crédito y contacta a un asesor.</p>
        </div>
      </div>
    </div>
  );
}
