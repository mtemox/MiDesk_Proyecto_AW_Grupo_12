// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios'; // (Descomentar para la API real)
import AuthLayout from './Auth'; // Reutilizamos el layout

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Limpiar error al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // --- SIMULACIÓN DE API (OMITIR ESTO CON BACKEND REAL) ---
    // (Usa 'admin@esfot.com' y '123456' para entrar)

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (formData.email === 'admin@esfot.com' && formData.password === '123456') {
      
      // Tarea: Almacenar el token de sesión (JWT) en el cliente
      localStorage.setItem('token', 'mock_jwt_token_12345');
      
      // Tarea: Redirigir al usuario al escritorio tras el éxito
      navigate('/desktop');
    } else {
      setError('Credenciales incorrectas. Inténtalo de nuevo.');
    }
    setLoading(false);
    // --- FIN DE SIMULACIÓN ---


    /*
    // --- CÓDIGO REAL CON AXIOS (TAREA: SB-F-002) ---
    // (Comentado hasta que el backend esté listo)

    try {
      // Tarea: Implementar envío de credenciales al backend
      const response = await axios.post('URL_DEL_BACKEND/api/auth/login', formData);
      
      // Tarea: Almacenar el token de sesión (JWT) en el cliente
      const token = response.data.token;
      localStorage.setItem('token', token);
      
      // Tarea: Redirigir al usuario al escritorio tras el éxito
      navigate('/desktop');

    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Credenciales incorrectas. Inténtalo de nuevo.');
      } else {
        setError('Ocurrió un error inesperado. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
    */
  };

  return (
    <AuthLayout title="Iniciar Sesión">
      {/* Tarea: Diseñar el componente UI del formulario de login */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-purple-200">Correo Electrónico</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="tu-correo@esfot.com"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-purple-200">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Tu contraseña"
            required
          />
        </div>

        {/* Mensaje de Error */}
        {error && <p className="text-sm text-center text-red-400">{error}</p>}

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
        ¿No tienes una cuenta? {' '}
        <Link to="/register" className="font-medium text-purple-400 hover:text-purple-300">
          Regístrate
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Login;