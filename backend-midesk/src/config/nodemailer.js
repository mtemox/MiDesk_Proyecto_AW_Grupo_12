import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP,
    },
    // ⚡ Agregar timeouts
    connectionTimeout: 10000, // 10 segundos
    greetingTimeout: 10000,
    socketTimeout: 15000,
})

// ✅ Verificar la conexión al iniciar
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ Error en configuración de email:", error);
    } else {
        console.log("✅ Servidor de email listo para enviar mensajes");
    }
});

const sendMail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: '"DeskVirtual" <materchico@gmail.com>',
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