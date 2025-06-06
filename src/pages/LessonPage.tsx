import { useParams, useNavigate } from 'react-router-dom';
import { LessonViewer } from '../components/LessonViewer';
import { Button } from '../components/Button';
import { useEffect, useState } from 'react';
import { useProgressStore } from '../store/useProgressStore';
import { useLessons } from '../hooks/useLessons';
import type { Lesson } from '../services/firestore';
import { Loader } from '../components/Loader';

export const LessonPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lessons, getLessonById } = useLessons();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const markCompleted = useProgressStore(s => s.markCompleted);

  useEffect(() => {
    const fetchLesson = async () => {
      if (id) {
        const lessonData = await getLessonById(id);
        setLesson(lessonData);
        if (lessonData) {
          markCompleted(lessonData.id);
        }
      }
      setLoading(false);
    };

    fetchLesson();
  }, [id, getLessonById, markCompleted]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <Loader size="large" />
      </div>
    );
  }

  if (!lesson) {
    return <div className="text-center mt-10 text-red-500">Урок не найден</div>;
  }

  const lessonIndex = lessons.findIndex(l => l.id === id);
  const prevLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1] : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-[60vh]">
      <LessonViewer lesson={lesson} />
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/')}
        >
          К списку уроков
        </Button>
        <div className="flex gap-2">
          {prevLesson && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(`/lesson/${prevLesson.id}`)}
            >
              ← Предыдущий
            </Button>
          )}
          {nextLesson && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/lesson/${nextLesson.id}`)}
            >
              Следующий →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}; 