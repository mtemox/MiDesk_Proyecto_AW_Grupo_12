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

export { improveTextIA };
