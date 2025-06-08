import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LessonForm } from '../components/LessonForm';
import { getLesson, type Lesson } from '../services/firestore';
import { Loader } from '../components/Loader';
import { Button } from '../components/Button';

export const EditLessonPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLesson = async () => {
      if (!id) {
        setError('ID урока не указан');
        setLoading(false);
        return;
      }

      try {
        const lessonData = await getLesson(id);
        if (lessonData) {
          setLesson(lessonData);
        } else {
          setError('Урок не найден');
        }
      } catch (err) {
        setError('Ошибка при загрузке урока');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
  }, [id]);

  const handleSuccess = () => {
    navigate('/admin');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <Loader size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-700 font-medium mb-2">Ошибка</h2>
          <p className="text-red-600">{error}</p>
          <Button
            onClick={() => navigate('/admin')}
            variant="secondary"
            className="mt-4"
          >
            Вернуться в админ-панель
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            {lesson ? 'Редактирование урока' : 'Новый урок'}
          </h1>
          <Button
            onClick={() => navigate('/admin')}
            variant="outline"
          >
            Отмена
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <LessonForm
            lesson={lesson || undefined}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </div>
  );
}; 