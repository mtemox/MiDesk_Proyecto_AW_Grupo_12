import Estudiante from "../models/estudiante.js"
import { sendMailToRecoveryPassword, sendMailToRegister } from "../helpers/sendMail.js"
import jwt from 'jsonwebtoken'

// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // 1. Validar campos
        if (Object.values(req.body).includes("")) 
            return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });

        // 2. Verificar que el usuario exista
        const estudianteBDD = await Estudiante.findOne({ email });
        if (!estudianteBDD) 
            return res.status(404).json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });

        // 3. Verificar si la cuenta está confirmada
        if (!estudianteBDD.confirmMail) 
            return res.status(401).json({ msg: "Lo sentimos, debes confirmar tu cuenta" });

        // 4. Verificar el password
        const matchPassword = await estudianteBDD.matchPassword(password);
        if (!matchPassword) 
            return res.status(401).json({ msg: "Lo sentimos, el password no es correcto" });

        // 5. Generar el Token JWT para la sesión
        const token = jwt.sign(
            { id: estudianteBDD._id, nombre: estudianteBDD.nombre },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // El token expira en 1 día
        );

        // 6. Enviar respuesta al frontend
        res.status(200).json({
            token,
            id: estudianteBDD._id,
            nombre: estudianteBDD.nombre,
            email: estudianteBDD.email,
            msg: "Inicio de sesión exitoso" // Mensaje para el toast del frontend
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` });
    }
}
// FIN DEL LOGIN

const registro = async (req,res)=>{
    try {
        const {email,password} = req.body
        
        if (Object.values(req.body).includes("")) 
            return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
        
        const verificarEmailBDD = await Estudiante.findOne({email})
        if(verificarEmailBDD) 
            return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
        
        const nuevoEstudiante = new Estudiante(req.body)
        nuevoEstudiante.password = await nuevoEstudiante.encryptPassword(password)
        const token = nuevoEstudiante.createToken()
        
        // ⚡ Guardar primero en la BD
        await nuevoEstudiante.save()
        
        // ✅ Enviar email de forma asíncrona (sin esperar)
        sendMailToRegister(email,token).catch(err => 
            console.error("Error al enviar email:", err)
        )
        
        // ⚡ Responder inmediatamente
        res.status(200).json({msg:"Registro exitoso. Revisa tu correo electrónico para confirmar tu cuenta"})

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` })
    }
}

const confirmarMail = async (req, res) => {
    //res.send("Cuenta Verificada")
 
        //Paso 1 verificar el token
        const { token } = req.params
        //Paso 2 verificar los datos
        const estudianteBDD = await Estudiante.findOne({ token })
        if (!estudianteBDD) return res.status(404).json({ msg: "Token inválido o cuenta ya confirmada" })
        //Paso 3
        estudianteBDD.token = null
        estudianteBDD.confirmMail = true
        await estudianteBDD.save()
        //Paso 4
        res.status(200).json({ msg: "Cuenta confirmada, ya puedes iniciar sesión" })

   
    }

const recuperarPassword = async (req, res) => {

    try {
        const { email } = req.body
        if (!email) return res.status(400).json({ msg: "Debes ingresar un correo electrónico" })
        const estudianteBDD = await Estudiante.findOne({ email })
        if (!estudianteBDD) return res.status(404).json({ msg: "El usuario no se encuentra registrado" })
        const token = estudianteBDD.createToken()
        estudianteBDD.token = token
        await sendMailToRecoveryPassword(email, token)
        await estudianteBDD.save()
        res.status(200).json({ msg: "Revisa tu correo electrónico para reestablecer tu cuenta" })
        
    } catch (error) {
    console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}



const comprobarTokenPasword = async (req,res)=>{
    try {
        const {token} = req.params
        const estudianteBDD = await Estudiante.findOne({token})
        if(estudianteBDD?.token !== token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
        res.status(200).json({msg:"Token confirmado, ya puedes crear tu nuevo password"}) 
    
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}



const crearNuevoPassword = async (req,res)=>{

    try {
        const{password,confirmpassword} = req.body
        const { token } = req.params
        if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Debes llenar todos los campos"})
        if(password !== confirmpassword) return res.status(404).json({msg:"Los passwords no coinciden"})
        const estudianteBDD = await Estudiante.findOne({token})
        if(!estudianteBDD) return res.status(404).json({msg:"No se puede validar la cuenta"})
        estudianteBDD.token = null
        estudianteBDD.password = await estudianteBDD.encryptPassword(password)
        await estudianteBDD.save()
        res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nuevo password"}) 

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}


export {
    login,
    registro,
    confirmarMail,
    recuperarPassword,
    comprobarTokenPasword,
    crearNuevoPassword
}