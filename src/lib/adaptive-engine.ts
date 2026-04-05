
import { 
  StudentPerformance, 
  Question, 
  ErrorType, 
  ExplanationMode, 
  WeakTopic, 
  StudentSession,
  Difficulty
} from '../types/adaptive';

/**
 * Difficulty rules:
 * - accuracy < 60% for 3+ questions -> drop to difficulty - 1 (min 1)
 * - accuracy > 85% for 5+ questions -> raise to difficulty + 1 (max 3)
 */
export function computeNextDifficulty(perf: StudentPerformance): Difficulty {
  const recentCount = perf.recentAnswers.length;
  if (recentCount < 3) return perf.currentDifficulty;

  const correctCount = perf.recentAnswers.filter(a => a).length;
  const accuracy = (correctCount / recentCount) * 100;

  if (recentCount >= 3 && accuracy < 60 && perf.currentDifficulty > 1) {
    return (perf.currentDifficulty - 1) as Difficulty;
  }

  if (recentCount >= 5 && accuracy > 85 && perf.currentDifficulty < 3) {
    return (perf.currentDifficulty + 1) as Difficulty;
  }

  return perf.currentDifficulty;
}

/**
 * Classifies the error type based on the answer and question context.
 * In a real app, this might use NLP or specific patterns.
 */
export function classifyError(question: Question, studentAnswer: string, correct: string): ErrorType {
  if (studentAnswer === correct) return 'none';

  const studentNum = parseFloat(studentAnswer);
  const correctNum = parseFloat(correct);

  if (!isNaN(studentNum) && !isNaN(correctNum)) {
    // If the difference is small, it might be a calculation error
    const diff = Math.abs(studentNum - correctNum);
    if (diff > 0 && diff < 5) return 'calculation';
    
    // If it's a multiple of 10 or similar, could be careless
    if (diff % 10 === 0 || diff % 1 === 0) return 'careless';
  }

  // Default to concept if we can't determine
  return 'concept';
}

/**
 * avg_time > 90s -> flag for simpler explanation
 * retry_count > 2 same type -> trigger step-by-step mode (handled in UI)
 */
export function getExplanationMode(perf: StudentPerformance): ExplanationMode {
  if (perf.avgTimeSec > 90) return 'simple';
  if (perf.accuracy > 90 && perf.currentDifficulty === 3) return 'challenge';
  return 'standard';
}

export function computeWeakTopics(allPerf: StudentPerformance[]): WeakTopic[] {
  return allPerf
    .filter(p => p.accuracy < 70)
    .map(p => ({
      topicId: p.topicId,
      accuracy: p.accuracy,
      reason: p.accuracy < 50 ? 'Critical Review Needed' : 'Needs Practice'
    }))
    .sort((a, b) => a.accuracy - b.accuracy);
}

export function computeEngagementScore(sessions: StudentSession[]): number {
  if (sessions.length === 0) return 0;
  
  const totalQuestions = sessions.reduce((acc, s) => acc + s.questionsAttempted, 0);
  const avgQuestionsPerSession = totalQuestions / sessions.length;
  
  // Simple score out of 100
  const score = Math.min(100, (avgQuestionsPerSession * 5) + (sessions.length * 2));
  return Math.round(score);
}

export function generateEncouragement(accuracy: number, streak: number): string {
  const messages = [
    "You're doing great! Keep it up! 🚀",
    "Wow, look at that focus! 🧠",
    "Every mistake is a step towards mastery. 🌟",
    "You're on fire! 🔥",
    "Math is your superpower! ⚡",
    "Keep going, you're almost there! 🏁"
  ];

  if (streak > 5) return `Incredible! A ${streak}-day streak! ${messages[3]}`;
  if (accuracy > 90) return `Perfect accuracy! ${messages[4]}`;
  if (accuracy < 60) return `Don't give up! ${messages[2]}`;

  return messages[Math.floor(Math.random() * messages.length)];
}
