import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

const getGeminiAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") return null;
  return new GoogleGenAI({ apiKey });
};

const getOpenAI = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "MY_OPENAI_API_KEY") return null;
  return new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
};

export const getAIResponse = async (prompt: string) => {
  const openai = getOpenAI();
  const gemini = getGeminiAI();

  if (openai) {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });
    return response.choices[0].message.content;
  }

  if (gemini) {
    const response = await gemini.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  }

  throw new Error("No AI API key set. Please add GEMINI_API_KEY or OPENAI_API_KEY in Settings.");
};

export const generateLearningReport = async (studentData: any) => {
  const prompt = `Analyze the following student performance data and generate a detailed learning report for a 10-13 year old student in India. 
    Data: ${JSON.stringify(studentData)}
    Provide: Strengths, Weaknesses, Suggested Topics, and a message for parents.`;
  
  return getAIResponse(prompt);
};
