'use client';
import React from 'react';
import { PieChart as PieChartIcon, BadgeDollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

export default function AdminDashboard({ vehicles = [] }: { vehicles: any[] }) {
  const soldVehicles = vehicles?.filter(v => v.status === 'Vendido') || [];
  const availableVehicles = vehicles?.filter(v => v.status === 'Disponible') || [];

  // Cálculos financieros
  const totalCapital = availableVehicles.reduce((acc, v) => acc + (v.purchaseCost || 0) + (v.reconditioningCost || 0), 0);
  const totalProfit = soldVehicles.reduce((acc, v) => acc + (v.salePrice - (v.purchaseCost || 0) - (v.reconditioningCost || 0) - (v.advisorBonus || 0)), 0);

  // Datos para la gráfica
  const chartData = [
    { name: 'Capital Vitrina', valor: totalCapital / 1000000, color: '#3b82f6' }, 
    { name: 'Utilidad Neta', valor: totalProfit / 1000000, color: '#10b981' } 
  ];

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
      <h2 className="text-xl font-black flex items-center gap-2 text-gray-900">
        <PieChartIcon className="w-6 h-6 text-blue-600" /> Finanzas Gerenciales
      </h2>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 col-span-2">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Capital Inmovilizado (COP)</span>
          <p className="text-3xl font-black text-gray-900 mt-1">$ {(totalCapital / 1000000).toFixed(1)}M</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-2xl shadow-lg col-span-2 text-white border border-gray-800">
          <span className="text-[10px] font-bold text-yellow-500 uppercase flex items-center gap-1">
            <BadgeDollarSign className="w-3 h-3"/> Utilidad Neta Real (Vendidos)
          </span>
          <p className="text-2xl font-black text-white mt-1">$ {(totalProfit / 1000000).toFixed(1)} Millones</p>
          <p className="text-xs text-gray-400 font-medium mt-1">Ya descontando comisiones y arreglos de {soldVehicles.length} autos.</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mt-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase mb-6">Balance General (Millones COP)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 600 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="valor" radius={[6, 6, 0, 0]} barSize={60}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
