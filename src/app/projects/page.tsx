import { getProfessionalContent } from '@/lib/unified-data';
import { generateListingBreadcrumbs } from '@/lib/breadcrumbUtils';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import PageTitle from '@/components/ui/PageTitle';
import UnifiedList from '@/components/ui/UnifiedList';
import DocumentCardList from '@/components/ui/DocumentCardList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects & Consulting Work | D. Warner North | NorthWorks',
  description: 'Professional projects and consulting work by D. Warner North including government service, academic collaborations, and private sector consulting.',
  openGraph: {
    title: 'Projects & Consulting Work | D. Warner North | NorthWorks',
    description: 'Professional projects and consulting work including government service, academic collaborations, and private sector consulting.',
    type: 'website',
    siteName: 'NorthWorks'
  }
};

export default function ProjectsPage() {
  // Load normalized professional content data (projects are part of professional content)
  const professionalContent = getProfessionalContent();
  
  // Generate breadcrumbs using centralized utility
  const breadcrumbs = generateListingBreadcrumbs('project');

  // Full document links for Warner project content
  const fullDocuments = [
    {
      title: "Professional Projects Overview",
      href: "/w-projects",
      description: "Comprehensive overview of consulting projects, government work, and private sector experience across multiple decades.",
      actionText: "View Overview"
    },
    {
      title: "Government Consulting Projects",
      href: "/w-projects-government", 
      description: "Detailed breakdown of government consulting work including EPA, NRC, and other federal agencies.",
      actionText: "View Projects"
    },
    {
      title: "Nuclear Regulatory Commission Projects",
      href: "/w-projects-nrc",
      description: "Specific projects and contributions to Nuclear Regulatory Commission risk analysis efforts.",
      actionText: "View Projects"
    },
    {
      title: "Stanford University Collaboration",
      href: "/w-projects-stanford",
      description: "Academic collaboration and research projects at Stanford University's Department of Management Science and Engineering.",
      actionText: "View Projects"
    },
    {
      title: "EPA Science Advisory Board Global Warming Analysis (1990)",
      href: "/w-epasab1990",
      description: "Analysis of EPA's draft reports to Congress on global warming, climate change policy, and emissions reduction scenarios.",
      actionText: "View Analysis"
    }
  ];

  return (
    <UnifiedLayout breadcrumbs={breadcrumbs}>
      <PageTitle
        title="Projects & Consulting Work"
        description="Professional projects and consulting work by D. Warner North including government service, academic collaborations, and private sector consulting."
        align="left"
        size="medium"
      />

      <DocumentCardList
        title="Featured Project Documentation"
        documents={fullDocuments}
      />

      {/* Section Overview */}
      <div className="mb-6">
        <h2 className="section-heading">Project Highlights & Details</h2>
        <p className="text-metadata mb-6">Browse individual project entries and detailed information from the comprehensive project portfolio.</p>
      </div>

      <UnifiedList 
        items={professionalContent}
        options={{
          layout: 'list',
          searchable: true,
          filterable: true,
          sortBy: 'date',
          pagination: true,
          groupBy: 'category',
          cardOptions: {
            layout: 'horizontal',
            size: 'medium',
            showTags: true,
            showSummary: true,
            showImage: false
          }
        }}
      />
    </UnifiedLayout>
  );
}
