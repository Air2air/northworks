import PageTitle from '@/components/ui/PageTitle';
import PageLayout from '@/components/layouts/PageLayout';
import SectionGrid from '@/components/ui/SectionGrid';
import ImageGallery from '@/components/ImageGallery';
import { loadMarkdownFile } from '@/lib/markdownLoader';
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

export default function BackgroundPage() {
  // Load the background content from markdown file
  const backgroundData = loadMarkdownFile('w-background.md');
  
  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: false },
    { label: 'Background', href: '/background', active: true }
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      {/* Section Grid with background content from markdown file */}
      <SectionGrid 
        content={backgroundData.content}
        frontmatter={backgroundData.frontmatter}
      />
    </PageLayout>
  );
}
