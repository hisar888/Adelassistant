/**
 * Mock AI Service for frontend development (MVP)
 * Replaces Cloud Functions openrouter proxy for now.
 */
export const fetchAIResponse = async (message) => {
  const FUNCTION_URL = import.meta.env.VITE_AI_FUNCTION_URL;

  if (FUNCTION_URL) {
    try {
      const resp = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, mentorCharacter: 'nova', mentorTone: 'friendly' })
      });
      if (resp.ok) {
        return await resp.json();
      }
    } catch (error) {
      console.error("Failed to reach AI Function:", error);
    }
  }

  // Fallback to mock (development)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        response: `[Mock] Отвечаю на: "${message}". Искусственный интеллект постоянно учится новому!`,
        buttons: ["Интересно!", "Расскажи подробнее", "Что еще?"]
      });
    }, 1500);
  });
};

export const generateQuest = async (branch, skill, ageGroup) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: "mock_quest_1",
        title: "Введение в ИИ",
        description: "Узнай, что такое искусственный интеллект на простых примерах.",
        xpReward: 100,
        steps: [
          { type: "dialogue", id: "s1" },
          { type: "practice", id: "s2" },
          { type: "quiz", id: "s3" }
        ]
      });
    }, 1000);
  });
};

export const evaluateAnswer = async (questId, stepId, answer) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pass = answer.length > 10;
      resolve({
        score: pass ? 95 : 45,
        feedback: pass 
          ? "Отличный промпт! Очень детальный и понятный." 
          : "Слишком коротко, попробуйте добавить деталей (минимум 10 символов).",
        pass: pass
      });
    }, 1500);
  });
};
