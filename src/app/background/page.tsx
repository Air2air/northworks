import Link from 'next/link';
import PageTitle from '@/components/ui/PageTitle';
import PageLayout from '@/components/layouts/PageLayout';
import ContentList from '@/components/ui/ContentList';
import { getAllContentSlugs, getContentBySlug } from '@/lib/content';
import { BackgroundFrontmatter } from '@/types/content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Background | D. Warner North | NorthWorks',
  description: 'Background information, education, and biographical details about D. Warner North, renowned expert in risk analysis and decision science.',
  keywords: ['D. Warner North biography', 'risk analysis expert', 'decision science', 'education', 'professional background', 'career history'],
  openGraph: {
    title: 'Background | D. Warner North | NorthWorks',
    description: 'Background information and biographical details about D. Warner North, expert in risk analysis and decision science.',
    type: 'profile',
    siteName: 'NorthWorks'
  }
};

export default function BackgroundIndexPage() {
  const slugs = getAllContentSlugs();
  
  // Filter for background content only and convert to ContentList format
  const backgroundContent = slugs
    .map(slug => {
      const content = getContentBySlug(slug, false);
      if (content?.frontmatter.type === 'background') {
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
    { label: 'Background', href: '/background', active: true }
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <PageTitle 
        title="Background Information"
        description="Professional background and biographical information"
        align="left"
        size="medium"
      />
        
      <ContentList 
        items={backgroundContent as any}
        baseUrl="/background"
        emptyMessage="No background information available."
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
