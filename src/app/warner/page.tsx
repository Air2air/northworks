import PageTitle from "@/components/ui/PageTitle";
import PageLayout from "@/components/layouts/PageLayout";
import UnifiedCard from "@/components/ui/UnifiedCard";
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
  // Create breadcrumbs
  const breadcrumbs = [
    { label: "Home", href: "/", active: false },
    { label: "D. Warner North", href: "/warner", active: true },
  ];

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

  const projectsNRCItem = {
    id: "projects-nrc-nav",
    slug: "projects-nrc",
    type: "project" as const,
    category: "projects" as const,
    title: "NRC Projects",
    summary: "Education, training, honors, and biographical information",
    url: "/projects-nrc",
    status: "published" as const,
    source: "manual" as const,
    tags: ["education", "training", "honors", "biography"],
  };

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      {/* Hero Section */}
      <PageTitle
        title="D. Warner North"
        description="Principal Scientist of NorthWorks and leading expert in risk analysis and nuclear waste issues"
        align="left"
        size="medium"
      />

      {/* Content Cards - Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-12">
        {/* Professional Card */}
        <UnifiedCard
          item={professionalItem}
          options={{
            layout: "vertical",
            size: "medium",
            showTags: true,
            showSummary: true,
            clickable: true,
          }}
          collection="warner"
        />

        {/* Publications Card */}
        <UnifiedCard
          item={publicationsItem}
          options={{
            layout: "vertical",
            size: "medium",
            showTags: true,
            showSummary: true,
            clickable: true,
          }}
          collection="warner"
        />

        {/* Background Card */}
        <UnifiedCard
          item={backgroundItem}
          options={{
            layout: "vertical",
            size: "medium",
            showTags: true,
            showSummary: true,
            clickable: true,
          }}
          collection="warner"
        />

        {/* Projects NRC Card */}
        <UnifiedCard
          item={projectsNRCItem}
          options={{
            layout: "vertical",
            size: "medium",
            showTags: true,
            showSummary: true,
            clickable: true,
          }}
          collection="warner"
        />
      </div>
    </PageLayout>
  );
}
