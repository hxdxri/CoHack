import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/auth';
import { Layout } from '@/components/layout/Layout';
import { LoadingPage } from '@/components/ui/LoadingSpinner';

// Pages
import { Landing } from '@/pages/Landing';
import { About } from '@/pages/About';
import { Auth } from '@/pages/auth/Auth';


// Farmer Pages
import { FarmerDashboard } from '@/pages/farmer/Dashboard';
import { FarmerProducts } from '@/pages/farmer/Products';
import { FarmerProfile } from '@/pages/farmer/Profile';
import { OrderFulfillment } from '@/pages/farmer/OrderFulfillment';

// Customer Pages
import { CustomerDashboard } from '@/pages/customer/Dashboard';
import { CustomerProfile } from '@/pages/customer/Profile';
import { Farm } from '@/pages/customer/Farm';
import { PastOrders } from '@/pages/customer/PastOrders';
import { ProductListing } from '@/pages/customer/ProductListing';
import { Cart } from '@/pages/customer/Cart';
import { Checkout } from '@/pages/customer/Checkout';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'farmer' | 'customer';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
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
    return <Navigate to="/auth" replace />;
  }

  const redirectPath = user?.role === 'farmer' ? '/farmer/dashboard' : '/customer/dashboard';
  return <Navigate to={redirectPath} replace />;
};

// Import Messages component
import { Messages } from '@/pages/Messages';

// Placeholder components for routes still to be implemented

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
          <Route path="/about" element={<About />} />
          <Route 
            path="/auth" 
            element={
              isAuthenticated ? <DashboardRedirect /> : <Auth />
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
                    <Route path="orders" element={<OrderFulfillment />} />
                    <Route path="messages" element={<Messages />} />
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
                    <Route path="farm/:farmerId" element={<Farm />} />
                    <Route path="product/:productId" element={<ProductListing />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="checkout" element={<Checkout />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="profile" element={<CustomerProfile />} />
                    <Route path="orders" element={<PastOrders />} />
                  </Routes>
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
