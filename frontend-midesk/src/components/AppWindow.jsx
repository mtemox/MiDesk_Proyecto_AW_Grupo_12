import React from 'react';
import { Rnd } from 'react-rnd';

// Recibe:
// - title: El título de la ventana
// - children: El contenido (tu app, ej: un editor de texto)
// - onClose: Función para cerrar la ventana (la llamará Desktop.jsx)
// - zIndex: Para saber qué ventana está encima de cuál
// - onFocus: Función para traer la ventana al frente
function AppWindow({ title, children, onClose, zIndex, onFocus, defaultWidth, defaultHeight }) {

  return (
    <Rnd
      // Configuración inicial de la ventana
      default={{
        x: Math.random() * (window.innerWidth / 2), // Posición X aleatoria
        y: Math.random() * (window.innerHeight / 4), // Posición Y aleatoria
        width: defaultWidth || 640,
        height: defaultHeight || 400,
      }}
      minWidth={300}
      minHeight={200}
      // Clases para el "marco" que se puede arrastrar
      dragHandleClassName="window-header"
      // Importante: le pasamos el z-index desde el estado
      style={{ zIndex }}
      // Al hacer clic, llamamos a onFocus para traerla al frente
      onMouseDown={onFocus}
    >
      {/* Usamos los mismos estilos "glassmorphism" de tu proyecto 
        para mantener la consistencia visual.
      */}
      <div className="w-full h-full flex flex-col 
                      bg-gray-800 bg-opacity-80 backdrop-blur-lg 
                      rounded-lg shadow-2xl border border-purple-500/30 text-white">
        
        {/* 1. Encabezado de la Ventana (para arrastrar) */}
        <div 
          className="window-header h-8 flex items-center justify-between 
                     px-3 py-1 bg-gray-900/50 rounded-t-lg cursor-move"
        >
          <span className="text-sm font-semibold">{title}</span>
          <button
            onClick={onClose}
            className="w-5 h-5 flex items-center justify-center text-gray-300 
                       bg-red-500 rounded-full hover:bg-red-700
                       transition-colors duration-150"
            title="Cerrar"
          >
            {/* Un 'X' simple, puedes usar un ícono SVG si prefieres */}
            <span className="text-xs font-bold">✕</span>
          </button>
        </div>

        {/* 2. Contenido de la Aplicación (El 'children') */}
        <div className="flex-grow p-4 overflow-auto">
          {children}
        </div>
      </div>
    </Rnd>
  );
}

export default AppWindow;