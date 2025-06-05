export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  order: number;
  type: 'text' | 'quiz' | 'practice';
}

export interface Quiz {
  id: string;
  lessonId: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface UserProgress {
  userId: string;
  lessonId: string;
  completed: boolean;
  score?: number;
  lastAttempt: Date;
} 