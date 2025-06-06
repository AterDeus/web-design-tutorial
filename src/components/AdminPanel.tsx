import type { FC } from 'react';
import { useState } from 'react';
import { Button } from './Button';
import { initializeDatabase } from '../scripts/initDb';
import { LessonForm } from './LessonForm';
import { useLessons } from '../hooks/useLessons';
import type { Lesson } from '../services/firestore';

export const AdminPanel: FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | undefined>();
  const { lessons, loading, refetch } = useLessons();

  const handleInitDb = async () => {
    if (window.confirm('Вы уверены, что хотите инициализировать базу данных? Все существующие данные будут перезаписаны.')) {
      await initializeDatabase();
      await refetch();
    }
  };

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setShowForm(true);
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingLesson(undefined);
    await refetch();
  };

  const handleToggleForm = () => {
    setEditingLesson(undefined);
    setShowForm(!showForm);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Панель администратора</h1>
      <div className="space-y-8">
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Инициализация базы данных</h2>
          <p className="text-gray-600 mb-4">
            Нажмите кнопку ниже, чтобы инициализировать базу данных начальными данными.
            Это действие перезапишет все существующие данные.
          </p>
          <Button onClick={handleInitDb} variant="primary" className="bg-red-600 hover:bg-red-700">
            Инициализировать базу данных
          </Button>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Управление уроками</h2>
            <div className="flex gap-2">
              <Button 
                onClick={handleInitDb}
                variant="outline"
              >
                Инициализировать БД
              </Button>
              <Button 
                onClick={handleToggleForm}
                variant="primary"
              >
                {showForm ? 'Скрыть форму' : 'Добавить урок'}
              </Button>
            </div>
          </div>

          {showForm && (
            <div className="mb-8">
              <LessonForm 
                lesson={editingLesson} 
                onSuccess={handleFormSuccess} 
              />
            </div>
          )}

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
      </div>
    </div>
  );
}; 