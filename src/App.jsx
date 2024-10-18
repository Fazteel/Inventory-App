import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css';
import Layouts from './layouts/Layouts'
import Dashboard from './pages/Dashboard'
import UserManagement from './pages/UserManagement'
import ProductManagement from './pages/ProductManagement'
import TransactionManagement from './pages/TransactionManagement'
import ReportProducts from './pages/ReportsProducts';
import ReportTransactions from './pages/ReportsTransactions';
import Settings from './pages/Settings'
import AuthForm from './pages/AuthForm'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layouts />}>
          <Route index element={<Dashboard />} />
          <Route path='users' element={<UserManagement />} />
          <Route path='products' element={<ProductManagement />} />
          <Route path='transactions' element={<TransactionManagement />} />
          <Route path='reports'>
            <Route path='products' element={<ReportProducts />} />
            <Route path='transactions' element={<ReportTransactions />} />
          </Route>
          <Route path='settings' element={<Settings />} />
        </Route>
        <Route path='auth' element={<AuthForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
