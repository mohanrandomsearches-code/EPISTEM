
export type Difficulty = 1 | 2 | 3;
export type ErrorType = 'calculation' | 'concept' | 'careless' | 'formula' | 'none';
export type ExplanationMode = 'simple' | 'standard' | 'challenge';

export interface Question {
  id: string;
  topicId: string;
  text: string;
  type: 'mcq' | 'numerical';
  options?: string[];
  correctAnswer: string;
  difficulty: Difficulty;
  explanation: string;
  stepByStep?: string[];
}

export interface StudentPerformance {
  topicId: string;
  accuracy: number;
  avgTimeSec: number;
  retryCount: number;
  errorTypes: Record<ErrorType, number>;
  currentDifficulty: Difficulty;
  recentAnswers: boolean[]; // last 10
}

export interface StudentSession {
  id: string;
  studentId: string;
  topicId: string;
  startTime: string;
  endTime: string;
  questionsAttempted: number;
  correctAnswers: number;
}

export interface WeakTopic {
  topicId: string;
  accuracy: number;
  reason: string;
}
