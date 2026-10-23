'use client';
import React, { useState } from 'react';
import { Search, SlidersHorizontal, CreditCard } from 'lucide-react';

export default function SearchAndFilters() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [budget, setBudget] = useState(50000000);
  const [financing, setFinancing] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');

  const handleFinancingToggle = () => {
    const newFinancingState = !financing;
    setFinancing(newFinancingState);
    if (newFinancingState && (!selectedYear || parseInt(selectedYear) < 2016)) {
      setSelectedYear('2016');
    } else if (!newFinancingState && selectedYear === '2016') {
      setSelectedYear('');
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 px-4 py-3 shadow-sm">
      <div className="max-w-md mx-auto flex items-center gap-2">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por marca, modelo o placa..."
            className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-900 border-none rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary outline-none transition-all"
          />
        </div>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`p-2.5 rounded-xl border transition-colors flex items-center justify-center ${
            isFilterOpen 
              ? 'bg-primary text-white border-primary' 
              : 'bg-gray-100 dark:bg-gray-900 border-transparent text-gray-600 dark:text-gray-300'
          }`}
          aria-label="Filtros"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
