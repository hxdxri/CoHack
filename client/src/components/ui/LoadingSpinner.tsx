import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * LoadingSpinner Component
 * 
 * A simple loading spinner with multiple sizes.
 * Uses HarvestLink primary color for consistency.
 * 
 * @example
 * // Default spinner
 * <LoadingSpinner />
 * 
 * @example
 * // Large spinner for page loading
 * <LoadingSpinner size="lg" />
 * 
 * @example
 * // Small spinner for buttons
 * <LoadingSpinner size="sm" />
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const classes = `spinner ${sizeClasses[size]} ${className}`;

  return (
    <div className={classes} role="status" aria-label="Loading">
      <span className="sr-only">Loading...</span>
    </div>
  );
};

interface LoadingPageProps {
  message?: string;
}

/**
 * LoadingPage Component
 * 
 * A full-page loading state with spinner and optional message.
 * 
 * @example
 * <LoadingPage message="Loading your dashboard..." />
 */
export const LoadingPage: React.FC<LoadingPageProps> = ({
  message = 'Loading...',
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-mist">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-graphite text-lg">{message}</p>
      </div>
    </div>
  );
};
