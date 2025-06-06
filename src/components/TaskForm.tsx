import type { FC } from 'react';
import { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import type { Task } from '../services/firestore';

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: Omit<Task, 'id' | 'lessonId'>) => void;
  onCancel: () => void;
}

export const TaskForm: FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Task, 'id' | 'lessonId'>>({
    type: 'quiz',
    content: {
      question: '',
      options: [{ text: '', isCorrect: false }]
    },
    order: 0
  });

  const codeTemplateRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (task) {
      const { id, lessonId, ...taskData } = task;
      setFormData(taskData);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSubmit(formData);
  };

  const handleTypeChange = (type: Task['type']) => {
    setFormData(prev => ({
      ...prev,
      type,
      content: type === 'quiz' 
        ? { question: '', options: [{ text: '', isCorrect: false }] }
        : type === 'code'
        ? { codeTemplate: '', codeTask: '' }
        : { figmaUrl: '' }
    }));
  };

  const insertCodePlaceholder = () => {
    const textarea = codeTemplateRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end);
    const newText = before + '{{ваш код}}' + after;

    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        codeTemplate: newText
      }
    }));

    // Устанавливаем курсор после вставленного плейсхолдера
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 11, start + 11);
    }, 0);
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        options: [...(prev.content.options || []), { text: '', isCorrect: false }]
      }
    }));
  };

  const removeOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        options: prev.content.options?.filter((_, i) => i !== index)
      }
    }));
  };

  const updateOption = (index: number, text: string, isCorrect: boolean) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        options: prev.content.options?.map((option, i) => 
          i === index ? { text, isCorrect } : option
        )
      }
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Тип задания
        </label>
        <select
          value={formData.type}
          onChange={e => handleTypeChange(e.target.value as Task['type'])}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="quiz">Тест</option>
          <option value="code">Практическое задание (HTML/CSS)</option>
          <option value="figma">Задание в Figma</option>
        </select>
      </div>

      {formData.type === 'quiz' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Вопрос
            </label>
            <input
              type="text"
              value={formData.content.question}
              onChange={e => setFormData(prev => ({
                ...prev,
                content: { ...prev.content, question: e.target.value }
              }))}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                Варианты ответов
              </label>
              <Button
                type="button"
                onClick={addOption}
                variant="secondary"
                size="sm"
              >
                Добавить вариант
              </Button>
            </div>
            {formData.content.options?.map((option, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={option.text}
                  onChange={e => updateOption(index, e.target.value, option.isCorrect)}
                  className="flex-1 px-3 py-2 border rounded-md"
                  placeholder={`Вариант ${index + 1}`}
                  required
                />
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={option.isCorrect}
                    onChange={e => updateOption(index, option.text, e.target.checked)}
                    className="form-checkbox"
                  />
                  <span className="text-sm text-gray-600">Правильный</span>
                </label>
                {formData.content.options!.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeOption(index)}
                    variant="secondary"
                    size="sm"
                  >
                    Удалить
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {formData.type === 'code' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Текст задания
            </label>
            <textarea
              value={formData.content.codeTask || ''}
              onChange={e => setFormData(prev => ({
                ...prev,
                content: { ...prev.content, codeTask: e.target.value }
              }))}
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
              required
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Шаблон кода
              </label>
              <Button
                type="button"
                onClick={insertCodePlaceholder}
                variant="secondary"
                size="sm"
              >
                Вставить плейсхолдер для кода
              </Button>
            </div>
            <textarea
              ref={codeTemplateRef}
              value={formData.content.codeTemplate || ''}
              onChange={e => setFormData(prev => ({
                ...prev,
                content: { ...prev.content, codeTemplate: e.target.value }
              }))}
              className="w-full px-3 py-2 border rounded-md font-mono"
              rows={10}
              required
            />
          </div>
        </div>
      )}

      {formData.type === 'figma' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ссылка на макет в Figma
          </label>
          <input
            type="text"
            value={formData.content.figmaUrl}
            onChange={e => setFormData(prev => ({
              ...prev,
              content: { ...prev.content, figmaUrl: e.target.value }
            }))}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button type="button" onClick={onCancel} variant="secondary">
          Отмена
        </Button>
        <Button type="button" onClick={handleSubmit} variant="primary">
          Сохранить задание
        </Button>
      </div>
    </div>
  );
}; 