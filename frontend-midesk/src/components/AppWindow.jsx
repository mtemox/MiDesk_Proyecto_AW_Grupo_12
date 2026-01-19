// src/components/AppWindow.jsx
import React from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, Square, Maximize2, Minimize2 } from 'lucide-react'; // Íconos opcionales si quieres dentro de los círculos

function AppWindow({ 
    id, 
    onDragStop,
    title, children, onClose, onMinimize, onMaximize, zIndex, onFocus, 
    defaultWidth, defaultHeight, defaultX, defaultY, isMaximized,
    isActive
}) {

  return (
    <Rnd
      // Si está maximizado, desactivamos arrastre y redimensión
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
      
      // Posición y Tamaño
      // Si es maximizado: X=0, Y=0, W=100%, H=100% (menos la barra de tareas aprox)
      position={isMaximized ? { x: 0, y: 0 } : { x: defaultX, y: defaultY }}
      size={isMaximized ? { width: '100%', height: 'calc(100% - 48px)' } : undefined}
      
      default={{
        x: defaultX || 50, 
        y: defaultY || 50,
        width: defaultWidth || 640,
        height: defaultHeight || 400,
      }}
      
      minWidth={300}
      minHeight={200}
      
      // ⚠️ QUITAMOS bounds="parent" para que no se trabe
      dragHandleClassName="window-header"
      
      style={{ zIndex }}
      onMouseDown={onFocus}
      
      // Importante para actualizar la posición interna de Rnd cuando no está maximizado
      onDragStop={(e, d) => {
          if(!isMaximized) {
             onFocus();
             if(onDragStop) onDragStop(id, d.x, d.y); // <--- AVISAR AL LAYOUT
          }
       }}
    >
      <div className={`w-full h-full flex flex-col bg-[#1e1e2e]/95 backdrop-blur-xl 
                       ${isMaximized ? '' : 'rounded-xl'} 
                       shadow-[0_0_40px_rgba(0,0,0,0.6)] border border-white/10 text-white overflow-hidden transition-all duration-200
                       pointer-events-auto`}>
        
        {/* --- CABECERA MODERNA --- */}
        <div 
          className="window-header h-10 flex items-center justify-between px-4 bg-white/5 border-b border-white/5 cursor-default"
          onDoubleClick={onMaximize} // Doble clic para maximizar
        >
          
          {/* Botones de Control (Estilo Semáforo Mac) */}
          <div className="flex items-center gap-2 group">
            {/* CERRAR (Rojo) */}
            <button
              onClick={onClose}
              className="w-3.5 h-3.5 rounded-full bg-[#FF5F57] hover:bg-[#FF5F57]/80 flex items-center justify-center text-black/50 transition-colors"
            >
               {/* Icono X que aparece al hacer hover en el grupo */}
               <X size={8} className="opacity-0 group-hover:opacity-100" />
            </button>

            {/* MINIMIZAR (Amarillo) */}
            <button
              onClick={onMinimize}
              className="w-3.5 h-3.5 rounded-full bg-[#FEBC2E] hover:bg-[#FEBC2E]/80 flex items-center justify-center text-black/50 transition-colors"
            >
               <Minus size={8} className="opacity-0 group-hover:opacity-100" />
            </button>

            {/* MAXIMIZAR (Verde) */}
            <button
              onClick={onMaximize}
              className="w-3.5 h-3.5 rounded-full bg-[#28C840] hover:bg-[#28C840]/80 flex items-center justify-center text-black/50 transition-colors"
            >
               {isMaximized ? <MinimizeIcon size={8} className="opacity-0 group-hover:opacity-100"/> : <Maximize2 size={8} className="opacity-0 group-hover:opacity-100" />}
            </button>
          </div>

          {/* Título Central */}
          <span className="text-xs font-medium text-gray-300 tracking-wide select-none">
            {title}
          </span>

          {/* Espaciador para centrar el título (visualmente) */}
          <div className="w-14"></div> 

        </div>

        {/* Contenido */}
        <div className="flex-grow overflow-hidden relative bg-black/20"> 
          {children}
        </div>
      </div>
    </Rnd>
  );
}

// Icono auxiliar para "Restaurar"
const MinimizeIcon = ({size, className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="4" y1="14" x2="10" y2="14"></line>
        <line x1="14" y1="10" x2="20" y2="10"></line>
        <line x1="14" y1="20" x2="20" y2="14"></line>
        <line x1="10" y1="4" x2="4" y2="10"></line>
    </svg>
);

export default AppWindow;