import { getContentBySlug, getContentByType } from '@/lib/content';
import { ReviewFrontmatter, ContentData } from '@/types/content';
import ContentLayout from '@/components/layouts/ContentLayout';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const reviews = getContentByType('review');
  
  return reviews.map((review: ContentData) => ({
    slug: review.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const content = getContentBySlug(params.slug);
  
  if (!content) {
    return {
      title: 'Review Not Found',
    };
  }

  const frontmatter = content.frontmatter as ReviewFrontmatter;
  
  return {
    title: frontmatter.seo?.title || frontmatter.title,
    description: frontmatter.seo?.description || `Review: ${frontmatter.title}`,
    keywords: frontmatter.seo?.keywords || frontmatter.subjects,
  };
}

export default function ReviewPage({ params }: Props) {
  const content = getContentBySlug(params.slug);
  
  if (!content) {
    notFound();
  }

  const frontmatter = content.frontmatter as ReviewFrontmatter;
  
  // Create breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'Reviews', href: '/reviews', active: false },
    { label: frontmatter.title, href: `/reviews/${params.slug}`, active: true }
  ];

  // Create navigation - using default navigation since reviews don't have navigation in frontmatter
  const navigation = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: false },
    { label: 'Cheryl North', href: '/cheryl', active: false },
    { label: 'Contact', href: '/contact', active: false }
  ];

  const layoutFrontmatter = {
    ...frontmatter,
    breadcrumbs
  };

  return (
    <ContentLayout frontmatter={layoutFrontmatter}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {frontmatter.title}
          </h1>
          
          {/* Publication Info */}
          {frontmatter.publication && (
            <div className="text-lg text-gray-600 mb-4 space-y-1">
              {frontmatter.publication.date && (
                <div>
                  <span className="font-medium">Date:</span> {frontmatter.publication.date}
                </div>
              )}
              {frontmatter.publication.publisher && (
                <div>
                  <span className="font-medium">Publication:</span> {frontmatter.publication.publisher}
                </div>
              )}
              {frontmatter.publication.author && (
                <div>
                  <span className="font-medium">Author:</span> {frontmatter.publication.author}
                </div>
              )}
            </div>
          )}

          {/* Subjects/Tags */}
          {frontmatter.subjects && frontmatter.subjects.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {frontmatter.subjects.map((subject, index) => (
                <span 
                  key={index}
                  className="inline-block px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full"
                >
                  {subject}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Hero Image */}
        {frontmatter.images && frontmatter.images.length > 0 && (
          <div className="mb-8">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={`/${frontmatter.images[0].src}`}
                alt={frontmatter.images[0].alt || frontmatter.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            {frontmatter.images[0].caption && (
              <p className="text-sm text-gray-600 mt-2 italic">
                {frontmatter.images[0].caption}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: content.content }} />
        </div>

        {/* Additional Images Gallery */}
        {frontmatter.images && frontmatter.images.length > 1 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Images</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {frontmatter.images.slice(1).map((image, index) => (
                <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={`/${image.src}`}
                    alt={image.alt || `Image ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                      {image.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="border-t pt-8">
          <div className="flex justify-between items-center">
            <Link 
              href="/reviews"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              ← Back to Reviews
            </Link>
            
            <div className="text-sm text-gray-500">
              Review • {params.slug}
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
