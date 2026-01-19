// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Importamos íconos similares a los de Windows 11
import { Wifi, Accessibility, Power, User, ArrowRight, Monitor } from 'lucide-react';
import dragonBg from '../assets/wallpapers/deg3.jpg'; // Usaremos tu fondo existente pero lo teñiremos de azul
import logoMidesk from '../assets/logos/midesk.jpg'; // Tu avatar

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ nombre: 'Cargando...', email: '' });
  const [sharedDesktops, setSharedDesktops] = useState([]);

  useEffect(() => {
    // Recuperamos el usuario guardado en el Login
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleEnterDesktop = () => {
    // Aquí simulamos el "ingreso" al escritorio
    navigate('/desktop');
  };

  // Entrar a un escritorio REMOTO
  const handleEnterRemoteDesktop = (remoteId, remoteName) => {
    // Navegamos pasando el ID en la URL
    navigate(`/desktop?remote=${remoteId}&name=${encodeURIComponent(remoteName)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    // Contenedor principal: Pantalla completa, sin scroll, fuente sans
    <div className="h-screen w-full overflow-hidden relative font-sans text-white select-none">
      
      {/* --- CAPAS DE FONDO (Para lograr el azul profundo de Windows 11) --- */}
      {/* 1. La imagen base (tu wallpaper) */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url(${dragonBg})` }}
      />
      {/* 2. Una capa azul fuerte encima para teñir la imagen */}
      <div className="absolute inset-0 z-0 bg-blue-900/80 mix-blend-multiply" />
      {/* 3. Un degradado sutil para dar profundidad */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/30 to-transparent" />


      {/* --- CONTENIDO PRINCIPAL (Distribuido en las esquinas y centro) --- */}
      <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-12">

        {/* --- PARTE SUPERIOR (Vacía para empujar el contenido) --- */}
        <div></div>

        {/* --- SECCIÓN CENTRAL (Usuario principal) --- */}
        {/* Usamos absolute y transforms para centrarlo perfectamente en la pantalla */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-fade-in-up">
            
            {/* Avatar Grande */}
            <img 
                src={logoMidesk} 
                alt="Profile" 
                className="w-44 h-44 rounded-full shadow-2xl mb-8 object-cover border-4 border-white/10"
            />

            {/* Nombre de Usuario */}
            <h1 className="text-3xl font-semibold mb-8 drop-shadow-md">
                {user.nombre}
            </h1>

            {/* Simulación de Botón de Ingreso (Estilo campo de contraseña) */}
            {/* En lugar de pedir contraseña de nuevo, es un botón para entrar */}
            <div className="flex flex-col items-center gap-4">
                 {/* Simulamos las "Opciones de inicio de sesión" de la foto con un texto */}
                <p className="text-sm text-gray-300 mb-2 cursor-pointer hover:underline opacity-80">Opciones de inicio de sesión</p>
                
                {/* Botón grande que parece un campo de entrada */}
                <button 
                    onClick={handleEnterDesktop}
                    className="group flex items-center bg-white/10 backdrop-blur-md border border-white/30 rounded-md overflow-hidden transition-all hover:bg-white/20 hover:border-white/50 focus:ring-2 focus:ring-white/50 w-64 h-12 pl-4"
                >
                    <span className="flex-1 text-left text-gray-200 text-sm">Iniciar Escritorio...</span>
                    <div className="bg-white/10 h-full w-12 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                         <ArrowRight size={20} />
                    </div>
                </button>
            </div>
        </div>


        {/* --- SECCIÓN INFERIOR (Contenedor Flex para Izquierda y Derecha) --- */}
        <div className="flex justify-between items-end w-full">

            {/* --- ABAJO IZQUIERDA: Lista de Usuarios --- */}
            <div className="flex flex-col gap-2 animate-fade-in-left">
                {/* Usuario Actual (Tarjeta Glassmorphism) */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2 pr-6 flex items-center gap-3 shadow-lg cursor-default transition-all hover:bg-white/15">
                    <img src={logoMidesk} alt="User" className="w-10 h-10 rounded-full object-cover" />
                    <span className="font-medium text-sm">{user.nombre}</span>
                </div>

                {/* 2. ESCRITORIOS COMPARTIDOS (Mapeo) */}
                {sharedDesktops.map(desk => (
                    <div 
                        key={desk._id}
                        onClick={() => handleEnterRemoteDesktop(desk._id, desk.nombre)}
                        className="group bg-gray-900/40 hover:bg-gray-900/60 backdrop-blur-md border border-white/5 rounded-xl p-6 cursor-pointer transition-all hover:scale-[1.02]"
                    >
                        <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4 shadow-lg group-hover:bg-purple-500 transition-colors">
                            <User size={24} className="text-white" />
                        </div>
                        <h3 className="font-bold text-lg truncate">{desk.nombre}</h3>
                        <p className="text-xs text-gray-400 mt-1 truncate">{desk.email}</p>
                        <div className="mt-4 flex items-center gap-2 text-[10px] text-green-400">
                             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                             Disponible
                        </div>
                    </div>
                ))}

                {/* Otro Usuario (Simulado, podría ser la "Comunidad" en el futuro) */}
                <div className="p-2 flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-pointer rounded-lg hover:bg-white/5">
                    <div className="w-10 h-10 rounded-full bg-gray-500/50 flex items-center justify-center">
                        <User size={20} className="text-gray-300" />
                    </div>
                    <span className="font-medium text-sm">Otro usuario</span>
                </div>
            </div>


            {/* --- ABAJO DERECHA: Íconos de Sistema --- */}
            <div className="flex items-center gap-6 animate-fade-in-right mr-4">
                <Wifi size={24} className="cursor-pointer hover:text-gray-300 transition-colors" title="Red" />
                <Accessibility size={24} className="cursor-pointer hover:text-gray-300 transition-colors" title="Accesibilidad" />
                <Power 
                    size={24} 
                    className="cursor-pointer hover:text-red-400 transition-colors" 
                    title="Cerrar Sesión"
                    onClick={handleLogout} 
                />
            </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;