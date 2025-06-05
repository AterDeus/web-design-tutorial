import type { FC } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';

interface HeaderProps {
  title?: string;
}

export const Header: FC<HeaderProps> = ({ title = 'Веб-учебник' }) => {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    navigate('/auth');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          <nav className="flex space-x-4 items-center">
            {user ? (
              <>
                <span className="text-gray-700 text-sm mr-2">{user.email}</span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Выйти
                </Button>
              </>
            ) : null}
          </nav>
        </div>
      </div>
    </header>
  );
}; 