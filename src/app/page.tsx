import { getContentBySlug } from '@/lib/content';
import { ContentFrontmatter } from '@/types/content';
import PageTitle from '@/components/ui/PageTitle';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NorthWorks - Cross-Domain Content Platform',
  description: 'Unified platform for classical music content and professional portfolio data with cross-domain search capabilities',
  keywords: ['NorthWorks', 'classical music', 'risk analysis', 'Warner North', 'Cheryl North', 'journalism', 'consulting']
};

export default function HomePage() {
  const homeData = getContentBySlug('index');
  
  if (!homeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <PageTitle 
            title="NorthWorks"
            description="Cross-Domain Content Platform"
            size="large"
            align="center"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageTitle
          title="NorthWorks"
          description="Cross-Domain Content Platform for Classical Music and Risk Analysis"
          align="center"
          size="large"
        />

        {/* Main Content */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: homeData.content }} />
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16">
          {/* D. Warner North Card */}
          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">D. Warner North</h3>
              <p className="text-gray-600 mb-6">
                Risk analysis consultant with 50+ years of experience in decision analysis, 
                environmental protection, and government consulting.
              </p>
              <Link
                href="/warner"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Explore Professional Work
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Cheryl North Card */}
          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Cheryl North</h3>
              <p className="text-gray-600 mb-6">
                Classical music journalist and critic specializing in opera, symphony, 
                and chamber music with extensive interview collection.
              </p>
              <Link
                href="/cheryl"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Explore Music Journalism
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Search CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Unified Search</h3>
            <p className="text-gray-600 mb-6">
              Search across both classical music content and professional portfolio data with our unified search system.
            </p>
            <Link
              href="/search"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Try Search
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
