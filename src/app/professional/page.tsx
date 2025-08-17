import Link from 'next/link';
import PageTitle from '@/components/ui/PageTitle';
import PageLayout from '@/components/layouts/PageLayout';
import ContentList from '@/components/ui/ContentList';
import { getAllContentSlugs, getContentBySlug } from '@/lib/content';
import { ProfessionalFrontmatter } from '@/types/content';
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
  const slugs = getAllContentSlugs();
  
  // Filter for professional content only and convert to ContentList format
  const professionalContent = slugs
    .map(slug => {
      const content = getContentBySlug(slug, false);
      if (content?.frontmatter.type === 'professional') {
        return {
          slug,
          frontmatter: {
            title: content.frontmatter.title,
            description: (content.frontmatter as any).description || '',
            date: (content.frontmatter as any).date || ''
          }
        };
      }
      return null;
    })
    .filter(Boolean);

  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
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
        
      <ContentList 
        items={professionalContent as any}
        baseUrl="/professional"
        emptyMessage="No professional experience content available."
        layout="list"
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
