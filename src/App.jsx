import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Employees from './pages/Employees';
import Evaluations from './pages/Evaluations';

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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
