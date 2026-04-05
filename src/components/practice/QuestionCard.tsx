
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Lightbulb, ArrowRight, Delete } from 'lucide-react';
import { Question, ExplanationMode } from '@/src/types/adaptive';
import { cn } from '@/src/lib/utils';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => Promise<any>;
  explanationMode: ExplanationMode;
}

export default function QuestionCard({ question, onAnswer, explanationMode }: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [numericalValue, setNumericalValue] = useState('');

  const handleOptionSelect = async (option: string) => {
    if (selectedOption || isSubmitting) return;
    
    setSelectedOption(option);
    setIsSubmitting(true);
    const result = await onAnswer(option);
    setFeedback(result);
    setIsSubmitting(false);
  };

  const handleNumericalSubmit = async () => {
    if (!numericalValue || isSubmitting) return;
    setIsSubmitting(true);
    const result = await onAnswer(numericalValue);
    setFeedback(result);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      {question.type === 'mcq' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options?.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isCorrect = feedback?.isCorrect && isSelected;
            const isWrong = feedback && !feedback.isCorrect && isSelected;
            const isRevealed = feedback && !feedback.isCorrect && option === question.correctAnswer;

            return (
              <motion.button
                key={idx}
                whileTap={!feedback ? { scale: 0.98 } : {}}
                onClick={() => handleOptionSelect(option)}
                disabled={!!feedback}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-[1.5px]",
                  "transition-colors duration-200 text-left min-h-[56px] overflow-visible",
                  !feedback && (isSelected ? "bg-[#00C9A7] border-[#00C9A7] -translate-y-0.5 shadow-sm" : "bg-white border-slate-200 hover:border-[#00C9A7] hover:bg-[#F0FDF9] hover:-translate-y-0.5"),
                  isCorrect && "bg-[#00C9A7] border-[#00C9A7] text-white shadow-lg shadow-primary/20",
                  isWrong && "bg-danger border-danger text-white animate-shake",
                  isRevealed && "border-primary border-dashed text-primary bg-primary/5",
                  feedback && !isSelected && !isRevealed && "bg-slate-50 border-slate-100 opacity-60"
                )}
              >
                <span className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 border transition-colors duration-200",
                  (isSelected || isCorrect || isWrong) ? "bg-white/20 border-white/40 text-white" : "bg-slate-100 border-slate-200 text-slate-500"
                )}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className={cn(
                  "flex-1 text-base font-medium leading-snug",
                  (isSelected || isCorrect || isWrong) ? "text-white" : "text-[#1A1A2E]"
                )}>
                  {option}
                </span>
                {isCorrect && <CheckCircle2 className="w-5 h-5 text-white ml-auto" />}
                {isWrong && <XCircle className="w-5 h-5 text-white ml-auto" />}
              </motion.button>
            );
          })}
        </div>
      ) : (
        <div className="max-w-md mx-auto space-y-6">
          <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-inner text-center">
            <span className="text-5xl font-heading font-bold text-primary">
              {numericalValue || '?'}
            </span>
          </div>

          {!feedback && (
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0].map((num) => (
                <button
                  key={num}
                  onClick={() => setNumericalValue(prev => prev + num)}
                  className="p-4 bg-slate-100 hover:bg-slate-200 rounded-2xl text-xl font-bold text-slate-700 transition-colors"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => setNumericalValue(prev => prev.slice(0, -1))}
                className="p-4 bg-slate-100 hover:bg-slate-200 rounded-2xl flex items-center justify-center text-slate-700"
              >
                <Delete className="w-6 h-6" />
              </button>
              <button
                onClick={handleNumericalSubmit}
                disabled={!numericalValue}
                className="col-span-3 p-4 bg-primary text-white rounded-2xl text-xl font-bold shadow-lg hover:scale-105 transition-all disabled:opacity-50"
              >
                Submit Answer
              </button>
            </div>
          )}

          {feedback && (
            <div className={cn(
              "p-6 rounded-3xl text-center font-bold text-2xl",
              feedback.isCorrect ? "bg-primary text-white" : "bg-danger text-white animate-shake"
            )}>
              {feedback.isCorrect ? "Correct! +10 XP" : `Oops! Correct answer was ${question.correctAnswer}`}
            </div>
          )}
        </div>
      )}

      {/* Explanation Panel */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass-card p-8 space-y-6 border-t-4 border-primary"
          >
            <div className="flex items-center gap-3 text-primary">
              <Lightbulb className="w-6 h-6" />
              <h3 className="text-xl font-heading font-bold">Explanation</h3>
            </div>
            
            <p className="text-slate-600 leading-relaxed text-lg">
              {question.explanation}
            </p>

            {explanationMode !== 'simple' && question.stepByStep && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="font-bold text-slate-700">Step-by-Step Breakdown:</h4>
                <div className="space-y-3">
                  {question.stepByStep.map((step, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                        {i + 1}
                      </div>
                      <p className="text-slate-600">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
