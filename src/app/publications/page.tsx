import { getPublicationContent } from '@/lib/unified-data';
import { generateListingBreadcrumbs } from '@/lib/breadcrumbUtils';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import PageTitle from '@/components/ui/PageTitle';
import UnifiedContentDisplay from '@/components/ui/UnifiedContentDisplay';
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
  // Load normalized publication content data
  const publicationContent = getPublicationContent();
  
  // Generate breadcrumbs using centralized utility
  const breadcrumbs = generateListingBreadcrumbs('publication');

  // Full document links for Warner publications
  const documentLinks = [
    {
      title: "Complete Publications & Research Papers List",
      href: "/w-publications",
      description: "Comprehensive bibliography of research papers, journal articles, and publications covering risk analysis, decision analysis, and environmental protection."
    },
    {
      title: "SEIF IV: Decision Analysis in Risk Management",
      href: "/w-pub-seif-iv", 
      description: "Research paper on systematic evaluation and implementation framework for decision analysis applications in risk management."
    },
    {
      title: "Stuttgart Workshop on Risk Analysis",
      href: "/w-pub-stuttgart",
      description: "Workshop proceedings and contributions from the Stuttgart international conference on risk analysis methodologies."
    },
    {
      title: "VNIIGAZ Collaboration Research",
      href: "/w-pub-vniigaz",
      description: "Collaborative research papers with the Russian natural gas research institute on risk assessment for energy infrastructure."
    }
  ];

  return (
    <UnifiedLayout breadcrumbs={breadcrumbs}>
      <PageTitle
        title="Publications & Research Papers"
        description="Publications and research papers by D. Warner North covering risk analysis, decision analysis, environmental protection, and nuclear waste management."
        align="left"
        size="medium"
      />

            <UnifiedContentDisplay
        items={publicationContent}
        preset="warnerContent"
      />
    </UnifiedLayout>
  );
}
