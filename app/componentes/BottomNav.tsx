'use client';

import React, { useState } from 'react';
import { Home, Search, Car, User } from 'lucide-react';


export default function BottomNav() {
  const [activeTab, setActiveTab] = useState('inventory');

  const navItems = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'search', icon: Search, label: 'Buscar' },
    { id: 'inventory', icon: Car, label: 'Inventario' },
    { id: 'profile', icon: User, label: 'Perfil' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe z-50">
      <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors"
            >
              <Icon 
                className={`w-6 h-6 transition-all duration-300 ${
                  isActive 
                    ? 'text-primary transform scale-110' // Color dinámico de la Marca Blanca
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'
                }`} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-[10px] font-medium ${
                isActive ? 'text-primary' : 'text-gray-400 dark:text-gray-500'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
