import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Card Component
 * 
 * A flexible card container with consistent styling and optional hover effects.
 * Uses HarvestLink design system with proper shadows and border radius.
 * 
 * @example
 * // Basic card
 * <Card>
 *   <h3>Card Title</h3>
 *   <p>Card content goes here...</p>
 * </Card>
 * 
 * @example
 * // Card with hover effect
 * <Card hover>
 *   <ProductItem product={product} />
 * </Card>
 * 
 * @example
 * // Card with custom padding
 * <Card padding="lg">
 *   <DetailedContent />
 * </Card>
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
}) => {
  const baseClasses = 'bg-bone rounded-card border border-gray-100';
  const shadowClasses = hover ? 'shadow-card hover:shadow-lg transition-shadow duration-200' : 'shadow-card';
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const classes = `${baseClasses} ${shadowClasses} ${paddingClasses[padding]} ${className}`;

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * CardHeader Component
 * 
 * Header section for cards with consistent spacing and typography.
 * 
 * @example
 * <Card>
 *   <CardHeader>
 *     <h2>Product Details</h2>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Product information...</p>
 *   </CardContent>
 * </Card>
 */
export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * CardContent Component
 * 
 * Main content area for cards with proper spacing.
 */
export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * CardFooter Component
 * 
 * Footer section for cards, typically used for actions or metadata.
 */
export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`mt-4 pt-4 border-t border-gray-100 ${className}`}>
      {children}
    </div>
  );
};
