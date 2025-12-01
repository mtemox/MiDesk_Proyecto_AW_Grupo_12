
import { sendMailToRegister,sendMailToRecoveryPassword } from "../helpers/sendMail.js"
import Estudiante from "../models/estudiante.js"
import { crearTokenJWT } from "../middlewares/JWT.js"
import mongoose from "mongoose"
import Item from "../models/item.js";


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
            const{nombre,apellido,direccion,celular,_id,rol} = estudianteBDD
            const token = crearTokenJWT(estudianteBDD._id,estudianteBDD.rol)

            //Paso 4 
            res.status(200).json({
                token,
                nombre,
                apellido,
                direccion,
                celular,
                rol,
                _id,
                email:estudianteBDD.email

        })
        
     }catch(error){
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
     }

    }

    const perfil =(req,res)=>{
    const {token,confirmEmail,createdAt,updatedAt,__v,...datosPerfil} = req.estudianteHeader
    res.status(200).json(datosPerfil)
    }

    const actualizarPassword = async (req,res)=>{
    try {
        const estudianteBDD = await Estudiante.findById(req.estudianteHeader._id)
        if(!estudianteBDD) return res.status(404).json({msg:`Lo sentimos, no existe el estudiante ${id}`})
        const verificarPassword = await estudianteBDD.matchPassword(req.body.passwordactual)
        if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password actual no es el correcto"})
        estudianteBDD.password = await estudianteBDD.encryptPassword(req.body.passwordnuevo)
        await estudianteBDD.save()
        res.status(200).json({msg:"Password actualizado correctamente"})
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

   const actualizarPerfil = async (req,res)=>{

    try {
        const {id} = req.params
        const {nombre,apellido,direccion,celular,email} = req.body
        if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(400).json({msg:`ID inválido: ${id}`})
        const estudianteBDD = await Estudiante.findById(id)
        if(!estudianteBDD) return res.status(404).json({ msg: `No existe el estudiante con ID ${id}` })
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Debes llenar todos los campos"})
        if (estudianteBDD.email !== email)
        {
            const emailExistente  = await Estudiante.findOne({email})
            if (emailExistente )
            {
                return res.status(404).json({msg:`El email ya se encuentra registrado`})  
            }
        }
        estudianteBDD.nombre = nombre ?? estudianteBDD.nombre
        estudianteBDD.apellido = apellido ?? estudianteBDD.apellido
        estudianteBDD.direccion = direccion ?? estudianteBDD.direccion
        estudianteBDD.celular = celular ?? estudianteBDD.celular
        estudianteBDD.email = email ?? estudianteBDD.email
        await estudianteBDD.save()
        res.status(200).json(estudianteBDD)
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

    /**
 * SB-B002 – GET /desktop
 * Devuelve los ítems raíz del usuario autenticado
 */
const getDesktop = async (req, res) => {
  try {
    const userId = req.estudianteHeader._id;

    console.log("👉 getDesktop userId:", userId);

    const items = await Item.find({
      userId,
      $or: [
        { parentId: null },
        { parentId: { $exists: false } }
      ]
    }).lean();

    console.log("👉 getDesktop items encontrados:", items.length);

    return res.status(200).json({
      ok: true,
      items
    });

  } catch (error) {
    console.error("❌ Error en getDesktop:", error);
    return res.status(500).json({ ok: false, msg: `Error en el servidor - ${error}` });
  }
};

/**
 * SB-B003 – POST /items
 * Crea un nuevo ítem asociado al usuario autenticado
 */
const createItem = async (req, res) => {
  try {
    const userId = req.estudianteHeader._id;
    // CORRECCIÓN: Agregamos 'content' aquí 👇
    const { type, name, url, parentId, x, y, content } = req.body; 

    console.log("👉 createItem userId:", userId);

    if (!type || !name) {
      return res.status(400).json({ ok: false, msg: "Tipo y nombre son obligatorios" });
    }

    if (type === "link" && !url) {
      return res.status(400).json({ ok: false, msg: "La URL es obligatoria para enlaces" });
    }

    const newItem = new Item({
      userId,
      type,
      name,
      url: url || null,
      parentId: parentId || null,
      content: content || "", // Ahora sí existe la variable
      position: {
        x: x ?? 100,
        y: y ?? 100,
      },
    });

    await newItem.save();

    return res.status(201).json({
      ok: true,
      msg: "Ítem creado exitosamente",
      item: newItem,
    });
  } catch (error) {
    console.error("❌ Error en createItem:", error);
    return res.status(500).json({ ok: false, msg: `Error en el servidor - ${error}` });
  }
};

const deleteItem = async (req, res) => {
  try {
    const userId = req.estudianteHeader._id;
    const { id } = req.params;

    // 1. Buscar el ítem principal
    const item = await Item.findOne({ _id: id, userId });
    if (!item) {
      return res.status(404).json({
        ok: false,
        msg: "No existe este ítem o no pertenece al usuario"
      });
    }

    // 2. Función recursiva para eliminar hijos
    const deleteChildren = async (parentId) => {
      const children = await Item.find({ parentId, userId });

      for (const child of children) {
        await deleteChildren(child._id); // Eliminar subhijos
        await Item.findByIdAndDelete(child._id);
      }
    };

    // 3. Eliminar todos los hijos primero
    await deleteChildren(item._id);

    // 4. Eliminar el ítem principal
    await Item.findByIdAndDelete(item._id);

    return res.status(200).json({
      ok: true,
      msg: "Ítem eliminado correctamente"
    });

  } catch (error) {
    console.error("Error eliminando ítem:", error);
    return res.status(500).json({
      ok: false,
      msg: `Error en el servidor - ${error}`
    });
  }
};

export {
    registro,
    confirmarMail,
    recuperarPassword,
    comprobarTokenPassword,
    crearNuevoPassword,
    login,
    perfil,
    actualizarPassword,
    actualizarPerfil,
    getDesktop,
    createItem,
    deleteItem 
}