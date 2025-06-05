import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './components/DashboardLayout';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { PrivateRoute } from './components/PrivateRoute';
import { LessonPage } from './pages/LessonPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/lesson/:id"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <LessonPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
