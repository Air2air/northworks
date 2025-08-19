import Link from 'next/link';
import PageTitle from '@/components/ui/PageTitle';
import PageLayout from '@/components/layouts/PageLayout';
import UnifiedList from '@/components/ui/UnifiedList';
import { getProfessionalContent } from '@/lib/unified-data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Professional Experience | D. Warner North | NorthWorks',
  description: 'Professional work and consulting experience of D. Warner North in risk analysis, decision analysis, and capital expenditure analysis.',
  keywords: ['risk analysis', 'decision analysis', 'capital expenditure analysis', 'consulting', 'D. Warner North', 'professional experience'],
  openGraph: {
    title: 'Professional Experience | D. Warner North | NorthWorks',
    description: 'Professional work and consulting experience of D. Warner North in risk analysis and decision analysis.',
    type: 'website',
    siteName: 'NorthWorks'
  }
};

export default function ProfessionalIndexPage() {
  // Load normalized professional content data
  const professionalContent = getProfessionalContent();

  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: false },
    { label: 'Professional Experience', href: '/professional', active: true }
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <PageTitle 
        title="Professional Experience"
        description="Career history and professional accomplishments"
        align="left"
        size="medium"
      />
        
      <UnifiedList 
        items={professionalContent}
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
