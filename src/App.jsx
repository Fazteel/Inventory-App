import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';
import Layouts from './layouts/Layouts';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import RolesManagement from './pages/RolesManagement';
import ProductManagement from './pages/ProductManagement';
import TransactionManagement from './pages/TransactionManagement';
import ReportProducts from './pages/ReportsProducts';
import ReportTransactions from './pages/ReportsTransactions';
import SupplierManagement from './pages/SupplierManagement';
import Settings from './pages/Settings';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
  const token = localStorage.getItem('token'); 

  return (
    <BrowserRouter>
      <Routes>
        {!token ? (
          <Route path="*" element={<Navigate to="/login" replace />} />
        ) : (
          <Route path="*" element={<Navigate to="/" replace />} />
        )}

        <Route path="/login" element={<Login />} />

        <Route path="/" element={<ProtectedRoute><Layouts /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="users">
            <Route path='users' element={<UserManagement/>} />
            <Route path='roles' element={<RolesManagement/>} />
          </Route>
          <Route path="products">
            <Route path="products" element={<ProductManagement />} />
            <Route path="suppliers" element={<SupplierManagement />} />
          </Route>
          <Route path="transactions" element={<TransactionManagement />} />
          <Route path="reports">
            <Route path="products" element={<ReportProducts />} />
            <Route path="transactions" element={<ReportTransactions />} />
          </Route>
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
