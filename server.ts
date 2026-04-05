
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import multer from 'multer';
import { computeNextDifficulty, generateEncouragement, classifyError } from './src/lib/adaptive-engine.ts';
import { Question, StudentPerformance } from './src/types/adaptive.ts';
import { parseMarksSheet, validateMarksRow } from './src/lib/excel-parser.ts';

const upload = multer({ storage: multer.memoryStorage() });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock database for questions
  const mockQuestions: Question[] = [
    {
      id: 'q1',
      topicId: 'ch7',
      text: 'What is 1/2 + 1/4?',
      type: 'mcq',
      options: ['1/6', '3/4', '2/4', '1/2'],
      correctAnswer: '3/4',
      difficulty: 1,
      explanation: 'To add fractions, find a common denominator. 1/2 is 2/4. So 2/4 + 1/4 = 3/4.',
      stepByStep: ['Find common denominator: 4', 'Convert 1/2 to 2/4', 'Add numerators: 2 + 1 = 3', 'Result is 3/4']
    },
    {
      id: 'q2',
      topicId: 'ch7',
      text: 'What is 3/5 of 25?',
      type: 'numerical',
      correctAnswer: '15',
      difficulty: 2,
      explanation: 'Multiply 25 by 3 and divide by 5. 25 * 3 = 75. 75 / 5 = 15.',
      stepByStep: ['Multiply 25 by numerator 3: 75', 'Divide 75 by denominator 5: 15']
    }
    // Add more mock questions as needed
  ];

  // Mock performance store
  const performanceStore: Record<string, StudentPerformance> = {};

  // API Routes
  app.post('/api/teacher/upload-excel', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const rows = parseMarksSheet(req.file.buffer);
      const errors: any[] = [];
      const validRows: any[] = [];

      rows.forEach((row, index) => {
        const validation = validateMarksRow(row);
        if (!validation.isValid) {
          errors.push({ row: index + 1, errors: validation.errors });
        } else {
          validRows.push(row);
        }
      });

      // Mock batch upsert and AI report queue
      const studentsProcessed = new Set(validRows.map(r => r.Name)).size;

      res.json({
        success: true,
        studentsProcessed,
        rowsInserted: validRows.length,
        errors,
        warnings: []
      });
    } catch (error) {
      console.error('Excel parsing error:', error);
      res.status(500).json({ error: 'Failed to parse Excel file' });
    }
  });

  app.post('/api/adaptive/next-question', (req, res) => {
    const { studentId, topicId, lastAnswerCorrect, lastTimeSec } = req.body;
    
    let perf = performanceStore[`${studentId}_${topicId}`];
    if (!perf) {
      perf = {
        topicId,
        accuracy: 0,
        avgTimeSec: 0,
        retryCount: 0,
        errorTypes: { calculation: 0, concept: 0, careless: 0, formula: 0, none: 0 },
        currentDifficulty: 1,
        recentAnswers: []
      };
    }

    if (lastAnswerCorrect !== undefined) {
      perf.recentAnswers.push(lastAnswerCorrect);
      if (perf.recentAnswers.length > 10) perf.recentAnswers.shift();
      
      // Update rolling average time
      if (lastTimeSec) {
        perf.avgTimeSec = perf.avgTimeSec === 0 ? lastTimeSec : (perf.avgTimeSec + lastTimeSec) / 2;
      }
    }

    const nextDiff = computeNextDifficulty(perf);
    perf.currentDifficulty = nextDiff;
    performanceStore[`${studentId}_${topicId}`] = perf;

    const availableQuestions = mockQuestions.filter(q => q.topicId === topicId && q.difficulty === nextDiff);
    const question = availableQuestions[Math.floor(Math.random() * availableQuestions.length)] || mockQuestions[0];

    res.json({
      question,
      difficulty: nextDiff,
      explanationMode: perf.avgTimeSec > 90 ? 'simple' : 'standard',
      encouragement: generateEncouragement(perf.accuracy, 5),
      questionNumber: perf.recentAnswers.length + 1,
      totalInSession: 10
    });
  });

  app.post('/api/adaptive/record-answer', (req, res) => {
    const { studentId, questionId, answer, timeSec } = req.body;
    const question = mockQuestions.find(q => q.id === questionId);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const isCorrect = answer === question.correctAnswer;
    const errorType = classifyError(question, answer, question.correctAnswer);
    
    // XP Logic
    let xpEarned = 2; // Participation
    if (isCorrect) {
      xpEarned = timeSec < 30 ? 15 : 10;
    }

    res.json({
      isCorrect,
      errorType,
      explanation: question.explanation,
      xpEarned,
      newAccuracy: 85 // Mocked for now
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
