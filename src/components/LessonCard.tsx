import type { FC } from 'react';
import { Link } from 'react-router-dom';
import type { Lesson } from '../data/lessons';

interface LessonCardProps {
  lesson: Lesson;
  isCompleted?: boolean;
}

export const LessonCard: FC<LessonCardProps> = ({ lesson, isCompleted = false }) => {
  return (
    <Link to={`/lesson/${lesson.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
        {isCompleted && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium z-10">
            Завершено
          </div>
        )}
        <div className="aspect-video relative">
          <img 
            src={lesson.image} 
            alt={lesson.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{lesson.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{lesson.description}</p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {lesson.duration} мин
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {lesson.difficulty}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}; 