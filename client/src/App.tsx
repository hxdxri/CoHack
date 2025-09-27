import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/auth';
import { Layout } from '@/components/layout/Layout';
import { LoadingPage } from '@/components/ui/LoadingSpinner';

// Pages
import { Landing } from '@/pages/Landing';
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';

// Farmer Pages
import { FarmerDashboard } from '@/pages/farmer/Dashboard';
import { FarmerProducts } from '@/pages/farmer/Products';
import { FarmerProfile } from '@/pages/farmer/Profile';

// Customer Pages
import { CustomerDashboard } from '@/pages/customer/Dashboard';
import { CustomerFarmers } from '@/pages/customer/Farmers';
import { CustomerProfile } from '@/pages/customer/Profile';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'farmer' | 'customer';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath = user?.role === 'farmer' ? '/farmer/dashboard' : '/customer/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

// Dashboard Redirect Component
const DashboardRedirect: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const redirectPath = user?.role === 'farmer' ? '/farmer/dashboard' : '/customer/dashboard';
  return <Navigate to={redirectPath} replace />;
};

// Placeholder components for routes still to be implemented
const CustomerReviews = () => <div className="p-8"><h1>My Reviews (Coming Soon)</h1></div>;
const Messages = () => <div className="p-8"><h1>Messages (Coming Soon)</h1></div>;

function App() {
  const { checkAuth, isAuthenticated } = useAuthStore();
  const [isInitialized, setIsInitialized] = React.useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
      setIsInitialized(true);
    };

    initializeAuth();
  }, [checkAuth]);

  if (!isInitialized) {
    return <LoadingPage message="Initializing HarvestLink..." />;
  }

  return (
    <Router>
      <div className="App">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#FFFFFF',
              color: '#1F2937',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
            },
            success: {
              iconTheme: {
                primary: '#16A34A',
                secondary: '#FFFFFF',
              },
            },
            error: {
              iconTheme: {
                primary: '#DC2626',
                secondary: '#FFFFFF',
              },
            },
          }}
        />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <DashboardRedirect /> : <Login />
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? <DashboardRedirect /> : <Register />
            } 
          />

          {/* Dashboard Redirect */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            } 
          />

          {/* Protected Routes with Layout */}
          <Route 
            path="/farmer/*" 
            element={
              <ProtectedRoute requiredRole="farmer">
                <Layout>
                  <Routes>
                    <Route path="dashboard" element={<FarmerDashboard />} />
                    <Route path="products" element={<FarmerProducts />} />
                    <Route path="profile" element={<FarmerProfile />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/customer/*" 
            element={
              <ProtectedRoute requiredRole="customer">
                <Layout>
                  <Routes>
                    <Route path="dashboard" element={<CustomerDashboard />} />
                    <Route path="farmers" element={<CustomerFarmers />} />
                    <Route path="profile" element={<CustomerProfile />} />
                    <Route path="reviews" element={<CustomerReviews />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Shared Protected Routes */}
          <Route 
            path="/messages" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Messages />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Public Farmer Profile Route */}
          <Route 
            path="/farmer-profile/:id" 
            element={
              <ProtectedRoute>
                <Layout>
                  <FarmerProfile />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
