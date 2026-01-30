import axios from "axios";

const improveTextIA = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: "Texto requerido" });

    const url = "https://api-inference.huggingface.com/models/facebook/bart-large-cnn";

    const response = await axios.post(
      url,
      { inputs: `Improve the following text in Spanish:\n\n${text}` },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 60000,
      }
    );

    const improved = response.data?.[0]?.generated_text ?? response.data;

    return res.status(200).json({ ok: true, improvedText: improved });
  } catch (error) {
    console.log("❌ HF ERROR MSG:", error.message);
    return res.status(500).json({ msg: "Error IA", error: error.message });
  }
};

// 2. NUEVA FUNCIÓN (CHATBOT CON PYTHON/OSCAR)
const chatWithMiDesk = async (req, res) => {
    try {
        const { mensaje } = req.body; // Recibimos el mensaje desde React

        if (!mensaje) {
            return res.status(400).json({ ok: false, msg: "El mensaje es obligatorio" });
        }

        // URL del microservicio de Oscar (Debe estar en tu .env o hardcodeada temporalmente)
        // Ejemplo: https://midesk-ia-api.onrender.com/chat
        const pythonUrl = process.env.PYTHON_MICROSERVICE_URL; 

        if (!pythonUrl) {
            return res.status(500).json({ ok: false, msg: "Error de configuración: Falta PYTHON_MICROSERVICE_URL" });
        }

        // Hacemos la petición al Python de Oscar
        // Python espera: { "mensaje": "..." }
        const response = await axios.post(pythonUrl, { mensaje });

        // Devolvemos la respuesta de Python tal cual al Frontend
        // Python devuelve: { "respuesta": "...", "metricas": {...} }
        return res.status(200).json({
            ok: true,
            data: response.data 
        });

    } catch (error) {
        console.error("❌ Error comunicando con Microservicio Python:", error.message);
        
        // Manejo de error si el servidor de Oscar está apagado o falla
        if (error.code === 'ECONNREFUSED' || error.response?.status >= 500) {
            return res.status(503).json({ ok: false, msg: "El asistente IA no está disponible en este momento." });
        }
        
        return res.status(500).json({ ok: false, msg: "Error interno del servidor" });
    }
};

export { improveTextIA, chatWithMiDesk };