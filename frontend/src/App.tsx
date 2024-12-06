import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/layout';
import AddBillPage from './pages/add-bill-page';
import StatisticsPage from './pages/statistics-page';
import HomePage from './pages/home-page';
import BillListPage from './pages/bill-list-page';
import LocalesMaintainerPage from './pages/locales-maintainer-page';
import CategoriesMaintainerPage from './pages/categories-maintainer-page';
import TypesMaintainerPage from './pages/types-maintainer-page';
import ProvidersMaintainerPage from './pages/providers-maintainer-page';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />          
          {/* GASTOS */}
          <Route path="/gastos/ingresar" element={<AddBillPage />} />
          <Route path="/gastos/listar" element={<BillListPage />} />
          {/* MANTENEDORES */}
          <Route path="/mantenedores/proveedores" element={<ProvidersMaintainerPage />} />
          <Route path="/mantenedores/locales" element={<LocalesMaintainerPage />} />
          <Route path="/mantenedores/categorias" element={<CategoriesMaintainerPage />} />
          <Route path="/mantenedores/tipos" element={<TypesMaintainerPage />} />
          {/* ESTADISTICAS */}
          <Route path="/estadisticas" element={<StatisticsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
