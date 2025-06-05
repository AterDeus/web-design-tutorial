import { lessons } from '../data/lessons';
import { Link } from 'react-router-dom';
import { useProgressStore } from '../store/useProgressStore';

export const DashboardPage = () => {
  const completedLessons = useProgressStore(s => s.completedLessons);
  const progress = Math.round((completedLessons.length / lessons.length) * 100);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Ваши уроки</h2>
      <div className="mb-6">
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-3 bg-blue-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-sm text-gray-600 mt-1">Прогресс: {completedLessons.length} из {lessons.length} ({progress}%)</div>
      </div>
      <ul className="space-y-3">
        {lessons.map(lesson => (
          <li key={lesson.id}>
            <Link
              to={`/lesson/${lesson.id}`}
              className={`block px-4 py-3 rounded border bg-white hover:bg-blue-50 transition flex items-center justify-between ${completedLessons.includes(lesson.id) ? 'border-green-400' : ''}`}
            >
              <span className="font-semibold">{lesson.title}</span>
              {completedLessons.includes(lesson.id) && (
                <span className="ml-2 text-green-600 text-lg">✔</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}; 