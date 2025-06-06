import { useAuthStore } from '../store/useAuthStore';
import { useProgressStore } from '../store/useProgressStore';
import { lessons } from '../data/lessons';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

export const ProfilePage = () => {
  const user = useAuthStore(s => s.user);
  const completedLessons = useProgressStore(s => s.completedLessons);
  const progress = Math.round((completedLessons.length / lessons.length) * 100);
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Профиль пользователя</h2>
      <div className="flex items-center space-x-4 mb-6">
        {user.photoURL ? (
          <img src={user.photoURL} alt="avatar" className="w-16 h-16 rounded-full object-cover border" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl">
            {user.displayName?.[0] || user.email?.[0] || '?'}
          </div>
        )}
        <div>
          {user.displayName && <div className="font-semibold text-lg">{user.displayName}</div>}
          <div className="text-gray-700">{user.email}</div>
        </div>
      </div>
      <div className="mb-6">
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-3 bg-blue-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-sm text-gray-600 mt-1">{completedLessons.length} из {lessons.length} уроков завершено ({progress}%)</div>
      </div>
      <h3 className="font-semibold mb-2">Завершённые уроки:</h3>
      <ul className="space-y-2 mb-8">
        {lessons.filter(l => completedLessons.includes(l.id)).map(l => (
          <li key={l.id} className="px-4 py-2 rounded border bg-green-50 border-green-300 text-green-800">
            {l.title}
          </li>
        ))}
        {completedLessons.length === 0 && <li className="text-gray-500">Нет завершённых уроков</li>}
      </ul>
      <Button variant="outline" onClick={() => navigate('/')}>Назад к урокам</Button>
    </div>
  );
}; 