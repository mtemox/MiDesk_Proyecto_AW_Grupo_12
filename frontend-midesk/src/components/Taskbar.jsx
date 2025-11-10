// src/components/Taskbar.jsx
import React, { useState, useEffect } from 'react';

// Un componente simple para el ícono de Configuración (engranaje)
const SettingsIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 20 20" 
    fill="currentColor" 
    className="w-5 h-5"
  >
    <path 
      fillRule="evenodd" 
      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0l-.1.41a1.5 1.5 0 01-2.1 1.44l-.41-.1c-1.56-.38-3.28.84-2.9 2.4l.1.41a1.5 1.5 0 01-1.44 2.1l-.41.1c-1.56.38-1.56 2.6 0 2.98l.41.1a1.5 1.5 0 011.44 2.1l-.1.41c-.38 1.56.84 3.28 2.4 2.9l.41-.1a1.5 1.5 0 012.1 1.44l.1.41c.38 1.56 2.6 1.56 2.98 0l.1-.41a1.5 1.5 0 012.1-1.44l.41.1c1.56.38 3.28-.84 2.9-2.4l-.1-.41a1.5 1.5 0 011.44-2.1l.41-.1c1.56-.38 1.56-2.6 0-2.98l-.41-.1a1.5 1.5 0 01-1.44-2.1l.1-.41c.38-1.56-.84-3.28-2.4-2.9l-.41.1a1.5 1.5 0 01-2.1-1.44l-.1-.41zM10 13a3 3 0 100-6 3 3 0 000 6z" 
      clipRule="evenodd" 
    />
  </svg>
);


function Taskbar() {
  // Estado para la hora y fecha
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Estado para la posición de la barra
  // (valores posibles: 'bottom', 'left', 'right')
  const [position, setPosition] = useState('bottom');

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
  const baseClasses = "fixed bg-gray-950 bg-opacity-70 backdrop-blur-md z-50 transition-all duration-300 ease-in-out text-white flex items-center shadow-lg shadow-black/50";

  // Clases específicas para cada posición
  let positionClasses = '';
  let containerFlexDirection = ''; // Para el contenedor principal
  let clockFlexDirection = '';     // Para el reloj
  let buttonMargin = '';           // Margen del botón de IA
  let clockAlignment = '';         // Alineación del reloj

  switch (position) {
    case 'left':
      positionClasses = "left-0 top-0 h-full w-12 py-4"; // Más delgada
      containerFlexDirection = "flex-col justify-between";
      clockFlexDirection = "flex-col-reverse"; // Pone el botón de config arriba
      buttonMargin = "mb-2"; // Margen inferior para el botón IA
      clockAlignment = "items-center";
      break;
    case 'right':
      positionClasses = "right-0 top-0 h-full w-12 py-4"; // Más delgada
      containerFlexDirection = "flex-col justify-between";
      clockFlexDirection = "flex-col-reverse";
      buttonMargin = "mb-4";
      clockAlignment = "items-center";
      break;
    default: // 'bottom'
      positionClasses = "bottom-0 left-0 w-full h-10 px-4"; // Más delgada (h-10)
      containerFlexDirection = "flex-row justify-between";
      clockFlexDirection = "flex-row items-center space-x-3"; // Espacio entre reloj y config
      buttonMargin = "mr-4"; // Margen derecho para el botón IA
      clockAlignment = "items-end";
  }

  // Función para cambiar la posición
  const handleChangePosition = () => {
    setPosition(currentPos => {
      if (currentPos === 'bottom') return 'left';
      if (currentPos === 'left') return 'right';
      return 'bottom'; // Vuelve al inicio
    });
  };

  return (
    <div className={`${baseClasses} ${positionClasses} ${containerFlexDirection}`}>
      
      {/* --- Lado Izquierdo (Inicio) --- */}
      {/* Botón de IA (más corto) */}
      <div 
        className={`w-6 h-6 bg-blue-900 text-white flex items-center justify-center 
                    rounded-md cursor-pointer hover:bg-blue-700 flex-shrink-0 ${buttonMargin}
                    transition-colors duration-200`}
      >
        IA
      </div>

      {/* (Aquí irán los íconos de apps abiertas en el futuro) */}
      
      {/* --- Lado Derecho (Reloj y Config) --- */}
      <div className={`flex ${clockFlexDirection} ${clockAlignment}`}>
        
        {/* Botón para cambiar posición */}
        <button 
          onClick={handleChangePosition}
          className="p-1 rounded-full text-gray-300 hover:text-white hover:bg-white/10
                     transition-colors duration-200"
          title="Cambiar posición de la barra"
        >
          <SettingsIcon />
        </button>

        {/* Contenedor de Hora y Fecha */}
        <div className={`flex flex-col ${clockAlignment} cursor-default`}>
          <p className="text-xs font-semibold">
            {timeString}
          </p>
          {/* Ocultamos la fecha si la barra no está abajo */}
          <p className={`text-[10px] text-gray-300 ${position !== 'bottom' ? 'hidden' : ''}`}>
            {dateString}
          </p>
        </div>

      </div>
    </div>
  );
}

export default Taskbar;