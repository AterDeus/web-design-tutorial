import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Button } from './Button';
import { TaskForm } from './TaskForm';
import type { Task } from '../services/firestore';
import { getTasksByLesson, addTask, updateTask, deleteTask } from '../services/firestore';

interface TaskManagerProps {
  lessonId: string;
}

export const TaskManager: FC<TaskManagerProps> = ({ lessonId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadTasks();
  }, [lessonId]);

  const loadTasks = async () => {
    try {
      const tasksData = await getTasksByLesson(lessonId);
      setTasks(tasksData);
    } catch (error) {
      console.error('Ошибка при загрузке заданий:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить это задание?')) {
      try {
        await deleteTask(taskId);
        await loadTasks();
      } catch (error) {
        console.error('Ошибка при удалении задания:', error);
      }
    }
  };

  const handleSubmit = async (taskData: Omit<Task, 'id' | 'lessonId'>) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
      } else {
        await addTask({
          ...taskData,
          lessonId,
          order: tasks.length + 1
        });
      }
      setShowForm(false);
      await loadTasks();
    } catch (error) {
      console.error('Ошибка при сохранении задания:', error);
    }
  };

  if (loading) {
    return <div>Загрузка заданий...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Задания</h3>
        <Button onClick={handleAddTask} variant="primary">
          Добавить задание
        </Button>
      </div>

      {showForm && (
        <div className="border rounded-lg p-4">
          <TaskForm
            task={editingTask}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">
                  {task.type === 'quiz' ? 'Тест' : 
                   task.type === 'code' ? 'Практическое задание' : 
                   'Задание в Figma'}
                </h4>
                {task.type === 'quiz' && (
                  <p className="text-gray-600">{task.content.question}</p>
                )}
                {task.type === 'code' && (
                  <p className="text-gray-600">{task.content.codeTask}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleEditTask(task)}
                  variant="secondary"
                  size="sm"
                >
                  Редактировать
                </Button>
                <Button
                  onClick={() => handleDeleteTask(task.id)}
                  variant="secondary"
                  size="sm"
                >
                  Удалить
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 