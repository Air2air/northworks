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

  // Get images from the frontmatter, fallback to default if not available
  const images = professionalData.frontmatter.images || [
    { src: '/images/title-experience.gif', alt: 'Professional Experience Title' },
    { src: '/images/logo-us.gif', alt: 'National Science Foundation Logo' },
    { src: '/images/logo-nrc.gif', alt: 'National Research Council Logo' },
    { src: '/images/logo-stan.gif', alt: 'Stanford Logo' },
    { src: '/images/logo-cra.gif', alt: 'Charles River Associates Logo' },
    { src: '/images/logo-ntrb.gif', alt: 'Nuclear Waste Technical Review Board Logo' },
    { src: '/images/logo-epri.gif', alt: 'Electric Power Research Institute Logo' },
    { src: '/images/logo-fluor.gif', alt: 'Fluor Hanford Logo' },
    { src: '/images/logo-plek.gif', alt: 'Plekhanov Russian Academy Logo' },
    { src: '/images/logo-mwra.gif', alt: 'Massachusetts Water Resources Authority Logo' },
    { src: '/images/logo-cma.gif', alt: 'Chemical Manufacturers Association Logo' },
    { src: '/images/logo-gma.gif', alt: 'Grocery Manufacturers Association Logo' },
    { src: '/images/logo-nsf.gif', alt: 'National Science Foundation Logo' },
    { src: '/images/logo-doe.gif', alt: 'US Department of Energy Logo' }
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      {/* Images Gallery */}
      <ImageGallery images={images} inline={true} />
      
      {/* Section Grid with professional content from markdown file */}
      <SectionGrid 
        content={professionalData.content}
        frontmatter={professionalData.frontmatter}
      />
    </PageLayout>
  );
}
