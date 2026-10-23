import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

type DamageMark = {
  id: number;
  zone: string;
  type: string;
  severity: number;
  note: string;
};

export default function DamageMap({ marks = [] }: { marks?: DamageMark[] }) {  // Datos de prueba simulando lo que viene de la base de datos (Prisma: DamageMark)
  const mockMarks = marks.length > 0 ? marks : [
    { id: 1, zone: 'FRONT_RIGHT_DOOR', type: 'SCRATCH', severity: 1, note: 'Rayón superficial' },
    { id: 2, zone: 'REAR_BUMPER', type: 'DENT', severity: 2, note: 'Pequeño hundido' }
  ];

  const getSeverityColor = (severity: number) =>
    switch(severity) {
      case 1: return 'bg-yellow-400'; // Leve
      case 2: return 'bg-orange-500'; // Medio
      case 3: return 'bg-red-600';    // Grave
      default: return 'bg-blue-500';
    }
  };

  const getTypeName = (type: string) => {
    const types: Record<string, string> = {
      SCRATCH: 'Rayón',
      DENT: 'Hundido',
      PAINT_FADE: 'Desgaste de pintura',
      CRACK: 'Grieta'
    };
    return types[type] || 'Detalle';
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
          Reporte Estético
        </h4>
        <span className="text-xs font-medium bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
          {mockMarks.length} detalles
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Silueta del Carro (Representación simplificada con CSS) */}
        <div className="relative w-32 h-64 bg-gray-100 dark:bg-gray-700 rounded-[3rem] border-4 border-gray-200 dark:border-gray-600 shadow-inner flex items-center justify-center">
          <div className="absolute top-8 w-24 h-12 bg-gray-200 dark:bg-gray-600 rounded-t-2xl opacity-50" /> {/* Parabrisas */}
          <div className="absolute bottom-8 w-24 h-12 bg-gray-200 dark:bg-gray-600 rounded-b-2xl opacity-50" /> {/* Vidrio Trasero */}
          
          {/* Puntos de daño sobre la silueta (posiciones ilustrativas) */}
          {mockMarks.map((mark, index) => (
            <div 
              key={mark.id}
              className={`absolute w-4 h-4 rounded-full border-2 border-white shadow-md animate-pulse ${getSeverityColor(mark.severity)}`}
              style={{
                // Logica visual rápida para posicionar puntos
                top: mark.zone.includes('FRONT') ? '20%' : '80%',
                left: mark.zone.includes('RIGHT') ? '80%' : '10%',
              }}
              title={mark.note}
            >
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              </span>
            </div>
          ))}
        </div>

        {/* Lista de Detalles */}
        <div className="flex-1 w-full space-y-3">
          {mockMarks.map((mark) => (
            <div key={mark.id} className="flex gap-3 items-start p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-600 hover:border-primary transition-colors">
              <div className={`mt-0.5 w-3 h-3 rounded-full ${getSeverityColor(mark.severity)} shadow-sm`} />
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {getTypeName(mark.type)}
                  {mark.severity === 3 && <AlertTriangle className="w-3 h-3 text-red-500" />}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {mark.note}
                </p>
              </div>
            </div>
          ))}
          
          {mockMarks.length === 0 && (
            <div className="text-center py-6 text-gray-400 flex flex-col items-center">
              <Info className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">Vehículo en perfectas condiciones estéticas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
