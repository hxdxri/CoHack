import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, User, LogOut, Menu } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/Button';
import { CartIcon } from '@/components/ui/CartIcon';

interface HeaderProps {
  onMenuToggle?: () => void;
}

/**
 * Header Component
 * 
 * Main navigation header with logo, navigation links, and user menu.
 * Responsive design with mobile menu toggle.
 * 
 * @example
 * <Header onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
 */
export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-bone border-b border-gray-200 sticky top-0 z-40">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            {onMenuToggle && (
              <button
                onClick={onMenuToggle}
                className="md:hidden p-2 text-graphite hover:text-primary-500 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            
            <Link to="/" className="flex items-center space-x-2 ml-2 md:ml-0">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient-primary">
                HarvestLink
              </span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-8">
              {user?.role === 'farmer' ? (
                <>
                  <Link to="/farmer/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                  <Link to="/farmer/products" className="nav-link">
                    Products
                  </Link>
                  <Link to="/farmer/orders" className="nav-link">
                    Orders
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/customer/dashboard" className="nav-link">
                    Browse
                  </Link>
                  <Link to="/customer/orders" className="nav-link">
                    Past Orders
                  </Link>
                </>
              )}
              <Link 
                to={user?.role === 'farmer' ? '/farmer/messages' : '/customer/messages'} 
                className="nav-link"
              >
                Messages
              </Link>
              {user?.role === 'customer' && <CartIcon />}
            </nav>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-ink">{user?.name}</p>
                  <p className="text-xs text-graphite capitalize">{user?.role}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Link
                    to={user?.role === 'farmer' ? '/farmer/profile' : '/customer/profile'}
                    className="p-2 text-graphite hover:text-primary-500 transition-colors duration-200"
                    aria-label="Profile"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="p-2 text-graphite hover:text-danger transition-colors duration-200"
                    aria-label="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
