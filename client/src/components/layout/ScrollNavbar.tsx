import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Leaf, ShoppingCart, Home, MapPin, Package, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth';

interface ScrollNavbarProps {
  className?: string;
}

export const ScrollNavbar: React.FC<ScrollNavbarProps> = ({ className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      // Show navbar after scrolling 100px
      setIsVisible(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeMobileMenu();
  };

  const handleFindFarmsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const farmMapSection = document.querySelector('[data-section="farm-map"]');
    if (farmMapSection) {
      farmMapSection.scrollIntoView({ behavior: 'smooth' });
    }
    closeMobileMenu();
  };

  const handleProductsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      // Redirect to appropriate dashboard based on user role
      const user = useAuthStore.getState().user;
      if (user?.role === 'farmer') {
        navigate('/farmer/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } else {
      navigate('/auth');
    }
    closeMobileMenu();
  };

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/about');
    closeMobileMenu();
  };

  return (
    <>
      {/* Scroll-triggered Navbar */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        } ${className}`}
      >
        <nav className="bg-white shadow-lg border-b border-gray-200">
          <div className="container-custom">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-ink">HarvestLink</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                <button
                  onClick={handleHomeClick}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-500 transition-colors duration-200"
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </button>
                <button
                  onClick={handleFindFarmsClick}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-500 transition-colors duration-200"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Find Farms</span>
                </button>
                <button
                  onClick={handleProductsClick}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-500 transition-colors duration-200"
                >
                  <Package className="w-4 h-4" />
                  <span>Products</span>
                </button>
                <button
                  onClick={handleAboutClick}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-500 transition-colors duration-200"
                >
                  <Info className="w-4 h-4" />
                  <span>About</span>
                </button>
              </div>

              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/auth">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden transition-all duration-300 ${
              isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            } overflow-hidden`}
          >
            <div className="px-4 py-4 bg-gray-50 border-t border-gray-200">
              <div className="space-y-4">
                {/* Mobile Navigation Links */}
                <div className="space-y-2">
                  <button
                    onClick={handleHomeClick}
                    className="flex items-center space-x-3 w-full text-left px-3 py-2 text-gray-700 hover:text-primary-500 hover:bg-white rounded-lg transition-colors duration-200"
                  >
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </button>
                  <button
                    onClick={handleFindFarmsClick}
                    className="flex items-center space-x-3 w-full text-left px-3 py-2 text-gray-700 hover:text-primary-500 hover:bg-white rounded-lg transition-colors duration-200"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Find Farms</span>
                  </button>
                  <button
                    onClick={handleProductsClick}
                    className="flex items-center space-x-3 w-full text-left px-3 py-2 text-gray-700 hover:text-primary-500 hover:bg-white rounded-lg transition-colors duration-200"
                  >
                    <Package className="w-4 h-4" />
                    <span>Products</span>
                  </button>
                  <button
                    onClick={handleAboutClick}
                    className="flex items-center space-x-3 w-full text-left px-3 py-2 text-gray-700 hover:text-primary-500 hover:bg-white rounded-lg transition-colors duration-200"
                  >
                    <Info className="w-4 h-4" />
                    <span>About</span>
                  </button>
                </div>

                {/* Mobile Auth Buttons */}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <Link to="/auth" className="block" onClick={closeMobileMenu}>
                    <Button variant="outline" size="sm" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth" className="block" onClick={closeMobileMenu}>
                    <Button variant="primary" size="sm" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>

                {/* Role Selection */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">I want to:</p>
                  <div className="space-y-2">
                    <Link
                      to="/auth?role=farmer"
                      className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-primary-500 hover:bg-white rounded-lg transition-colors duration-200"
                      onClick={closeMobileMenu}
                    >
                      <Leaf className="w-4 h-4" />
                      <span>Sell as a Farmer</span>
                    </Link>
                    <Link
                      to="/auth?role=customer"
                      className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-primary-500 hover:bg-white rounded-lg transition-colors duration-200"
                      onClick={closeMobileMenu}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Buy as a Customer</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Spacer to prevent content jump when navbar appears */}
      <div className={`transition-all duration-300 ${isVisible ? 'h-16' : 'h-0'}`} />
    </>
  );
};
