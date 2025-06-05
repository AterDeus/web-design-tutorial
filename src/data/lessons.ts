import type { Lesson, Quiz } from '../types';

export const lessons: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Введение в веб-дизайн',
    content: 'В этом уроке вы узнаете, что такое веб-дизайн и какие бывают сайты.\n\n**Веб-дизайн** — это процесс создания внешнего вида и структуры сайта.',
    order: 1,
    type: 'text',
  },
  {
    id: 'lesson-2',
    title: 'Тест: основы веб-дизайна',
    content: '',
    order: 2,
    type: 'quiz',
  },
  {
    id: 'lesson-3',
    title: 'Практика: ваша первая страница',
    content: 'Создайте простую HTML-страницу с заголовком и абзацем.',
    order: 3,
    type: 'practice',
  },
];

export const quizzes: Quiz[] = [
  {
    id: 'quiz-1',
    lessonId: 'lesson-2',
    question: 'Что такое веб-дизайн?',
    options: [
      'Создание сайтов',
      'Только программирование',
      'Только рисование',
      'Только верстка',
    ],
    correctAnswer: 0,
  },
]; 