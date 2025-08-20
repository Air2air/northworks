import PageTitle from '@/components/ui/PageTitle';
import PageLayout from '@/components/layouts/PageLayout';
import SectionGrid from '@/components/ui/SectionGrid';
import ImageGallery from '@/components/ImageGallery';
import { loadMarkdownFile } from '@/lib/markdownLoader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Professional Experience & Projects | D. Warner North | NorthWorks',
  description: 'Professional work and consulting experience of D. Warner North in risk analysis, decision analysis, and capital expenditure analysis.',
  openGraph: {
    title: 'Professional Experience & Projects | D. Warner North | NorthWorks',
    description: 'Professional work and consulting experience of D. Warner North in risk analysis and decision analysis.',
    type: 'website',
    siteName: 'NorthWorks'
  }
};

export default function ProfessionalPage() {
  // Load the professional content from markdown file
  const professionalData = loadMarkdownFile('w-projects.md');
  
  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: false },
    { label: 'Professional Experience', href: '/professional', active: true }
  ];


  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      {/* Images Gallery */}

      
      {/* Section Grid with professional content from markdown file */}
      <SectionGrid 
        content={professionalData.content}
        frontmatter={professionalData.frontmatter}
      />
    </PageLayout>
  );
}
