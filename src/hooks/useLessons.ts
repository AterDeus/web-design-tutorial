import { useState, useEffect, useCallback } from 'react';
import { getLessons, getLesson, type Lesson } from '../services/firestore';

export const useLessons = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLessons = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getLessons();
      setLessons(data.sort((a, b) => a.order - b.order));
      setError(null);
    } catch (err) {
      setError('Ошибка при загрузке уроков');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const getLessonById = async (id: string) => {
    try {
      const lesson = await getLesson(id);
      return lesson;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  return {
    lessons,
    loading,
    error,
    getLessonById,
    refetch: fetchLessons
  };
}; 