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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* EMAIL */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            {...register('email', { required: 'El email es requerido' })}
            // CAMBIO: focus:ring-red-600 y borde gris oscuro
            className="w-full px-3 py-2 mt-1 text-white bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder-gray-500"
            placeholder="tu-correo@esfot.com"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500 font-bold">{errors.email.message}</p>}
        </div>
        
        {/* PASSWORD */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            {...register('password', { required: 'La contraseña es requerida' })}
            className="w-full px-3 py-2 mt-1 text-white bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder-gray-500"
            placeholder="Tu contraseña"
          />
          {errors.password && <p className="mt-1 text-xs text-red-500 font-bold">{errors.password.message}</p>}
        </div>

        {/* ENLACE OLVIDE PASSWORD */}
        <div className="flex justify-end">
            <Link 
                to="/forgot" 
                // CAMBIO: hover:text-red-400
                className="text-sm font-medium text-gray-400 hover:text-red-500 transition-colors"
            >
                ¿Olvidaste tu contraseña?
            </Link>
        </div>

        {/* BOTÓN */}
        <div>
          <button
            type="submit"
            disabled={loading}
            // CAMBIO: bg-red-700 hover:bg-red-800
            className="w-full py-2 px-4 font-bold text-white bg-red-700 rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black transition-all shadow-[0_0_10px_rgba(185,28,28,0.5)]"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </div>
      </form>
      
      <p className="text-sm text-center text-gray-400">
        ¿No tienes una cuenta?{' '}
        <Link to="/register" className="font-medium text-red-500 hover:text-red-400 underline">
          Regístrate
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Login;