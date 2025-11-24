import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Employees from './pages/Employees';
import Evaluations from './pages/Evaluations';
import Clubs from './pages/Clubs';
import ClubDetail from './pages/ClubDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="employees" element={<Employees />} />
          <Route path="evaluations" element={<Evaluations />} />
          <Route path="clubs" element={<Clubs />} />
          <Route path="clubs/:id" element={<ClubDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
