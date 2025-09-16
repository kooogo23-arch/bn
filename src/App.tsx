import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { useAuth } from './hooks/useAuth';
import VersionWatcher from './components/VersionWatcher';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminRoute from './components/AdminRoute'; // Import AdminRoute
import './index.css';
// Lazy loading des pages pour améliorer les performances
const HomePage = lazy(() => import('./pages/HomePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const NewLoginPage = lazy(() => import('./pages/LoginPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const PostDetailPage = lazy(() => import('./pages/PostDetailPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="loading">Chargement de l'utilisateur...</div>;
  }

  // Optionally, you can add logic here to redirect based on user status
  // For example, if (!user) { navigate('/login'); }

  return (
    <div className="app-container">
      <Header />
      <main>
        <Suspense fallback={<div className="loading">Chargement...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/projets" element={<ProjectsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/produits" element={<ProductsPage />} />
            <Route
              path="/dashboard"
              element={
                <AdminRoute>
                  <DashboardPage />
                </AdminRoute>
              }
            />
            <Route path="/login" element={<NewLoginPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/order/:orderId" element={<OrderConfirmationPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:postSlug" element={<PostDetailPage />} />
            <Route path="/projets/:projectId" element={<ProjectDetailPage />} />
            <Route path="/politique-confidentialite" element={<PrivacyPolicyPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      {/* Surveille les nouvelles versions pour un rechargement doux */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, pointerEvents: 'none' }}>
        {/* The component renders a banner when update is ready */}
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <VersionWatcher />
      </div>
    </div>
  );
}

export default App;