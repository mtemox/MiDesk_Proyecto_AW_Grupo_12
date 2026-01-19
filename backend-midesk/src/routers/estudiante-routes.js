import {Router} from 'express'
import { confirmarMail,recuperarPassword,comprobarTokenPassword,crearNuevoPassword,registro, login,perfil,actualizarPassword,actualizarPerfil,getDesktop,createItem,deleteItem,
moverItem,renombrarItem,actulizarContenidoTextual,obetenerRecomendaciones,shareItem,actualizarImagen,actuPreferencias,  
compartirEscritorio,
getDashboardData} from '../controllers/estudiante-controller.js';
import { verificarTokenJWT } from '../middlewares/JWT.js';

import { improveTextIA } from "../controllers/ai-controller.js";


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

router.patch('/items/:id/renombrar', verificarTokenJWT, renombrarItem);

router.patch('/items/:id/mover', verificarTokenJWT, moverItem);

//ID= de la carpeta que quieras eliminar 
router.delete('/items/:id', verificarTokenJWT, deleteItem);

router.post('/ia/improve-text', verificarTokenJWT, improveTextIA);

router.put('/files/:id', verificarTokenJWT, actulizarContenidoTextual);

router.get("/ia/recommendations", verificarTokenJWT, obetenerRecomendaciones);

router.post("/share/:id", verificarTokenJWT, shareItem);

router.patch("/user/preferences",verificarTokenJWT,actuPreferencias);

router.post("/upload/image",verificarTokenJWT,actualizarImagen);

router.post("/share-desktop", verificarTokenJWT, compartirEscritorio);

router.get("/dashboard-data", verificarTokenJWT, getDashboardData);

export default router;