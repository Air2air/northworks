import { getContentBySlug } from '@/lib/content';
import { BiographyFrontmatter } from '@/types/content';
import ContentLayout from '@/components/layouts/ContentLayout';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cheryl North - Classical Music Journalist | NorthWorks',
  description: 'Cheryl North is a noted music columnist and critic, writing performance reviews and feature articles for major publications including Opera Now.',
  keywords: ['classical music', 'music criticism', 'opera reviews', 'music journalism', 'Oakland Tribune', 'Opera Now']
};

export default function CherylPage() {
  const cherylData = getContentBySlug('c_main');
  
  if (!cherylData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cheryl North</h1>
          <p className="text-gray-600">Content not found</p>
        </div>
      </div>
    );
  }

  const frontmatter = cherylData.frontmatter as BiographyFrontmatter;
  
  // Create breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'Cheryl North', href: '/cheryl', active: true }
  ];

  // Create navigation with Cheryl active
  const navigation = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: false },
    { label: 'Cheryl North', href: '/cheryl', active: true },
    { label: 'Contact', href: '/contact', active: false }
  ];

  const layoutFrontmatter = {
    ...frontmatter,
    title: 'Cheryl North',
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
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Cheryl North</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Classical Music Journalist and Critic specializing in opera and symphony performances
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Professional Images */}
            <div className="flex gap-6 mb-8">
              {frontmatter.images && frontmatter.images.length > 1 && (
                <div className="flex-shrink-0">
                  <Image
                    src={`/${frontmatter.images[1].src}`}
                    alt="Cheryl North"
                    width={frontmatter.images[1].width || 150}
                    height={frontmatter.images[1].height || 150}
                    className="rounded-lg shadow-md"
                  />
                </div>
              )}
              {frontmatter.images && frontmatter.images.length > 2 && (
                <div className="flex-shrink-0">
                  <Image
                    src={`/${frontmatter.images[2].src}`}
                    alt="Opera Now Magazine"
                    width={frontmatter.images[2].width || 150}
                    height={frontmatter.images[2].height || 150}
                    className="rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Biography Content */}
            <div className="prose prose-lg max-w-none mb-8">
              <div dangerouslySetInnerHTML={{ __html: cherylData.content }} />
            </div>

            {/* Featured Photo */}
            {frontmatter.images && frontmatter.images.length > 3 && (
              <div className="mb-8">
                <Image
                  src={`/${frontmatter.images[3].src}`}
                  alt="Cheryl North with Nicola and Placido"
                  width={frontmatter.images[3].width || 400}
                  height={frontmatter.images[3].height || 290}
                  className="rounded-lg shadow-md mx-auto"
                />
                <p className="text-sm text-gray-600 text-center mt-2 italic">
                  With renowned opera performers
                </p>
              </div>
            )}

            {/* Publications */}
            {frontmatter.images && frontmatter.images.length > 4 && (
              <div className="text-center">
                <Image
                  src={`/${frontmatter.images[4].src}`}
                  alt="Publication Logos"
                  width={frontmatter.images[4].width || 220}
                  height={frontmatter.images[4].height || 248}
                  className="mx-auto"
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Music Journalism</h3>
              
              <div className="space-y-4">
                <Link 
                  href="/interviews"
                  className="block p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all"
                >
                  <h4 className="font-medium text-gray-900 mb-1">Artist Interviews</h4>
                  <p className="text-sm text-gray-600">In-depth conversations with classical music performers</p>
                </Link>
                
                <Link 
                  href="/reviews"
                  className="block p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all"
                >
                  <h4 className="font-medium text-gray-900 mb-1">Performance Reviews</h4>
                  <p className="text-sm text-gray-600">Opera and symphony concert reviews</p>
                </Link>
                
                <Link 
                  href="/articles"
                  className="block p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all"
                >
                  <h4 className="font-medium text-gray-900 mb-1">Feature Articles</h4>
                  <p className="text-sm text-gray-600">In-depth articles about classical music</p>
                </Link>
              </div>

              {/* Specialties */}
              <div className="mt-8">
                <h4 className="font-medium text-gray-900 mb-3">Specializations</h4>
                <div className="flex flex-wrap gap-2">
                  {['Opera', 'Symphony', 'Chamber Music', 'Classical Performance', 'Music Criticism'].map((specialty) => (
                    <span 
                      key={specialty}
                      className="inline-block px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Publications */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Publications</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Oakland Tribune</li>
                  <li>• Opera Now (UK)</li>
                  <li>• Bay Area News Group</li>
                  <li>• Classical Music Publications</li>
                </ul>
              </div>

              {/* Featured Venue */}
              {(frontmatter as any).subjects && (frontmatter as any).subjects.includes('War Memorial Opera House') && (
                <div className="mt-6 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Frequent Coverage:</strong> War Memorial Opera House and San Francisco Bay Area venues
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
