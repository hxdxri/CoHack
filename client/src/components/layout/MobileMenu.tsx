import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, MessageCircle, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * MobileMenu Component
 * 
 * Slide-out mobile navigation menu with role-based navigation links.
 * Includes backdrop and proper accessibility features.
 * 
 * @example
 * <MobileMenu
 *   isOpen={isMobileMenuOpen}
 *   onClose={() => setIsMobileMenuOpen(false)}
 * />
 */
export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { user, logout, isAuthenticated } = useAuthStore();

  // Handle escape key and body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleLinkClick = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div className="fixed inset-y-0 left-0 w-64 bg-bone shadow-xl transform transition-transform">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-ink">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 text-graphite hover:text-ink transition-colors duration-200"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full">
          {isAuthenticated ? (
            <>
              {/* User Info */}
              <div className="p-4 border-b border-gray-200">
                <p className="font-medium text-ink">{user?.name}</p>
                <p className="text-sm text-graphite capitalize">{user?.role}</p>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                {user?.role === 'farmer' ? (
                  <>
                    <Link
                      to="/farmer/dashboard"
                      onClick={handleLinkClick}
                      className="block px-3 py-2 text-ink hover:bg-primary-50 hover:text-primary-500 rounded-md transition-colors duration-200"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/farmer/products"
                      onClick={handleLinkClick}
                      className="block px-3 py-2 text-ink hover:bg-primary-50 hover:text-primary-500 rounded-md transition-colors duration-200"
                    >
                      Products
                    </Link>
                    <Link
                      to="/farmer/profile"
                      onClick={handleLinkClick}
                      className="block px-3 py-2 text-ink hover:bg-primary-50 hover:text-primary-500 rounded-md transition-colors duration-200"
                    >
                      Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/customer/dashboard"
                      onClick={handleLinkClick}
                      className="block px-3 py-2 text-ink hover:bg-primary-50 hover:text-primary-500 rounded-md transition-colors duration-200"
                    >
                      Browse Products
                    </Link>
                    <Link
                      to="/customer/reviews"
                      onClick={handleLinkClick}
                      className="block px-3 py-2 text-ink hover:bg-primary-50 hover:text-primary-500 rounded-md transition-colors duration-200"
                    >
                      My Reviews
                    </Link>
                  </>
                )}
                
                <Link
                  to={user?.role === 'farmer' ? '/farmer/messages' : '/customer/messages'}
                  onClick={handleLinkClick}
                  className="flex items-center space-x-2 px-3 py-2 text-ink hover:bg-primary-50 hover:text-primary-500 rounded-md transition-colors duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Messages</span>
                </Link>
              </nav>

              {/* Bottom Actions */}
              <div className="p-4 border-t border-gray-200 space-y-2">
                <Link
                  to={user?.role === 'farmer' ? '/farmer/profile' : '/customer/profile'}
                  onClick={handleLinkClick}
                  className="flex items-center space-x-2 px-3 py-2 text-ink hover:bg-gray-50 rounded-md transition-colors duration-200"
                >
                  <User className="w-4 h-4" />
                  <span>Profile Settings</span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-danger hover:bg-red-50 rounded-md transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <div className="p-4">
              <p className="text-graphite mb-4">Please log in to access your account.</p>
              <div className="space-y-2">
                <Link
                  to="/auth"
                  onClick={handleLinkClick}
                  className="block w-full px-4 py-2 text-center bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/auth"
                  onClick={handleLinkClick}
                  className="block w-full px-4 py-2 text-center border border-primary-500 text-primary-500 rounded-md hover:bg-primary-50 transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
