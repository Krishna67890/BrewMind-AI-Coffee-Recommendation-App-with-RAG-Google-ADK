import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AIConcierge from './pages/AIConcierge';
import Menu from './pages/Menu';
import TasteProfile from './pages/TasteProfile';
import SmartOrder from './pages/SmartOrder';
import Technology from './pages/Technology';
import About from './pages/About';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/concierge" element={<AIConcierge />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/profile" element={<TasteProfile />} />
          <Route path="/order" element={<SmartOrder />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
