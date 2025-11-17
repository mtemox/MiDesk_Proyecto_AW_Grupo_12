
import generarJWT from "../helpers/crearJWT.js"
import { sendMailToRegister,sendMailToRecoveryPassword } from "../helpers/sendMail.js"
import Estudiante from "../models/estudiante.js"


const registro = async (req,res)=>{

    try {
        //Paso 1
        const {email,password} = req.body
        //Paso 2
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
        const verificarEmailBDD = await Estudiante.findOne({email})
        if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
        //Paso 3
        const nuevoEstudiante = new Estudiante(req.body)
        nuevoEstudiante.password = await nuevoEstudiante.encryptPassword(password)
        const token = nuevoEstudiante.createToken()
        await sendMailToRegister(email,token)
        await nuevoEstudiante.save()
        //Paso 4
        res.status(200).json({msg:"Revisa tu correo electrónico para confirmar tu cuenta"})

    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
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

    try{
        //Paso 1
        const{email} = req.body
        //Paso2
        if (!email) return res.status(400).json({ msg: "Debes ingresar un correo electrónico" })
        const estudianteBDD = await Estudiante.findOne({ email })
        if (!estudianteBDD) return res.status(404).json({ msg: "El usuario no se encuentra registrado" })
        //Paso3
        const token = estudianteBDD.createToken()//ABC123
        estudianteBDD.token = token
        await estudianteBDD.save()
        //Correo 
        //Paso 4
        await sendMailToRecoveryPassword(email,token)
        res.status(200).json({msg: 'Revisa tu correo electrónico para restablecer tu cuenta'})
        
    }catch(error){


        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}


const comprobarTokenPassword = async (req, res) => {
        try{
            //Paso 1
            const{token} = req.params
            //Paso2
            const estudianteBDD = await Estudiante.findOne({token})
            if(estudianteBDD?.token !== token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
            //Paso3
            //estudianteBDD?.token = token
            //Paso4
            res.status(200).json({msg:"Token confirmado, ya puedes crear tu nuevo password"}) 
            
        }catch(error){
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const crearNuevoPassword = async (req, res) => {

        try{
            //Paso 1
            const{token}=req.params
            const{password,confirmpassword}=req.body

            //Paso 2
            if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Debes llenar todos los campos"})
            if(password !== confirmpassword) return res.status(404).json({msg:"Los passwords no coinciden"})
            const estudianteBDD = await Estudiante.findOne({token})
            if(!estudianteBDD) return res.status(404).json({msg:"No se puede validar la cuenta"})
            
            //Paso 3
            estudianteBDD.password = await estudianteBDD.encryptPassword(password)
            estudianteBDD.token = null
            await estudianteBDD.save()

            //Paso 4
            res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nuevo password"}) 

        }catch(error){
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const login = async (req, res) => {
        try{
            //Paso 1
            const {email,password} = req.body
            //Paso 2
            if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Debes llenar todos los campos"})
            const estudianteBDD = await Estudiante.findOne({ email })
            if (!estudianteBDD) return res.status(404).json({ msg: "El usuario no se encuentra registrado" })

            if(!estudianteBDD.confirmMail) return res.status(403).json({ msg: "Debes verificar la cuenta antes de inciar sesión" })

            const verificarPassword = await estudianteBDD.matchPassword(password)
            if(!verificarPassword) return res.status(401).json({ msg: "El password no es correcto" })

            //Paso 3
            // Se genera el token JWT para la sesión
            const token = generarJWT(estudianteBDD._id, estudianteBDD.rol);

            const{nombre,apellido,direccion,telefono,_id,rol} = estudianteBDD

            //Paso 4 
            res.status(200).json({
                token,
                nombre,
                apellido,
                direccion,
                telefono,
                _id,
                rol,
                email:estudianteBDD.email

        })
        
     }catch(error){
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
     }

}

export {
    registro,
    confirmarMail,
    recuperarPassword,
    comprobarTokenPassword,
    crearNuevoPassword,
    login
    
}