const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require('firebase-functions/params');
const logger = require("firebase-functions/logger");
const cors = require("cors")({ origin: true });
const axios = require("axios");

const openRouterKey = defineSecret('OPENROUTER_API_KEY');

exports.chat = onRequest({ secrets: [openRouterKey] }, (req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    try {
      const { message, history = [], mentorTone = "friendly", mentorCharacter = "nova" } = req.body;
      
      const systemPrompt = `Ты ИИ-наставник обучающий семью искусственному интеллекту. Тебя зовут ${mentorCharacter}. Тон: ${mentorTone}. Отвечай кратко на русском языке. Используй эмодзи.`;
      
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            ...history,
            { role: "user", content: message }
          ]
        },
        {
          headers: {
            "Authorization": `Bearer ${openRouterKey.value()}`,
            "HTTP-Referer": "https://adel-assistant.web.app",
            "X-Title": "Adel Assistant"
          }
        }
      );

      const aiText = response.data.choices[0].message.content;
      
      res.json({ 
        response: aiText,
        buttons: ["Что такое ИИ?", "Приведи пример", "Спасибо!"] // Example fallback logic
      });
      
    } catch (error) {
      logger.error("Error calling OpenRouter", error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to generate AI response' });
    }
  });
});
