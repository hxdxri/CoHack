import React from 'react';

interface ProfileLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen relative ${className}`}>
      {/* Seamless Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'url(/farm-pattern.svg)',
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
