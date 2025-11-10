import React, { memo } from 'react';

// Recibimos 'nombre' e 'imgSrc' como propiedades (props)
const Icon = ({ nombre, imgSrc, iconData, onOpen }) => {
  
  // <-- NUEVO: Manejador para el doble clic
  const handleDoubleClick = () => {
    // Tarea SB-F-005: Lógica de apertura
    
    // 1. Verificamos que 'iconData' exista
    // 2. Verificamos que el tipo sea 'link'
    // 3. Verificamos que tengamos una URL para abrir
    if (iconData && iconData.type === 'link' && iconData.url) {
      
      // Tarea SB-F-005: Abrir la URL en una nueva pestaña
      // '_blank' le dice al navegador que sea una nueva pestaña.
      // 'noopener noreferrer' es una medida de seguridad
      // recomendada al usar '_blank'.
      window.open(iconData.url, '_blank', 'noopener,noreferrer');
    } else if (iconData && iconData.type === 'app' && onOpen) {
      // Llamamos a la función que nos pasó Desktop.jsx
      // Ahora pasamos las 'windowOptions' del icono
      onOpen(iconData.appId, iconData.nombre, iconData.windowOptions);

    // 3. Lógica para carpetas (futuro)
    } else if (iconData && iconData.type === 'folder') {
      console.log(`Abrir carpeta: ${nombre}`);
      // (Aquí podrías usar 'onOpen' para abrir un explorador de archivos)
      // onOpen('explorer', nombre);

    } else {
      console.log(`Doble clic en: ${nombre} (Tipo: ${iconData?.type})`);
    }
  };
  
  return (
    
    // --- CLASES MODIFICADAS AQUÍ ---
    // 1. Quitamos 'hover:bg-blue-500 hover:bg-opacity-30'
    // 2. Añadimos 'bg-white/5 backdrop-blur-sm' (Glassmorphism)
    // 3. Añadimos 'hover:bg-white/10' (un hover más sutil)
    // 4. Añadimos las sombras 'hover:shadow-lg hover:shadow-blue-500/50'
    // 5. Añadimos 'transition-all duration-150' para suavizar el hover
    // 6. Añadimos 'animate-fade-in' (del Paso 0)
    <div 
      className="w-20 h-24 flex flex-col items-center justify-start p-2 m-1 cursor-pointer 
                 rounded-lg bg-white/5 backdrop-blur-sm 
                 hover:bg-white/10 hover:shadow-lg hover:shadow-blue-500/50
                 transition-all duration-150 animate-fade-in"
      onDoubleClick={handleDoubleClick} // <-- ¡Aquí está la magia!
    >

      {/* Mensaje para depurar (¡BORRAR DESPUÉS!) */}
      {/* console.log(`Renderizando ícono: ${nombre}`) */}

      {/* La imagen del ícono */}
      <img 
        src={imgSrc} 
        alt={nombre} 
        className="w-12 h-12" 
      />
      
      {/* El nombre del ícono */}
      <p className="text-white text-xs text-center mt-1">
        {nombre}
      </p>
    </div>
  );
}

// 3. Exportamos la versión "memorizada" del componente.
//    React se encargará de optimizarlo.
export default memo(Icon);