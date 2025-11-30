import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import MarketplacePage from './pages/MarketplacePage';
import PropertyDetails from './pages/PropertyDetails';
import ProjectDetailPage from './pages/ProjectDetailPage';
import LandDetailPage from './pages/LandDetailPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/search-results" element={<MarketplacePage />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/project/:id" element={<ProjectDetailPage />} />
        <Route path="/land/:id" element={<LandDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
