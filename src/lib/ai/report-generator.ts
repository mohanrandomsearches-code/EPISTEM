import { GoogleGenAI, Type } from "@google/genai";
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

export interface StudentContext {
  name: string;
  grade: number;
  class: string;
  marksData: string;
  extracurricularData: string;
  topicsPractised: string[];
  accuracyMap: Record<string, number>;
  errorPatterns: string[];
  avgSessionMin: number;
  sessionsPerWeek: number;
  weakTopics: string[];
  psychometricData?: {
    score: number;
    subjectScores: Record<string, number>;
    confidenceProfile: string;
    recommendedDifficulty: number;
  };
}

export interface AIReport {
  strengths: string[];
  weaknesses: string[];
  weak_topics: string[];
  error_patterns: string[];
  extracurricular_insights: string;
  behavioral_insights: string;
  improvement_plan: {
    week: number;
    focus: string;
    action: string;
    goal: string;
  }[];
  teacher_notes: string;
  parent_message: string;
  risk_level: 'low' | 'medium' | 'high';
  confidence_score: number;
}

export interface ClassInsights {
  commonWeakTopics: string[];
  teachingGaps: string[];
  recommendedFocus: string[];
  atRiskStudents: { name: string; reason: string }[];
}

export async function buildStudentContext(studentId: string): Promise<StudentContext> {
  // In a real app, this would fetch from student_marks, extracurricular, student_answers, student_sessions
  // For MVP, we return mock data based on studentId
  return {
    name: studentId === 's1' ? 'Rahul Student' : 'Sample Student',
    grade: 6,
    class: 'A',
    marksData: "Math: 78/100, Science: 82/100, English: 90/100",
    extracurricularData: "Sports: 8/10 (Cricket), Arts: 6/10, Participation: 9/10",
    topicsPractised: ["Algebra", "Geometry", "Fractions", "Decimals"],
    accuracyMap: {
      "Algebra": 85,
      "Geometry": 45,
      "Fractions": 55,
      "Decimals": 92
    },
    errorPatterns: ["Calculation errors in multi-step problems", "Conceptual confusion in Geometry theorems"],
    avgSessionMin: 25,
    sessionsPerWeek: 4,
    weakTopics: ["Geometry", "Fractions"],
    psychometricData: {
      score: 12,
      subjectScores: { math: 3, science: 4, english: 3, reasoning: 2 },
      confidenceProfile: 'balanced',
      recommendedDifficulty: 2
    }
  };
}

export async function generateStudentReport(context: StudentContext): Promise<AIReport> {
  const openai = getOpenAI();
  const gemini = getGeminiAI();

  const prompt = `
Analyse this student's complete performance data and return a JSON report.

STUDENT: ${context.name}, Grade ${context.grade}, Class ${context.class}

ACADEMIC PERFORMANCE:
${context.marksData}

EXTRACURRICULAR:
${context.extracurricularData}

LEARNING BEHAVIOUR (from platform):
- Topics practised: ${context.topicsPractised.join(", ")}
- Accuracy per topic: ${JSON.stringify(context.accuracyMap)}
- Error patterns: ${context.errorPatterns.join(", ")}
- Average session duration: ${context.avgSessionMin} minutes
- Sessions per week: ${context.sessionsPerWeek}
- Weak topics (accuracy < 60%): ${context.weakTopics.join(", ")}

PSYCHOMETRIC BASELINE (taken on first login):
Score: ${context.psychometricData?.score}/15
Subject breakdown: Math ${context.psychometricData?.subjectScores.math}/4, Science ${context.psychometricData?.subjectScores.science}/4, English ${context.psychometricData?.subjectScores.english}/4, Reasoning ${context.psychometricData?.subjectScores.reasoning}/3
Confidence profile: ${context.psychometricData?.confidenceProfile}
Initial difficulty: ${context.psychometricData?.recommendedDifficulty}

Factor this baseline into your analysis. If current performance strongly differs from baseline,
note it as either "strong improvement since joining" or "struggling below initial baseline".
`;

  if (openai) {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert educational psychologist working with Indian school students aged 10-13. Generate structured JSON only. No markdown, no preamble." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });
    return JSON.parse(response.choices[0].message.content || "{}");
  }

  if (!gemini) {
    throw new Error("No AI API key set. Please add GEMINI_API_KEY or OPENAI_API_KEY in Settings.");
  }

  const response = await gemini.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are an expert educational psychologist working with Indian school students aged 10-13. Generate structured JSON only. No markdown, no preamble.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          weak_topics: { type: Type.ARRAY, items: { type: Type.STRING } },
          error_patterns: { type: Type.ARRAY, items: { type: Type.STRING } },
          extracurricular_insights: { type: Type.STRING },
          behavioral_insights: { type: Type.STRING },
          improvement_plan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                week: { type: Type.INTEGER },
                focus: { type: Type.STRING },
                action: { type: Type.STRING },
                goal: { type: Type.STRING }
              },
              required: ["week", "focus", "action", "goal"]
            }
          },
          teacher_notes: { type: Type.STRING },
          parent_message: { type: Type.STRING },
          risk_level: { type: Type.STRING, enum: ["low", "medium", "high"] },
          confidence_score: { type: Type.NUMBER }
        },
        required: [
          "strengths", "weaknesses", "weak_topics", "error_patterns", 
          "extracurricular_insights", "behavioral_insights", "improvement_plan", 
          "teacher_notes", "parent_message", "risk_level", "confidence_score"
        ]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function generateClassInsights(classId: string): Promise<ClassInsights> {
  const openai = getOpenAI();
  const gemini = getGeminiAI();

  const prompt = `
Analyse the performance of Class ${classId} and provide class-level insights.
Common weak topics across students: Geometry, Fractions.
Teaching gaps identified: Visual representation of abstract concepts.
Recommended focus: Hands-on activities for Geometry.
At-risk students: 3 students showing declining engagement.
`;

  if (openai) {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert educational consultant. Generate structured JSON only. No markdown, no preamble." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });
    return JSON.parse(response.choices[0].message.content || "{}");
  }

  if (!gemini) {
    throw new Error("No AI API key set. Please add GEMINI_API_KEY or OPENAI_API_KEY in Settings.");
  }

  const response = await gemini.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are an expert educational consultant. Generate structured JSON only. No markdown, no preamble.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          commonWeakTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
          teachingGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendedFocus: { type: Type.ARRAY, items: { type: Type.STRING } },
          atRiskStudents: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                reason: { type: Type.STRING }
              },
              required: ["name", "reason"]
            }
          }
        },
        required: ["commonWeakTopics", "teachingGaps", "recommendedFocus", "atRiskStudents"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
