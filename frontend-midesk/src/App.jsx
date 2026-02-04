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
import Dashboard from './pages/Dashboard';
import GoogleSuccess from './pages/GoogleSuccess';

function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} /> 
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/google-success" element={<GoogleSuccess />} />
      <Route path="/confirmar/:token" element={<Confirm />} />
      <Route path="/forgot" element={<Forgot />} />
      <Route path="/reset/:token" element={<Reset />} />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/desktop" 
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<Navigate to="/" />} /> 
    </Routes>
  );
}

export default App;