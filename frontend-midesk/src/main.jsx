// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <-- IMPORTAR
import { ToastContainer } from 'react-toastify'
import { ThemeProvider } from './context/ThemeContext';
import './index.css'
import App from './App.jsx'

import { SocketProvider } from './context/SocketContext.jsx';

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <StrictMode>
      <SocketProvider> {/* <--- ENVOLVEMOS AQUÍ (Fuera o dentro del Router, pero fuera de App) */}
        <BrowserRouter>
          <App />
          <ToastContainer 
            position="top-right"
            autoClose={3000}
            theme="colored"
          />
        </BrowserRouter>
      </SocketProvider>
    </StrictMode>
  </ThemeProvider>
);