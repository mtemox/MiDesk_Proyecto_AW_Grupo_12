// src/components/ContextMenu.jsx
import React from 'react';

// Este componente recibe 3 props:
// 1. isVisible: (true/false) para saber si debe mostrarse
// 2. x: la coordenada horizontal (izquierda)
// 3. y: la coordenada vertical (arriba)
function ContextMenu({ isVisible, x, y, onNewLink }) {
  
  // Si no debe ser visible, no renderiza nada
  if (!isVisible) {
    return null;
  }

  // Usamos el estilo en línea (style) para
  // posicionar el menú exactamente donde
  // el usuario hizo clic derecho.
  const menuStyle = {
    top: `${y}px`,
    left: `${x}px`,
  };

  return (
    // 'absolute' y 'z-50' son claves: 
    // 'absolute' permite posicionarlo con 'top' y 'left'.
    // 'z-50' lo pone por encima de todo lo demás.
    // Usamos los mismos estilos oscuros/blur que tu Login/Register.

    // --- CLASES MODIFICADAS AQUÍ ---
    // 1. Reemplazamos 'shadow-xl' por 'shadow-2xl shadow-purple-500/20'
    // 2. Quitamos el 'backdrop-blur-md' (que ya no funciona aquí)
    // 3. Añadimos 'animate-scale-in' (del Paso 0)

    <div 
      className="absolute z-50 w-52 bg-gray-800 bg-opacity-90 
                 rounded-md shadow-2xl shadow-purple-500/20 
                 text-white border border-purple-500/30
                 animate-scale-in"
      style={menuStyle}
    >
      <ul className="py-1">

        
        
        {/* Tarea HU-F-004: Opción para crear Enlace */}
        <li 
          className="px-4 py-2 hover:bg-purple-600 cursor-pointer text-sm"
          onClick={onNewLink}
          // onClick={() => ...} // <-- En el futuro, esto abrirá el modal
        >
          Nuevo Enlace Web
        </li>
        
        {/* Tarea HU-F-004: Opción para crear Carpeta */}
        <li 
          className="px-4 py-2 hover:bg-purple-600 cursor-pointer text-sm"
        >
          Nueva Carpeta
        </li>

        {/* (Aquí irán "Nueva Nota" y "Nuevo Código" más adelante) */}

        <div className="border-t border-purple-500/30 my-1"></div>
        
        <li className="px-4 py-2 hover:bg-purple-600 cursor-pointer text-sm">
          Propiedades
        </li>

      </ul>
    </div>
  );
}

export default ContextMenu;