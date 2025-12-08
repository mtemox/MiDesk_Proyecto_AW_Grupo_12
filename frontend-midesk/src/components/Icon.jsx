// src/components/Icon.jsx
import React, { memo } from 'react';

// Agregamos 'onContextMenu' a las props
const Icon = ({ nombre, imgSrc, iconData, onOpen, onContextMenu }) => {
  
  const handleDoubleClick = () => {
    if (iconData?.type === 'link' && iconData.url) {
      window.open(iconData.url, '_blank', 'noopener,noreferrer');
    } else if (iconData && onOpen) {
      onOpen(
        iconData.appId || iconData.type, // appId o "folder"
        iconData.nombre, 
        iconData.windowOptions,
        iconData // <--- Pasamos todo el objeto (incluye _id) como 'data'
      );
    }
  };

  // Manejador local de clic derecho
  const handleRightClick = (e) => {
    if (onContextMenu) {
      // Pasamos el evento Y los datos de este ícono específico
      onContextMenu(e, iconData);
    }
  };
  
  return (
    <div 
      className="w-20 h-24 flex flex-col items-center justify-start p-2 m-1 cursor-pointer 
                 rounded-lg bg-white/5 backdrop-blur-sm 
                 hover:bg-white/10 hover:shadow-lg hover:shadow-blue-500/50
                 transition-all duration-150 animate-fade-in"
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleRightClick} // 👈 Conectamos aquí
    >
      <img src={imgSrc} alt={nombre} className="w-12 h-12" />
      <p className="text-white text-xs text-center mt-1 truncate w-full">
        {nombre}
      </p>
    </div>
  );
}

export default memo(Icon);