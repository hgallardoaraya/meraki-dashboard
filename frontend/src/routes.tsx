import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/layout';
import AddBillPage from './pages/add-bill-page';
import StatisticsPage from './pages/statistics-page';
import BillListPage from './pages/bill-list-page';
import LocalesMaintainerPage from './pages/locales-maintainer-page';
import CategoriesMaintainerPage from './pages/categories-maintainer-page';
import TypesMaintainerPage from './pages/types-maintainer-page';
import ProvidersMaintainerPage from './pages/providers-maintainer-page';
import LoginPage from './pages/login-page';
import ProtectedRoute from './components/auth/protected-route';
import UnauthorizedPage from './pages/unauthorized-page';
import SaleListPage from './pages/sale-list-page';
import SettingsPage from './pages/settings-page';
import { useEffect } from 'react';
import { AuthState, setFudoToken } from './auth/authSlice';
import { decodeToken } from './helpers/token';
import { getJWT } from './components/statistics/fudo-service';
import { useDispatch, useSelector } from 'react-redux';

export const AppRoutes = () => {
  const authState = useSelector((state: { auth: AuthState }) => state.auth);
  const dispatch = useDispatch();

  const getJWTWrapper = async () => {
    try{
      const jwt = await getJWT();
      return jwt;
    } catch(error) {
      return;
    }
    
  }

  useEffect(() => {
    const fetchToken = async () => {
      let fudoToken = authState.fudoToken;
      let decodedToken = decodeToken(fudoToken || "");
      
      if (fudoToken == null || !decodedToken || !decodedToken.exp || decodedToken.exp > Date.now()) {
        const jwt = await getJWTWrapper(); 
        if (jwt) {
          dispatch(setFudoToken(jwt));  
        }
      }
    };

    fetchToken();
  }, [])

  return (
    <Router>
      <Layout>
        <Routes>            
        {/* ESTADISTICAS */}
        <Route path="/" element={<ProtectedRoute allowedRoles={['ADMIN']}><StatisticsPage /></ProtectedRoute>} />
        {/* GASTOS */}
        <Route path="/gastos/ingresar" element={<ProtectedRoute allowedRoles={['ADMIN']}><AddBillPage /></ProtectedRoute>} />
        <Route path="/gastos/listar" element={<ProtectedRoute allowedRoles={['ADMIN']}><BillListPage /></ProtectedRoute>} />
        {/* MANTENEDORES */}
        <Route path="/mantenedores/proveedores" element={<ProtectedRoute allowedRoles={['ADMIN']}><ProvidersMaintainerPage /></ProtectedRoute>} />
        <Route path="/mantenedores/locales" element={<ProtectedRoute allowedRoles={['ADMIN']}><LocalesMaintainerPage /></ProtectedRoute>} />
        <Route path="/mantenedores/categorias" element={<ProtectedRoute allowedRoles={['ADMIN']}><CategoriesMaintainerPage /></ProtectedRoute>} />
        <Route path="/mantenedores/tipos" element={<ProtectedRoute allowedRoles={['ADMIN']}><TypesMaintainerPage /></ProtectedRoute>} />
        {/* VENTAS */}
        <Route path="/ventas/listar" element={<ProtectedRoute allowedRoles={['ADMIN']}><SaleListPage /></ProtectedRoute>} />                        
        {/* CONFIGURACIONES */}
        <Route path="/configuraciones" element={<ProtectedRoute allowedRoles={['ADMIN']}><SettingsPage /></ProtectedRoute>} />                        
        {/* LOGIN */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}