import { generateCollectionBreadcrumbs } from "@/lib/breadcrumbUtils";
import PageTitle from "@/components/ui/PageTitle";
import UnifiedLayout from "@/components/layouts/UnifiedLayout";
import LandingGrid from "@/components/ui/LandingGrid";
import { UnifiedContentItem } from "@/schemas/unified-content-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "D. Warner North - Risk Analysis Consultant | NorthWorks",
  description:
    "Dr. D. Warner North is principal scientist of NorthWorks, a leading expert in risk analysis and nuclear waste issues with over 50 years of experience.",
  keywords: [
    "risk analysis",
    "nuclear waste",
    "consulting",
    "Stanford University",
    "EPA Science Advisory Board",
    "decision analysis",
  ],
  openGraph: {
    title: "D. Warner North - Risk Analysis Consultant",
    description:
      "Leading expert in risk analysis and nuclear waste issues with over 50 years of experience.",
    type: "profile",
    siteName: "NorthWorks",
  },
};

export default function WarnerPage() {
  // Generate breadcrumbs using centralized utility
  const breadcrumbs = generateCollectionBreadcrumbs("warner");

  // Create navigation items using centralized types
  const professionalItem: UnifiedContentItem = {
    id: "professional-nav",
    slug: "professional",
    type: "professional",
    category: "professional",
    title: "Professional Experience",
    summary: "Consulting work, government service, and academic collaborations",
    url: "/professional",
    status: "published",
    source: "manual",
    tags: ["consulting", "government", "academic", "professional"],
  };

  const publicationsItem: UnifiedContentItem = {
    id: "publications-nav",
    slug: "publications",
    type: "publication",
    category: "publications",
    title: "Publications",
    summary: "Books, research papers, reports, and articles",
    url: "/publications",
    status: "published",
    source: "manual",
    tags: ["research", "papers", "books", "articles"],
  };

  const backgroundItem: UnifiedContentItem = {
    id: "background-nav",
    slug: "background",
    type: "background",
    category: "background",
    title: "Background",
    summary: "Education, training, honors, and biographical information",
    url: "/background",
    status: "published",
    source: "manual",
    tags: ["education", "training", "honors", "biography"],
  };

  const landingItems = [
    professionalItem,
    publicationsItem,
    backgroundItem,
  ];

  return (
    <UnifiedLayout breadcrumbs={breadcrumbs}>
      {/* Hero Section */}
      <PageTitle
        title="D. Warner North"
        description="Principal Scientist of NorthWorks and leading expert in risk analysis and nuclear waste issues"
        align="left"
        size="medium"
      />

      {/* Content Cards - Responsive Grid Layout */}
      <LandingGrid
        items={landingItems}
        collection="warner"
        variant="text-only"
      />
    </UnifiedLayout>
  );
}
