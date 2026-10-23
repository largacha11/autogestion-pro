import React, { useState } from 'react';
import { Car, Lock } from 'lucide-react';

interface LoginModalProps {
  onLogin: (user: string, pass: string) => void;
  onGuest: () => void;
}

export default function LoginModal({ onLogin, onGuest }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-2">
          <Car className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-black text-gray-900">AutoGestión <span className="text-blue-600">PRO</span></h1>
        <p className="text-sm text-gray-500 font-medium">Ingresa para administrar la vitrina</p>
        
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Usuario</label>
            <input required type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="Ej. admin o asesor" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Contraseña</label>
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="••••••" />
          </div>
          <button type="submit" className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-black rounded-xl flex justify-center items-center gap-2 transition-colors">
            <Lock className="w-4 h-4" /> Ingresar al Sistema
          </button>
        </form>
        
        <div className="pt-4 border-t border-gray-100">
          <button onClick={onGuest} className="w-full py-3 bg-blue-50 text-blue-700 font-bold text-sm rounded-xl hover:bg-blue-100 transition-colors">
            Entrar como Cliente (Vitrina QR)
          </button>
        </div>
      </div>
    </div>
  );
}
