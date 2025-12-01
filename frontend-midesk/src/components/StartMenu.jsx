// src/components/StartMenu.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Users, Settings, Search } from 'lucide-react';
import computerIcon from '../assets/icons/desktop.png'; // Reusamos íconos

const StartMenu = ({ isVisible, onClose, onOpenApp }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({ nombre: 'Estudiante', email: '' });

  // Simulamos otros usuarios conectados (En el futuro esto vendría del Backend)
  const usersOnline = [
    { id: 1, name: 'Byron Loarte', status: 'Profesor' },
    { id: 2, name: 'Compañero 1', status: 'En línea' },
    { id: 3, name: 'Compañero 2', status: 'Ocupado' },
  ];

  const handleLaunch = (appId, title) => {
    onOpenApp(appId, title); // Abre la ventana
    onClose(); // Cierra el menú
  };

  useEffect(() => {
    // 1. Recuperamos los datos reales del usuario logueado
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!isVisible) return null;

  return (
    // Contenedor Flotante (encima de la barra de tareas)
    <div className="fixed bottom-12 left-2 z-50 w-80 md:w-96 
                    bg-gray-900/90 backdrop-blur-xl border border-white/10 
                    rounded-xl shadow-2xl text-white overflow-hidden animate-scale-in origin-bottom-left">
      
      {/* --- CABECERA (Perfil) --- */}
      <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold text-lg">
          {currentUser.nombre.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{currentUser.nombre}</h3>
          <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
        </div>
        <button 
          onClick={handleLogout} 
          className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
          title="Cerrar Sesión"
        >
          <LogOut size={18} />
        </button>
      </div>

      {/* --- BUSCADOR --- */}
      <div className="p-3">
        <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-3 py-2 border border-white/5">
          <Search size={16} className="text-gray-400"/>
          <input 
            type="text" 
            placeholder="Buscar archivos, compañeros..." 
            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-gray-500"
          />
        </div>
      </div>

      {/* --- LISTA DE "OTROS ESCRITORIOS" (DASHBOARD) --- */}
      <div className="px-2 pb-2">
        <p className="px-2 text-xs font-bold text-gray-500 uppercase mb-2">Comunidad (Otros Escritorios)</p>
        
        <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
            {/* Renderizamos los usuarios simulados */}
            {usersOnline.map(user => (
                <div key={user.id} className="group flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                        <Users size={14} className="text-gray-300"/>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium group-hover:text-blue-300 transition-colors">{user.name}</p>
                        <p className="text-[10px] text-gray-400">{user.status}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* --- ACCESOS RÁPIDOS --- */}
      <div className="p-2 grid grid-cols-2 gap-2 border-t border-white/10 bg-black/20">
         <button 
        onClick={() => handleLaunch('profile', 'Configuración')} // 👈 ACCIÓN
        className="flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg text-xs text-gray-300 transition-colors"
        >
            <Settings size={14} /> Configuración
        </button>
        
        <button 
            onClick={() => handleLaunch('profile', 'Mi Perfil')} // 👈 ACCIÓN
            className="flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg text-xs text-gray-300 transition-colors"
        >
            <User size={14} /> Mi Cuenta
        </button>
      </div>

    </div>
  );
};

export default StartMenu;