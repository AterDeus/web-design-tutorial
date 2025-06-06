import { useState } from 'react';
import { Button } from './Button';

interface PracticeProps {
  lessonId: string;
}

export const Practice = ({ lessonId }: PracticeProps) => {
  const [value, setValue] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    // Здесь можно добавить отправку на сервер или ИИ-проверку
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        className="w-full min-h-[120px] border rounded px-3 py-2"
        placeholder="Введите ваш код или ответ..."
        value={value}
        onChange={e => setValue(e.target.value)}
        required
        disabled={sent}
      />
      <Button type="submit" className="w-full" disabled={sent || !value.trim()}>
        Отправить
      </Button>
      {sent && <div className="text-green-600 text-sm">Ответ отправлен!</div>}
    </form>
  );
}; 