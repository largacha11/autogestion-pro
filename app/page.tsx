'use client';
import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Car, PlusCircle, ArrowLeft, Settings, AlertTriangle, Share2, CheckCircle, Calculator, LogOut, Download, Edit3, Lock, RotateCcw, MapPin, User, Phone, DollarSign, Target, Trophy, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CAR_BRANDS = ['Chevrolet', 'Renault', 'Mazda', 'Kia', 'Toyota', 'Suzuki', 'Nissan', 'Volkswagen', 'Ford', 'Hyundai', 'BMW', 'Mercedes-Benz', 'Otro'];
const LOCATIONS = ['Vitrina Principal', 'Patio Exterior', 'Zona de Alistamiento', 'Taller', 'Bodega'];

declare global { interface Window { html2pdf: any; } }

export default function AutoGestionApp() {
  const [isMounted, setIsMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ role: 'admin' | 'asesor' | 'cliente', name: string } | null>(null);
  const [loginUsername, setLoginUsername] = useState('');
  
  const [appMode, setAppMode] = useState<'interno' | 'cliente'>('interno');
  const [activeTab, setActiveTab] = useState('inventory'); 
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [logs, setLogs] = useState<{date: string, action: string}[]>([]);
  
  // Estados UI y Búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ brand: '', location: '' });
  
  // Estado para Reservas
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [reserveData, setReserveData] = useState({ clientName: '', phone: '', deposit: '' });

  // Simulador de Crédito
  const [downPayment, setDownPayment] = useState('');
  const [loanMonths, setLoanMonths] = useState(48);
  const [includeTransfer, setIncludeTransfer] = useState(false);

  // Formulario de Vehículos
  const initialFormState = {
    brand: 'Chevrolet', model: '', version: '', year: 2024, salePrice: '', color: '', bodyType: 'SUV', mileageKm: '',
    engineCapacity: '', transmission: 'Automática', fuelType: 'Gasolina', traction: '4x2',
    plate: '', soatExpiration: '', tecnoExpiration: '', minimumPrice: '', advisorBonus: '', purchaseCost: '', reconditioningCost: '', location: 'Vitrina Principal'
  };
  const [formData, setFormData] = useState(initialFormState);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPrintView, setShowPrintView] = useState(false);

  useEffect(() => {
    const savedV = localStorage.getItem('ag_vehicles');
    const savedL = localStorage.getItem('ag_logs');
    if (savedV) setVehicles(JSON.parse(savedV));
    if (savedL) setLogs(JSON.parse(savedL));
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('ag_vehicles', JSON.stringify(vehicles));
      localStorage.setItem('ag_logs', JSON.stringify(logs));
    }
  }, [vehicles, logs, isMounted]);

  const addLog = (action: string) => {
    setLogs(prev => [{ date: new Date().toLocaleString(), action }, ...prev].slice(0, 50));
  };

  const handleLogin = (e: React.FormEvent, role: 'admin'|'asesor') => {
    e.preventDefault();
    if (!loginUsername.trim()) return alert("Ingresa un nombre.");
    setCurrentUser({ role, name: loginUsername });
    addLog(`Ingreso al sistema: ${loginUsername} (${role})`);
  };

  const handleLogout = () => {
    setCurrentUser(null); setAppMode('interno'); setSelectedVehicle(null); setActiveTab('inventory');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- CRUD Vehículos ---
  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.model || !formData.salePrice) return alert('Modelo y precio obligatorios.');
    const finalImages = uploadedImages.length > 0 ? uploadedImages : (isEditing ? vehicles.find(v=>v.id===editingId)?.gallery : ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80']);
    const num = (val: any) => Number(val) || 0;

    const payload = {
      ...formData, year: num(formData.year), salePrice: num(formData.salePrice), mileageKm: num(formData.mileageKm),
      purchaseCost: num(formData.purchaseCost), reconditioningCost: num(formData.reconditioningCost), 
      minimumPrice: num(formData.minimumPrice) || num(formData.salePrice), advisorBonus: num(formData.advisorBonus), 
      plate: formData.plate.toUpperCase(), coverPhoto: finalImages[0], gallery: finalImages
    };

    if (isEditing && editingId) {
      setVehicles(vehicles.map(v => v.id === editingId ? { ...v, ...payload } : v));
      addLog(`${currentUser?.name} actualizó el vehículo: ${payload.brand} ${payload.model}`);
    } else {
      setVehicles([{ id: `VEH-${Date.now()}`, ...payload, status: 'Disponible', createdAt: new Date().toISOString() }, ...vehicles]);
      addLog(`${currentUser?.name} registró un nuevo: ${payload.brand} ${payload.model}`);
    }
    setFormData(initialFormState); setUploadedImages([]); setIsEditing(false); setEditingId(null); setActiveTab('inventory');
  };

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    setVehicles(vehicles.map(v => v.id === selectedVehicle.id ? { 
      ...v, status: 'Reservado', reservedBy: currentUser?.name, clientName: reserveData.clientName, clientPhone: reserveData.phone, deposit: Number(reserveData.deposit) 
    } : v));
    addLog(`${currentUser?.name} RESERVÓ: ${selectedVehicle.brand} ${selectedVehicle.model} (Cliente: ${reserveData.clientName})`);
    setShowReserveModal(false); setSelectedVehicle(null);
  };

  const handleSell = (v: any) => {
    if(confirm("¿Confirmar venta cerrada?")) {
      setVehicles(vehicles.map(x => x.id === v.id ? { ...x, status: 'Vendido', soldBy: currentUser?.name, sellDate: new Date().toLocaleDateString() } : x));
      addLog(`💰 VENTA CERRADA: ${currentUser?.name} vendió ${v.brand} ${v.model}`);
      setSelectedVehicle(null);
    }
  };

  const handleRelease = (v: any) => {
    if(confirm("¿Liberar vehículo a vitrina? Se perderá la reserva.")) {
      setVehicles(vehicles.map(x => x.id === v.id ? { ...x, status: 'Disponible', reservedBy: null, clientName: null, deposit: null, soldBy: null, sellDate: null } : x));
      addLog(`🔄 VEHÍCULO LIBERADO: ${v.brand} ${v.model} vuelve a vitrina.`);
      setSelectedVehicle(null);
    }
  };

  const downloadHabladorPDF = () => {
    setShowPrintView(true);
    setTimeout(() => {
      const element = document.getElementById('hablador-pdf');
      const opt = { margin: 0, filename: `Ficha_${selectedVehicle.plate}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } };
      if (window.html2pdf) { window.html2pdf().set(opt).from(element).save().then(() => setShowPrintView(false)); } 
      else {
        const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        s.onload = () => window.html2pdf().set(opt).from(element).save().then(() => setShowPrintView(false));
        document.head.appendChild(s);
      }
    }, 800);
  };

  if (!isMounted) return null;

  // ================= 1. LOGIN =================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-2"><Car className="w-8 h-8 text-white" /></div>
          <h1 className="text-2xl font-black text-gray-900">AutoGestión <span className="text-blue-600">PRO</span></h1>
          
          <div className="space-y-4 text-left">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Tu Nombre o ID</label>
              <input type="text" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500" placeholder="Ej. Juan Pérez" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={(e) => handleLogin(e, 'asesor')} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl">Entrar Asesor</button>
              <button onClick={(e) => handleLogin(e, 'admin')} className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-black text-xs rounded-xl">Entrar Admin</button>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <button onClick={() => {setCurrentUser({role: 'cliente', name: 'Invitado'}); setAppMode('cliente');}} className="w-full py-3 bg-blue-50 text-blue-700 font-bold text-sm rounded-xl">Vitrina Pública (Cliente)</button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ================= 2. PDF VIEW =================
  if (showPrintView && selectedVehicle) {
    const v = selectedVehicle;
    return (
      <div className="fixed inset-0 bg-gray-900/95 z-50 flex flex-col items-center justify-center overflow-auto p-4">
        <div className="flex justify-between w-full max-w-[210mm] mb-3 items-center">
          <span className="text-white text-xs font-bold animate-pulse">Generando PDF...</span>
          <button onClick={() => setShowPrintView(false)} className="bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-lg">✖ Cerrar Visor</button>
        </div>
        <div id="hablador-pdf" className="bg-white" style={{ width: '210mm', height: '297mm', padding: '12mm', boxSizing: 'border-box' }}>
            <div className="text-center mb-6">
              <h1 className="text-4xl font-black text-gray-900 tracking-tighter">AutoGestión <span className="text-blue-600">PRO</span></h1>
              <p className="text-gray-500 text-sm uppercase font-bold tracking-widest mt-1">Vehículo Verificado y Certificado</p>
            </div>
            <img src={v.coverPhoto} className="w-full h-72 object-cover rounded-2xl mb-6 border-2 border-gray-900" crossOrigin="anonymous" alt="Carro" />
            <div className="text-center mb-6">
              <h2 className="text-5xl font-black text-gray-900 mb-2">{v.brand} {v.model}</h2>
              <h3 className="text-xl text-gray-600 font-bold">{v.version} • {v.year}</h3>
            </div>
            <div className="bg-gray-900 text-white rounded-3xl p-6 mb-6 text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-1">Precio de Oportunidad</p>
              <p className="text-6xl font-black">$ {v.salePrice.toLocaleString()}</p>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-8 text-center">
              {[['Kilometraje', `${v.mileageKm} km`], ['Transmisión', v.transmission], ['Motor', v.engineCapacity], ['Ubicación', v.location]].map((i, idx) => (
                <div key={idx} className="p-4 border-2 border-gray-100 rounded-2xl"><p className="text-[10px] text-gray-500 uppercase font-bold">{i[0]}</p><p className="text-sm font-black mt-1">{i[1]}</p></div>
              ))}
            </div>
            <div className="flex justify-center items-center gap-6 bg-gray-50 p-6 rounded-3xl border-2 border-gray-100">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://tu-concesionario.com/v/${v.id}`} alt="QR" className="w-32 h-32 rounded-xl" crossOrigin="anonymous" />
              <div className="text-left">
                <h4 className="text-2xl font-black text-gray-900">Escanea para comprar</h4>
                <p className="text-gray-500 text-sm font-medium mt-2">Usa la cámara de tu celular para ver<br/>más fotos y simular tu crédito en línea.</p>
              </div>
            </div>
        </div>
      </div>
    );
  }

  // ================= 3. DETALLE DEL VEHÍCULO =================
  if (selectedVehicle && !showReserveModal) {
    const v = selectedVehicle;
    const transferCost = (v.salePrice * 0.01 + 350000) / 2;
    const creditPrincipal = (v.salePrice - Number(downPayment || 0)) + (includeTransfer ? transferCost : 0);
    const monthlyFee = Math.round(creditPrincipal * 0.015 / (1 - Math.pow(1.015, -loanMonths)));

    return (
      <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="min-h-screen bg-gray-50 pb-24">
        
        {/* PARCHE 1: BARRA SUPERIOR CON WHATSAPP Y BORRAR */}
        <div className="bg-white p-4 shadow-sm sticky top-0 z-20 flex justify-between items-center">
          <button onClick={() => setSelectedVehicle(null)} className="flex items-center gap-2 text-gray-600 font-bold text-sm"><ArrowLeft className="w-5 h-5" /> Volver</button>
          
          <div className="flex gap-2">
            {appMode === 'interno' && currentUser?.role !== 'cliente' && (
              <>
                {currentUser?.role === 'admin' && (
                  <button onClick={() => { if(confirm("¿Borrar vehículo del sistema?")) { setVehicles(vehicles.filter(x => x.id !== v.id)); setSelectedVehicle(null); } }} className="bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-[10px] font-black">Borrar</button>
                )}
                <button onClick={() => {setFormData({...v}); setUploadedImages(v.gallery || [v.coverPhoto]); setIsEditing(true); setEditingId(v.id); setActiveTab('new'); setSelectedVehicle(null);}} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-[10px] font-black"><Edit3 className="w-3 h-3 inline"/> Editar</button>
                <button onClick={downloadHabladorPDF} className="bg-gray-900 text-white px-3 py-1.5 rounded-full text-[10px] font-black"><Download className="w-3 h-3 inline"/> PDF</button>
              </>
            )}
            <button onClick={() => window.open(`https://wa.me/?text=¡Hola! Mira este vehículo:%0A🚗 *${v.brand} ${v.model}* ${v.version}%0A💰 *Precio: $${v.salePrice.toLocaleString()}*%0A%0A¡Pregúntame por él!`, '_blank')} className="bg-green-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black flex items-center gap-1"><Share2 className="w-3 h-3"/> Enviar</button>
          </div>
        </div>
        
        <div className="w-full h-72 bg-gray-900 relative">
          <img src={v.coverPhoto} className="w-full h-full object-cover opacity-90" />
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold border border-white/20"><MapPin className="w-3.5 h-3.5 text-red-400"/> {v.location}</div>
        </div>
        
        <main className="p-4 max-w-md mx-auto space-y-4 -mt-6 relative z-10">
          <div className="bg-white p-5 rounded-3xl shadow-xl border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-2xl font-black text-gray-900 leading-tight">{v.brand} {v.model}</h1>
              {appMode === 'interno' && v.status === 'Disponible' && <span className="bg-blue-100 text-blue-700 text-[9px] font-black px-2 py-1 rounded-md uppercase">Disponible</span>}
              {appMode === 'interno' && v.status === 'Reservado' && <span className="bg-yellow-100 text-yellow-700 text-[9px] font-black px-2 py-1 rounded-md uppercase">Reservado</span>}
              {appMode === 'interno' && v.status === 'Vendido' && <span className="bg-green-100 text-green-700 text-[9px] font-black px-2 py-1 rounded-md uppercase">Vendido</span>}
            </div>
            <p className="text-sm text-gray-500 font-medium mb-3">{v.version} • {v.year} • {v.mileageKm.toLocaleString()} km</p>
            <p className="text-4xl font-black text-blue-600">$ {v.salePrice.toLocaleString()}</p>
          </div>

          {/* CRM y Venta (Solo Interno) */}
          {appMode === 'interno' && (
            <div className="bg-gray-900 rounded-3xl p-5 shadow-lg border border-gray-800 text-white">
              <h3 className="text-xs font-black text-yellow-500 uppercase mb-4 flex items-center gap-2"><Target className="w-4 h-4" /> Zona de Negociación</h3>
              
              {v.status === 'Disponible' && (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><span className="text-[10px] text-gray-400 block mb-1">PRECIO PISO</span><span className="text-sm font-bold">$ {v.minimumPrice.toLocaleString()}</span></div>
                    <div><span className="text-[10px] text-gray-400 block mb-1">COMISIÓN ASESOR</span><span className="text-sm font-bold text-green-400">$ {v.advisorBonus.toLocaleString()}</span></div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowReserveModal(true)} className="w-1/2 py-3 bg-yellow-500 text-yellow-950 font-black rounded-xl text-sm">PISAR NEGOCIO</button>
                    <button onClick={() => handleSell(v)} className="w-1/2 py-3 bg-green-600 text-white font-black rounded-xl text-sm">CERRAR VENTA</button>
                  </div>
                </>
              )}
              
              {v.status === 'Reservado' && (
                <div className="space-y-4">
                  <div className="bg-gray-800 p-3 rounded-xl border border-gray-700">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Cliente en Trámite</p>
                    <p className="font-bold text-sm text-yellow-400">{v.clientName} <span className="text-gray-300">({v.clientPhone})</span></p>
                    <p className="text-xs text-gray-400 mt-1">Anticipo: <strong className="text-white">${v.deposit?.toLocaleString()}</strong></p>
                    <p className="text-[9px] text-gray-500 mt-1">Asesor: {v.reservedBy}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleRelease(v)} className="w-1/2 py-3 bg-red-600/20 text-red-400 border border-red-600/30 font-black rounded-xl text-xs">REVERTIR RESERVA</button>
                    <button onClick={() => handleSell(v)} className="w-1/2 py-3 bg-green-600 text-white font-black rounded-xl text-xs">APROBADO: VENDER</button>
                  </div>
                </div>
              )}

              {v.status === 'Vendido' && (
                <div className="text-center py-2">
                  <Trophy className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="font-black text-green-400">VENDIDO POR {v.soldBy?.toUpperCase()}</p>
                  <p className="text-xs text-gray-400">{v.sellDate}</p>
                  <button onClick={() => handleRelease(v)} className="mt-4 px-4 py-2 bg-gray-800 text-gray-400 font-bold rounded-lg text-[10px]">Revertir Venta (Admin)</button>
                </div>
              )}
            </div>
          )}

          {/* Simulador Financiero Valle del Cauca */}
          <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100">
            <h3 className="text-sm font-black flex items-center gap-2 text-blue-900 mb-4"><Calculator className="w-4 h-4" /> Simulador de Crédito</h3>
            <div className="space-y-3">
              <div><label className="text-[10px] font-bold text-blue-700">Cuota Inicial ($)</label><input type="number" value={downPayment} onChange={(e)=>setDownPayment(e.target.value)} className="w-full px-4 py-2.5 rounded-xl text-sm mt-1 border border-blue-200" placeholder="0" /></div>
              <div><label className="text-[10px] font-bold text-blue-700">Plazo</label><select value={loanMonths} onChange={(e)=>setLoanMonths(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl text-sm mt-1 border border-blue-200">{[12,24,36,48,60,72].map(m => <option key={m} value={m}>{m} Meses</option>)}</select></div>
              <label className="flex items-center gap-2 mt-2 cursor-pointer bg-white p-2 rounded-lg border border-blue-100">
                <input type="checkbox" checked={includeTransfer} onChange={e => setIncludeTransfer(e.target.checked)} className="w-4 h-4 accent-blue-600" />
                <span className="text-[10px] font-bold text-blue-900">Incluir Gastos Traspaso (50/50) <span className="text-gray-400 block font-medium">Est. +${Math.round(transferCost).toLocaleString()} al crédito</span></span>
              </label>
              <div className="flex justify-between items-center pt-4 border-t border-blue-200 mt-2">
                <span className="text-xs font-bold text-blue-900">Cuota Mensual Aprox:</span>
                <span className="text-xl font-black text-blue-700">$ {monthlyFee > 0 ? monthlyFee.toLocaleString() : 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-black flex items-center gap-2 mb-4"><Settings className="w-4 h-4 text-gray-400" /> Ficha Técnica</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              {[ ['Motor', v.engineCapacity], ['Transmisión', v.transmission], ['Gasolina', v.fuelType], ['Color', v.color], ['Carrocería', v.bodyType], ['Placa', v.plate] ].map((i, idx) => (
                <div key={idx}><span className="text-[10px] text-gray-400 uppercase font-bold block">{i[0]}</span><span className="text-sm font-bold text-gray-800">{i[1]}</span></div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2">
              <div className="bg-gray-50 p-2 rounded-lg"><span className="text-[9px] text-gray-400 uppercase font-bold block">Venc. SOAT</span><span className="text-xs font-bold text-red-600">{v.soatExpiration || 'Revisar'}</span></div>
              <div className="bg-gray-50 p-2 rounded-lg"><span className="text-[9px] text-gray-400 uppercase font-bold block">Venc. Tecnomecánica</span><span className="text-xs font-bold text-red-600">{v.tecnoExpiration || 'Revisar'}</span></div>
            </div>
          </div>
        </main>
      </motion.div>
    );
  }

  // ================= MODAL RESERVA =================
  if (showReserveModal) {
    return (
      <div className="fixed inset-0 bg-gray-900/80 z-50 flex items-center justify-center p-4">
        <motion.form initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onSubmit={handleReserve} className="bg-white rounded-3xl p-6 w-full max-w-sm space-y-4">
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2"><Lock className="w-5 h-5 text-yellow-500"/> Pisar Negocio</h2>
          <p className="text-xs text-gray-500 font-medium">El vehículo pasará a "Reservado" y se ocultará de la vitrina pública.</p>
          <div><label className="text-[10px] font-bold text-gray-500">NOMBRE DEL CLIENTE</label><input required value={reserveData.clientName} onChange={e=>setReserveData({...reserveData, clientName: e.target.value})} className="w-full p-3 border rounded-xl text-sm mt-1" /></div>
          <div><label className="text-[10px] font-bold text-gray-500">TELÉFONO</label><input required type="tel" value={reserveData.phone} onChange={e=>setReserveData({...reserveData, phone: e.target.value})} className="w-full p-3 border rounded-xl text-sm mt-1" /></div>
          <div><label className="text-[10px] font-bold text-gray-500">VALOR ANTICIPO / SEPARACIÓN (COP)</label><input required type="number" value={reserveData.deposit} onChange={e=>setReserveData({...reserveData, deposit: e.target.value})} className="w-full p-3 border rounded-xl text-sm mt-1 font-bold" /></div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={() => setShowReserveModal(false)} className="w-1/3 py-3 bg-gray-100 font-bold rounded-xl text-sm">Cancelar</button>
            <button type="submit" className="w-2/3 py-3 bg-yellow-500 text-yellow-950 font-black rounded-xl text-sm">Confirmar Reserva</button>
          </div>
        </motion.form>
      </div>
    );
  }

  // ================= RENDERIZADO PRINCIPAL (TABS) =================
  const getFilteredInventory = () => {
    let list = vehicles;
    // Cliente solo ve azules (Disponibles)
    if (appMode === 'cliente') list = list.filter(v => v.status === 'Disponible');
    
    // Búsqueda de texto
    if (searchTerm) list = list.filter(v => `${v.brand} ${v.model} ${v.plate}`.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filtros rápidos
    if (filters.brand) list = list.filter(v => v.brand === filters.brand);
    if (filters.location) list = list.filter(v => v.location === filters.location);
    return list;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* HEADER */}
      <div className="bg-gray-900 px-4 py-4 text-white sticky top-0 z-20 shadow-lg flex justify-between items-start">
        <div>
          <h1 className="font-black text-xl leading-none">AutoGestión <span className="text-blue-500">PRO</span></h1>
          <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase flex items-center gap-1"><User className="w-3 h-3"/> {currentUser.name} ({currentUser.role})</p>
        </div>
        <div className="flex gap-2">
          {currentUser.role !== 'cliente' && (
            <button onClick={() => setAppMode(appMode === 'interno' ? 'cliente' : 'interno')} className={`px-3 py-2 rounded-lg text-[9px] font-bold transition-colors ${appMode === 'interno' ? 'bg-blue-600' : 'bg-green-600'}`}>VISTA {appMode === 'interno' ? 'CLIENTE' : 'INTERNA'}</button>
          )}
          <button onClick={handleLogout} className="bg-gray-800 p-2 rounded-lg text-gray-300"><LogOut className="w-4 h-4" /></button>
        </div>
      </div>

      <main className="max-w-md mx-auto relative">
        <AnimatePresence mode="wait">
          {/* TAB: VITRINA */}
          {activeTab === 'inventory' && (
            <motion.div key="inv" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white flex items-center px-3 py-2.5 rounded-2xl shadow-sm border border-gray-100">
                  <Search className="w-4 h-4 text-gray-400 mr-2" />
                  <input type="text" placeholder="Buscar vehículo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full text-sm outline-none bg-transparent" />
                </div>
                <button onClick={() => setShowFilters(!showFilters)} className={`p-3 rounded-2xl transition-colors ${showFilters ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-100 shadow-sm'}`}><SlidersHorizontal className="w-4 h-4" /></button>
              </div>

              {showFilters && (
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-2 gap-3 text-xs">
                  <select value={filters.brand} onChange={e=>setFilters({...filters, brand: e.target.value})} className="p-2 border rounded-xl"><option value="">Todas las marcas</option>{CAR_BRANDS.map(b=><option key={b}>{b}</option>)}</select>
                  <select value={filters.location} onChange={e=>setFilters({...filters, location: e.target.value})} className="p-2 border rounded-xl"><option value="">Cualquier Ubicación</option>{LOCATIONS.map(b=><option key={b}>{b}</option>)}</select>
                  <button onClick={() => setFilters({brand:'', location:''})} className="col-span-2 py-2 bg-gray-100 font-bold rounded-xl">Limpiar Filtros</button>
                </div>
              )}

              <div className="space-y-3">
                {getFilteredInventory().map((v) => (
                  <div key={v.id} onClick={() => setSelectedVehicle(v)} className={`bg-white rounded-2xl shadow-sm border overflow-hidden flex h-32 cursor-pointer transition-shadow hover:shadow-md ${v.status === 'Reservado' ? 'border-yellow-200 bg-yellow-50/30' : v.status === 'Vendido' ? 'border-green-200 bg-green-50/30' : 'border-gray-100'}`}>
                    <div className="w-1/3 h-full relative">
                      <img src={v.coverPhoto} className="w-full h-full object-cover" />
                      {v.status === 'Reservado' && <div className="absolute inset-0 bg-yellow-500/20 backdrop-blur-[1px] flex items-center justify-center"><Lock className="w-6 h-6 text-yellow-100 drop-shadow-md"/></div>}
                    </div>
                    <div className="p-3 w-2/3 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-black text-gray-900 leading-tight pr-1">{v.brand} {v.model}</h3>
                          {appMode === 'interno' && <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${v.status === 'Disponible' ? 'bg-blue-500' : v.status === 'Reservado' ? 'bg-yellow-400' : 'bg-green-500'}`} />}
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium">{v.year} • {v.mileageKm.toLocaleString()} km</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-lg font-black text-blue-600 leading-none">$ {(v.salePrice/1000000).toFixed(1)}M</span>
                        <span className="text-[9px] text-gray-400 flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5"/> {v.location.split(' ')[0]}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {getFilteredInventory().length === 0 && <p className="text-center text-gray-400 py-10 text-sm font-bold">No hay vehículos.</p>}
              </div>
            </motion.div>
          )}

          {/* TAB: METAS Y RENDIMIENTO (PARQUEADERO) */}
          {activeTab === 'metas' && (
            <motion.div key="metas" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-4 space-y-5">
              
              {/* VISTA ASESOR */}
              {currentUser.role === 'asesor' && (
                <>
                  <div className="bg-gray-900 rounded-3xl p-6 text-white text-center shadow-lg border border-gray-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Mis Comisiones (Mes)</p>
                    <p className="text-5xl font-black text-green-400">
                      $ {vehicles.filter(v => v.status === 'Vendido' && v.soldBy === currentUser.name).reduce((acc, v) => acc + (v.advisorBonus||0), 0).toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-black text-gray-900 flex items-center gap-2 mb-4"><Target className="w-4 h-4 text-blue-500" /> Mi Parqueadero de Metas</h3>
                    <div className="flex flex-wrap gap-3">
                      {/* Generar siluetas */}
                      {Array.from({ length: 10 }).map((_, i) => {
                        const misVendidos = vehicles.filter(v => v.status === 'Vendido' && v.soldBy === currentUser.name).length;
                        const misReservados = vehicles.filter(v => v.status === 'Reservado' && v.reservedBy === currentUser.name).length;
                        
                        let colorClass = 'text-gray-200';
                        if (i < misVendidos) colorClass = 'text-green-500 drop-shadow-sm';
                        else if (i < misVendidos + misReservados) colorClass = 'text-yellow-400 drop-shadow-sm';
                        
                        return <Car key={i} className={`w-10 h-10 ${colorClass} transition-colors duration-500`} />;
                      })}
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 mt-4 text-center uppercase">Rellena el parqueadero para romper tu meta</p>
                  </div>
                </>
              )}

              {/* VISTA ADMIN */}
              {currentUser.role === 'admin' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                      <p className="text-[9px] text-gray-400 uppercase font-bold mb-1">Capital en Vitrina</p>
                      <p className="text-xl font-black text-gray-900">$ {(vehicles.filter(v => v.status !== 'Vendido').reduce((acc, v) => acc + (v.purchaseCost || 0) + (v.reconditioningCost || 0), 0)/1000000).toFixed(1)}M</p>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-3xl shadow-lg border border-gray-800 text-white">
                      <p className="text-[9px] text-green-400 uppercase font-bold mb-1">Utilidad Generada</p>
                      <p className="text-xl font-black">$ {(vehicles.filter(v=>v.status === 'Vendido').reduce((acc, v) => acc + (v.salePrice - (v.purchaseCost || 0) - (v.reconditioningCost || 0) - (v.advisorBonus || 0)), 0)/1000000).toFixed(1)}M</p>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-black text-gray-900 flex items-center gap-2 mb-4"><Trophy className="w-4 h-4 text-yellow-500" /> Leaderboard Asesores</h3>
                    <div className="space-y-3">
                      {Array.from(new Set(vehicles.filter(v=>v.status==='Vendido').map(v=>v.soldBy))).map((asesor, idx) => {
                        if(!asesor) return null;
                        const qty = vehicles.filter(v=>v.status==='Vendido' && v.soldBy===asesor).length;
                        return (
                          <div key={asesor} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <span className="text-lg font-black text-gray-300">#{idx+1}</span>
                              <span className="font-bold text-sm">{asesor}</span>
                            </div>
                            <div className="flex gap-1">{Array.from({length: qty}).map((_,i)=><Car key={i} className="w-4 h-4 text-green-500"/>)}</div>
                          </div>
                        );
                      })}
                      {vehicles.filter(v=>v.status==='Vendido').length === 0 && <p className="text-xs text-gray-400 text-center">No hay ventas registradas aún.</p>}
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-black text-gray-900 flex items-center gap-2 mb-4"><Clock className="w-4 h-4 text-gray-400" /> Historial Logístico</h3>
                    <div className="space-y-2 h-40 overflow-y-auto pr-2 text-xs">
                      {logs.map((log, i) => (
                        <div key={i} className="py-2 border-b border-gray-50 flex flex-col">
                          <span className="text-[9px] text-gray-400 font-bold">{log.date}</span>
                          <span className="text-gray-700 font-medium">{log.action}</span>
                        </div>
                      ))}
                      {logs.length === 0 && <p className="text-xs text-gray-400">Sin movimientos.</p>}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* TAB: REGISTRO (FORMULARIO) */}
          {activeTab === 'new' && (
            <motion.div key="new" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-4">
              <h2 className="text-xl font-black mb-4">{isEditing ? 'Editar Vehículo' : 'Ingresar Vehículo'}</h2>
              
              {/* PARCHE 2: FORMULARIO COMPLETO Y FOTOS */}
              <form onSubmit={handleSaveVehicle} className="space-y-4 pb-10">
                <div className="bg-white p-4 rounded-3xl border border-gray-100 space-y-3">
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <span className="text-xs font-bold text-gray-500">Subir fotos (Toca aquí)</span>
                    <input type="file" className="hidden" multiple accept="image/*" onChange={(e) => {
                      if (e.target.files) {
                        Promise.all(Array.from(e.target.files).map(file => new Promise<string>((resolve) => {
                          const reader = new FileReader(); reader.onload = (ev) => resolve(ev.target?.result as string); reader.readAsDataURL(file);
                        }))).then(imgs => setUploadedImages(prev => [...prev, ...imgs]));
                      }
                    }} />
                  </label>
                  {uploadedImages.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto py-2">
                      {uploadedImages.map((img, i) => (
                        <div key={i} className="relative w-20 h-20 flex-shrink-0"><img src={img} className="w-full h-full object-cover rounded-lg shadow-sm" /><button type="button" onClick={() => setUploadedImages(uploadedImages.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X className="w-3 h-3" /></button></div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Ubicación Física 📍</label>
                    <select name="location" value={formData.location} onChange={handleInputChange} className="w-full p-3 border rounded-xl text-sm mt-1 bg-gray-50 font-bold text-blue-900">{LOCATIONS.map(b=><option key={b}>{b}</option>)}</select>
                  </div>
                  
                  <div><label className="text-[10px] font-bold text-gray-400">Marca</label><select name="brand" value={formData.brand} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm bg-gray-50">{CAR_BRANDS.map(b=><option key={b}>{b}</option>)}</select></div>
                  <div><label className="text-[10px] font-bold text-gray-400">Modelo</label><input required name="model" value={formData.model} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm bg-gray-50" /></div>
                  <div><label className="text-[10px] font-bold text-gray-400">Versión</label><input name="version" value={formData.version} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm bg-gray-50" /></div>
                  <div><label className="text-[10px] font-bold text-gray-400">Placa</label><input name="plate" value={formData.plate} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm bg-gray-50 uppercase" /></div>
                  <div><label className="text-[10px] font-bold text-gray-400">Año</label><input type="number" name="year" value={formData.year} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm bg-gray-50" /></div>
                  <div><label className="text-[10px] font-bold text-gray-400">Kilometraje</label><input type="number" name="mileageKm" value={formData.mileageKm} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm bg-gray-50" /></div>
                  
                  <div><label className="text-[10px] font-bold text-gray-400">Color</label><input name="color" value={formData.color} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm bg-gray-50" /></div>
                  <div><label className="text-[10px] font-bold text-gray-400">Carrocería</label><select name="bodyType" value={formData.bodyType} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm bg-gray-50"><option>SUV</option><option>Sedán</option><option>Hatchback</option><option>Pick-up</option><option>Coupé</option></select></div>
                  <div><label className="text-[10px] font-bold text-gray-400">Motor</label><input name="engineCapacity" value={formData.engineCapacity} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm bg-gray-50" /></div>
                  <div><label className="text-[10px] font-bold text-gray-400">Transmisión</label><select name="transmission" value={formData.transmission} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm bg-gray-50"><option>Automática</option><option>Manual</option></select></div>
                  <div><label className="text-[10px] font-bold text-gray-400">Combustible</label><select name="fuelType" value={formData.fuelType} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm bg-gray-50"><option>Gasolina</option><option>Diesel</option><option>Híbrido</option><option>Eléctrico</option></select></div>
                  <div><label className="text-[10px] font-bold text-gray-400">Tracción</label><select name="traction" value={formData.traction} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm bg-gray-50"><option>4x2</option><option>4x4</option><option>AWD</option></select></div>
                  
                  <div><label className="text-[10px] font-bold text-gray-400">Venc. SOAT</label><input type="date" name="soatExpiration" value={formData.soatExpiration} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm bg-gray-50" /></div>
                  <div><label className="text-[10px] font-bold text-gray-400">Venc. Tecno</label><input type="date" name="tecnoExpiration" value={formData.tecnoExpiration} onChange={handleInputChange} className="w-full p-2 border rounded-lg text-sm bg-gray-50" /></div>
                </div>

                <div className="bg-gray-900 p-6 rounded-3xl shadow-lg border border-gray-800 text-white grid grid-cols-2 gap-4">
                  <div className="col-span-2"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Precio Venta Público</label><input required type="number" name="salePrice" value={formData.salePrice} onChange={handleInputChange} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-2xl font-black mt-1" /></div>
                  <div className="col-span-2 border-t border-gray-800 pt-3"><label className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Comisión Asesor (Bono)</label><input type="number" name="advisorBonus" value={formData.advisorBonus} onChange={handleInputChange} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-sm font-bold mt-1 text-green-400" /></div>
                  {currentUser?.role === 'admin' && (
                    <>
                      <div><label className="text-[10px] font-bold text-gray-500 uppercase">Costo Compra</label><input type="number" name="purchaseCost" value={formData.purchaseCost} onChange={handleInputChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-sm mt-1" /></div>
                      <div><label className="text-[10px] font-bold text-gray-500 uppercase">Arreglos</label><input type="number" name="reconditioningCost" value={formData.reconditioningCost} onChange={handleInputChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-sm mt-1" /></div>
                      <div className="col-span-2"><label className="text-[10px] font-bold text-gray-500 uppercase">Precio Piso (Mínimo)</label><input type="number" name="minimumPrice" value={formData.minimumPrice} onChange={handleInputChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-sm mt-1" /></div>
                    </>
                  )}
                </div>

                <button type="submit" className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 active:scale-95 transition-all">
                  {isEditing ? 'Guardar Cambios' : 'Ingresar a Vitrina'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* BOTTOM NAV */}
      {appMode === 'interno' && currentUser.role !== 'cliente' && !selectedVehicle && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-3 px-6 flex justify-around max-w-md mx-auto shadow-[0_-10px_40px_rgb(0,0,0,0.05)] z-30 pb-safe">
          <button onClick={() => setActiveTab('inventory')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'inventory' ? 'text-blue-600' : 'text-gray-400'}`}>
            <Car className="w-6 h-6" /><span className="text-[9px] font-black uppercase tracking-widest">Vitrina</span>
          </button>
          <button onClick={() => setActiveTab('metas')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'metas' ? 'text-blue-600' : 'text-gray-400'}`}>
            <Target className="w-6 h-6" /><span className="text-[9px] font-black uppercase tracking-widest">{currentUser.role === 'admin' ? 'Dashboard' : 'Mis Metas'}</span>
          </button>
          <button onClick={() => {setActiveTab('new'); setFormData(initialFormState); setIsEditing(false);}} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'new' ? 'text-blue-600' : 'text-gray-400'}`}>
            <PlusCircle className="w-6 h-6" /><span className="text-[9px] font-black uppercase tracking-widest">Ingresar</span>
          </button>
        </nav>
      )}
    </div>
  );
}
