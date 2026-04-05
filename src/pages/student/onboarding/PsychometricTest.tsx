
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, CheckCircle2, ArrowRight, Sparkles, Brain, Calculator, Microscope, Languages, Timer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';
import { analyseResults, saveResultToSupabase, Response } from '../../../lib/psychometric/analyser';

const QUESTIONS = [
  { id: '1', question_number: 1, subject: 'math', question_text: 'What is the LCM of 4 and 6?', options: { a: '10', b: '12', c: '24', d: '8' }, correct: 'b', explanation: 'LCM of 4 and 6 is 12 because 12 is the smallest number divisible by both.', difficulty: 1 },
  { id: '2', question_number: 2, subject: 'math', question_text: 'If a train travels 240 km in 4 hours, what is its speed?', options: { a: '40 km/h', b: '60 km/h', c: '80 km/h', d: '50 km/h' }, correct: 'b', explanation: 'Speed = Distance / Time = 240 / 4 = 60 km/h.', difficulty: 2 },
  { id: '3', question_number: 3, subject: 'math', question_text: 'What is 15% of 200?', options: { a: '25', b: '30', c: '35', d: '20' }, correct: 'b', explanation: '15% of 200 = (15/100) x 200 = 30.', difficulty: 1 },
  { id: '4', question_number: 4, subject: 'math', question_text: 'Solve: 3x + 7 = 22. What is x?', options: { a: '3', b: '4', c: '5', d: '6' }, correct: 'c', explanation: '3x = 22 - 7 = 15, so x = 5.', difficulty: 2 },
  { id: '5', question_number: 5, subject: 'science', question_text: 'Which planet is known as the Red Planet?', options: { a: 'Venus', b: 'Jupiter', c: 'Mars', d: 'Saturn' }, correct: 'c', explanation: 'Mars appears red due to iron oxide (rust) on its surface.', difficulty: 1 },
  { id: '6', question_number: 6, subject: 'science', question_text: 'What is the chemical formula of water?', options: { a: 'HO', b: 'H2O', c: 'H2O2', d: 'OH' }, correct: 'b', explanation: 'Water is made of 2 hydrogen atoms and 1 oxygen atom: H2O.', difficulty: 1 },
  { id: '7', question_number: 7, subject: 'science', question_text: 'Which part of the plant makes food using sunlight?', options: { a: 'Root', b: 'Stem', c: 'Leaf', d: 'Flower' }, correct: 'c', explanation: 'Leaves contain chlorophyll and perform photosynthesis.', difficulty: 1 },
  { id: '8', question_number: 8, subject: 'science', question_text: 'What type of energy does a moving object have?', options: { a: 'Potential energy', b: 'Kinetic energy', c: 'Chemical energy', d: 'Nuclear energy' }, correct: 'b', explanation: 'A moving object has kinetic energy due to its motion.', difficulty: 2 },
  { id: '9', question_number: 9, subject: 'english', question_text: 'Which sentence is grammatically correct?', options: { a: 'She go to school every day.', b: 'She goes to school every day.', c: 'She going to school every day.', d: 'She gone to school every day.' }, correct: 'b', explanation: 'Third-person singular present tense uses "goes".', difficulty: 2 },
  { id: '10', question_number: 10, subject: 'english', question_text: 'What is the synonym of "happy"?', options: { a: 'Sad', b: 'Joyful', c: 'Angry', d: 'Tired' }, correct: 'b', explanation: 'Joyful means feeling great happiness — a synonym of happy.', difficulty: 1 },
  { id: '11', question_number: 11, subject: 'english', question_text: 'Identify the noun in: "The clever fox jumped over the fence."', options: { a: 'clever', b: 'jumped', c: 'fox', d: 'over' }, correct: 'c', explanation: 'Fox is a noun — it names an animal.', difficulty: 1 },
  { id: '12', question_number: 12, subject: 'english', question_text: 'Choose the correct passive voice: "The teacher praised the student."', options: { a: 'The student praised the teacher.', b: 'The student is praised by the teacher.', c: 'The student was praised by the teacher.', d: 'The teacher is praising the student.' }, correct: 'c', explanation: 'Past tense passive: subject + was/were + past participle + by + object.', difficulty: 3 },
  { id: '13', question_number: 13, subject: 'reasoning', question_text: 'If APPLE = 50, and each letter is worth its position in the alphabet, what is A worth?', options: { a: '1', b: '2', c: '26', d: '5' }, correct: 'a', explanation: 'A is the 1st letter of the alphabet, so A = 1.', difficulty: 2 },
  { id: '14', question_number: 14, subject: 'reasoning', question_text: 'A clock shows 3:15. What is the angle between the hour and minute hands?', options: { a: '0 degrees', b: '7.5 degrees', c: '52.5 degrees', d: '90 degrees' }, correct: 'b', explanation: 'At 3:15, hour hand is at 97.5 degrees, minute hand at 90 degrees. Angle = |97.5 - 90| = 7.5 degrees.', difficulty: 3 },
  { id: '15', question_number: 15, subject: 'reasoning', question_text: 'Find the next number: 2, 6, 12, 20, 30, ___', options: { a: '40', b: '42', c: '44', d: '36' }, correct: 'b', explanation: 'Pattern: differences are 4,6,8,10,12. Next = 30+12 = 42.', difficulty: 2 },
];

export default function PsychometricTest() {
  const [step, setStep] = useState<'intro' | 'test' | 'completion'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const { profile, setProfile } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (step === 'test') {
      setStartTime(Date.now());
    }
  }, [currentIdx, step]);

  const handleNext = async () => {
    if (!selectedOption) return;

    const timeSec = Math.round((Date.now() - startTime) / 1000);
    const question = QUESTIONS[currentIdx];
    const isCorrect = selectedOption === question.correct;

    const newResponse: Response = {
      questionId: question.id,
      selectedOption,
      timeSec,
      isCorrect,
      subject: question.subject
    };

    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);
    setSelectedOption(null);

    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      // Submit test
      setIsSubmitting(true);
      const analysis = analyseResults(updatedResponses);
      setResult(analysis);
      
      if (profile) {
        await saveResultToSupabase(profile.id, analysis, updatedResponses);
        // Update local profile state
        setProfile({
          ...profile,
          psychometric_completed: true,
          psychometric_completed_at: new Date().toISOString()
        });
      }
      
      setIsSubmitting(false);
      setStep('completion');
    }
  };

  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-mint/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/15 rounded-full blur-[120px]" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 max-w-2xl w-full text-center space-y-8 relative z-10"
        >
          <div className="flex justify-center">
            <div className="bg-primary p-4 rounded-3xl shadow-xl shadow-primary/20">
              <BookOpen className="text-white w-12 h-12" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-heading font-black text-primary tracking-tight">
              Welcome, {profile?.name}!
            </h1>
            <p className="text-lg text-muted font-medium leading-relaxed">
              Before we begin, let's understand how you learn. This helps us personalize your journey from Day 1.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="bg-muted/5 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-mint/10 rounded-xl flex items-center justify-center text-mint">
                <Brain size={20} />
              </div>
              <span className="text-sm font-bold text-primary">15 Questions</span>
            </div>
            <div className="bg-muted/5 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                <Sparkles size={20} />
              </div>
              <span className="text-sm font-bold text-primary">Personalized</span>
            </div>
          </div>

          <p className="text-sm text-muted italic">"There's no pressure — just answer honestly!"</p>

          <button 
            onClick={() => setStep('test')}
            className="btn-primary w-full py-5 text-lg rounded-full flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
          >
            Ready? Let's go!
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    );
  }

  if (step === 'test') {
    const q = QUESTIONS[currentIdx];
    const progress = ((currentIdx + 1) / QUESTIONS.length) * 100;

    return (
      <div className="min-h-screen bg-[#F7F9FC] flex flex-col p-6 relative overflow-hidden">
        {/* Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-2 bg-slate-200 z-50">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-mint shadow-[0_0_10px_rgba(46,213,115,0.5)]"
          />
        </div>

        {/* Decorative Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-mint/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />

        <div className="flex-1 flex items-center justify-center pt-12 relative z-10">
          <motion.div 
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-[680px] space-y-8"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                  q.subject === 'math' ? 'bg-primary/10 text-primary' :
                  q.subject === 'science' ? 'bg-accent/10 text-accent' :
                  q.subject === 'english' ? 'bg-secondary/10 text-secondary' :
                  'bg-ai-purple/10 text-ai-purple'
                }`}>
                  {q.subject}
                </span>
                <span className="text-sm font-bold text-muted">Question {currentIdx + 1} of 15</span>
              </div>
              <div className="flex items-center gap-2 text-muted font-bold text-sm">
                <Timer size={16} />
                <span>Hidden Timer</span>
              </div>
            </div>

            <div className="glass-card p-10 space-y-8 shadow-2xl">
              <h2 className="text-2xl font-heading font-bold text-[#1A1A2E] leading-tight">
                {q.question_text}
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {Object.entries(q.options).map(([key, val]) => {
                  const isSelected = selectedOption === key;
                  return (
                    <motion.button
                      key={key}
                      onClick={() => setSelectedOption(key)}
                      whileTap={{ scale: 0.98 }}
                      className={[
                        "w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-[1.5px]",
                        "transition-colors duration-200 text-left min-h-[56px] overflow-visible",
                        isSelected
                          ? "bg-[#00C9A7] border-[#00C9A7] -translate-y-0.5 shadow-sm"
                          : "bg-white border-slate-200 hover:border-[#00C9A7] hover:bg-[#F0FDF9] hover:-translate-y-0.5",
                      ].join(" ")}
                    >
                      <span className={isSelected 
                        ? "text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center bg-white/20 border border-white/40 flex-shrink-0" 
                        : "text-slate-500 text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 border border-slate-200 flex-shrink-0"
                      }>
                        {key.toUpperCase()}
                      </span>
                      <span className={isSelected 
                        ? "text-white flex-1 text-base font-medium leading-snug" 
                        : "text-[#1A1A2E] flex-1 text-base font-medium leading-snug"
                      }>
                        {val}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end">
              <AnimatePresence>
                {selectedOption && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="btn-primary px-10 py-4 rounded-full font-black flex items-center gap-2 shadow-xl shadow-primary/20"
                  >
                    {currentIdx === QUESTIONS.length - 1 ? 'Submit Test' : 'Next Question'}
                    <ArrowRight size={20} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (step === 'completion') {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-mint/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/15 rounded-full blur-[120px]" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 max-w-xl w-full text-center space-y-8 relative z-10"
        >
          <div className="flex justify-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12 }}
              className="w-24 h-24 bg-mint/10 rounded-full flex items-center justify-center text-mint"
            >
              <CheckCircle2 size={64} />
            </motion.div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-heading font-black text-primary">All done! {profile?.name}</h1>
            <p className="text-muted font-medium">You're ready to learn! Here's how you did:</p>
          </div>

          <div className="bg-muted/5 p-8 rounded-[2rem] space-y-6">
            <div className="text-center">
              <span className="text-5xl font-black text-primary">{result?.totalScore}</span>
              <span className="text-xl text-muted font-bold"> / 15</span>
              <p className="text-xs font-bold text-muted uppercase tracking-widest mt-2">Total Score</p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <div className="px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold flex items-center gap-2">
                <Calculator size={14} />
                Math {result?.subjectScores.math || 0}/4
              </div>
              <div className="px-4 py-2 bg-accent/10 text-accent rounded-full text-xs font-bold flex items-center gap-2">
                <Microscope size={14} />
                Science {result?.subjectScores.science || 0}/4
              </div>
              <div className="px-4 py-2 bg-secondary/10 text-secondary rounded-full text-xs font-bold flex items-center gap-2">
                <Languages size={14} />
                English {result?.subjectScores.english || 0}/4
              </div>
              <div className="px-4 py-2 bg-ai-purple/10 text-ai-purple rounded-full text-xs font-bold flex items-center gap-2">
                <Brain size={14} />
                Reasoning {result?.subjectScores.reasoning || 0}/3
              </div>
            </div>
            
            <div className="pt-4 border-t border-muted/10">
              <p className="text-sm font-bold text-primary">
                Learning Profile: <span className="text-accent uppercase">{result?.confidenceProfile}</span>
              </p>
            </div>
          </div>

          <button 
            onClick={() => navigate('/student')}
            className="btn-primary w-full py-5 text-lg rounded-full flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
          >
            Let's go to your dashboard!
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    );
  }

  return null;
}
