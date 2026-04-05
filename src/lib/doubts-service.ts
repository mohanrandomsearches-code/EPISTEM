export interface Doubt {
  id: string;
  studentId: string;
  studentName: string;
  topicId: string;
  topicName: string;
  question: string;
  isAnonymous: boolean;
  isAnswered: boolean;
  answer?: string;
  createdAt: number;
  answeredAt?: number;
}

const STORAGE_KEY = 'epistem_doubts';

export function getDoubts(): Doubt[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function saveDoubts(doubts: Doubt[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(doubts));
}

export function submitDoubt(studentId: string, studentName: string, topicId: string, topicName: string, question: string, isAnonymous: boolean): Doubt {
  const doubts = getDoubts();
  const newDoubt: Doubt = {
    id: Math.random().toString(36).substring(7),
    studentId,
    studentName,
    topicId,
    topicName,
    question,
    isAnonymous,
    isAnswered: false,
    createdAt: Date.now(),
  };
  
  saveDoubts([newDoubt, ...doubts]);
  return newDoubt;
}

export function replyToDoubt(doubtId: string, answer: string): Doubt | undefined {
  const doubts = getDoubts();
  const index = doubts.findIndex(d => d.id === doubtId);
  
  if (index !== -1) {
    doubts[index] = {
      ...doubts[index],
      isAnswered: true,
      answer,
      answeredAt: Date.now(),
    };
    saveDoubts(doubts);
    return doubts[index];
  }
  return undefined;
}
