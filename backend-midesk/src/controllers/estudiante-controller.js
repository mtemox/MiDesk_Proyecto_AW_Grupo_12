
import { sendMailToRegister,sendMailToRecoveryPassword } from "../helpers/sendMail.js"
import Estudiante from "../models/estudiante.js"
import { crearTokenJWT } from "../middlewares/JWT.js"
import mongoose from "mongoose"
import Item from "../models/item.js";
import Recommendation from "../models/recomendaciones.js"
import fs from "fs";
import {subirImagenCloudinary} from "../helpers/uploadCloudinary.js"

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
    const {token,confirmMail,createdAt,updatedAt,__v,...datosPerfil} = req.estudianteHeader
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
    const miId = req.estudianteHeader._id; 
    
    // 1. OBTENCIÓN Y LIMPIEZA DEL PARÁMETRO
    // Express a veces devuelve req.query como { 'remoteUserId': '...' } o undefined
    let { remoteUserId } = req.query;

    console.log("--- DEBUG GET DESKTOP ---");
    console.log(`📡 URL solicitada: ${req.originalUrl}`);
    console.log(`📦 Query Params recibidos:`, req.query);
    console.log(`👤 ID Solicitante: ${miId}`);
    console.log(`🎯 Remote ID (crudo): ${remoteUserId}`);

    let items = [];

    // 2. CONDICIÓN RELAJADA
    // Si existe, no es "undefined" (string), no es "null" (string) y no es mi propio ID
    const esModoRemoto = remoteUserId && 
                         remoteUserId !== "undefined" && 
                         remoteUserId !== "null" && 
                         String(remoteUserId) !== String(miId);

    if (esModoRemoto) {
        console.log(`👉 ENTRANDO A MODO REMOTO (Visitando a ${remoteUserId})`);
        
        const yo = await Estudiante.findById(miId);
        // Validamos permisos
        const tienePermiso = yo.escritoriosGuardados.some(id => String(id) === String(remoteUserId));

        if (!tienePermiso) {
            console.log("⛔ Acceso denegado: No está en lista de permitidos");
            // Por seguridad, si no tiene permiso, devolvemos array vacío o error
            // Para debug, devolvamos error claro
            return res.status(403).json({ ok: false, msg: "No tienes permiso para ver este escritorio." });
        }

        // TRAER ITEMS DEL DUEÑO (REMOTO)
        items = await Item.find({
            userId: remoteUserId,
            $or: [ { parentId: null }, { parentId: { $exists: false } } ]
        }).lean();

        console.log(`✅ Items remotos encontrados: ${items.length}`);

    } else {
        console.log("🏠 ENTRANDO A MODO LOCAL");
        
        // TRAER MIS ITEMS + COMPARTIDOS
        items = await Item.find({
            $or: [
                { userId: miId, $or: [{ parentId: null }, { parentId: { $exists: false } }] },
                { "sharedWith.userId": miId }
            ]
        }).lean();

        // Aplicar posiciones personalizadas (solo en local)
        items = items.map(item => {
            if (String(item.userId) !== String(miId) && item.guestPositions) {
                const myPos = item.guestPositions.find(gp => String(gp.userId) === String(miId));
                if (myPos) {
                    item.position = { x: myPos.x, y: myPos.y };
                }
            }
            return item;
        });
    }

    return res.status(200).json({ ok: true, items });

  } catch (error) {
    console.error("❌ Error CRÍTICO en getDesktop:", error);
    return res.status(500).json({ ok: false, msg: `Error - ${error.message}` });
  }
};

/**
 * SB-B003 – POST /items
 * Crea un nuevo ítem asociado al usuario autenticado
 */
const createItem = async (req, res) => {
  try {
    const userId = req.estudianteHeader._id;
    const { type, name, url, parentId, x, y } = req.body;

    console.log("👉 createItem userId:", userId);
    console.log("👉 createItem body:", req.body);

    if (!type || !name)
      return res.status(400).json({ ok: false, msg: "Tipo y nombre son obligatorios" });

    if (type === "link" && !url)
      return res.status(400).json({ ok: false, msg: "La URL es obligatoria para enlaces" });

    const newItem = new Item({
      userId,
      type,
      name,
      url: url || null,
      parentId: parentId || null,
      position: { x: x ?? 100, y: y ?? 100 }
    });

    await newItem.save();

    // ✅ SOCKET.IO EVENT
    const io = req.app.get("io");
    if (io) {
      io.to(`user:${userId}`).emit("item-created", newItem);

      // Si este item tiene compartidos (en el futuro)
      if (newItem.sharedWith && newItem.sharedWith.length > 0) {
        newItem.sharedWith.forEach(s => {
          io.to(`user:${s.userId}`).emit("item-created", newItem);
        });
      }
    }

    return res.status(201).json({
      ok: true,
      msg: "Ítem creado exitosamente",
      item: newItem
    });

  } catch (error) {
    console.error("❌ Error en createItem:", error);
    return res.status(500).json({ ok: false, msg: `Error en el servidor - ${error}` });
  }
};



const renombrarItem=async(req,res)=>{
  try{
    const userId=req.estudianteHeader._id;
    const {id}=req.params;
    const {name}=req.body;

    console.log("✅ ENTRO renombrarItem", {id:String(id), userId:String(userId), name});

    if(!name||!String(name).trim()){
      return res.status(400).json({ok:false,msg:"El nombre es obligatorio"});
    }

    const item=await Item.findOneAndUpdate(
      {_id:id,userId},
      {name:String(name).trim()},
      {new:true}
    );

    if(!item){
      console.log("❌ renombrarItem: item no encontrado o no pertenece");
      return res.status(404).json({ok:false,msg:"Ítem no encontrado o no pertenece al usuario"});
    }

    const io=req.app.get("io");
    console.log("🔎 io existe?:", Boolean(io));

    if(io){
      const payload={id:item._id,name:item.name,parentId:item.parentId,position:item.position,type:item.type};
      console.log("📢 EMIT item-renamed to", `user:${String(userId)}`, payload);

      io.to(`user:${userId}`).emit("item-renamed",payload);

      if(item.sharedWith?.length){
        item.sharedWith.forEach(s=>io.to(`user:${s.userId}`).emit("item-renamed",payload));
      }
    }

    return res.status(200).json({ok:true,msg:"Ítem renombrado correctamente",item});
  }catch(error){
    console.error("❌ renombrarItem:",error);
    return res.status(500).json({ok:false,msg:`Error en el servidor - ${error.message}`});
  }
};



const moverItem = async(req, res) => {
  try {
    const userId = req.estudianteHeader._id; // Quién mueve
    const { id } = req.params;
    const { x, y } = req.body;

    if (x === undefined && y === undefined) {
      return res.status(400).json({ ok: false, msg: "Faltan coordenadas" });
    }

    // Buscamos el ítem (sin filtrar por userId aun, para ver de quién es)
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ ok: false, msg: "Ítem no encontrado" });

    // VERIFICACIÓN DE PROPIEDAD
    const isOwner = String(item.userId) === String(userId);
    const isShared = item.sharedWith.some(s => String(s.userId) === String(userId));

    if (!isOwner && !isShared) {
      return res.status(403).json({ ok: false, msg: "No tienes permiso para mover esto" });
    }

    // LÓGICA DE MOVIMIENTO INDEPENDIENTE
    if (isOwner) {
      // Si soy el dueño, actualizo la posición principal
      if (x !== undefined) item.position.x = Number(x);
      if (y !== undefined) item.position.y = Number(y);
    } else {
      // Si soy invitado, busco si ya tengo una posición guardada
      const guestPosIndex = item.guestPositions.findIndex(
        gp => String(gp.userId) === String(userId)
      );

      if (guestPosIndex >= 0) {
        // Actualizo existente
        if (x !== undefined) item.guestPositions[guestPosIndex].x = Number(x);
        if (y !== undefined) item.guestPositions[guestPosIndex].y = Number(y);
      } else {
        // Creo nueva entrada
        item.guestPositions.push({
          userId,
          x: Number(x ?? item.position.x),
          y: Number(y ?? item.position.y)
        });
      }
    }

    await item.save();

    // SOCKETS: Notificar SOLO al usuario que movió (para no afectar al otro)
    // El frontend ya hace actualización optimista, pero esto confirma.
    // NOTA: Ya no emitimos a la sala global del dueño para evitar que se mueva en su pantalla.
    
    return res.status(200).json({ ok: true, msg: "Ítem movido correctamente" });

  } catch (error) {
    console.error("❌ moverItem:", error);
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

/**
 * SB-B-007 
 */
const actulizarContenidoTextual = async (req, res) => {
  try {
    const userId = req.estudianteHeader._id;
    const { id } = req.params;
    const { content } = req.body;

    if (!content) return res.status(400).json({ msg: "El contenido es obligatorio" });

    // BUSCAMOS: Que sea mío O que me lo hayan compartido con permiso 'edit'
    const file = await Item.findOne({
        _id: id,
        type: { $in: ["note", "code"] },
        $or: [
            { userId: userId }, // Soy el dueño
            { "sharedWith": { $elemMatch: { userId: userId, permission: "edit" } } } // Soy editor
        ]
    });

    if (!file) return res.status(404).json({msg: "Archivo no encontrado o no tienes permiso de edición"});

    file.content = content;
    await file.save();

    // SOCKET: Avisar a la sala del DUEÑO del archivo (para que él lo vea en vivo)
    const io = req.app.get("io");
    if(io) {
        // Emitimos a la sala del dueño del archivo
        io.to(`user:${file.userId}`).emit("file-change", { fileId: id, content });
    }

    res.status(200).json({ok: true, msg: "Contenido guardado correctamente"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error guardando contenido" });
  }
};

const deleteItem = async (req, res) => {
  try {
    const userId = req.estudianteHeader._id;
    const { id } = req.params;

    console.log("🧨 deleteItem id:", id, "userId:", userId);

    const root = await Item.findOne({ _id: id, userId }).lean();
    if (!root) return res.status(404).json({ ok:false, msg:"No existe este ítem o no pertenece al usuario" });

    // ✅ Recolectar IDs a borrar (BFS) evitando ciclos
    const toDelete = new Set([String(id)]);
    const queue = [id];
    let guard = 0;

    while (queue.length) {
      guard++;
      if (guard > 5000) {
        return res.status(400).json({ ok:false, msg:"Árbol demasiado grande o ciclo detectado" });
      }

      const parentId = queue.shift();

      const children = await Item.find({ parentId, userId }).select("_id").lean();
      for (const ch of children) {
        const chId = String(ch._id);
        if (!toDelete.has(chId)) {
          toDelete.add(chId);
          queue.push(ch._id);
        }
      }
    }

    const idsArray = Array.from(toDelete);
    console.log("🧨 Total a borrar:", idsArray.length);

    await Item.deleteMany({ _id: { $in: idsArray }, userId });

    // ✅ SOCKET.IO EVENT
    const io=req.app.get("io");
    if(io){
      io.to(`user:${userId}`).emit("item-deleted",{id,deleted:idsArray.length,ids:idsArray});
      // Si este item tenía compartidos (en el futuro), notifica a invitados
      if(root.sharedWith&&root.sharedWith.length>0){
        root.sharedWith.forEach(s=>{
          io.to(`user:${s.userId}`).emit("item-deleted",{id,deleted:idsArray.length,ids:idsArray});
        });
      }
    }

    return res.status(200).json({ ok:true, msg:"Ítem eliminado correctamente", deleted: idsArray.length });
  } catch (error) {
    console.error("❌ deleteItem:", error);
    return res.status(500).json({ ok:false, msg:`Error en el servidor - ${error.message}` });
  }
};

/**
 * SB-B-009
 * npm i node-cron
 */
const obetenerRecomendaciones = async (req, res) => {
  try {
    const userId = req.estudianteHeader._id;

    const recs = await Recommendation
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    return res.status(200).json({ ok: true, recommendations: recs });
  } catch (error) {
    console.error("❌ getRecommendations:", error);
    return res.status(500).json({ ok: false, msg: "Error en el servidor" });
  }
};

const shareItem = async (req,res)=>{
  try{
    const ownerId=req.estudianteHeader._id;
    const {id}=req.params;
    const {email,permission}=req.body;

    if(!email) return res.status(400).json({msg:"Email requerido"});
    if(!["read","edit"].includes(permission))
      return res.status(400).json({msg:"Permiso inválido (read/edit)"});

    const item=await Item.findOne({_id:id,userId:ownerId});
    if(!item)
      return res.status(403).json({msg:"No puedes compartir este ítem (no eres propietario)"});

    const invitedUser=await Estudiante.findOne({email});
    if(!invitedUser)
      return res.status(404).json({msg:"Usuario invitado no existe"});

    if(String(invitedUser._id)===String(ownerId))
      return res.status(400).json({msg:"No puedes compartir contigo mismo"});

    const index=item.sharedWith.findIndex(
      s=>String(s.userId)===String(invitedUser._id)
    );

    if(index>=0){
      item.sharedWith[index].permission=permission;
    }else{
      item.sharedWith.push({userId:invitedUser._id,permission});
    }

    await item.save();

    // --- NOTIFICACIÓN REAL-TIME (SOCKET) ---
    const io = req.app.get("io");
    if(io) {
        // Le avisamos al usuario invitado que tiene un nuevo ítem
        io.to(`user:${invitedUser._id}`).emit("item-shared", item);
    }

    return res.status(200).json({
      ok:true,
      msg:"Ítem compartido correctamente",
      sharedWith:item.sharedWith
    });
  }catch(error){
    console.error("❌ shareItem:",error);
    return res.status(500).json({msg:"Error en el servidor"});
  }
};

const actuPreferencias=async(req,res)=>{
  try{
    const userId=req.estudianteHeader._id;
    const {theme, wallpaperUrl}=req.body;
    

    if(theme&&!["light","dark"].includes(theme)){
      return res.status(400).json({ok:false,msg:"theme inválido (light/dark)"});
    }

    const estudiante=await Estudiante.findById(userId);
    if(!estudiante) return res.status(404).json({ok:false,msg:"Usuario no encontrado"});

    if (theme) estudiante.preferences.theme=theme;
    if (wallpaperUrl !== undefined) {
        estudiante.preferences.wallpaperUrl = wallpaperUrl;
    }

    await estudiante.save();

    const io=req.app.get("io");
    if (io) io.to(`user:${userId}`).emit("preferences-updated", { 
        theme: estudiante.preferences.theme,
        wallpaperUrl: estudiante.preferences.wallpaperUrl 
    });

    return res.status(200).json({ok:true,msg:"Preferencias actualizadas",preferences:estudiante.preferences});
  }catch(error){
    console.error("❌ updatePreferences:",error);
    return res.status(500).json({ok:false,msg:`Error en el servidor - ${error.message}`});
  }
};

const actualizarImagen = async (req, res) => {
  try {
    const userId = req.estudianteHeader._id;

    // ✅ validar archivo en campo "image"
    if (!req.files || !req.files.image) {
      return res.status(400).json({
        ok: false,
        msg: "Debes enviar un archivo en el campo 'image'",
      });
    }

    const file = req.files.image;

    // ✅ express-fileupload con useTempFiles:true genera tempFilePath
    if (!file.tempFilePath) {
      return res.status(400).json({
        ok: false,
        msg: "tempFilePath no existe. Revisa express-fileupload (useTempFiles:true)",
      });
    }

    // ✅ subir a Cloudinary
    const { secure_url, public_id } = await subirImagenCloudinary(file.tempFilePath, "VirtualDesk");

    // ✅ guardar en BD (aunque no exista preferences)
    const estudiante = await Estudiante.findByIdAndUpdate(
      userId,
      { $set: { "preferences.wallpaperUrl": secure_url } },
      { new: true }
    );

    return res.status(200).json({
      ok: true,
      msg: "Imagen subida correctamente",
      wallpaperUrl: secure_url,
      publicId: public_id,
      preferences: estudiante?.preferences || { wallpaperUrl: secure_url },
    });
  } catch (error) {
    console.error("❌ subirImagen:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error en el servidor",
      error: error?.message || String(error),
    });
  }
};

// A. FUNCIÓN PARA COMPARTIR MI ESCRITORIO (Dar permiso)
const compartirEscritorio = async (req, res) => {
    try {
        const ownerId = req.estudianteHeader._id; // Yo
        const { email } = req.body; // A quién invito

        const invitado = await Estudiante.findOne({ email });
        if (!invitado) return res.status(404).json({ msg: "Usuario no encontrado" });

        // Evitar duplicados
        if (!invitado.escritoriosGuardados.includes(ownerId)) {
            invitado.escritoriosGuardados.push(ownerId);
            await invitado.save();
        }

        return res.status(200).json({ ok: true, msg: `Escritorio compartido con ${email}` });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};

// B. FUNCIÓN PARA OBTENER EL DASHBOARD (Mis datos + Escritorios guardados)
const getDashboardData = async (req, res) => {
    try {
        const userId = req.estudianteHeader._id;
        
        // Buscamos al usuario y "populamos" la lista de escritorios guardados
        // para obtener sus nombres y emails.
        const usuario = await Estudiante.findById(userId)
            .populate('escritoriosGuardados', 'nombre email') 
            .select('-password -token -confirmMail');

        return res.status(200).json({ ok: true, usuario });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
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
    deleteItem,
    renombrarItem,
    moverItem,
    actulizarContenidoTextual,
    obetenerRecomendaciones,
    shareItem,
    actuPreferencias,
    actualizarImagen,
    compartirEscritorio,
    getDashboardData
}

