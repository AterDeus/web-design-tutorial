import type { Lesson } from '../types';
import { quizzes } from '../data/lessons';
import { useMemo } from 'react';
import { Quiz } from './Quiz';

interface LessonViewerProps {
  lesson: Lesson;
}

export const LessonViewer = ({ lesson }: LessonViewerProps) => {
  // Простейший markdown: **жирный** и \n -> <br />
  const htmlContent = useMemo(() => {
    return lesson.content
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\n/g, '<br />');
  }, [lesson.content]);

  if (lesson.type === 'quiz') {
    const quiz = quizzes.find(q => q.lessonId === lesson.id);
    if (!quiz) return <div>Тест не найден</div>;
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">{lesson.title}</h2>
        <Quiz quiz={quiz} />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{lesson.title}</h2>
      <div className="prose" dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}; 