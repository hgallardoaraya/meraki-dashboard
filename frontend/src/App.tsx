import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/layout';
import BillsPage from './pages/bills-page';
import StatisticsPage from './pages/statistics-page';
import HomePage from './pages/home-page';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gastos" element={<BillsPage />} />
          <Route path="/gastos/ingresar" element={<BillsPage />} />
          <Route path="/estadisticas" element={<StatisticsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
