// src/components/Taskbar.jsx
import React, { useState, useEffect } from 'react';
import StartMenu from './StartMenu'; // 👈 IMPORTANTE: Importamos el menú que acabamos de crear
import { Menu, X } from 'lucide-react'; // Usamos iconos para el botón hamburguesa

// Un componente simple para el ícono de Configuración (engranaje)
const SettingsIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 20 20" 
    fill="currentColor" 
    className="w-5 h-5"
  >

  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0l-.1.41a1.5 1.5 0 01-2.1 1.44l-.41-.1c-1.56-.38-3.28.84-2.9 2.4l.1.41a1.5 1.5 0 01-1.44 2.1l-.41.1c-1.56.38-1.56 2.6 0 2.98l.41.1a1.5 1.5 0 011.44 2.1l-.1.41c-.38 1.56.84 3.28 2.4 2.9l.41-.1a1.5 1.5 0 012.1 1.44l.1.41c.38 1.56 2.6 1.56 2.98 0l.1-.41a1.5 1.5 0 012.1-1.44l.41.1c1.56.38 3.28-.84 2.9-2.4l-.1-.41a1.5 1.5 0 011.44-2.1l.41-.1c1.56-.38 1.56-2.6 0-2.98l-.41-.1a1.5 1.5 0 01-1.44-2.1l.1-.41c.38-1.56-.84-3.28-2.4-2.9l-.41.1a1.5 1.5 0 01-2.1-1.44l-.1-.41zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>  

    <path 
      fillRule="evenodd" 
      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0l-.1.41a1.5 1.5 0 01-2.1 1.44l-.41-.1c-1.56-.38-3.28.84-2.9 2.4l.1.41a1.5 1.5 0 01-1.44 2.1l-.41.1c-1.56.38-1.56 2.6 0 2.98l.41.1a1.5 1.5 0 011.44 2.1l-.1.41c-.38 1.56.84 3.28 2.4 2.9l.41-.1a1.5 1.5 0 012.1 1.44l.1.41c.38 1.56 2.6 1.56 2.98 0l.1-.41a1.5 1.5 0 012.1-1.44l.41.1c1.56.38 3.28-.84 2.9-2.4l-.1-.41a1.5 1.5 0 011.44-2.1l.41-.1c1.56-.38 1.56-2.6 0-2.98l-.41-.1a1.5 1.5 0 01-1.44-2.1l.1-.41c.38-1.56-.84-3.28-2.4-2.9l-.41.1a1.5 1.5 0 01-2.1-1.44l-.1-.41zM10 13a3 3 0 100-6 3 3 0 000 6z" 
      clipRule="evenodd" 
    />
  </svg>
  
);


function Taskbar({ onOpenApp, openWindows = [], onMinimize, onFocus }) {
  // Estado para la hora y fecha
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Estado para la posición de la barra
  // (valores posibles: 'bottom', 'left', 'right')
  const [position, setPosition] = useState('bottom');

  // --- NUEVO ESTADO PARA EL MENÚ ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Efecto para actualizar la hora cada segundo
  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(timerId);
  }, []); // El array vacío [] asegura que esto solo se ejecute al montar

  // Formatear la hora y fecha
  const timeString = currentTime.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const dateString = currentTime.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  

  // --- Clases dinámicas de Tailwind ---

  // Clases base (comunes para todas las posiciones)
  // --- 1. CLASES BASE MODIFICADAS ---
  // Añadimos 'shadow-lg shadow-black/50'
  // Estilos base
  const baseClasses = "fixed bg-gray-950/80 backdrop-blur-md z-50 transition-all duration-300 ease-in-out text-white flex items-center shadow-[0_-2px_10px_rgba(0,0,0,0.5)] border-t border-white/5";

  // Clases específicas para cada posición
  let positionClasses = '';
  let containerClasses = ''; // Para el contenedor interno (flex direction y tamaño)
  let clockGroupClasses = ''; // Para agrupar reloj y engranaje

  switch (position) {
    case 'left':
      positionClasses = "left-0 top-0 h-full w-16 py-4 border-r"; 
      // h-full es CRÍTICO para que justify-between funcione verticalmente
      containerClasses = "flex-col justify-between h-full w-full items-center"; 
      clockGroupClasses = "flex flex-col-reverse items-center gap-4"; // Engranaje arriba de la hora
      break;

    case 'right':
      positionClasses = "right-0 top-0 h-full w-16 py-4 border-l";
      containerClasses = "flex-col justify-between h-full w-full items-center";
      clockGroupClasses = "flex flex-col-reverse items-center gap-4";
      break;
    default: // 'bottom'
      positionClasses = "bottom-0 left-0 w-full h-11 px-4 border-t";
      // w-full es CRÍTICO para que justify-between separe los extremos
      containerClasses = "flex-row justify-between w-full h-full items-center";
      clockGroupClasses = "flex flex-row items-center gap-3"; // Engranaje al lado de la hora
  }

  const handleChangePosition = () => {
    setPosition(current => current === 'bottom' ? 'left' : current === 'left' ? 'right' : 'bottom');
  };

  // Helper para obtener icono según appId (puedes expandir esto o importar getIconImage si quieres ser estricto)
  // Por simplicidad visual, usaremos un icono genérico si no tenemos la imagen a mano,
  // pero idealmente deberías pasar el imgSrc dentro de 'openWindows' desde Desktop.
  const getAppIcon = (win) => {
      if (win.data && win.data.imgSrc) return win.data.imgSrc;
      // Icono fallback visual
      return "https://cdn-icons-png.flaticon.com/512/732/732205.png"; 
  };

  return (
    <>
      {/* Menú Inicio */}
      <StartMenu isVisible={isMenuOpen} onClose={() => setIsMenuOpen(false)} onOpenApp={onOpenApp} />

      {/* Barra de Tareas */}
      <div className={`${baseClasses} ${positionClasses}`}>
        
        {/* Contenedor Interno (Maneja la distribución) */}
        <div className={`flex ${containerClasses}`}>
          
          {/* --- IZQUIERDA / ARRIBA: Botón Inicio --- */}
          <div className="flex items-center justify-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`
                p-2 rounded-md transition-all duration-200
                ${isMenuOpen ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]' : 'hover:bg-white/10 text-gray-200'}
              `}
              title="Inicio"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Ventanas abiertas */}
          <div className="flex items-center gap-1 h-full">
                {openWindows.map((win) => (
                    <button
                        key={win.id}
                        onClick={() => {
                            if (win.isMinimized) {
                                onMinimize(win.id); // Restaurar
                                onFocus(win.id);    // Traer al frente
                            } else {
                                // Si ya está activa y visible, la minimizamos
                                onMinimize(win.id);
                            }
                        }}
                        className={`
                            group relative flex items-center justify-center w-10 h-9 rounded-md transition-all duration-200
                            ${!win.isMinimized ? 'bg-white/10 border-b-2 border-purple-500' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}
                        `}
                        title={win.title}
                    >
                        {/* Icono de la App */}
                        <div className="w-6 h-6 flex items-center justify-center">
                           {/* Usamos una imagen pequeña. Si en Desktop.jsx pasaste imgSrc en 'data', lo usamos */}
                           {win.data?.imgSrc ? (
                               <img src={win.data.imgSrc} alt="app" className="w-full h-full object-contain" />
                           ) : (
                               <div className="w-4 h-4 bg-purple-400 rounded-full"></div>
                           )}
                        </div>

                        {/* Tooltip Hover (Opcional estilo Windows) */}
                        <div className="absolute bottom-12 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-xs px-2 py-1 rounded border border-white/10 whitespace-nowrap pointer-events-none">
                            {win.title}
                        </div>
                    </button>
                ))}
            </div>

          {/* --- DERECHA / ABAJO: Reloj y Configuración --- */}
          <div className={clockGroupClasses}>
            
            {/* Botón de Configuración (Cambiar posición) */}
            <button 
              onClick={handleChangePosition}
              className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Cambiar posición de la barra"
            >
              <SettingsIcon />
            </button>

            {/* Texto de Hora y Fecha */}
            <div className="flex flex-col items-center justify-center cursor-default leading-tight">
              <span className="text-xs font-bold tracking-wide">{timeString}</span>
              {position === 'bottom' && (
                <span className="text-[10px] text-gray-400">{dateString}</span>
              )}
            </div>
            
          </div>

        </div>
      </div>
    </>
  );
}

export default Taskbar;