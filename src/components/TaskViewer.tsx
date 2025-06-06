import type { FC } from 'react';
import { useState } from 'react';
import { Button } from './Button';
import type { Lesson } from '../services/firestore';

interface TaskViewerProps {
  lesson: Lesson;
}

export const TaskViewer: FC<TaskViewerProps> = ({ lesson }) => {
  const [showTask, setShowTask] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [code, setCode] = useState(lesson.task.content.codeTemplate || '');

  const handleSubmit = () => {
    if (lesson.task.type === 'quiz') {
      setShowResult(true);
    }
  };

  const renderTask = () => {
    switch (lesson.task.type) {
      case 'quiz':
        return (
          <div className="space-y-4">
            <p className="text-lg font-medium">{lesson.task.content.question}</p>
            <div className="space-y-2">
              {lesson.task.content.options?.map((option, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="answer"
                    checked={selectedAnswer === index}
                    onChange={() => setSelectedAnswer(index)}
                    className="form-radio"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            <Button onClick={handleSubmit} variant="primary">
              Проверить
            </Button>
            {showResult && (
              <div className={`mt-4 p-4 rounded-md ${
                selectedAnswer === lesson.task.content.correctAnswer
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {selectedAnswer === lesson.task.content.correctAnswer
                  ? 'Правильно!'
                  : 'Неправильно. Попробуйте еще раз.'}
              </div>
            )}
          </div>
        );

      case 'code':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Ваш код</h3>
                <textarea
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  className="w-full h-64 font-mono p-4 border rounded-md"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Результат</h3>
                <iframe
                  srcDoc={code}
                  className="w-full h-64 border rounded-md"
                  title="Code preview"
                />
              </div>
            </div>
            <Button onClick={handleSubmit} variant="primary">
              Проверить
            </Button>
          </div>
        );

      case 'figma':
        return (
          <div className="space-y-4">
            <p className="text-lg">
              Откройте макет в Figma и выполните задание:
            </p>
            <a
              href={lesson.task.content.figmaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button variant="primary">
                Открыть макет в Figma
              </Button>
            </a>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mt-8 border-t pt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Задание</h2>
        <Button
          onClick={() => setShowTask(!showTask)}
          variant="secondary"
        >
          {showTask ? 'Скрыть задание' : 'Выполнить задание'}
        </Button>
      </div>
      {showTask && renderTask()}
    </div>
  );
}; 