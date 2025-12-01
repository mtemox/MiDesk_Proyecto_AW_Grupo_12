// src/layouts/AppLayout.jsx
import React, { useState } from 'react';
import Desktop from '../components/Desktop';
import Taskbar from '../components/Taskbar';

function AppLayout() {
  const [openWindows, setOpenWindows] = useState([]);
  const [nextZ, setNextZ] = useState(10);

  const handleOpenWindow = (appId, title, windowOptions = {}) => {
    if (appId === 'profile' && !windowOptions.defaultWidth) {
        windowOptions = { defaultWidth: 500, defaultHeight: 600 };
    }

    // Cascada: Calculamos posición inicial
    const offset = (openWindows.length * 30) % 300; 
    const defaultX = 50 + offset; 
    const defaultY = 20 + offset;

    const newWindowId = Date.now();
    const newZ = nextZ + 1;
    
    setOpenWindows(prev => [
      ...prev, 
      { 
        id: newWindowId, 
        appId, 
        title, 
        zIndex: newZ, 
        defaultX, 
        defaultY,
        isMinimized: false, // 👈 Nuevo estado
        isMaximized: false, // 👈 Nuevo estado
        ...windowOptions 
      }
    ]);
    
    setNextZ(newZ);
  };

  const handleCloseWindow = (windowId) => {
    setOpenWindows(prev => prev.filter(win => win.id !== windowId));
  };

  // 👈 NUEVO: Minimizar (Ocultar)
  const handleMinimizeWindow = (windowId) => {
    setOpenWindows(prev => prev.map(win => 
      win.id === windowId ? { ...win, isMinimized: !win.isMinimized } : win
    ));
  };

  // 👈 NUEVO: Maximizar (Estado)
  const handleMaximizeWindow = (windowId) => {
    setOpenWindows(prev => prev.map(win => 
        win.id === windowId ? { ...win, isMaximized: !win.isMaximized } : win
    ));
  };

  const handleFocusWindow = (windowId) => {
    setNextZ(prevZ => {
      const newZ = prevZ + 1;
      setOpenWindows(prev => prev.map(win => 
        win.id === windowId ? { ...win, zIndex: newZ } : win
      ));
      return newZ;
    });
  };

  return (
    <main className="font-sans h-screen overflow-hidden relative">
      <Desktop 
         openWindows={openWindows}
         onOpenWindow={handleOpenWindow}
         onCloseWindow={handleCloseWindow}
         onMinimizeWindow={handleMinimizeWindow} // 👈 Pasamos función
         onMaximizeWindow={handleMaximizeWindow} // 👈 Pasamos función
         onFocusWindow={handleFocusWindow}
      />
      
      {/* (Nota: En el futuro, la Taskbar usará openWindows para restaurar las minimizadas) */}
      <Taskbar onOpenApp={handleOpenWindow} />
    </main>
  );
}

export default AppLayout;