import React from 'react';
import Icon from './Icon'; // <-- Importamos nuestro componente de ícono
import backgroundImageUrl from '../assets/wallpapers/mi-fondo.jpg';
import folderIcon from '../assets/icons/folder.png';
import computerIcon from '../assets/icons/desktop.png';

function Desktop() {
  
  // URL del fondo de pantalla
  // const backgroundImageUrl = '../assets/wallpapers/mi-fondo.jpg';

  return (
    <div 
      className="w-full h-screen overflow-hidden" 
      style={{ 
        backgroundImage: `url(${backgroundImageUrl})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Contenedor para los íconos */}
      <div className="p-4 grid grid-cols-12 grid-rows-6 gap-2">
        
        {/* Aquí ponemos los íconos "a mano". 
          En Fase 2, esto vendrá de un 'useState'.
        */}
        
        <Icon 
          nombre="Mis Proyectos" 
          imgSrc={folderIcon}
        />
        
        <Icon 
          nombre="Mi Equipo" 
          imgSrc={computerIcon}
        />
        
        {/* Puedes añadir más... */}
        
      </div>
    </div>
  );
}

export default Desktop;