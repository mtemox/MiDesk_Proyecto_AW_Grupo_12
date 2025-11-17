// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios'; // (Descomentar para la API real)
import AuthLayout from './Auth'; // Reutilizamos el layout
import { useFetch } from '../hooks/useFetch';
import { useForm } from "react-hook-form";

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fetchDataBackend = useFetch();
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      
      // 'data' ya contiene { email, password }
      const response = await fetchDataBackend(
        `${backendUrl}/estudiante/login`, // Apuntamos a la nueva ruta
        data,
        "POST"
      );
       
      // 2. Verificamos si llegó el token
        if (response?.token) {
            // Guardamos el token
            localStorage.setItem('token', response.token);
            
            // Guardamos también los datos del usuario para usarlos en el sistema
            // (Por ejemplo, para poner "Hola, Ariel" en el dashboard)
            const userData = {
                nombre: response.nombre,
                rol: response.rol,
                id: response._id
            };
            localStorage.setItem('user', JSON.stringify(userData));

            // 3. Redirigimos
            navigate('/desktop');
        }
        
      // Si hay un error (ej: 401, 404), el hook useFetch
      // capturará el 'msg' del backend y lo mostrará como un toast de error.

    } catch (error) {
      // El error ya es manejado y mostrado por el hook useFetch
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Iniciar Sesión">
      {/* handleSubmit(onSubmit) activa la validación de hook-form antes de llamar a onSubmit */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* --- CAMPO EMAIL --- */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-purple-200">
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            {...register('email', { // 'register' registra el input
              required: 'El email es requerido' // Regla de validación
            })}
            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="tu-correo@esfot.com"
          />
          {/* Muestra el error si existe */}
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>
        
        {/* --- CAMPO PASSWORD --- */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-purple-200">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            {...register('password', { // 'register' registra el input
              required: 'La contraseña es requerida' // Regla de validación
            })}
            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Tu contraseña"
          />
          {/* Muestra el error si existe */}
          {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
        </div>

        {/* El estado 'error' local se elimina, los errores de API se muestran en el Toast */}

        {/* --- BOTÓN SUBMIT --- */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </div>
      </form>
      <p className="text-sm text-center text-gray-400">
        ¿No tienes una cuenta?{' '}
        <Link to="/register" className="font-medium text-purple-400 hover:text-purple-300">
          Regístrate
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Login;