// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios'; // (Descomentar para la API real)
import AuthLayout from './Auth'; // La plantilla de estilo
import { useForm } from "react-hook-form";
import { ToastContainer } from 'react-toastify';
import { useFetch } from '../hooks/useFetch';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Limpiar errores al escribir
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
    setApiError('');
  };

  // Tarea: Implementar validación de campos en el cliente
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'El nombre es requerido';
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El formato de email no es válido';
    }
    if (!formData.password) newErrors.password = 'La contraseña es requerida';
    else if (formData.password.length < 6) newErrors.password = 'Debe tener al menos 6 caracteres';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');

    if (!validateForm()) {
      return; // Detener si hay errores de validación
    }

    setLoading(true);

    // --- SIMULACIÓN DE API (OMITIR ESTO CON BACKEND REAL) ---
    // (Usa 'error@dominio.com' para simular un error)
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (formData.email === 'error@dominio.com') {
      // Tarea: Gestionar y mostrar mensajes de error
      setApiError('Este correo electrónico ya está registrado.');
      setLoading(false);
      return;
    }
    
    // Tarea: Gestionar y mostrar mensajes de éxito
    setSuccessMessage('¡Registro exitoso! Redirigiendo al login...');
    setTimeout(() => {
      navigate('/login');
    }, 2000);
    // --- FIN DE SIMULACIÓN ---


    /*
    // --- CÓDIGO REAL CON AXIOS (TAREA: SB-F-001) ---
    // (Comentado hasta que el backend esté listo)
    
    try {
      const { name, email, password } = formData;
      // Tarea: Implementar envío de datos al 'endpoint' del backend
      const response = await axios.post('URL_DEL_BACKEND/api/auth/register', {
        name,
        email,
        password
      });
      
      setSuccessMessage('¡Registro exitoso! Redirigiendo al login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setApiError(error.response.data.message);
      } else {
        setApiError('Ocurrió un error inesperado. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
    */
  };

  // Función de helper para inputs
  const renderInput = (name, type, placeholder) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-purple-200">{placeholder}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={formData[name]}
        onChange={handleChange}
        className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        placeholder={`Ingresa tu ${placeholder.toLowerCase()}`}
      />
      {errors[name] && <p className="mt-1 text-xs text-red-400">{errors[name]}</p>}
    </div>
  );

  return (
    <AuthLayout title="Crear Cuenta">
      {/* Tarea: Diseñar el componente UI del formulario de registro */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {renderInput('name', 'text', 'Nombre Completo')}
        {renderInput('email', 'email', 'Correo Electrónico')}
        {renderInput('password', 'password', 'Contraseña')}
        {renderInput('confirmPassword', 'password', 'Confirmar Contraseña')}

        {/* Mensajes de Error/Éxito */}
        {apiError && <p className="text-sm text-center text-red-400">{apiError}</p>}
        {successMessage && <p className="text-sm text-center text-green-400">{successMessage}</p>}

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