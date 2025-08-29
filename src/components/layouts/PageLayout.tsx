import React from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { PageLayoutProps } from '@/types';

/**
 * Simple page layout component with breadcrumbs
 * Use this for basic pages that don't need complex content handling
 */
export default function PageLayout({ 
  breadcrumbs, 
  children, 
  className = 'max-w-4xl mx-auto px-4 py-8' 
}: PageLayoutProps) {
  return (
    <div className={className}>
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
