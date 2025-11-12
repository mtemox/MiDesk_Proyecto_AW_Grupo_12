import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

// ✅ OPCIÓN 1: Si usas Gmail real
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.USER_MAILTRAP, // Tu email de Gmail
        pass: process.env.PASS_MAILTRAP,  // Tu contraseña de aplicación de Gmail
    },
})

// ✅ OPCIÓN 2: Si usas Mailtrap (para testing)
// const transporter = nodemailer.createTransport({
//     host: process.env.HOST_MAILTRAP,
//     port: process.env.PORT_MAILTRAP,
//     auth: {
//         user: process.env.USER_MAILTRAP,
//         pass: process.env.PASS_MAILTRAP,
//     },
// })

// ✅ OPCIÓN 3: Si usas otro servicio SMTP
// const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com", // o tu host SMTP
//     port: 587,
//     secure: false, // true para puerto 465, false para otros
//     auth: {
//         user: process.env.USER_MAILTRAP,
//         pass: process.env.PASS_MAILTRAP,
//     },
// })

/**
 * Función genérica para enviar correos
 * @param {string} to - Email del destinatario
 * @param {string} subject - Asunto del correo
 * @param {string} html - Contenido HTML del correo
 */
const sendMail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: '"DeskVirtual" <admin@vet.com>', // ⚠️ Debe ser un email válido si usas Gmail
            to,
            subject,
            html,
        })
        console.log("✅ Email enviado:", info.messageId)
        return { success: true, messageId: info.messageId }
    } catch (error) {
        console.error("❌ Error enviando email:", error.message)
        return { success: false, error: error.message }
    }
}

export default sendMail