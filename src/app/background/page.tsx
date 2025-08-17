import Link from 'next/link';
import PageTitle from '@/components/ui/PageTitle';
import PageLayout from '@/components/layouts/PageLayout';
import UnifiedList from '@/components/ui/UnifiedList';
import { getBackgroundContent } from '@/lib/unified-data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Background | D. Warner North | NorthWorks',
  description: 'Background information, education, and biographical details about D. Warner North, renowned expert in risk analysis and decision science.',
  keywords: ['D. Warner North biography', 'risk analysis expert', 'decision science', 'education', 'professional background', 'career history'],
  openGraph: {
    title: 'Background | D. Warner North | NorthWorks',
    description: 'Background information and biographical details about D. Warner North, expert in risk analysis and decision science.',
    type: 'website',
    siteName: 'NorthWorks'
  }
};

export default function BackgroundIndexPage() {
  // Load normalized background content data
  const backgroundContent = getBackgroundContent();

  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'Warner', href: '/warner', active: false },
    { label: 'Background', href: '/background', active: true }
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <PageTitle 
        title="Background"
        description="Education, biographical information, and professional credentials"
        align="left"
        size="medium"
      />
        
      <UnifiedList 
        items={backgroundContent}
        options={{
          layout: 'list',
          searchable: true,
          filterable: true,
          sortBy: 'date',
          pagination: true,
          groupBy: 'category'
        }}
      />
        
      <div className="mt-12 pt-8 border-t border-gray-200">
        <Link
          href="/warner"
          className="inline-flex items-center text-sky-600 hover:text-sky-800 transition-colors"
        >
          ← Back to D. Warner North
        </Link>
      </div>
    </PageLayout>
  );
}
