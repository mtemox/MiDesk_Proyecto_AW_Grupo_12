// src/components/StartMenu.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Users, Settings, Search, MonitorPlay, Share2 } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import computerIcon from '../assets/icons/desktop.png'; // Reusamos íconos

const StartMenu = ({ isVisible, onClose, onOpenApp }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({ nombre: 'Estudiante', email: '' });

  const { connectToSession } = useSocket();

  // Simulamos otros usuarios conectados (En el futuro esto vendría del Backend)
  const usersOnline = [
    { id: '691ab723aa6db0cb3c95ec61', name: 'Usuario A (Dueño)', status: 'En línea' }, 
    // ^^^ REEMPLAZA ESTO CON EL ID REAL DE TU CUENTA "A" PARA PROBAR
    { id: '696da7ae79323bfbdf9e068a', name: 'Usuario B', status: 'Trabajando' },
  ];

  const handleConnectToUser = (targetUser) => {
    if (!targetUser.id) return;
    
    // Llamamos a la función del contexto
    connectToSession(targetUser.id);
    
    toast.success(`Conectado al escritorio de ${targetUser.name}`);
    onClose();
  };

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

  const handleShareMyDesktop = async () => {
    // Usamos un prompt simple por rapidez, o puedes crear un modal bonito luego
    const email = prompt("Ingresa el correo del usuario al que darás acceso:");
    if (!email) return;

    try {
        const token = localStorage.getItem('token');
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        
        const response = await fetch(`${backendUrl}/share-desktop`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        
        if(response.ok) {
            toast.success("¡Acceso concedido!");
        } else {
            toast.error(data.msg || "Error");
        }
    } catch(e) { console.error(e); }
};

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
            <div 
               key={user.id} 
               onClick={() => handleConnectToUser(user)} // <--- CLICK PARA CONECTAR
               className="group flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
            >
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    {/* Icono cambia al hacer hover para indicar acción */}
                    <MonitorPlay size={14} className="text-gray-300 group-hover:text-green-400"/>
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium group-hover:text-blue-300 transition-colors">{user.name}</p>
                    <p className="text-[10px] text-gray-400">Clic para ver escritorio</p>
                </div>
            </div>
        ))}
        </div>
      </div>

      {/* --- ACCESOS RÁPIDOS --- */}

      <div className="p-2 grid grid-cols-2 gap-2 border-t border-white/10 bg-black/20">
        <button onClick={handleShareMyDesktop} className="...">
          <Share2 size={14} /> Dar Acceso a mi PC
        </button> 
        
         <button 
        onClick={() => handleLaunch('profile', 'Configuración')} // 👈 ACCIÓN
        className="flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg text-xs text-gray-300 transition-colors"
        >
            <Settings size={14} /> Configuración
        </button>

        <button 
            onClick={() => handleLaunch('settings', 'Configuración')} // <--- appId: 'settings'
            className="..."
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