import Link from 'next/link';
import { getProfessionalContent } from '@/lib/unified-data';
import { generateListingBreadcrumbs } from '@/lib/breadcrumbUtils';
import PageTitle from '@/components/ui/PageTitle';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import UnifiedContentDisplay from '@/components/ui/UnifiedContentDisplay';
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
  // Load normalized professional content data
  const professionalContent = getProfessionalContent();
  
  // Generate breadcrumbs using centralized utility
  const breadcrumbs = generateListingBreadcrumbs('professional');

  // Full document links for Warner professional content
  const documentLinks = [
    {
      title: "Professional Projects Overview", 
      href: "/w-projects",
      description: "Comprehensive overview of consulting projects, government work, and private sector experience.",
      actionText: "View Document"
    },
    {
      title: "Government Consulting Projects",
      href: "/w-projects-government", 
      description: "Detailed breakdown of government consulting work including EPA, NRC, and other federal agencies.",
      actionText: "View Document"
    },
    {
      title: "Nuclear Regulatory Commission Projects",
      href: "/w-projects-nrc",
      description: "Specific projects and contributions to Nuclear Regulatory Commission risk analysis efforts.",
      actionText: "View Document"
    },
    {
      title: "Stanford University Collaboration",
      href: "/w-projects-stanford",
      description: "Academic collaboration and research projects at Stanford University's Department of Management Science and Engineering.",
      actionText: "View Document"
    },
    {
      title: "EPA Science Advisory Board Global Warming Analysis (1990)",
      href: "/w-epasab1990",
      description: "Analysis of EPA's draft reports to Congress on global warming, climate change policy, and emissions reduction scenarios.",
      actionText: "View Document"
    }
  ];

  return (
    <UnifiedLayout breadcrumbs={breadcrumbs}>
      <PageTitle
        title="Professional Experience & Projects"
        description="Professional work and consulting experience of D. Warner North in risk analysis, decision analysis, and capital expenditure analysis."
        align="left"
        size="medium"
      />

            <UnifiedContentDisplay
        items={professionalContent}
        preset="warnerContent"
      />
    </UnifiedLayout>
  );
}
