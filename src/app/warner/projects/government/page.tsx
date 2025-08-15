import { getContentBySlug } from '@/lib/content';
import PageTitle from '@/components/ui/PageTitle';
import Link from 'next/link';

export default function GovernmentProjectsPage() {
  const governmentData = getContentBySlug('w_projects_government');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageTitle
          title="Government Projects"
          description="Federal and state government consulting projects and advisory board service."
          align="center"
          size="medium"
        />

        {/* Search hint */}
        <div className="text-center mb-8">
          <Link 
            href="/search"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔍 Search All Content
          </Link>
        </div>

        {/* Content */}
        {governmentData ? (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: governmentData.content }}
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">Government projects content not found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
