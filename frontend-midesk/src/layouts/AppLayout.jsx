// src/layouts/AppLayout.jsx
import React from 'react';
import Desktop from '../components/Desktop';
import Taskbar from '../components/Taskbar';

// Este componente es lo que el usuario ve DESPUÉS de iniciar sesión
function AppLayout() {
  return (
    <main className="font-sans">
      <Desktop />
      <Taskbar />
    </main>
  );
}

export default AppLayout;