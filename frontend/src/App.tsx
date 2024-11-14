import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/layout';
import Home from './pages/home';
import About from './pages/about';
import Contact from './pages/contact';
import BillsPage from './pages/bills-page';
import StatisticsPage from './pages/statistics-page';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gastos" element={<BillsPage />} />
          <Route path="/estadisticas" element={<StatisticsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
