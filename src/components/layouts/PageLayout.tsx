import React from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';

interface BreadcrumbItem {
  label: string;
  href: string;
  active: boolean;
}

interface PageLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

/**
 * Universal page layout component
 * Provides consistent structure with optional breadcrumbs and standard container width
 */
export default function PageLayout({ 
  children, 
  breadcrumbs, 
  className = "max-w-7xl mx-auto py-6 sm:px-6 lg:px-8" 
}: PageLayoutProps) {
  return (
    <div className={className}>
      <div className="px-4 py-6 sm:px-0">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
