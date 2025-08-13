import { getContentBySlug } from '@/lib/content';
import { BiographyFrontmatter } from '@/types/content';
import ContentLayout from '@/components/layouts/ContentLayout';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'D. Warner North - Risk Analysis Consultant | NorthWorks',
  description: 'Dr. D. Warner North is principal scientist of NorthWorks, a leading expert in risk analysis and nuclear waste issues with over 50 years of experience.',
  keywords: ['risk analysis', 'nuclear waste', 'consulting', 'Stanford University', 'EPA Science Advisory Board', 'decision analysis']
};

export default function WarnerPage() {
  const warnerData = getContentBySlug('w_main');
  
  if (!warnerData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">D. Warner North</h1>
          <p className="text-gray-600">Content not found</p>
        </div>
      </div>
    );
  }

  const frontmatter = warnerData.frontmatter as BiographyFrontmatter;
  
  // Create breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: true }
  ];

  // Create navigation with Warner active
  const navigation = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: true },
    { label: 'Cheryl North', href: '/cheryl', active: false },
    { label: 'Contact', href: '/contact', active: false }
  ];

  const layoutFrontmatter = {
    ...frontmatter,
    title: 'D. Warner North',
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">D. Warner North</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Principal Scientist of NorthWorks and leading expert in risk analysis and nuclear waste issues
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Professional Image */}
            {frontmatter.images && frontmatter.images.length > 1 && (
              <div className="float-right ml-6 mb-6">
                <Image
                  src={`/${frontmatter.images[1].src}`}
                  alt="D. Warner North"
                  width={frontmatter.images[1].width || 200}
                  height={frontmatter.images[1].height || 200}
                  className="rounded-lg shadow-md"
                />
              </div>
            )}

            {/* Biography Content */}
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: warnerData.content }} />
            </div>

            {/* Speaking Image */}
            {frontmatter.images && frontmatter.images.length > 2 && (
              <div className="mt-8">
                <Image
                  src={`/${frontmatter.images[2].src}`}
                  alt="Dr. North speaking at Belgian Senate"
                  width={frontmatter.images[2].width || 400}
                  height={frontmatter.images[2].height || 300}
                  className="rounded-lg shadow-md mx-auto"
                />
                <p className="text-sm text-gray-600 text-center mt-2 italic">
                  Dr. North speaking at the Belgian Senate
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Professional Portfolio</h3>
              
              <div className="space-y-4">
                <Link 
                  href="/warner/projects-index"
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1 group-hover:text-blue-600">Complete Projects Index</h4>
                      <p className="text-sm text-gray-600">50+ years of consulting work</p>
                    </div>
                    <span className="text-2xl">📋</span>
                  </div>
                </Link>

                <Link 
                  href="/warner/background"
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1 group-hover:text-blue-600">Background & Education</h4>
                      <p className="text-sm text-gray-600">Academic credentials & training</p>
                    </div>
                    <span className="text-2xl">🎓</span>
                  </div>
                </Link>
                
                <Link 
                  href="/warner/projects/government"
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1 group-hover:text-blue-600">Government Service</h4>
                      <p className="text-sm text-gray-600">Federal & state agency work</p>
                    </div>
                    <span className="text-2xl">🏛️</span>
                  </div>
                </Link>

                <Link 
                  href="/warner/stanford-index"
                  className="block p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1 group-hover:text-red-600">Stanford University</h4>
                      <p className="text-sm text-gray-600">35 years of academic service</p>
                    </div>
                    <span className="text-2xl">🏫</span>
                  </div>
                </Link>

                <Link 
                  href="/warner/nrc-index"
                  className="block p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1 group-hover:text-purple-600">National Academies</h4>
                      <p className="text-sm text-gray-600">NRC National Associate</p>
                    </div>
                    <span className="text-2xl">⭐</span>
                  </div>
                </Link>
                
                <Link 
                  href="/warner/publications-index"
                  className="block p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1 group-hover:text-green-600">Publications Index</h4>
                      <p className="text-sm text-gray-600">Books, papers & reports</p>
                    </div>
                    <span className="text-2xl">📚</span>
                  </div>
                </Link>
              </div>

              {/* Advisory Boards Section */}
              {frontmatter.images && frontmatter.images.length > 3 && (
                <div className="mt-8">
                  <Image
                    src={`/${frontmatter.images[3].src}`}
                    alt="Advisory Boards"
                    width={frontmatter.images[3].width || 220}
                    height={frontmatter.images[3].height || 45}
                    className="mx-auto"
                  />
                </div>
              )}

              {/* Key Expertise */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Key Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {['Risk Analysis', 'Decision Analysis', 'Nuclear Safety', 'Environmental Policy', 'Waste Management'].map((skill) => (
                    <span 
                      key={skill}
                      className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
