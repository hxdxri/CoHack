import React, { useState } from 'react';
import { Header } from './Header';
import { MobileMenu } from './MobileMenu';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Layout Component
 * 
 * Main layout wrapper that includes header, mobile menu, and content area.
 * Provides consistent structure across all pages.
 * 
 * @example
 * <Layout>
 *   <Dashboard />
 * </Layout>
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-mist">
      <Header onMenuToggle={handleMenuToggle} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={handleMenuClose} />
      
      <main className="relative">
        {children}
      </main>
    </div>
  );
};
