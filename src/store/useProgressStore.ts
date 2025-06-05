import { create } from 'zustand';

interface ProgressState {
  completedLessons: string[];
  markCompleted: (lessonId: string) => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  completedLessons: [],
  markCompleted: (lessonId) => set((state) => ({
    completedLessons: state.completedLessons.includes(lessonId)
      ? state.completedLessons
      : [...state.completedLessons, lessonId],
  })),
})); 