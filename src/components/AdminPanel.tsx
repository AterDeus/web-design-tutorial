import type { FC } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { initializeDatabase } from '../scripts/initDb';
import { useLessons } from '../hooks/useLessons';
import type { Lesson } from '../services/firestore';
import { Loader } from './Loader';

export const AdminPanel: FC = () => {
  const navigate = useNavigate();
  const [showDangerZone, setShowDangerZone] = useState(false);
  const { lessons, loading, refetch } = useLessons();

  const handleInitDb = async () => {
    if (window.confirm('Вы уверены, что хотите инициализировать базу данных? Все существующие данные будут перезаписаны.')) {
      await initializeDatabase();
      await refetch();
    }
  };

  const handleEdit = (lesson: Lesson) => {
    navigate(`/admin/lesson/${lesson.id}`);
  };

  const handleAddLesson = () => {
    navigate('/admin/lesson/new');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Панель администратора</h1>
      <div className="space-y-8">
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Управление уроками</h2>
            <Button 
              onClick={handleAddLesson}
              variant="primary"
            >
              Добавить урок
            </Button>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Список уроков</h3>
            {loading ? (
              <div className="text-gray-500">Загрузка...</div>
            ) : (
              <div className="space-y-2">
                {lessons.map(lesson => (
                  <div key={lesson.id} className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                    <div>
                      <div className="font-medium">{lesson.title}</div>
                      <div className="text-sm text-gray-600">
                        {lesson.difficulty} • {lesson.duration} мин • Порядок: {lesson.order}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleEdit(lesson)}
                      variant="secondary"
                      className="ml-4"
                    >
                      Редактировать
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Блок опасных операций */}
        <div className="p-4 bg-white rounded-lg shadow border border-red-200">
          <button
            onClick={() => setShowDangerZone(!showDangerZone)}
            className="w-full flex justify-between items-center text-left"
          >
            <h2 className="text-xl font-semibold text-red-600">Опасные операции</h2>
            <svg
              className={`w-5 h-5 transform transition-transform ${showDangerZone ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showDangerZone && (
            <div className="mt-4 pt-4 border-t border-red-200">
              <div className="p-4 bg-red-50 rounded-lg">
                <h3 className="text-lg font-medium text-red-700 mb-4">Инициализация базы данных</h3>
                <p className="text-red-600 mb-4">
                  Нажмите кнопку ниже, чтобы инициализировать базу данных начальными данными.
                  Это действие перезапишет все существующие данные.
                </p>
                <Button 
                  onClick={handleInitDb} 
                  variant="primary" 
                  className="bg-red-600 hover:bg-red-700"
                >
                  Инициализировать базу данных
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 