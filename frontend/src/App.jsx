import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ChildInterface from './pages/ChildInterface.jsx';
import ChildProfile from './pages/ChildProfile.jsx';
import Reports from './pages/Reports.jsx';
import Settings from './pages/Settings.jsx';
import Sobre from './pages/Sobre.jsx';

function PrivateRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-neutral-500 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  return token ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) return null;

  return !token ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas públicas */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/registro"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Interface da criança - sem layout de pais */}
          <Route
            path="/crianca/:id"
            element={
              <PrivateRoute>
                <ChildInterface />
              </PrivateRoute>
            }
          />

          {/* Rotas protegidas com layout */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="criancas/nova" element={<ChildProfile />} />
            <Route path="criancas/:id/editar" element={<ChildProfile />} />
            <Route path="relatorios" element={<Reports />} />
            <Route path="relatorios/:criancaId" element={<Reports />} />
            <Route path="configuracoes" element={<Settings />} />
            <Route path="sobre" element={<Sobre />} />
          </Route>

          {/* Página Sobre acessível sem autenticação também */}
          <Route path="/sobre-publica" element={<Sobre />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
