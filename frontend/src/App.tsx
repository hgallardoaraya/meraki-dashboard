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
import LoginPage from './pages/login-page';
import ProtectedRoute from './components/auth/protected-route';
import UnauthorizedPage from './pages/unauthorized-page';
import { Provider } from 'react-redux';
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import SaleListPage from './pages/sale-list-page';
import UsersMaintainerPage from './pages/users-maintainer-page';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<ProtectedRoute allowedRoles={['ADMIN']}><HomePage /></ProtectedRoute>} />
              {/* GASTOS */}
              <Route path="/gastos/ingresar" element={<ProtectedRoute allowedRoles={['ADMIN']}><AddBillPage /></ProtectedRoute>} />
              <Route path="/gastos/listar" element={<ProtectedRoute allowedRoles={['ADMIN']}><BillListPage /></ProtectedRoute>} />
              {/* MANTENEDORES */}
              <Route path="/mantenedores/proveedores" element={<ProtectedRoute allowedRoles={['ADMIN']}><ProvidersMaintainerPage /></ProtectedRoute>} />
              <Route path="/mantenedores/locales" element={<ProtectedRoute allowedRoles={['ADMIN']}><LocalesMaintainerPage /></ProtectedRoute>} />
              <Route path="/mantenedores/categorias" element={<ProtectedRoute allowedRoles={['ADMIN']}><CategoriesMaintainerPage /></ProtectedRoute>} />
              <Route path="/mantenedores/tipos" element={<ProtectedRoute allowedRoles={['ADMIN']}><TypesMaintainerPage /></ProtectedRoute>} />
              <Route path="/mantenedores/usuarios" element={<ProtectedRoute allowedRoles={['ADMIN']}><UsersMaintainerPage /></ProtectedRoute>} />
              {/* VENTAS */}
              <Route path="/ventas/listar" element={<ProtectedRoute allowedRoles={['ADMIN']}><SaleListPage /></ProtectedRoute>} />
              {/* ESTADISTICAS */}
              <Route path="/estadisticas" element={<ProtectedRoute allowedRoles={['ADMIN']}><StatisticsPage /></ProtectedRoute>} />
              {/* LOGIN */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
            </Routes>
          </Layout>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
