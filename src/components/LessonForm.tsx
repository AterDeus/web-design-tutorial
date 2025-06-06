import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Button } from './Button';
import type { Lesson } from '../services/firestore';
import { addLesson, updateLesson, getLesson } from '../services/firestore';
import { TaskManager } from './TaskManager';
import { MarkdownPreview } from './MarkdownPreview';
import { Modal } from './Modal';

interface LessonFormProps {
  onSuccess?: () => void;
  lesson?: Lesson;
}

const defaultFormData: Omit<Lesson, 'id'> = {
  title: '',
  content: '',
  image: '',
  description: '',
  duration: 30,
  difficulty: 'Начальный',
  order: 1,
  videoUrl: ''
};

export const LessonForm: FC<LessonFormProps> = ({ onSuccess, lesson }) => {
  const [formData, setFormData] = useState<Omit<Lesson, 'id'>>(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (lesson) {
      const { id, ...lessonData } = lesson;
      setFormData(lessonData);
    } else {
      setFormData(defaultFormData);
    }
  }, [lesson]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (lesson) {
        await updateLesson(lesson.id, formData);
        const updatedLesson = await getLesson(lesson.id);
        if (updatedLesson) {
          const { id, ...lessonData } = updatedLesson;
          setFormData(lessonData);
        }
      } else {
        const newLessonId = await addLesson(formData);
        const newLesson = await getLesson(newLessonId);
        if (newLesson) {
          const { id, ...lessonData } = newLesson;
          setFormData(lessonData);
        }
      }
      onSuccess?.();
    } catch (error) {
      console.error('Ошибка при сохранении урока:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Название урока
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Описание
        </label>
        <textarea
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border rounded-md"
          rows={3}
          required
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Содержание урока (Markdown)
          </label>
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="px-3 py-1 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-300"
          >
            Предпросмотр
          </button>
        </div>
        <textarea
          value={formData.content}
          onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
          className="w-full px-3 py-2 border rounded-md font-mono"
          rows={10}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL видео (YouTube или Rutube)
        </label>
        <input
          type="text"
          value={formData.videoUrl || ''}
          onChange={e => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL изображения
        </label>
        <input
          type="text"
          value={formData.image}
          onChange={e => setFormData(prev => ({ ...prev, image: e.target.value }))}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Продолжительность (минуты)
          </label>
          <input
            type="number"
            value={formData.duration}
            onChange={e => setFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
            className="w-full px-3 py-2 border rounded-md"
            min={1}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Сложность
          </label>
          <select
            value={formData.difficulty}
            onChange={e => setFormData(prev => ({ ...prev, difficulty: e.target.value as Lesson['difficulty'] }))}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="Начальный">Начальный</option>
            <option value="Средний">Средний</option>
            <option value="Продвинутый">Продвинутый</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Порядок
        </label>
        <input
          type="number"
          value={formData.order}
          onChange={e => setFormData(prev => ({ ...prev, order: Number(e.target.value) }))}
          className="w-full px-3 py-2 border rounded-md"
          min={1}
          required
        />
      </div>

      {lesson && (
        <div className="border-t pt-4">
          <TaskManager lessonId={lesson.id} />
        </div>
      )}

      <Button type="submit" variant="primary" disabled={isSaving}>
        {isSaving ? 'Сохранение...' : lesson ? 'Сохранить изменения' : 'Добавить урок'}
      </Button>

      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Предпросмотр урока"
      >
        <div className="prose max-w-none">
          <MarkdownPreview content={formData.content} />
        </div>
      </Modal>
    </form>
  );
}; 