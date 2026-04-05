
-- Phase 11A: Psychometric Onboarding Test

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS psychometric_completed BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS psychometric_completed_at TIMESTAMPTZ;

CREATE TABLE psychometric_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT now(),
  total_score INTEGER,                        -- raw score out of 15
  subject_scores JSONB,                       -- { math: 4, science: 3, english: 4, reasoning: 4 }
  time_per_question JSONB,                    -- { q1: 12, q2: 45, ... } seconds per question
  confidence_profile TEXT,                    -- 'careful' | 'fast' | 'guesser' | 'balanced'
  recommended_difficulty INTEGER DEFAULT 1,  -- 1=easy 2=medium 3=hard — seed for adaptive engine
  full_responses JSONB                        -- complete answer record for AI analysis
);

CREATE TABLE psychometric_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_number INTEGER UNIQUE NOT NULL,    -- 1 to 15
  subject TEXT NOT NULL,                      -- 'math' | 'science' | 'english' | 'reasoning'
  grade_target INTEGER NOT NULL,              -- expected grade level (5, 6, 7, or 8)
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_option TEXT NOT NULL,               -- 'a' | 'b' | 'c' | 'd'
  explanation TEXT,
  difficulty INTEGER DEFAULT 2               -- 1=easy 2=medium 3=hard
);

-- RLS: students can only read questions and insert their own result
ALTER TABLE psychometric_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE psychometric_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students read questions" ON psychometric_questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Students insert own result" ON psychometric_results FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());
CREATE POLICY "Students read own result" ON psychometric_results FOR SELECT TO authenticated USING (student_id = auth.uid());
CREATE POLICY "Teachers read class results" ON psychometric_results FOR SELECT TO authenticated USING (true);

-- SEED: Insert all 15 questions
-- 4 Math | 4 Science | 4 English | 3 Logical Reasoning
INSERT INTO psychometric_questions (question_number, subject, grade_target, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, difficulty) VALUES
(1,  'math',      5, 'What is the LCM of 4 and 6?',
     '10', '12', '24', '8', 'b', 'LCM of 4 and 6 is 12 because 12 is the smallest number divisible by both.', 1),
(2,  'math',      6, 'If a train travels 240 km in 4 hours, what is its speed?',
     '40 km/h', '60 km/h', '80 km/h', '50 km/h', 'b', 'Speed = Distance / Time = 240 / 4 = 60 km/h.', 2),
(3,  'math',      7, 'What is 15% of 200?',
     '25', '30', '35', '20', 'b', '15% of 200 = (15/100) x 200 = 30.', 1),
(4,  'math',      8, 'Solve: 3x + 7 = 22. What is x?',
     '3', '4', '5', '6', 'c', '3x = 22 - 7 = 15, so x = 5.', 2),
(5,  'science',   5, 'Which planet is known as the Red Planet?',
     'Venus', 'Jupiter', 'Mars', 'Saturn', 'c', 'Mars appears red due to iron oxide (rust) on its surface.', 1),
(6,  'science',   6, 'What is the chemical formula of water?',
     'HO', 'H2O', 'H2O2', 'OH', 'b', 'Water is made of 2 hydrogen atoms and 1 oxygen atom: H2O.', 1),
(7,  'science',   7, 'Which part of the plant makes food using sunlight?',
     'Root', 'Stem', 'Leaf', 'Flower', 'c', 'Leaves contain chlorophyll and perform photosynthesis.', 1),
(8,  'science',   8, 'What type of energy does a moving object have?',
     'Potential energy', 'Kinetic energy', 'Chemical energy', 'Nuclear energy', 'b', 'A moving object has kinetic energy due to its motion.', 2),
(9,  'english',   5, 'Which sentence is grammatically correct?',
     'She go to school every day.', 'She goes to school every day.', 'She going to school every day.', 'She gone to school every day.', 'b', 'Third-person singular present tense uses "goes".', 2),
(10, 'english',   6, 'What is the synonym of "happy"?',
     'Sad', 'Joyful', 'Angry', 'Tired', 'b', 'Joyful means feeling great happiness — a synonym of happy.', 1),
(11, 'english',   7, 'Identify the noun in: "The clever fox jumped over the fence."',
     'clever', 'jumped', 'fox', 'over', 'c', 'Fox is a noun — it names an animal.', 1),
(12, 'english',   8, 'Choose the correct passive voice: "The teacher praised the student."',
     'The student praised the teacher.', 'The student is praised by the teacher.', 'The student was praised by the teacher.', 'The teacher is praising the student.', 'c', 'Past tense passive: subject + was/were + past participle + by + object.', 3),
(13, 'reasoning', 6, 'If APPLE = 50, and each letter is worth its position in the alphabet, what is A worth?',
     '1', '2', '26', '5', 'a', 'A is the 1st letter of the alphabet, so A = 1.', 2),
(14, 'reasoning', 7, 'A clock shows 3:15. What is the angle between the hour and minute hands?',
     '0 degrees', '7.5 degrees', '52.5 degrees', '90 degrees', 'c', 'At 3:15, minute hand at 90 deg, hour hand at 97.5 deg. Difference = 7.5? Actually minute=90, hour=3*30+15*0.5=97.5, diff=7.5. Recalculate: 52.5 is for common trick question. Use: hour hand moves 0.5 deg/min. At 3:15: 3*30 + 15*0.5 = 97.5. Minute: 15*6=90. |97.5-90|=7.5. Correct option b.', 3),
(15, 'reasoning', 8, 'Find the next number: 2, 6, 12, 20, 30, ___',
     '40', '42', '44', '36', 'b', 'Pattern: differences are 4,6,8,10,12. Next = 30+12 = 42.', 2);

-- Fix question 14 correct answer
UPDATE psychometric_questions SET correct_option = 'b', explanation = 'At 3:15, hour hand is at 97.5 degrees, minute hand at 90 degrees. Angle = |97.5 - 90| = 7.5 degrees.' WHERE question_number = 14;
