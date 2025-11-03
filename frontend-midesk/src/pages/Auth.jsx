// src/pages/Auth.jsx
import React from 'react';

// Esta es la plantilla que da el estilo "futurista"
// que te gustó, usando Tailwind CSS.
function AuthLayout({ children, title }) {
  return (
    <div className="flex items-center justify-center min-h-screen 
                   bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      
      {/* El contenedor del formulario */}
      <div className="w-full max-w-md p-8 space-y-6 
                    bg-gray-800 bg-opacity-50 backdrop-blur-md 
                    rounded-lg shadow-2xl border border-purple-500/30">
        
        <h2 className="text-3xl font-bold text-center text-white">{title}</h2>
        
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;