import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { LessonPage } from './pages/LessonPage';
import { ProgressPage } from './pages/ProgressPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPanel } from './components/AdminPanel';
import { EditLessonPage } from './pages/EditLessonPage';
import { ProtectedRouteLayout } from './components/ProtectedRouteLayout';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/"
          element={
            <ProtectedRouteLayout>
              <DashboardPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path="/lesson/:id"
          element={
            <ProtectedRouteLayout>
              <LessonPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRouteLayout>
              <ProgressPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRouteLayout>
              <ProfilePage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRouteLayout>
              <AdminPanel />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path="/admin/lesson/:id"
          element={
            <ProtectedRouteLayout>
              <EditLessonPage />
            </ProtectedRouteLayout>
          }
        />
        <Route
          path="/admin/lesson/new"
          element={
            <ProtectedRouteLayout>
              <EditLessonPage />
            </ProtectedRouteLayout>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
