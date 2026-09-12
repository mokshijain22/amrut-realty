import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import About from './pages/About';
import Vision from './pages/Vision';
import Gallery from './pages/Gallery';
import Legal from './pages/Legal';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminProperties from './pages/AdminProperties';
import AdminUsers from './pages/AdminUsers';

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <p style={{ textAlign: 'center', marginTop: 80 }}>Loading...</p>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/vision" element={<Vision />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute roles={['super_admin', 'sub_admin', 'executive']}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/properties"
            element={
              <PrivateRoute roles={['super_admin', 'sub_admin']}>
                <AdminProperties />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute roles={['super_admin']}>
                <AdminUsers />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}