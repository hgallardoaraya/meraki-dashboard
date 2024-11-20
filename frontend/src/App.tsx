import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/layout';
import AddBillPage from './pages/add-bill-page';
import StatisticsPage from './pages/statistics-page';
import HomePage from './pages/home-page';
import BillListPage from './pages/bill-list-page';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />          
          {/* GASTOS */}
          <Route path="/gastos/ingresar" element={<AddBillPage />} />
          <Route path="/gastos/listar" element={<BillListPage />} />
          {/* ESTADISTICAS */}
          <Route path="/estadisticas" element={<StatisticsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
