import { getBackgroundContent } from '@/lib/unified-data';
import { generateListingBreadcrumbs } from '@/lib/breadcrumbUtils';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
import PageTitle from '@/components/ui/PageTitle';
import UnifiedContentDisplay from '@/components/ui/UnifiedContentDisplay';
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
  // Load normalized background content data
  const backgroundContent = getBackgroundContent();
  
  // Generate breadcrumbs using centralized utility
  const breadcrumbs = generateListingBreadcrumbs('background');

  // Full document links for Warner background content
  const documentLinks = [
    {
      title: "Professional Background & Biography",
      href: "/w-background",
      description: "Comprehensive biographical information, education, career history, and professional affiliations of D. Warner North."
    },
    {
      title: "Career Overview & Experience Summary",
      href: "/w-main",
      description: "Detailed overview of professional experience, consulting career, academic affiliations, and major career achievements."
    },
    {
      title: "About NorthWorks Consulting",
      href: "/w-northworks",
      description: "Information about NorthWorks consulting firm, its mission, services, and approach to risk analysis and decision science."
    }
  ];

  return (
    <UnifiedLayout breadcrumbs={breadcrumbs}>
      <PageTitle
        title="Background"
        description="Background information, education, and biographical details about D. Warner North, renowned expert in risk analysis and decision science."
        align="left"
        size="medium"
      />

            <UnifiedContentDisplay
        items={backgroundContent}
        preset="warnerContent"
      />
    </UnifiedLayout>
  );
}
