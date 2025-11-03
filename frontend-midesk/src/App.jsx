// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './layouts/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Rutas de Autenticación */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Ruta principal de la App (Protegida) */}
      <Route 
        path="/desktop" 
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        } 
      />
      
      {/* Redirigir cualquier otra ruta al login */}
      <Route path="*" element={<Navigate to="/login" />} /> 
    </Routes>
  );
}

export default App;