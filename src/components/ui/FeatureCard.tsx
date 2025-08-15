import Link from 'next/link';
import { ReactNode } from 'react';

interface FeatureCardProps {
  title: string;
  description?: string;
  content?: ReactNode;
  href?: string;
  interactive?: boolean;
  className?: string;
}

/**
 * FeatureCard component for project displays and feature sections
 * Simple card with optional interactivity
 */
export default function FeatureCard({ 
  title, 
  description, 
  content, 
  href,
  interactive = false,
  className = ''
}: FeatureCardProps) {
  const cardContent = (
    <div className={`bg-white rounded-lg shadow-md p-6 ${interactive ? 'hover:shadow-lg transition-shadow' : ''} ${className}`}>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      {description && (
        <p className="text-gray-600 mb-4">{description}</p>
      )}
      {content}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
