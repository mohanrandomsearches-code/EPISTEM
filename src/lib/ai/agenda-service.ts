import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

const getGeminiAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

const getOpenAI = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "MY_OPENAI_API_KEY") {
    return null;
  }
  return new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
};

export async function suggestAgendaActivity(slotName: string, date: string, weakTopics: string[]): Promise<string> {
  const openai = getOpenAI();
  const gemini = getGeminiAI();
  
  const prompt = `
Suggest one focused lesson activity for the time slot "${slotName}" on ${date} for a class that is currently weak in these topics: ${weakTopics.join(', ')}.

Be specific and include:
1. Topic name
2. Activity type (e.g., hands-on, quiz, peer-learning)
3. Time breakdown (e.g., 10 min: intro, 20 min: activity, 5 min: wrap-up)

Keep it concise and professional.
`;

  if (openai) {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert educational consultant." },
        { role: "user", content: prompt }
      ]
    });
    return response.choices[0].message.content || "Could not generate suggestion.";
  }

  if (!gemini) {
    throw new Error("No AI API key set. Please add GEMINI_API_KEY or OPENAI_API_KEY in Settings.");
  }

  const response = await gemini.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text || "Could not generate suggestion.";
}
