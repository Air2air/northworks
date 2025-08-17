import Link from 'next/link';
import PageTitle from '@/components/ui/PageTitle';
import PageLayout from '@/components/layouts/PageLayout';
import ContentList from '@/components/ui/ContentList';
import { getAllContentSlugs, getContentBySlug } from '@/lib/content';
import { PublicationFrontmatter } from '@/types/content';
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
  const slugs = getAllContentSlugs();
  
  // Filter for publication content only and convert to ContentList format
  const publicationContent = slugs
    .map(slug => {
      const content = getContentBySlug(slug, false);
      if (content?.frontmatter.type === 'publication') {
        return {
          slug,
          frontmatter: {
            title: content.frontmatter.title,
            description: (content.frontmatter as any).description || '',
            date: (content.frontmatter as any).publication?.date || ''
          }
        };
      }
      return null;
    })
    .filter(Boolean);

  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
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
        
      <ContentList 
        items={publicationContent as any}
        baseUrl="/publications"
        emptyMessage="No publications available."
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
