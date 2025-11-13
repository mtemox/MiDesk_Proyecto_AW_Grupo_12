import {Router} from 'express'
import { confirmarMail,recuperarPassword,comprobarTokenPassword,crearNuevoPassword,registro, login } from '../controllers/estudiante-controller.js';

const router = Router()


console.log("✅ [estudiante-routes.js] Archivo cargado y definiendo rutas.");

router.post('/registro', registro);

router.get('/confirmar/:token',confirmarMail)

router.post('/recuperarPassword',recuperarPassword)

router.get('/recuperarPassword/:token',comprobarTokenPassword)

router.post('/nuevoPassword/:token',crearNuevoPassword)

router.post('/veterinario/login',login)


export default router;