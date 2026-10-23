import React from 'react';
import { MessageCircle, FileText, Copy, Share2 } from 'lucide-react';

type VehicleShare = {
  brand: string;
  model: string;
  version: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  url: string;
};

export default function ShareVehicleModule({ vehicle }: { vehicle?: VehicleShare | null }) {  // Datos de prueba en caso de que no venga el objeto
  const data = vehicle || {
    brand: 'Mazda',
    model: 'CX-5',
    version: 'Grand Touring LX',
    year: 2022,
    price: 95000000,
    mileage: 45000,
    transmission: 'Automática',
    url: 'https://autoelite.tuapp.com/v/mazda-cx5-123' // Enlace a la app marca blanca
  };

const formatCurrency = (value: number) =>    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

  // Lógica para armar el mensaje perfecto para ventas
  const buildWhatsAppMessage = () => {
    return `🚗 *${data.brand} ${data.model} ${data.year}* - ${data.version}\n\n` +
           `💰 *Precio:* ${formatCurrency(data.price)}\n` +
           `🛣️ *Kilometraje:* ${data.mileage.toLocaleString()} km\n` +
           `⚙️ *Transmisión:* ${data.transmission}\n\n` +
           `✅ Papeles al día y peritaje aprobado. Listo para traspaso.\n\n` +
           `📸 *Mira todas las fotos y detalles aquí:*\n${data.url}`;
  };

  const messageText = buildWhatsAppMessage();
  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(messageText)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(messageText);
    alert('¡Ficha copiada al portapapeles!');
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm mt-4">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="w-5 h-5 text-gray-800 dark:text-gray-200" />
        <h3 className="font-bold text-gray-900 dark:text-white">Compartir Ficha al Cliente</h3>
      </div>

      {/* Vista previa del mensaje */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 mb-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">
        {messageText}
      </div>

      {/* Botones de Acción Rápida */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Botón WhatsApp */}
        <a 
          href={whatsappLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 px-4 rounded-xl font-bold text-sm transition-colors shadow-sm shadow-green-500/20"
        >
          <MessageCircle className="w-5 h-5" />
          Enviar al WhatsApp
        </a>

        {/* Botón Copiar Texto */}
        <button 
          onClick={copyToClipboard}
          className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl font-bold text-sm transition-colors border border-gray-200 dark:border-gray-700"
        >
          <Copy className="w-5 h-5" />
          Copiar Texto
        </button>

        {/* Botón PDF (Marca Blanca) */}
        <button 
          className="flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary py-3 px-4 rounded-xl font-bold text-sm transition-colors border border-primary/20"
        >
          <FileText className="w-5 h-5" />
          Generar PDF
        </button>

      </div>
    </div>
  );
}
