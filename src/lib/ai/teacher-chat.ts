import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import OpenAI from "openai";

// Initialize Gemini
const getGeminiAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Initialize OpenAI
const getOpenAI = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "MY_OPENAI_API_KEY") {
    return null;
  }
  return new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
};

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface ClassSummary {
  grade: string;
  section: string;
  school: string;
  count: number;
  avg: number;
  atRisk: number;
  topWeakTopic: string;
  studentSummaries: string;
  recentInsights: string;
}

// Mock class data for the MVP
const MOCK_CLASS_SUMMARY: ClassSummary = {
  grade: "6",
  section: "A",
  school: "EPISTEM Academy",
  count: 32,
  avg: 74,
  atRisk: 4,
  topWeakTopic: "Geometry",
  studentSummaries: `
- Rahul: 78% accuracy, weak in Geometry, Risk: Low
- Priya: 85% accuracy, weak in Fractions, Risk: Low
- Arjun: 45% accuracy, weak in Algebra, Risk: High
- Sneha: 55% accuracy, weak in Decimals, Risk: Medium
`,
  recentInsights: `
- Class performance in Geometry dropped by 12% this week.
- Engagement time is highest on Tuesdays and Thursdays.
- 5 students have not completed the latest Fractions assignment.
`
};

export function buildSystemPrompt(summary: ClassSummary = MOCK_CLASS_SUMMARY): string {
  return `
You are EduPersona — the AI co-teacher for Class ${summary.grade}${summary.section} at ${summary.school}.

You have access to REAL data about this class. Use it in every answer. Be specific.

CLASS OVERVIEW:
- Total students: ${summary.count}
- Class average accuracy: ${summary.avg}%
- At-risk students: ${summary.atRisk}
- Most common weak topic: ${summary.topWeakTopic}

STUDENT QUICK PROFILES:
${summary.studentSummaries}

RECENT AI REPORTS SUMMARY:
${summary.recentInsights}

RULES:
- Use student first names (never roll numbers)
- Always suggest 2-3 concrete next steps
- For lesson plans: use time blocks (e.g., "10 min: warm-up")
- Tone: professional but warm, like a helpful co-teacher
- If asked about a specific student: reference their actual data
- If you don't have enough data: say so and suggest what to upload
`;
}

export async function* streamTeacherChat(messages: ChatMessage[]) {
  const openai = getOpenAI();
  const gemini = getGeminiAI();
  const systemPrompt = buildSystemPrompt();

  if (openai) {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map(m => ({ 
          role: m.role === 'model' ? 'assistant' : 'user' as 'assistant' | 'user', 
          content: m.text 
        }))
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      yield chunk.choices[0]?.delta?.content || "";
    }
    return;
  }

  if (!gemini) {
    throw new Error("No AI API key set. Please add GEMINI_API_KEY or OPENAI_API_KEY in Settings.");
  }

  const chat = gemini.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: systemPrompt,
    },
  });

  const lastMessage = messages[messages.length - 1].text;

  const responseStream = await chat.sendMessageStream({
    message: lastMessage,
  });

  for await (const chunk of responseStream) {
    const c = chunk as GenerateContentResponse;
    yield c.text || "";
  }
}
