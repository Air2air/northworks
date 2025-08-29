import React from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { PageLayoutProps } from '@/types';

/**
 * Basic page layout component with breadcrumbs
 */
export default function PageLayout({ 
  breadcrumbs, 
  children, 
  className = '' 
}: PageLayoutProps) {
  return (
    <div className={`max-w-4xl mx-auto px-4 py-8 ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      )}
      
      <main>
        {children}
      </main>
    </div>
  );
}
