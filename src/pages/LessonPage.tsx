import { useParams, useNavigate } from 'react-router-dom';
import { lessons } from '../data/lessons';
import { LessonViewer } from '../components/LessonViewer';
import { Button } from '../components/Button';
import { useEffect } from 'react';
import { useProgressStore } from '../store/useProgressStore';

export const LessonPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lessonIndex = lessons.findIndex(l => l.id === id);
  const lesson = lessons[lessonIndex];
  const markCompleted = useProgressStore(s => s.markCompleted);

  useEffect(() => {
    if (lesson) markCompleted(lesson.id);
  }, [lesson, markCompleted]);

  if (!lesson) {
    return <div className="text-center mt-10 text-red-500">Урок не найден</div>;
  }

  const prevLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1] : null;

  return (
    <div>
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