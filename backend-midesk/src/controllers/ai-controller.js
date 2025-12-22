import hf from "../services/huggingface.js";

const summarizeText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ ok: false, msg: "El texto es obligatorio" });
    }

    try {
      const result = await hf.summarization({
        model: process.env.HF_MODEL_SUMMARY,
        inputs: text,
      });

      return res.json({
        ok: true,
        source: "huggingface",
        summary: result.summary_text
      });

    } catch (hfError) {
      console.warn("⚠️ HuggingFace no disponible, usando fallback");

      // Fallback local
      return res.json({
        ok: true,
        source: "fallback",
        summary: text.slice(0, 120) + "..."
      });
    }

  } catch (error) {
    return res.status(500).json({ ok: false, msg: "Error IA" });
  }
};


export {summarizeText}