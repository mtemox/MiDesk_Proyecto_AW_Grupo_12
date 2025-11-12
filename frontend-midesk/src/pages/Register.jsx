// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios'; // (Descomentar para la API real)
import AuthLayout from './Auth'; // La plantilla de estilo
import { useForm } from "react-hook-form";
import { ToastContainer } from 'react-toastify';
import { useFetch } from '../hooks/useFetch';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';

function Register() {

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fetchDataBackend = useFetch();

  // --- CONFIGURACIÓN DE REACT-HOOK-FORM ---
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  // Usamos watch para poder comparar la contraseña de confirmación
  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const { nombre, email, password } = data; // 'data' viene de react-hook-form
      
      const response = await fetchDataBackend(
        `${backendUrl}/registro`,
        { nombre, email, password },
        "POST"
      );

      if (response) {
        // El hook useFetch ya muestra el toast de éxito con el 'msg' del backend
        setTimeout(() => {
          navigate('/login');
        }, 2000); // Esperamos 2 seg antes de redirigir
      }
    } catch (error) {
      console.error('Error en registro:', error);
      // El hook useFetch ya muestra el toast de error
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Crear Cuenta">
      {/* handleSubmit(onSubmit) activa la validación de hook-form antes de llamar a onSubmit */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* --- CAMPO NOMBRE --- */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-purple-200">Nombre Completo</label>
          <input
            id="nombre"
            type="text"
            {...register('nombre', { // 'register' registra el input
              required: 'El nombre es requerido' // Regla de validación
            })}
            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Ingresa tu nombre completo"
          />
          {/* Muestra el error si existe */}
          {errors.nombre && <p className="mt-1 text-xs text-red-400">{errors.nombre.message}</p>}
        </div>

        {/* --- CAMPO EMAIL --- */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-purple-200">Correo Electrónico</label>
          <input
            id="email"
            type="email"
            {...register('email', { 
              required: 'El email es requerido',
              pattern: { // Validación con Expresión Regular
                value: /\S+@\S+\.\S+/,
                message: 'El formato de email no es válido'
              }
            })}
            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="tu-correo@esfot.com"
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>

        {/* --- CAMPO PASSWORD --- */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-purple-200">Contraseña</label>
          <input
            id="password"
            type="password"
            {...register('password', { 
              required: 'La contraseña es requerida',
              minLength: {
                value: 6,
                message: 'Debe tener al menos 6 caracteres'
              }
            })}
            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Mínimo 6 caracteres"
          />
          {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
        </div>

        {/* --- CAMPO CONFIRMAR PASSWORD --- */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-purple-200">Confirmar Contraseña</label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword', { 
              required: 'Debes confirmar la contraseña',
              validate: value => // Validación personalizada
                value === password || 'Las contraseñas no coinciden'
            })}
            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Repite tu contraseña"
          />
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>}
        </div>

        {/* --- BOTÓN SUBMIT --- */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </div>
      </form>

      <p className="text-sm text-center text-gray-400">
        ¿Ya tienes una cuenta? {' '}
        <Link to="/login" className="font-medium text-purple-400 hover:text-purple-300">
          Inicia sesión
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Register;