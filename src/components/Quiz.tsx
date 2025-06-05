import type { Quiz as QuizType } from '../types';
import { useState } from 'react';
import { Button } from './Button';

interface QuizProps {
  quiz: QuizType;
}

export const Quiz = ({ quiz }: QuizProps) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
  };

  const handleCheck = () => {
    setShowResult(true);
  };

  return (
    <div>
      <div className="mb-4 font-medium">{quiz.question}</div>
      <ul className="space-y-2 mb-4">
        {quiz.options.map((opt, idx) => (
          <li key={idx}>
            <button
              type="button"
              className={`w-full text-left px-4 py-2 rounded border transition
                ${selected === idx ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}
                ${showResult && idx === quiz.correctAnswer ? 'border-green-500 bg-green-50' : ''}
                ${showResult && selected === idx && selected !== quiz.correctAnswer ? 'border-red-500 bg-red-50' : ''}
              `}
              onClick={() => handleSelect(idx)}
              disabled={showResult}
            >
              {opt}
            </button>
          </li>
        ))}
      </ul>
      {!showResult && (
        <Button
          type="button"
          onClick={handleCheck}
          disabled={selected === null}
        >
          Проверить
        </Button>
      )}
      {showResult && selected !== null && (
        <div className={`mt-4 font-semibold ${selected === quiz.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
          {selected === quiz.correctAnswer ? 'Верно!' : 'Неверно. Попробуйте ещё раз.'}
        </div>
      )}
    </div>
  );
}; 