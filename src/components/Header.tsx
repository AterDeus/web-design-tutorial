import type { FC } from 'react';

interface HeaderProps {
  title?: string;
}

export const Header: FC<HeaderProps> = ({ title = 'Веб-учебник' }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          <nav className="flex space-x-4">
            {/* Здесь будут ссылки навигации */}
          </nav>
        </div>
      </div>
    </header>
  );
}; 