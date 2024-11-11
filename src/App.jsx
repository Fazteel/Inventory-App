import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './server/contexts/authContext';
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
import SetNewPasswordForm from './pages/SetNewPasswordForm';
import ChangePasswordForm from './pages/ChangePasswordForm';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/set-password" element={<SetNewPasswordForm />} />

          <Route path="/" element={<ProtectedRoute><Layouts /></ProtectedRoute>}>
            <Route index element={<Dashboard />} /> 

            <Route path="users">
              <Route path='users' element={<ProtectedRoute requiredPermission="read:users"><UserManagement /></ProtectedRoute>} />
              <Route path='roles' element={<ProtectedRoute requiredPermission="read:roles"><RolesManagement /></ProtectedRoute>} />
            </Route>

            <Route path="products">
              <Route path="products" element={<ProtectedRoute requiredPermission="read:products"><ProductManagement /></ProtectedRoute>} />
              <Route path="suppliers" element={<ProtectedRoute requiredPermission="read:suppliers"><SupplierManagement /></ProtectedRoute>} />
            </Route>

            <Route path="transactions" element={<ProtectedRoute requiredPermission="read:transactions"><TransactionManagement /></ProtectedRoute>} />
            <Route path="reports">
              <Route path="products" element={<ProtectedRoute requiredPermission="reports:products"><ReportProducts /></ProtectedRoute>} />
              <Route path="transactions" element={<ProtectedRoute requiredPermission="reports:transactions"><ReportTransactions /></ProtectedRoute>} />
            </Route>
            <Route path="settings" element={<ProtectedRoute requiredPermission="read:settings"><Settings /></ProtectedRoute>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
