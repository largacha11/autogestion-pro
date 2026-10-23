'use client';
import React, { useState } from 'react';
import { ClipboardCheck, CheckCircle, AlertTriangle, XCircle, FileText } from 'lucide-react';

export default function AppraisalChecklist() {
  const [formData, setFormData] = useState({
    cliente: '', placa: '', kilometraje: ''
  });

  const [checklist, setChecklist] = useState({
    motor_encendido: null, fluidos: null, pintura_original: null,
    llantas_estado: null, tapiceria: null, chasis_golpes: null
  });

  const handleScore = (key: string, value: string) => {
    setChecklist({ ...checklist, [key]: value });
  };

  const calculateScore = () => {
    const values = Object.values(checklist);
    const completed = values.filter(v => v !== null).length;
    if (completed === 0) return 0;
    const points = values.reduce((acc: number, val) => {
      if (val === 'ok') return acc + 10;
      if (val === 'regular') return acc + 5;
      return acc;
    }, 0);
    return Math.round((points / (values.length * 10)) * 100);
  };

  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="bg-blue-600 p-5 rounded-2xl text-white shadow-lg">
        <h2 className="text-xl font-black flex items-center gap-2 mb-1"><ClipboardCheck className="w-6 h-6"/> Peritaje de Retoma</h2>
        <p className="text-xs text-blue-100 font-medium">Checklist técnico para ingreso de inventario</p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase">Propietario / Cliente</label>
          <input type="text" className="w-full p-2 border rounded-lg text-sm mt-1" placeholder="Nombre completo" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-500 uppercase">Placa</label>
          <input type="text" className="w-full p-2 border rounded-lg text-sm uppercase mt-1" placeholder="XYZ123" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-500 uppercase">Kilometraje</label>
          <input type="number" className="w-full p-2 border rounded-lg text-sm mt-1" placeholder="Ej. 45000" />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-black text-gray-900 text-sm mt-2">Inspección Física y Mecánica</h3>
        
        {[
          { id: 'motor_encendido', label: 'Encendido y Sonido Motor' },
          { id: 'fluidos', label: 'Niveles de Fluidos (Aceite/Agua)' },
          { id: 'pintura_original', label: 'Estado de Pintura / Piezas Repintadas' },
          { id: 'chasis_golpes', label: 'Puntas de Chasis (Libre de golpes)' },
          { id: 'llantas_estado', label: 'Vida Útil de Llantas' },
          { id: 'tapiceria', label: 'Estado de Tapicería e Interior' }
        ].map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
            <span className="text-xs font-bold text-gray-800">{item.label}</span>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => handleScore(item.id, 'ok')} className={`py-2 rounded-lg flex items-center justify-center gap-1 text-[10px] font-black transition-colors ${checklist[item.id as keyof typeof checklist] === 'ok' ? 'bg-green-600 text-white' : 'bg-gray-50 text-gray-400 border'}`}><CheckCircle className="w-3 h-3"/> Óptimo</button>
              <button onClick={() => handleScore(item.id, 'regular')} className={`py-2 rounded-lg flex items-center justify-center gap-1 text-[10px] font-black transition-colors ${checklist[item.id as keyof typeof checklist] === 'regular' ? 'bg-yellow-500 text-white' : 'bg-gray-50 text-gray-400 border'}`}><AlertTriangle className="w-3 h-3"/> Regular</button>
              <button onClick={() => handleScore(item.id, 'malo')} className={`py-2 rounded-lg flex items-center justify-center gap-1 text-[10px] font-black transition-colors ${checklist[item.id as keyof typeof checklist] === 'malo' ? 'bg-red-600 text-white' : 'bg-gray-50 text-gray-400 border'}`}><XCircle className="w-3 h-3"/> Requiere Arreglo</button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 p-5 rounded-2xl text-white flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase">Puntaje General</span>
          <p className="text-3xl font-black text-white">{calculateScore()}%</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-colors">
          <FileText className="w-4 h-4"/> Guardar Reporte
        </button>
      </div>
    </div>
  );
}
