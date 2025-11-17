// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './layouts/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import { Confirm } from './pages/Confirm';
import Forgot from './pages/Forgot';
import Reset from './pages/Reset';

function App() {
  return (
    <Routes>
      
      {/* --- 2. RUTA PRINCIPAL (LANDING) --- */}
      {/* Antes, tu ruta principal o el wildcard
        probablemente redirigían a '/login'.
        Ahora, la ruta "/" (la raíz) muestra tu LandingPage.
      */}
      <Route path="/" element={<LandingPage />} /> {/* <-- ¡MODIFICADO! */}

      {/* Rutas de Autenticación */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/confirmar/:token" element={<Confirm />} />
      <Route path="/forgot" element={<Forgot />} />
      
      <Route path="/reset/:token" element={<Reset />} />
      
      {/* Ruta principal de la App (Protegida) */}
      <Route 
        path="/desktop" 
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        } 
      />
      
      {/* --- 3. REDIRECCIÓN (WILDCARD) --- */}
      {/* Ahora, cualquier ruta desconocida (ej. /hola, /pagina-rota)
        redirigirá a la LandingPage ('/'), no al login.
      */}
      <Route path="*" element={<Navigate to="/" />} /> {/* <-- ¡MODIFICADO! */}

    </Routes>
  );
}

export default App;