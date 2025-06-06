import type { FC } from 'react';
import { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import type { Lesson, Task } from '../services/firestore';
import { getTasks } from '../services/firestore';
import { MarkdownPreview } from './MarkdownPreview';
import { Loader } from './Loader';

interface LessonViewerProps {
  lesson: Lesson;
}

interface TaskResult {
  taskId: string;
  isCorrect: boolean;
  userAnswer: string;
}

export const LessonViewer: FC<LessonViewerProps> = ({ lesson }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userCode, setUserCode] = useState<Record<string, string>>({});
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [taskResults, setTaskResults] = useState<TaskResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isContentReady, setIsContentReady] = useState(false);
  const editableRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      setIsContentReady(false);
      try {
        const lessonTasks = await getTasks();
        const filteredTasks = lessonTasks.filter(task => task.lessonId === lesson.id);
        setTasks(filteredTasks);

        // Инициализируем состояние для кодовых заданий
        const codeTasks = filteredTasks.filter(task => task.type === 'code');
        const initialCode = codeTasks.reduce((acc, task) => {
          acc[task.id] = '';
          return acc;
        }, {} as Record<string, string>);
        setUserCode(initialCode);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [lesson.id]);

  useEffect(() => {
    if (!isLoading && contentRef.current) {
      // Даем время на рендеринг Markdown и Mermaid
      const timer = setTimeout(() => {
        setIsContentReady(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const handleCodeChange = (taskId: string, code: string) => {
    setUserCode(prev => ({
      ...prev,
      [taskId]: code
    }));
  };

  const handleAnswerSelect = (taskId: string, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [taskId]: answer
    }));
  };

  const handleSubmitAnswer = async () => {
    const currentTask = tasks[currentTaskIndex];
    let isCorrect = false;
    let userAnswer = '';

    if (currentTask.type === 'quiz') {
      userAnswer = selectedAnswers[currentTask.id] || '';
      isCorrect = currentTask.content.options?.find(opt => opt.text === userAnswer)?.isCorrect || false;
    } else if (currentTask.type === 'code') {
      userAnswer = userCode[currentTask.id] || '';
      // TODO: Реализовать проверку кода
      isCorrect = true; // Временно всегда true
    }

    const newResult: TaskResult = {
      taskId: currentTask.id,
      isCorrect,
      userAnswer
    };

    setTaskResults(prev => [...prev, newResult]);

    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const renderCodeTemplate = (template: string | undefined, taskId: string) => {
    if (!template) return null;
    const parts = template.split('{{ваш код}}');
    
    return (
      <div className="bg-gray-800 text-white p-4 rounded-lg font-mono text-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400">Шаблон кода:</span>
        </div>
        <pre className="whitespace-pre-wrap">
          {parts[0]}
          <div
            ref={el => editableRefs.current[taskId] = el}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              const target = e.target as HTMLDivElement;
              handleCodeChange(taskId, target.innerText);
            }}
            className="bg-yellow-900 text-white px-1 rounded min-h-[1.5em] w-full inline-block"
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              outline: 'none'
            }}
          >
            {userCode[taskId] || 'ваш код'}
          </div>
          {parts[1]}
        </pre>
      </div>
    );
  };

  const getPreviewHtml = (template: string | undefined, userInput: string) => {
    if (!template) return '';
    return template.replace('{{ваш код}}', userInput || '');
  };

  const renderResults = () => {
    const correctAnswers = taskResults.filter(result => result.isCorrect).length;
    const totalTasks = tasks.length;
    const percentage = Math.round((correctAnswers / totalTasks) * 100);
    let grade = '';
    
    if (percentage >= 90) grade = 'Отлично';
    else if (percentage >= 70) grade = 'Хорошо';
    else if (percentage >= 50) grade = 'Удовлетворительно';
    else grade = 'Неудовлетворительно';

    return (
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Результаты</h2>
        <div className="text-4xl font-bold text-blue-600">{percentage}%</div>
        <div className="text-xl">{grade}</div>
        <div className="text-gray-600">
          Правильных ответов: {correctAnswers} из {totalTasks}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <Loader size="large" />
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-[60vh] transition-opacity duration-500 ease-in-out">
        <h1 className="text-3xl font-bold mb-6">{lesson.title}</h1>
        {renderResults()}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="min-h-[60vh] transition-opacity duration-500 ease-in-out">
        <h1 className="text-3xl font-bold mb-6">{lesson.title}</h1>
        <div className="text-center text-gray-600">Задания не найдены</div>
      </div>
    );
  }

  const currentTask = tasks[currentTaskIndex];

  return (
    <div className="min-h-[60vh] transition-opacity duration-500 ease-in-out">
      <h1 className="text-3xl font-bold mb-6">{lesson.title}</h1>
      
      {lesson.videoUrl && (
        <div className="mb-8">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={lesson.videoUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-lg"
            />
          </div>
        </div>
      )}

      <div className="prose max-w-none mb-8">
        <MarkdownPreview content={lesson.content} />
      </div>

      <div className="border rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Задание {currentTaskIndex + 1} из {tasks.length}</h2>
          <div className="text-gray-600">
            Прогресс: {currentTaskIndex + 1}/{tasks.length}
          </div>
        </div>

        {currentTask.type === 'quiz' && (
          <div className="space-y-4">
            <p className="text-gray-700">{currentTask.content.question}</p>
            <div className="space-y-2">
              {currentTask.content.options?.map((option, optionIndex) => (
                <label key={optionIndex} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`task-${currentTask.id}`}
                    value={option.text}
                    checked={selectedAnswers[currentTask.id] === option.text}
                    onChange={() => handleAnswerSelect(currentTask.id, option.text)}
                    className="form-radio"
                  />
                  <span>{option.text}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {currentTask.type === 'code' && (
          <div className="space-y-4">
            <div className="prose max-w-none mb-4">
              <MarkdownPreview content={currentTask.content.codeTask || ''} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                {renderCodeTemplate(currentTask.content.codeTemplate, currentTask.id)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Предпросмотр:
                </label>
                <div className="w-full h-64 border rounded-md bg-white p-4">
                  <iframe
                    srcDoc={getPreviewHtml(currentTask.content.codeTemplate, userCode[currentTask.id])}
                    className="w-full h-full"
                    title="preview"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTask.type === 'figma' && (
          <div className="space-y-4">
            <p className="text-gray-700">{currentTask.content.question}</p>
            <a
              href={currentTask.content.figmaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Открыть в Figma
            </a>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button
            variant="primary"
            onClick={handleSubmitAnswer}
          >
            {currentTaskIndex < tasks.length - 1 ? 'Ответить' : 'Завершить'}
          </Button>
        </div>
      </div>
    </div>
  );
}; 