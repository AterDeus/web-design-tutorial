import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './components/DashboardLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout>Главная страница</DashboardLayout>} />
        {/* Здесь будут добавлены другие маршруты */}
      </Routes>
    </Router>
  );
}

export default App;
