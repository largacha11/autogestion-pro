import React, { useState } from 'react';
import { Lock, Mail, Car } from 'lucide-react';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {    e.preventDefault();
    // Aquí iría la lógica de autenticación (ej. Supabase o Firebase)
    console.log('Iniciando sesión con:', email);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 animate-in zoom-in duration-300">
        
        {/* Logo del Concesionario (Marca Blanca) */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <Car className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white text-center">
            AutoElite <span className="text-primary">Pro</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gestión de Inventario Automotriz
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="email" 
                placeholder="asesor@autoelite.com"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-3.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:-translate-y-0.5 mt-2"
          >
            Ingresar al Sistema
          </button>
        </form>

        {/* Nota de seguridad */}
        <p className="text-xs text-center text-gray-400 mt-6 font-medium">
          Acceso restringido solo para personal autorizado.
        </p>
      </div>
    </div>
  );
}
