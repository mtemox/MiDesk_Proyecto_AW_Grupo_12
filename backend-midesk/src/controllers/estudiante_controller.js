import Veterinario from "../models/Estudiante.js"
import { sendMailToRegister } from "../helpers/sendMail.js"

const registro = async (req,res)=>{
    try {
        //Paso 1
        const {email,password} = req.body
        //Paso 2
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
        const verificarEmailBDD = await Veterinario.findOne({email})
        if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
        //Paso 3
        const nuevoVeterinario = new Veterinario(req.body)
        await nuevoVeterinario.save()

        nuevoVeterinario.password = await nuevoVeterinario.encrypPassword(password)

        const token = nuevoVeterinario.createToken()
        await sendMailToRegister(email,token)
        await nuevoVeterinario.save()
        res.status(200).json({msg:"Revisa tu correo electrónico para confirmar tu cuenta"})
        //Paso 4
        res.status(201).json({msg:"Revisa tu correo electrónico para confirmar tu cuenta"})

        
        
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}


export {
    registro
}