import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';
import Layouts from './layouts/Layouts';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import ProductManagement from './pages/ProductManagement';
import TransactionManagement from './pages/TransactionManagement';
import ReportProducts from './pages/ReportsProducts';
import ReportTransactions from './pages/ReportsTransactions';
import SupplierManagement from './pages/SupplierManagement';
import Settings from './pages/Settings';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

function App() {
  const token = localStorage.getItem('token'); // Cek apakah user sudah login

  return (
    <BrowserRouter>
      <Routes>
        {/* Jika belum login, arahkan ke halaman login */}
        {!token ? (
          <Route path="*" element={<Navigate to="/login" replace />} />
        ) : (
          <Route path="*" element={<Navigate to="/" replace />} />
        )}

        {/* Route untuk halaman login */}
        <Route path="/login" element={<Login />} />

        {/* Proteksi rute-rute lain dengan ProtectedRoute */}
        <Route path="/" element={<ProtectedRoute><Layouts /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
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
