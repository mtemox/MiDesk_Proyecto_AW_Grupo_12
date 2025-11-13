// Paquetes

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import routerEstudiantes from './routers/estudiante-routes.js'


// Inicializaciones
const app = express()
dotenv.config()

// Configuraciones

// Middlewares

app.use(express.json());
app.use(cors());

// Variables de entorno o variables globales
app.set('port', process.env.PORT || 3000);

// Rutas
// Ruta principal
app.get('/',(req,res)=>res.send("Server on"))

console.log("✅ Cargando rutas de estudiantes en /api");
// Rutas para veterinarios
app.use('/api',routerEstudiantes)

// Manejo de una ruta que no sea encontrada
app.use((req,res)=>{


    console.log(`❌ 404 - Ruta no encontrada: ${req.method} ${req.originalUrl}`);

    res.status(404).send("Endpoint no encontrado - 404")
    
})

    

// Exportar la instancia express por medio de app

export default app;