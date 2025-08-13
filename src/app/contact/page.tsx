import { getContentBySlug } from '@/lib/content';
import { ContentFrontmatter } from '@/types/content';
import ContentLayout from '@/components/layouts/ContentLayout';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact NorthWorks | Risk Analysis & Music Journalism',
  description: 'Contact D. Warner North and Cheryl North at NorthWorks for risk analysis consulting and classical music journalism services.',
  keywords: ['contact', 'NorthWorks', 'risk analysis consulting', 'music journalism', 'San Francisco']
};

export default function ContactPage() {
  const contactData = getContentBySlug('contact');
  
  if (!contactData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact</h1>
          <p className="text-gray-600">Content not found</p>
        </div>
      </div>
    );
  }

  const frontmatter = contactData.frontmatter as ContentFrontmatter;
  
  // Create breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'Contact', href: '/contact', active: true }
  ];

  // Create navigation with Contact active
  const navigation = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: false },
    { label: 'Cheryl North', href: '/cheryl', active: false },
    { label: 'Contact', href: '/contact', active: true }
  ];

  const layoutFrontmatter = {
    ...frontmatter,
    title: 'Contact NorthWorks',
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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Contact NorthWorks</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get in touch with D. Warner North and Cheryl North for consulting and journalism services
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Title Image */}
            {(frontmatter as any).images && (frontmatter as any).images.length > 0 && (
              <div className="mb-6 text-center">
                <Image
                  src={`/${(frontmatter as any).images[0].src}`}
                  alt="Contact"
                  width={(frontmatter as any).images[0].width || 200}
                  height={(frontmatter as any).images[0].height || 28}
                  className="mx-auto"
                />
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Email</h3>
                <a 
                  href="mailto:northworks@mindspring.com"
                  className="text-blue-600 hover:text-blue-800 transition-colors text-lg"
                >
                  northworks@mindspring.com
                </a>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Services</h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <strong>D. Warner North:</strong> Risk Analysis Consulting, Decision Analysis, Nuclear Safety
                  </p>
                  <p className="text-gray-600">
                    <strong>Cheryl North:</strong> Classical Music Journalism, Performance Reviews, Artist Interviews
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Location</h3>
                <p className="text-gray-600">
                  San Francisco Bay Area, California
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Professional Affiliations</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Stanford University (Consulting Professor)</li>
                  <li>• US EPA Science Advisory Board</li>
                  <li>• National Academy of Sciences</li>
                  <li>• Oakland Tribune & Bay Area News Group</li>
                  <li>• Opera Now Magazine (UK)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Personal Photo and Additional Info */}
          <div className="space-y-6">
            {/* Personal Photo */}
            {(frontmatter as any).images && (frontmatter as any).images.length > 1 && (
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <Image
                  src={`/${(frontmatter as any).images[1].src}`}
                  alt="Warner and Cheryl North"
                  width={(frontmatter as any).images[1].width || 225}
                  height={(frontmatter as any).images[1].height || 315}
                  className="rounded-lg mx-auto"
                />
                <p className="text-sm text-gray-600 mt-3 italic">
                  Warner and Cheryl North
                </p>
              </div>
            )}

            {/* Quick Links */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-3">
                <a 
                  href="/warner"
                  className="block p-3 bg-white rounded border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <span className="font-medium text-gray-900">D. Warner North</span>
                  <p className="text-sm text-gray-600">Risk Analysis & Consulting</p>
                </a>
                
                <a 
                  href="/cheryl"
                  className="block p-3 bg-white rounded border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all"
                >
                  <span className="font-medium text-gray-900">Cheryl North</span>
                  <p className="text-sm text-gray-600">Classical Music Journalism</p>
                </a>
                
                <a 
                  href="/interviews"
                  className="block p-3 bg-white rounded border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all"
                >
                  <span className="font-medium text-gray-900">Recent Interviews</span>
                  <p className="text-sm text-gray-600">Artist conversations & profiles</p>
                </a>
                
                <a 
                  href="/reviews"
                  className="block p-3 bg-white rounded border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all"
                >
                  <span className="font-medium text-gray-900">Performance Reviews</span>
                  <p className="text-sm text-gray-600">Opera & symphony critiques</p>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Website Link from Original Content */}
        <div className="text-center mt-12">
          <a 
            href="http://www.northworks.net"
            className="text-blue-600 hover:text-blue-800 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.northworks.net
          </a>
        </div>
      </div>
    </ContentLayout>
  );
}
