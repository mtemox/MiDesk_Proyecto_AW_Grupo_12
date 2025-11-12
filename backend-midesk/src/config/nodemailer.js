import sgMail from '@sendgrid/mail'
import dotenv from 'dotenv'
dotenv.config()

// Configurar API Key de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

/**
 * Función genérica para enviar correos usando SendGrid
 * @param {string} to - Email del destinatario
 * @param {string} subject - Asunto del correo
 * @param {string} html - Contenido HTML del correo
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
const sendMail = async (to, subject, html) => {
    try {
        console.log(`📧 Preparando envío de email a: ${to}`)
        const startTime = Date.now()
        
        const msg = {
            to, // Email del destinatario
            from: {
                email: process.env.SENDGRID_SENDER_EMAIL || 'materchico@gmail.com',
                name: 'DeskVirtual'
            },
            subject,
            html,
            // Opcional: agregar texto plano como fallback
            text: html.replace(/<[^>]*>/g, ''), // Remueve tags HTML
        }
        
        const response = await sgMail.send(msg)
        
        const duration = Date.now() - startTime
        const messageId = response[0].headers['x-message-id']
        
        console.log(`✅ Email enviado exitosamente en ${duration}ms`)
        console.log(`   → Destinatario: ${to}`)
        console.log(`   → Message ID: ${messageId}`)
        
        return { 
            success: true, 
            messageId: messageId 
        }
        
    } catch (error) {
        console.error("❌ Error al enviar email con SendGrid:")
        console.error(`   → Código: ${error.code}`)
        console.error(`   → Mensaje: ${error.message}`)
        
        // Errores comunes de SendGrid
        if (error.code === 401) {
            console.error("   ⚠️  API Key inválida o no configurada")
        } else if (error.code === 403) {
            console.error("   ⚠️  Email remitente no verificado en SendGrid")
        } else if (error.response) {
            console.error(`   → Detalles: ${JSON.stringify(error.response.body)}`)
        }
        
        return { 
            success: false, 
            error: error.message 
        }
    }
}

// Verificar configuración al iniciar el servidor
const verifyConfiguration = () => {
    if (!process.env.SENDGRID_API_KEY) {
        console.error("❌ SENDGRID_API_KEY no está configurada en las variables de entorno")
        return false
    }
    
    if (!process.env.SENDGRID_SENDER_EMAIL) {
        console.warn("⚠️  SENDGRID_SENDER_EMAIL no está configurada, usando email por defecto")
    }
    
    console.log("✅ SendGrid configurado correctamente")
    return true
}

// Ejecutar verificación al importar el módulo
verifyConfiguration()

export default sendMail