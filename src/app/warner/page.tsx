import { generateCollectionBreadcrumbs } from '@/lib/breadcrumbUtils';
import PageTitle from '@/components/ui/PageTitle';
import UnifiedLayout from "@/components/layouts/UnifiedLayout";
import LandingGrid from '@/components/ui/LandingGrid';
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
  const breadcrumbs = generateCollectionBreadcrumbs('warner');

  // Create navigation items for UnifiedCard
  const professionalItem = {
    id: "professional-nav",
    slug: "professional",
    type: "professional" as const,
    category: "professional" as const,
    title: "Professional Work",
    summary: "Consulting projects, government service, and academic positions",
    url: "/professional",
    status: "published" as const,
    source: "manual" as const,
    tags: ["consulting", "government", "academic", "projects"],
  };

  const publicationsItem = {
    id: "publications-nav",
    slug: "publications",
    type: "publication" as const,
    category: "publications" as const,
    title: "Publications",
    summary: "Books, research papers, reports, and articles",
    url: "/publications",
    status: "published" as const,
    source: "manual" as const,
    tags: ["research", "papers", "books", "articles"],
  };

  const backgroundItem = {
    id: "background-nav",
    slug: "background",
    type: "background" as const,
    category: "background" as const,
    title: "Background",
    summary: "Education, training, honors, and biographical information",
    url: "/background",
    status: "published" as const,
    source: "manual" as const,
    tags: ["education", "training", "honors", "biography"],
  };

  const projectsItem = {
    id: "projects-nav",
    slug: "projects",
    type: "project" as const,
    category: "projects" as const,
    title: "Projects",
    summary: "Consulting projects, government work, and academic collaborations",
    url: "/projects",
    status: "published" as const,
    source: "manual" as const,
    tags: ["consulting", "government", "projects", "collaborations"],
  };

  const landingItems = [
    professionalItem,
    publicationsItem,
    backgroundItem,
    projectsItem
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
      />
    </UnifiedLayout>
  );
}
