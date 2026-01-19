// src/components/ContextMenu.jsx
import React from 'react';
import { Trash2, Link as LinkIcon, FolderPlus, FileText, FileCode, Share2 } from 'lucide-react'; // Íconos opcionales

function ContextMenu({ isVisible, x, y, onNewLink, onNewFolder, onNewNote, onNewCode, selectedItem, onDelete, onShare }) {
  
  if (!isVisible) return null;

  return (
    <div 
      className="absolute z-50 w-52 bg-[#1e1e2e]/95 backdrop-blur-md
                 rounded-lg shadow-2xl border border-white/10
                 text-gray-200 animate-scale-in overflow-hidden"
      style={{ top: `${y}px`, left: `${x}px` }}
    >
      <ul className="py-1">
        
        {/* Opciones Generales (siempre visibles) */}
        
        {/* Nueva Carpeta */}
        <li 
           className="px-4 py-2 hover:bg-white/10 cursor-pointer text-sm flex items-center gap-2"
           onClick={onNewFolder} // <--- AQUI ESTABA EL PROBLEMA (Faltaba esto)
        >
           <FolderPlus size={14} /> Nueva Carpeta
        </li>

        {/* --- NUEVA OPCIÓN: NUEVA NOTA (SIN FORMULARIO) --- */}
        <li 
           className="px-4 py-2 hover:bg-white/10 cursor-pointer text-sm flex items-center gap-2"
           onClick={onNewNote} // <--- LLAMADA A LA FUNCIÓN
        >
           <FileText size={14} /> Nueva Nota
        </li>

        {/* --- NUEVA OPCIÓN: NUEVO CÓDIGO --- */}
        <li 
           className="px-4 py-2 hover:bg-white/10 cursor-pointer text-sm flex items-center gap-2"
           onClick={onNewCode} // <--- LLAMADA A LA FUNCIÓN
        >
           <FileCode size={14} /> Nuevo Código
        </li>
        
        <li 
          className="px-4 py-2 hover:bg-white/10 cursor-pointer text-sm flex items-center gap-2"
          onClick={onNewLink}
        >
          <LinkIcon size={14} /> Nuevo Enlace
        </li>

        {/* Separador */}
        <div className="border-t border-white/10 my-1"></div>

        {/* Opciones ESPECÍFICAS DE ÍTEM (Solo si hay un ítem seleccionado) */}
        {selectedItem && (
            <>
                <li className="px-4 py-2 text-xs text-gray-500 font-bold uppercase">
                    {selectedItem.nombre}
                </li>

                {/* --- NUEVA OPCIÓN: COMPARTIR --- */}
                <li 
                    className="px-4 py-2 hover:bg-white/10 cursor-pointer text-sm flex items-center gap-2"
                    onClick={onShare} // <--- Necesitamos recibir esta prop
                >
                    <Share2 size={14} className="text-blue-400" /> Compartir
                </li>
                
                {/* Consumir Endpoint Delete */}
                <li 
                    className="px-4 py-2 hover:bg-red-500/20 text-red-400 hover:text-red-300 cursor-pointer text-sm flex items-center gap-2"
                    onClick={() => onDelete(selectedItem)}
                >
                    <Trash2 size={14} /> Eliminar
                </li>
            </>
        )}

        {!selectedItem && (
             <li className="px-4 py-2 hover:bg-white/10 cursor-pointer text-sm">
                Propiedades
            </li>
        )}

      </ul>
    </div>
  );
}

export default ContextMenu;