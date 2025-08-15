import Link from 'next/link';
import { ReactNode } from 'react';

interface NavigationCardProps {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
  buttonText: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  className?: string;
}

/**
 * NavigationCard component for homepage and navigation sections
 * Provides consistent styling for navigation and feature cards
 */
export default function NavigationCard({ 
  title, 
  description, 
  href, 
  icon, 
  buttonText, 
  variant = 'primary',
  className = ''
}: NavigationCardProps) {
  const variantClasses = {
    primary: {
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      icon: 'bg-blue-100'
    },
    secondary: {
      button: 'bg-green-600 hover:bg-green-700 text-white',
      icon: 'bg-green-100'
    },
    tertiary: {
      button: 'bg-purple-600 hover:bg-purple-700 text-white',
      icon: 'bg-purple-100'
    }
  };

  const { button, icon: iconBg } = variantClasses[variant];

  return (
    <div className={`bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow text-center ${className}`}>
      <div className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
        {icon}
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <Link
        href={href}
        className={`inline-flex items-center px-6 py-3 rounded-md transition-colors ${button}`}
      >
        {buttonText}
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
