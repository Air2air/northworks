import { getContentBySlug } from '@/lib/content';
import PageLayout from '@/components/layouts/PageLayout';
import PageTitle from '@/components/ui/PageTitle';
import Link from 'next/link';

export default function GovernmentProjectsPage() {
  const governmentData = getContentBySlug('w_projects_government');

  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'Warner North', href: '/warner', active: false },
    { label: 'Projects', href: '/warner/projects', active: false },
    { label: 'Government', href: '/warner/projects/government', active: true }
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs} className="min-h-screen bg-gray-50">
      <PageTitle
        title="Government Projects"
        description="Dr. Warner North's government consulting work and public service roles."
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
    </PageLayout>
  );
}
