import {Router} from 'express'
import {    comprobarTokenPasword, 
            confirmarMail, 
            crearNuevoPassword, 
            recuperarPassword, 
            registro,
            login } 
from '../controllers/estudiante-controller.js'

const router = Router()


console.log("✅ [estudiante-routes.js] Archivo cargado y definiendo rutas.");

router.post('/login', login);

router.post('/registro', registro);
router.get('/confirmar/:token',confirmarMail)


router.post('/recuperarpassword',recuperarPassword)
router.get('/recuperarpassword/:token',comprobarTokenPasword)
router.post('/nuevopassword/:token',crearNuevoPassword)



export default router;