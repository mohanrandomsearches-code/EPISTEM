
import { supabase } from '../supabase';

export interface Response {
  questionId: string;
  selectedOption: string;
  timeSec: number;
  isCorrect: boolean;
  subject: string;
}

export interface PsychometricResult {
  totalScore: number;
  subjectScores: Record<string, number>;
  timePerQuestion: Record<string, number>;
  confidenceProfile: 'careful' | 'fast' | 'guesser' | 'balanced';
  recommendedDifficulty: 1 | 2 | 3;
}

export function analyseResults(responses: Response[]): PsychometricResult {
  // 1. Calculate totalScore and subjectScores from correct answers
  const totalScore = responses.filter(r => r.isCorrect).length;
  const subjectScores: Record<string, number> = {};
  const timePerQuestion: Record<string, number> = {};

  responses.forEach(r => {
    subjectScores[r.subject] = (subjectScores[r.subject] || 0) + (r.isCorrect ? 1 : 0);
    timePerQuestion[r.questionId] = r.timeSec;
  });

  // 2. Compute confidenceProfile from timing patterns
  const avgTime = responses.reduce((acc, r) => acc + r.timeSec, 0) / responses.length;
  const fastAnswers = responses.filter(r => r.timeSec < 8).length;
  const wrongFastAnswers = responses.filter(r => !r.isCorrect && r.timeSec < 8).length;

  let confidenceProfile: 'careful' | 'fast' | 'guesser' | 'balanced' = 'balanced';
  if (avgTime < 8 || fastAnswers > responses.length / 2) {
    confidenceProfile = 'fast';
  } else if (avgTime > 45) {
    confidenceProfile = 'careful';
  }
  
  if (wrongFastAnswers > 3) {
    confidenceProfile = 'guesser';
  }

  // 3. Compute recommendedDifficulty
  let recommendedDifficulty: 1 | 2 | 3 = 2;
  if (totalScore <= 5) {
    recommendedDifficulty = 1;
  } else if (totalScore >= 11) {
    recommendedDifficulty = 3;
  }

  return {
    totalScore,
    subjectScores,
    timePerQuestion,
    confidenceProfile,
    recommendedDifficulty
  };
}

export async function saveResultToSupabase(
  studentId: string,
  result: PsychometricResult,
  fullResponses: Response[]
): Promise<void> {
  // In our mock system, we'll use localStorage to persist the result
  const results = JSON.parse(localStorage.getItem('psychometric_results') || '[]');
  results.push({
    id: Math.random().toString(36).substr(2, 9),
    student_id: studentId,
    completed_at: new Date().toISOString(),
    ...result,
    full_responses: fullResponses
  });
  localStorage.setItem('psychometric_results', JSON.stringify(results));

  // Update profile in localStorage
  const stored = localStorage.getItem('epistem_user');
  if (stored) {
    const profile = JSON.parse(stored);
    if (profile.id === studentId) {
      profile.psychometric_completed = true;
      profile.psychometric_completed_at = new Date().toISOString();
      profile.recommended_difficulty = result.recommendedDifficulty;
      localStorage.setItem('epistem_user', JSON.stringify(profile));
      
      // Also update the auth store if needed, but App.tsx usually handles this on reload
    }
  }

  // Simulate Supabase calls for Phase 11A completeness
  try {
    await supabase.from('psychometric_results').insert({
      student_id: studentId,
      ...result,
      full_responses: fullResponses
    });
    
    await supabase.from('profiles')
      .update({ 
        psychometric_completed: true, 
        psychometric_completed_at: new Date().toISOString() 
      })
      .eq('id', studentId);
  } catch (e) {
    console.error("Supabase mock error:", e);
  }
}
