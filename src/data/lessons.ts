export interface Lesson {
  id: string;
  title: string;
  content: string;
  image: string;
  description: string;
  duration: number;
  difficulty: 'Начальный' | 'Средний' | 'Продвинутый';
}

export const lessons: Lesson[] = [
  {
    id: '1',
    title: 'Введение в HTML',
    content: 'HTML - это язык разметки, который используется для создания веб-страниц...',
    image: '/images/html-intro.jpg',
    description: 'Изучите основы HTML и создайте свою первую веб-страницу',
    duration: 30,
    difficulty: 'Начальный'
  },
  {
    id: '2',
    title: 'Основы CSS',
    content: 'CSS - это язык стилей, который используется для оформления веб-страниц...',
    image: '/images/css-basics.jpg',
    description: 'Научитесь стилизовать веб-страницы с помощью CSS',
    duration: 45,
    difficulty: 'Начальный'
  },
  {
    id: '3',
    title: 'Адаптивный дизайн',
    content: 'Адаптивный дизайн позволяет создавать сайты, которые хорошо выглядят на любых устройствах...',
    image: '/images/responsive-design.jpg',
    description: 'Создавайте сайты, которые отлично выглядят на всех устройствах',
    duration: 60,
    difficulty: 'Средний'
  }
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