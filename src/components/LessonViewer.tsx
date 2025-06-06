import type { FC } from 'react';
import { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import type { Lesson, Task } from '../services/firestore';
import { getTasks } from '../services/firestore';
import { MarkdownPreview } from './MarkdownPreview';

interface LessonViewerProps {
  lesson: Lesson;
}

export const LessonViewer: FC<LessonViewerProps> = ({ lesson }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userCode, setUserCode] = useState<Record<string, string>>({});
  const editableRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const loadTasks = async () => {
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
    };

    loadTasks();
  }, [lesson.id]);

  const handleCodeChange = (taskId: string, code: string) => {
    setUserCode(prev => ({
      ...prev,
      [taskId]: code
    }));
  };

  const handleSubmitCode = async (taskId: string) => {
    // TODO: Реализовать отправку кода на сервер для проверки
    console.log('Отправка кода на проверку:', userCode[taskId]);
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

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{lesson.title}</h1>
      
      {lesson.videoUrl && (
        <div className="mb-8">
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src={lesson.videoUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            />
          </div>
        </div>
      )}

      <div className="prose max-w-none mb-8">
        <MarkdownPreview content={lesson.content} />
      </div>

      {tasks.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Задания</h2>
          {tasks.map((task, index) => (
            <div key={task.id} className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                Задание {index + 1}
              </h3>
              
              {task.type === 'quiz' && (
                <div className="space-y-4">
                  <p className="text-gray-700">{task.content.question}</p>
                  <div className="space-y-2">
                    {task.content.options?.map((option, optionIndex) => (
                      <label key={optionIndex} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`task-${task.id}`}
                          value={option.text}
                          className="form-radio"
                        />
                        <span>{option.text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {task.type === 'code' && (
                <div className="space-y-4">
                  <div className="prose max-w-none mb-4">
                    <MarkdownPreview content={task.content.codeTask || ''} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ваш код:
                      </label>
                      {renderCodeTemplate(task.content.codeTemplate, task.id)}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Предпросмотр:
                      </label>
                      <div className="w-full h-64 border rounded-md bg-white p-4">
                        <iframe
                          srcDoc={getPreviewHtml(task.content.codeTemplate, userCode[task.id])}
                          className="w-full h-full"
                          title="preview"
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => handleSubmitCode(task.id)}
                  >
                    Отправить на проверку
                  </Button>
                </div>
              )}

              {task.type === 'figma' && (
                <div className="space-y-4">
                  <p className="text-gray-700">{task.content.question}</p>
                  <a
                    href={task.content.figmaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Открыть в Figma
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 