import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from './firebase';

export interface Lesson {
  id: string;
  title: string;
  content: string;
  image: string;
  description: string;
  duration: number;
  difficulty: 'Начальный' | 'Средний' | 'Продвинутый';
  order: number;
  videoUrl?: string;
}

export interface Task {
  id: string;
  lessonId: string;
  type: 'quiz' | 'code' | 'figma';
  content: {
    question?: string;
    options?: {
      text: string;
      isCorrect: boolean;
    }[];
    codeTemplate?: string;
    codeTask?: string;
    figmaUrl?: string;
  };
  order: number;
}

// Уроки
export const lessonsCollection = collection(db, 'lessons');

export const getLessons = async (): Promise<Lesson[]> => {
  const snapshot = await getDocs(lessonsCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Lesson));
};

export const getLesson = async (id: string): Promise<Lesson | null> => {
  const docRef = doc(db, 'lessons', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Lesson;
  }
  
  return null;
};

export const addLesson = async (lesson: Omit<Lesson, 'id'>): Promise<string> => {
  const docRef = await addDoc(lessonsCollection, lesson);
  return docRef.id;
};

export const updateLesson = async (id: string, data: Omit<Lesson, 'id'>) => {
  try {
    await updateDoc(doc(db, 'lessons', id), data);
  } catch (error) {
    console.error('Ошибка при обновлении урока:', error);
    throw error;
  }
};

export const deleteLesson = async (id: string): Promise<void> => {
  const docRef = doc(db, 'lessons', id);
  await deleteDoc(docRef);
};

// Задания
export const tasksCollection = collection(db, 'tasks');

export const getTasks = async (): Promise<Task[]> => {
  const snapshot = await getDocs(tasksCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Task));
};

export const getTasksByLesson = async (lessonId: string): Promise<Task[]> => {
  const q = query(tasksCollection, where('lessonId', '==', lessonId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Task)).sort((a, b) => a.order - b.order);
};

export const getTask = async (id: string): Promise<Task | null> => {
  const docRef = doc(db, 'tasks', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Task;
  }
  
  return null;
};

export const addTask = async (task: Omit<Task, 'id'>): Promise<string> => {
  const docRef = await addDoc(tasksCollection, task);
  return docRef.id;
};

export const updateTask = async (id: string, data: Partial<Task>): Promise<void> => {
  const docRef = doc(db, 'tasks', id);
  await updateDoc(docRef, data);
};

export const deleteTask = async (id: string): Promise<void> => {
  const docRef = doc(db, 'tasks', id);
  await deleteDoc(docRef);
}; 