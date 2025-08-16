import { ReactNode } from 'react';

interface InfoCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  shadow?: 'sm' | 'md' | 'lg';
  padding?: 'sm' | 'md' | 'lg';
  centered?: boolean;
}

/**
 * InfoCard component for contact information and static content
 * Flexible card with configurable styling options
 */
export default function InfoCard({ 
  title, 
  children, 
  className = '', 
  shadow = 'lg',
  padding = 'lg',
  centered = false
}: InfoCardProps) {
  const shadowStyles = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };

  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={`bg-white rounded-lg ${shadowStyles[shadow]} ${paddingStyles[padding]} ${centered ? 'text-center' : ''} ${className}`}>
      {title && (
        <h3 className="text-xl font-semibold text-sky-900 mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
}
