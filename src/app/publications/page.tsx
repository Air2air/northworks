import Link from 'next/link';
import PageTitle from '@/components/ui/PageTitle';
import PageLayout from '@/components/layouts/PageLayout';
import UnifiedList from '@/components/ui/UnifiedList';
import { getPublicationContent } from '@/lib/unified-data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Publications | D. Warner North | NorthWorks',
  description: 'Academic publications and research papers by D. Warner North on risk analysis, decision science, and related fields.',
  keywords: ['academic publications', 'research papers', 'risk analysis publications', 'decision science', 'D. Warner North', 'scholarly articles'],
  openGraph: {
    title: 'Publications | D. Warner North | NorthWorks',
    description: 'Academic publications and research papers by D. Warner North on risk analysis and decision science.',
    type: 'website',
    siteName: 'NorthWorks'
  }
};

export default function PublicationsIndexPage() {
  // Load normalized publication content data
  const publicationContent = getPublicationContent();

  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'Warner', href: '/warner', active: false },
    { label: 'Publications', href: '/publications', active: true }
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <PageTitle 
        title="Publications"
        description="Research publications, reports, and written works"
        align="left"
        size="medium"
      />
        
      <UnifiedList 
        items={publicationContent}
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
