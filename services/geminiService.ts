
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // For this example, we'll proceed, and the UI will show an error if the call fails.
  console.warn("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const systemInstruction = `You are a helpful and empathetic AI legal assistant named 'AI 法律助理'. 
Your expertise is in digital inheritance laws, with a specific focus on Taiwan's Civil Code (台灣《民法》). 
Your goal is to provide clear, concise, and preliminary advice to users regarding their digital assets and wills.
- When referencing laws, be specific if possible (e.g., "According to Taiwan's Civil Code, Article...").
- Keep your responses easy to understand for a non-legal audience.
- ALWAYS include a disclaimer at the end of every response, in traditional Chinese, stating: "請注意：我是一個AI助理，以上資訊僅供參考，不能取代專業律師的正式法律建議。若需處理具體法律事務，請務必諮詢合格的執業律師。"
- Do not answer questions outside the scope of digital inheritance, wills, and estate planning. If asked an off-topic question, politely decline and steer the conversation back to your area of expertise.`;


export const getGeminiResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.5,
            topP: 0.95,
        }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    return "抱歉，與AI助理的連線發生問題。請檢查您的網路連線或稍後再試。";
  }
};
