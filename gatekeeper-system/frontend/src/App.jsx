import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import gsap from 'gsap';
import { 
  Mail, KeyRound, ArrowRight, ShieldCheck, Server, Database, 
  Workflow, Activity, CheckCircle2, XCircle, Download, User,
  QrCode, Lock, Fingerprint, RotateCcw
} from 'lucide-react';
import './index.css';

const API_URL = 'http://localhost:3000/api';

const LOADING_TIPS = [
  "Validando datos y credenciales institucionales...",
  "El orquestador n8n buscando coincidencias de tu pago...",
  "Conexión segura establecida. Mantén esta ventana abierta...",
  "Casi terminamos la verificación del sistema Gatekeeper..."
];

export default function App() {
  const [email, setEmail] = useState('');
  const [folio, setFolio] = useState('');
  const [status, setStatus] = useState('idle');
  const [currentTip, setCurrentTip] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const cardRef = useRef(null);

  // GSAP: Animaciones Dinámicas
  useEffect(() => {
    if (status === 'aceptado' && cardRef.current) {
      gsap.fromTo(cardRef.current,
        { scale: 0.5, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 1.2, ease: 'elastic.out(1, 0.7)' }
      );
    } else if (status === 'rechazado') {
      gsap.fromTo('.error-shake',
        { x: -10 }, { x: 10, duration: 0.1, yoyo: true, repeat: 5, ease: 'linear' }
      );
    }
  }, [status]);

  // Rotador de Consejos (Loading Tips)
  useEffect(() => {
    let tipInterval;
    if (status === 'procesando') {
      tipInterval = setInterval(() => {
        setCurrentTip(prev => (prev + 1) % LOADING_TIPS.length);
      }, 3000);
    }
    return () => clearInterval(tipInterval);
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !folio) return;
    setStatus('procesando');
    setCurrentTip(0);

    try {
      await axios.post(`${API_URL}/solicitar-acceso`, { email, folio });
    } catch (err) {
      setTimeout(() => setStatus('rechazado'), 4000);
    }
  };

  useEffect(() => {
    let interval;
    if (status === 'procesando') {
      interval = setInterval(async () => {
        try {
          const res = await axios.get(`${API_URL}/verificar-estatus/${email}`);
          if (res.data.estatus !== 'Procesando') {
            setStatus(res.data.estatus.toLowerCase());
            clearInterval(interval);
          }
        } catch (err) { }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [status, email]);

  const resetForm = () => {
    setStatus('idle');
    setFolio('');
    setIsFlipped(false);
  };

  const studentId = email ? btoa(email).substring(0, 8).toUpperCase() : 'ISC00000';
  const currentDate = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col items-center justify-center p-4 md:p-8 font-sans overflow-y-auto">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row my-auto">
        
        {/* PANEL LATERAL ITSES (Navy) */}
        <div className="flex order-2 md:order-1 md:w-[40%] text-slate-300 flex-col justify-between p-10 relative overflow-hidden" style={{ background: '#111c2e' }}>
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#d4af37] rounded-full opacity-5 blur-3xl pointer-events-none"></div>
          
          <div>
            <div className="flex items-center gap-3 mb-12">
              <ShieldCheck className="h-10 w-10 text-[#d4af37]" />
              <div>
                <h1 className="text-xl font-black text-white tracking-widest leading-none">GATEKEEPER</h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-bold mt-1">ITSES Security</p>
              </div>
            </div>

            <p className="text-sm text-slate-400/90 leading-relaxed mb-10 border-l-2 border-[#d4af37] pl-4">
              Arquitectura de validación en tiempo real automatizada con orquestador n8n.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-slate-800/30 p-4 rounded-xl border border-white/5 shadow-lg relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#d4af37]"></div>
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                <Server className="h-5 w-5 text-[#d4af37]" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Servidor Node.js</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">En línea</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-800/30 p-4 rounded-xl border border-white/5 shadow-lg relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#d4af37]"></div>
                <div className="h-2 w-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                <Database className="h-5 w-5 text-[#d4af37]" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">PostgreSQL</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">Conexión Segura</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-800/30 p-4 rounded-xl border border-white/5 shadow-lg relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#d4af37]"></div>
                <div className="h-2 w-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                <Workflow className="h-5 w-5 text-[#d4af37]" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Automations n8n</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">Webhooks Activos</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-500 font-bold tracking-widest uppercase">
            <span>ITSES Tech 2026</span>
            <Activity className="h-5 w-5 text-slate-600" />
          </div>
        </div>

        {/* ÁREA PRINCIPAL */}
        <div className="w-full md:w-[60%] order-1 md:order-2 p-8 md:p-14 relative bg-white overflow-y-auto">
          
          <div className="md:hidden flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
            <ShieldCheck className="h-6 w-6 text-slate-900" />
            <h1 className="text-lg font-black text-slate-900 tracking-wider">GATEKEEPER ITSES</h1>
          </div>

          <div className="max-w-md mx-auto relative h-full flex flex-col justify-center pb-4 md:pb-0">
            
            {/* 1. ESTADO: Formulario de Ingreso */}
            {status === 'idle' && (
              <div className="animate-in fade-in duration-500">
                <div className="mb-10 text-left">
                  <h2 className="text-3xl font-black text-slate-900 mb-3">Acceso Autorizado</h2>
                  <p className="text-slate-500 font-medium text-sm md:text-base">
                    Autenticación vía n8n y Base de Datos. Ingresa tus credenciales ITSES.
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-bold rounded-full shadow-sm">
                    <Lock className="h-3.5 w-3.5" /> Conexión 100% Segura
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                      <Mail className="h-4 w-4 text-[#d4af37]" /> Correo Institucional
                    </label>
                    <input
                      type="email"
                      required
                      className="block w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#d4af37]/50 focus:border-[#d4af37] focus:bg-white transition-all text-sm outline-none font-medium text-slate-800"
                      placeholder="alumno@itses.edu.mx"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                      <KeyRound className="h-4 w-4 text-[#d4af37]" /> Folio de Pago (Recibo)
                    </label>
                    <input
                      type="text"
                      required
                      className="block w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#d4af37]/50 focus:border-[#d4af37] focus:bg-white transition-all text-sm outline-none uppercase font-mono tracking-widest font-bold text-slate-800"
                      placeholder="FOLIO-12345"
                      value={folio}
                      onChange={(e) => setFolio(e.target.value.toUpperCase())}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 text-white font-black py-4 px-4 rounded-xl transition-all shadow-lg active:scale-[0.98] mt-8 uppercase tracking-[0.15em] text-sm"
                    style={{ background: '#111c2e' }}
                  >
                    Validar Acceso
                    <ArrowRight className="h-5 w-5 text-[#d4af37]" />
                  </button>
                </form>
              </div>
            )}

            {/* 2. ESTADO: Procesando con Consejos */}
            {status === 'procesando' && (
              <div className="flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="relative mb-14 mt-4">
                  <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-[#d4af37]"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-dashed border-slate-900/10 rounded-full animate-[spin_8s_linear_infinite]"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 border-[3px] border-dotted border-[#d4af37]/50 rounded-full animate-[spin_6s_linear_infinite_reverse]"></div>
                  
                  <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-xl relative z-10">
                    <Fingerprint className="h-12 w-12 text-slate-900 animate-pulse" />
                  </div>
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-8 text-center uppercase tracking-widest">
                  Analizando...
                </h3>
                
                {/* Caja de status animada */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 w-full shadow-inner relative overflow-hidden h-[120px] flex flex-col justify-center items-center text-center">
                  <Activity className="h-6 w-6 text-[#d4af37] mb-2 opacity-50 absolute top-4" />
                  <p key={currentTip} className="text-sm font-bold text-slate-600 mt-4 leading-relaxed px-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {LOADING_TIPS[currentTip]}
                  </p>
                </div>
              </div>
            )}

            {/* 3. ESTADO: Aceptado (Gafete 3D) */}
            {status === 'aceptado' && (
              <div className="w-full relative animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col items-center justify-center gap-1 mb-8 text-slate-900 bg-[#fffdf0] p-4 rounded-xl border border-yellow-200/60 shadow-sm text-center">
                  <div className="flex items-center gap-2">
                    <div className="bg-yellow-100 rounded-full p-1"><CheckCircle2 className="h-4 w-4 text-yellow-600" /></div>
                    <p className="text-xs font-black tracking-widest uppercase text-slate-800">Validación Aprobada</p>
                  </div>
                  <p className="text-[11px] text-slate-600 font-bold mt-1">Acceso liberado por orquestador n8n.</p>
                </div>

                {/* Flip Card Container */}
                <div ref={cardRef} className="mb-6 relative" style={{ perspective: '1200px' }}>
                  <div 
                    className="relative w-full max-w-[320px] mx-auto transition-transform duration-700 aspect-[5/8]"
                    style={{ 
                      transformStyle: 'preserve-3d', 
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' 
                    }}
                  >
                    
                    {/* FRENTE DE LA CREDENCIAL */}
                    <div className="absolute inset-0 w-full h-full bg-white rounded-2xl overflow-hidden shadow-2xl" style={{ backfaceVisibility: 'hidden' }}>
                      {/* Cabecera Azul Fuerte ITSES */}
                      <div className="h-32 bg-[#10306c] relative overflow-hidden flex flex-col justify-between p-5 pb-8">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-transparent"></div>
                        <div className="relative z-10 flex justify-between items-start w-full">
                          <div className="text-left">
                            <p className="text-[9px] uppercase tracking-[0.2em] font-black text-[#e5b955]">Instituto Tecnológico</p>
                            <p className="text-[13px] font-bold tracking-wide mt-1 text-white">Ingeniería en Sistemas</p>
                          </div>
                          <ShieldCheck className="h-6 w-6 text-[#e5b955] opacity-90" />
                        </div>
                      </div>
                      
                      {/* Franja Dorada Inferior de la cabecera */}
                      <div className="h-[14px] w-full bg-[#c99b38] shadow-sm relative z-0"></div>

                      <div className="absolute top-[88px] left-1/2 -translate-x-1/2 z-20">
                        <div className="h-[90px] w-[90px] bg-slate-50 rounded-[18px] border-4 border-white shadow-md flex items-center justify-center">
                          <User className="h-10 w-10 text-slate-300" strokeWidth={2} />
                        </div>
                      </div>

                      <div className="pt-20 pb-6 px-6 text-center h-full flex flex-col justify-between" style={{ height: 'calc(100% - 142px)'}}>
                        <div>
                          <h3 className="text-[20px] font-black text-slate-800 uppercase tracking-wider leading-none">
                            {email.split('@')[0].replace('.', ' ')}
                          </h3>
                          <p className="text-[11px] text-slate-400 font-bold mt-1.5 lowercase">{email}</p>
                          <div className="mt-3 inline-block bg-green-50 px-4 py-[6px] rounded-full border border-green-200">
                            <p className="text-[9px] font-black text-[#37a659] tracking-wider uppercase">
                              Estudiante Regular
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-between items-end text-left w-full">
                          <div>
                            <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest">Matrícula / ID</p>
                            <p className="text-sm font-black text-slate-700 mt-0.5">{studentId}</p>
                            <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest mt-2">Vigencia</p>
                            <p className="text-xs font-black text-slate-700 mt-0.5">{currentDate}</p>
                          </div>
                          <div className="bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
                            <QrCode className="h-[60px] w-[60px] text-slate-700" strokeWidth={1} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* REVERSO DE LA CREDENCIAL */}
                    <div className="absolute inset-0 w-full h-full bg-slate-50 rounded-2xl overflow-hidden p-6 border border-slate-200 shadow-2xl flex flex-col justify-center" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                       <h3 className="text-sm font-black text-slate-800 border-b border-slate-200 pb-2 mb-4 text-center">Normativas de Uso</h3>
                       <ul className="text-[10px] text-slate-500 space-y-4 font-medium text-justify">
                         <li>1. Esta credencial es personal e intransferible. El mal uso será sancionado según las políticas de acceso digital ITSES.</li>
                         <li>2. Al portar esta credencial de forma digital, te comprometes a respetar el reglamento interno del instituto.</li>
                         <li>3. Válida únicamente en el ciclo escolar indicado en el anverso y soportado siempre por pagos_referencia DB.</li>
                       </ul>
                       <div className="mt-6 flex justify-center">
                          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${email}`} alt="QR" className="opacity-80 rounded shadow-sm" />
                       </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mb-6">
                  <button 
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 px-6 rounded-full transition-colors text-[10px] uppercase tracking-wider"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Ver Reverso
                  </button>
                </div>

                <div className="flex gap-3 mb-4 max-w-[320px] mx-auto">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-[#111c2e] hover:bg-slate-800 text-white font-bold py-3.5 px-2 rounded-xl transition-all text-[11px]">
                     <Download className="h-3.5 w-3.5 text-[#d4af37]" /> Guardar PDF
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-3.5 px-2 rounded-xl transition-all text-[11px]">
                     <Lock className="h-3.5 w-3.5 text-slate-700" /> Google Wallet
                  </button>
                </div>
                
                <div className="max-w-[320px] mx-auto">
                  <button
                    onClick={resetForm}
                    className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold py-3.5 rounded-xl transition-colors text-[10px] uppercase tracking-[0.1em]"
                  >
                    Finalizar Sesión
                  </button>
                </div>
              </div>
            )}

            {/* 4. ESTADO: Rechazado */}
            {status === 'rechazado' && (
              <div className="text-center py-8 error-shake animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-red-50 text-red-600 rounded-full mb-8 border-[6px] border-red-100 shadow-inner">
                  <XCircle className="h-12 w-12" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Autorización Denegada</h3>
                <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100 mb-10 max-w-sm mx-auto text-left shadow-sm">
                  <p className="text-xs text-red-900 font-bold mb-3 uppercase tracking-wider">Detalles devueltos por n8n:</p>
                  <p className="font-mono text-xs text-red-700 bg-white p-4 rounded-xl border border-red-100 shadow-sm leading-relaxed">
                    ERR_CONSTRAINT: El folio referenciado [{folio}] o el correo ingresado no cumplieron con las reglas estipuladas.
                  </p>
                </div>
                
                <button
                  onClick={resetForm}
                  className="inline-flex items-center justify-center px-10 py-4 w-full text-white font-black tracking-[0.2em] uppercase text-[11px] rounded-xl transition-all shadow-lg active:scale-[0.98] hover:-translate-y-1"
                  style={{ background: '#111c2e' }}
                >
                  Regresar al Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
