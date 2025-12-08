// src/components/FolderContent.jsx
import React from 'react';
import { FolderOpen } from 'lucide-react';

const FolderContent = ({ folderId, folderName }) => {
  // NOTA: Como no podemos tocar el backend, actualmente no hay un endpoint
  // para "traer hijos de una carpeta". 
  // Este componente está listo para recibir una lista de items en el futuro.
  
  return (
    <div className="w-full h-full bg-[#1e1e2e] text-white p-4 flex flex-col items-center justify-center">
      <div className="text-center opacity-50">
        <FolderOpen size={64} className="mx-auto mb-4 text-purple-400" />
        <h3 className="text-xl font-bold">{folderName}</h3>
        <p className="text-sm mt-2">Esta carpeta está vacía.</p>
        <p className="text-xs text-gray-500 mt-1">(ID: {folderId})</p>
      </div>
      
      {/* AQUÍ, EN EL FUTURO, HARÍAS UN MAP DE LOS ÍTEMS HIJOS:
         <div className="grid grid-cols-4 gap-4 w-full mt-4">
            {items.map(item => <Icon ... />)}
         </div>
      */}
    </div>
  );
};

export default FolderContent;