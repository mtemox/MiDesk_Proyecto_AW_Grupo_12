import React from 'react';

// Recibimos 'nombre' e 'imgSrc' como propiedades (props)
function Icon({ nombre, imgSrc }) {
  return (
    <div className="w-20 h-24 flex flex-col items-center justify-start p-2 m-1 cursor-pointer hover:bg-blue-500 hover:bg-opacity-30 rounded">
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

export default Icon;