
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Timer, 
  Trophy, 
  ArrowRight,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Brain
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Question, Difficulty, ExplanationMode } from '@/src/types/adaptive';
import { cn } from '@/src/lib/utils';
import QuestionCard from '@/src/components/practice/QuestionCard';

export default function PracticeMode() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>(1);
  const [explanationMode, setExplanationMode] = useState<ExplanationMode>('standard');
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalInSession] = useState(10);
  const [score, setScore] = useState(0);
  const [xpTotal, setXpTotal] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState(100); // Percentage for progress bar
  const [startTime, setStartTime] = useState(Date.now());

  const fetchNextQuestion = async (lastCorrect?: boolean, lastTime?: number) => {
    setLoading(true);
    try {
      const response = await fetch('/api/adaptive/next-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: 'student_1',
          topicId,
          lastAnswerCorrect: lastCorrect,
          lastTimeSec: lastTime
        })
      });
      const data = await response.json();
      setCurrentQuestion(data.question);
      setDifficulty(data.difficulty);
      setExplanationMode(data.explanationMode);
      setQuestionNumber(data.questionNumber);
      setLoading(false);
      setStartTime(Date.now());
      setTimeLeft(100);
    } catch (error) {
      console.error('Failed to fetch question:', error);
    }
  };

  useEffect(() => {
    fetchNextQuestion();
  }, [topicId]);

  useEffect(() => {
    if (loading || isComplete) return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) return 0;
        return prev - 0.5; // Shrink bar
      });
    }, 100);

    return () => clearInterval(interval);
  }, [loading, isComplete]);

  const handleAnswer = async (answer: string) => {
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    
    try {
      const response = await fetch('/api/adaptive/record-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: 'student_1',
          questionId: currentQuestion?.id,
          answer,
          timeSec: timeTaken
        })
      });
      const data = await response.json();
      
      if (data.isCorrect) {
        setScore(prev => prev + 1);
        setXpTotal(prev => prev + data.xpEarned);
      }

      // Wait a bit to show feedback before next question
      setTimeout(() => {
        if (questionNumber >= totalInSession) {
          setIsComplete(true);
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00C9A7', '#FFB830', '#4FACFE']
          });
        } else {
          fetchNextQuestion(data.isCorrect, timeTaken);
        }
      }, 2000);

      return data;
    } catch (error) {
      console.error('Failed to record answer:', error);
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card max-w-md w-full p-10 text-center space-y-8"
        >
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
            <Trophy className="w-12 h-12 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-heading font-bold text-primary">Session Complete!</h1>
            <p className="text-muted font-medium mt-2">You're getting stronger every day.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary/10 p-4 rounded-2xl">
              <p className="text-xs font-bold text-primary uppercase">Score</p>
              <p className="text-2xl font-bold text-primary">{score} / {totalInSession}</p>
            </div>
            <div className="bg-secondary/10 p-4 rounded-2xl">
              <p className="text-xs font-bold text-secondary uppercase">XP Earned</p>
              <p className="text-2xl font-bold text-secondary">+{xpTotal}</p>
            </div>
          </div>

          <button 
            onClick={() => navigate('/student')}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition-all"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <div className="h-2 bg-slate-200 w-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: "100%" }}
            animate={{ width: `${timeLeft}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>
        <div className="bg-white/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-slate-100">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-muted" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="bg-slate-100 px-4 py-2 rounded-full flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary">Level {difficulty}</span>
            </div>
            <div className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              Question {questionNumber} / {totalInSession}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 mt-16">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-primary font-bold">Generating next challenge...</p>
            </motion.div>
          ) : currentQuestion && (
            <motion.div 
              key={currentQuestion.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="w-full max-w-3xl"
            >
              <div className="mb-8 text-center">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary leading-tight">
                  {currentQuestion.text}
                </h2>
              </div>

              <QuestionCard 
                question={currentQuestion}
                onAnswer={handleAnswer}
                explanationMode={explanationMode}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
