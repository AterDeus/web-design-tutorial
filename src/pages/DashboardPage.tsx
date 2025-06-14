import { useProgressStore } from '../store/useProgressStore';
import { LessonCard } from '../components/LessonCard';
import { useLessons } from '../hooks/useLessons';
import { Loader } from '../components/Loader';

export const DashboardPage = () => {
  const completedLessons = useProgressStore(s => s.completedLessons);
  const { lessons, loading, error } = useLessons();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <Loader size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Уроки веб-дизайна</h1>
        <div className="text-gray-600">
          Завершено: {completedLessons.length} из {lessons.length}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map(lesson => (
          <LessonCard 
            key={lesson.id} 
            lesson={lesson}
            isCompleted={completedLessons.includes(lesson.id)}
          />
        ))}
      </div>
    </div>
  );
}; 