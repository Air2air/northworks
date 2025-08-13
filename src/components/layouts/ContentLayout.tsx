import { ContentFrontmatter } from '@/types/content';
import Navigation from '@/components/Navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ReactNode } from 'react';

interface ContentLayoutProps {
  frontmatter: ContentFrontmatter;
  children: ReactNode;
  showBreadcrumbs?: boolean;
}

export default function ContentLayout({ 
  frontmatter, 
  children, 
  showBreadcrumbs = true 
}: ContentLayoutProps) {
  const defaultNavigation = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: false },
    { label: 'Cheryl North', href: '/cheryl', active: false },
    { label: 'Contact', href: '/contact', active: false }
  ];

  const navigation = (frontmatter as any).navigation || defaultNavigation;
  const breadcrumbs = (frontmatter as any).breadcrumbs;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation items={navigation} />

      {/* Breadcrumbs */}
      {showBreadcrumbs && breadcrumbs && (
        <Breadcrumbs items={breadcrumbs} />
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2025 NorthWorks. All rights reserved.</p>
            <p className="mt-2">
              Risk Analysis Consultants and Classical Music Journalism
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
