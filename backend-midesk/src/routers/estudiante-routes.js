import {Router} from 'express'
import { confirmarMail,recuperarPassword,comprobarTokenPassword,crearNuevoPassword,registro, login,perfil,actualizarPassword,actualizarPerfil,getDesktop,createItem,deleteItem,
moverItem,renombrarItem  } from '../controllers/estudiante-controller.js';
import { verificarTokenJWT } from '../middlewares/JWT.js';

import { summarizeText } from "../controllers/ai-controller.js";


const router = Router()


console.log("✅ [estudiante-routes.js] Archivo cargado y definiendo rutas.");

router.post('/registro', registro);

router.get('/confirmar/:token',confirmarMail)

router.post('/recuperarPassword',recuperarPassword)

router.get('/recuperarPassword/:token',comprobarTokenPassword)

router.post('/nuevoPassword/:token',crearNuevoPassword)




router.post('/estudiante/login',login)

router.get('/estudiante/perfil',verificarTokenJWT,perfil)

router.put('/estudiante/perfil/:id',verificarTokenJWT,actualizarPerfil)

router.put('/actualizarPassword/:id',verificarTokenJWT,actualizarPassword)

// Obtener ítems del escritorio
router.get("/desktop", verificarTokenJWT, getDesktop);

// Crear un nuevo ítem
router.post("/items", verificarTokenJWT, createItem);

//ID= de la carpeta que quieras eliminar 
router.delete('/items/:id', verificarTokenJWT, deleteItem);

router.patch('/items/:id/renombrar', verificarTokenJWT, renombrarItem);

router.patch('/items/:id/mover', verificarTokenJWT, moverItem);

router.post('/ai/summarize', verificarTokenJWT, summarizeText);

export default router;