import { addLesson, addTask } from '../services/firestore';
import type { Lesson, Task } from '../services/firestore';

const initialLessons: Omit<Lesson, 'id'>[] = [
  {
    title: 'Введение в HTML',
    content: `# Введение в HTML

HTML (HyperText Markup Language) - это стандартный язык разметки для создания веб-страниц.

## Основные понятия

- Теги
- Атрибуты
- Элементы
- Структура документа`,
    image: 'https://example.com/html-intro.jpg',
    description: 'Базовые концепции HTML и создание простых веб-страниц',
    duration: 30,
    difficulty: 'Начальный' as const,
    order: 1,
    videoUrl: 'https://www.youtube.com/watch?v=example1'
  },
  {
    title: 'Основы CSS',
    content: `# Основы CSS

CSS (Cascading Style Sheets) - это язык стилей, используемый для оформления HTML-документов.

## Что вы узнаете

- Селекторы
- Свойства
- Значения
- Каскадность`,
    image: 'https://example.com/css-basics.jpg',
    description: 'Изучение основ CSS для стилизации веб-страниц',
    duration: 45,
    difficulty: 'Начальный' as const,
    order: 2,
    videoUrl: 'https://www.youtube.com/watch?v=example2'
  },
  {
    title: 'Адаптивный дизайн',
    content: `# Адаптивный дизайн

Адаптивный дизайн позволяет создавать веб-сайты, которые хорошо выглядят на любых устройствах.

## Ключевые концепции

- Медиа-запросы
- Относительные единицы
- Flexbox
- Grid`,
    image: 'https://example.com/responsive-design.jpg',
    description: 'Создание адаптивных веб-сайтов с использованием современных техник',
    duration: 60,
    difficulty: 'Средний' as const,
    order: 3,
    videoUrl: 'https://www.youtube.com/watch?v=example3'
  }
];

const initialTasks: Omit<Task, 'id'>[] = [
  {
    lessonId: '', // Будет заполнено после создания уроков
    type: 'quiz',
    content: {
      question: 'Что такое HTML?',
      options: [
        { text: 'Язык программирования', isCorrect: false },
        { text: 'Язык разметки', isCorrect: true },
        { text: 'Язык стилей', isCorrect: false },
        { text: 'База данных', isCorrect: false }
      ]
    },
    order: 1
  },
  {
    lessonId: '', // Будет заполнено после создания уроков
    type: 'code',
    content: {
      codeTemplate: `<!DOCTYPE html>
<html>
<head>
  <title>Моя первая страница</title>
</head>
<body>
  <h1>Привет, мир!</h1>
</body>
</html>`
    },
    order: 2
  },
  {
    lessonId: '', // Будет заполнено после создания уроков
    type: 'figma',
    content: {
      figmaUrl: 'https://www.figma.com/file/example'
    },
    order: 3
  }
];

export const initializeDatabase = async () => {
  try {
    // Добавляем уроки
    const lessonIds = await Promise.all(
      initialLessons.map(lesson => addLesson(lesson))
    );

    // Добавляем задания, связывая их с уроками
    await Promise.all(
      initialTasks.map((task, index) => {
        const lessonIndex = index % lessonIds.length;
        return addTask({
          ...task,
          lessonId: lessonIds[lessonIndex]
        });
      })
    );

    console.log('База данных успешно инициализирована');
  } catch (error) {
    console.error('Ошибка при инициализации базы данных:', error);
  }
}; 