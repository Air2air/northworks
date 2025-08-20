import PageTitle from '@/components/ui/PageTitle';
import PageLayout from '@/components/layouts/PageLayout';
import SectionGrid from '@/components/ui/SectionGrid';
import ImageGallery from '@/components/ImageGallery';
import { loadMarkdownFile } from '@/lib/markdownLoader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Publications & Research Papers | D. Warner North | NorthWorks',
  description: 'Publications and research papers by D. Warner North covering risk analysis, decision analysis, environmental protection, and nuclear waste management.',
  openGraph: {
    title: 'Publications & Research Papers | D. Warner North | NorthWorks',
    description: 'Publications and research papers by D. Warner North covering risk analysis, decision analysis, and environmental protection.',
    type: 'website',
    siteName: 'NorthWorks'
  }
};

export default function PublicationsPage() {
  // Load the publications content from markdown file
  const publicationsData = loadMarkdownFile('w-publications.md');
  
  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: false },
    { label: 'Publications', href: '/publications', active: true }
  ];



  return (
    <PageLayout breadcrumbs={breadcrumbs}>

      
      {/* Section Grid with publications content from markdown file */}
      <SectionGrid 
        content={publicationsData.content}
        frontmatter={publicationsData.frontmatter}
      />
    </PageLayout>
  );
}
