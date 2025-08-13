import { getContentBySlug } from '@/lib/content';
import { ContentFrontmatter } from '@/types/content';
import ContentLayout from '@/components/layouts/ContentLayout';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'D. Warner North - Background & Education | NorthWorks',
  description: 'Educational background and professional credentials of Dr. D. Warner North, risk analysis expert and Stanford consulting professor.',
  keywords: ['Warner North', 'education', 'credentials', 'Stanford University', 'risk analysis background']
};

export default function WarnerBackgroundPage() {
  const backgroundData = getContentBySlug('w_background');
  
  if (!backgroundData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Background & Education</h1>
          <p className="text-gray-600">Content not found</p>
        </div>
      </div>
    );
  }

  const frontmatter = backgroundData.frontmatter as ContentFrontmatter;
  
  // Create breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: false },
    { label: 'Background', href: '/warner/background', active: true }
  ];

  // Create navigation
  const navigation = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: true },
    { label: 'Cheryl North', href: '/cheryl', active: false },
    { label: 'Contact', href: '/contact', active: false }
  ];

  const layoutFrontmatter = {
    ...frontmatter,
    title: 'Background & Education',
    breadcrumbs,
    navigation,
    seo: {
      title: metadata.title as string,
      description: metadata.description as string,
      keywords: metadata.keywords as string[]
    }
  };

  return (
    <ContentLayout frontmatter={layoutFrontmatter}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Background & Education
          </h1>
          <p className="text-lg text-gray-600">
            Academic background and professional credentials of D. Warner North
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: backgroundData.content }} />
        </div>

        {/* Navigation back to main profile */}
        <div className="border-t pt-8">
          <div className="flex justify-between items-center">
            <a 
              href="/warner"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              ← Back to D. Warner North
            </a>
            
            <div className="text-sm text-gray-500">
              Professional Background
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
