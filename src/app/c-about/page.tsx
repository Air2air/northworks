import { getContentBySlug } from "@/lib/content";
import UnifiedLayout from "@/components/layouts/UnifiedLayout";
import PageTitle from "@/components/ui/PageTitle";
import ImageGallery from "@/components/ImageGallery";
import { generateCollectionBreadcrumbs } from "@/lib/breadcrumbUtils";
import { generateMetadataFromContent } from "@/lib/metadataUtils";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = generateMetadataFromContent("c-about", {
  type: "article",
  defaultTitle: "About Cheryl North",
  defaultDescription:
    "Biography, education, and musical background of classical music journalist Cheryl North",
});

export default function AboutCherylPage() {
  const content = getContentBySlug("c-about");

  if (!content) {
    notFound();
  }

  // Generate breadcrumbs
  const breadcrumbs = [
    { label: "Home", href: "/", active: false },
    { label: "Cheryl North", href: "/cheryl", active: false },
    { label: "About Cheryl", href: "/c-about", active: true },
  ];

  return (
    <UnifiedLayout breadcrumbs={breadcrumbs}>
      <PageTitle
        title={content.frontmatter.title}
        description={content.frontmatter.description}
        align="left"
        size="large"
      />

      <div className="mt-12 max-w-4xl mx-auto">
        {/* Main portrait image */}
        {content.frontmatter.images && (
          <ImageGallery 
            images={content.frontmatter.images.filter((img: any) => img.section === 'main')}
            showCaptions={true}
            inline={true}
          />
        )}
        
        <div
          className="prose prose-lg prose-sky max-w-none
                     prose-headings:text-sky-900 prose-headings:font-bold
                     prose-p:text-gray-700 prose-p:leading-relaxed
                     prose-a:text-sky-600 prose-a:no-underline hover:prose-a:text-sky-800"
          dangerouslySetInnerHTML={{ __html: content.content }}
        />

        {/* Professional recognition images */}
        {content.frontmatter.images && (
          <ImageGallery 
            images={content.frontmatter.images.filter((img: any) => img.section === 'professional')}
            showCaptions={true}
            inline={false}
          />
        )}
      </div>
    </UnifiedLayout>
  );
}
