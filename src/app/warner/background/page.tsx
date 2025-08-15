import { getWarnerContentByPattern } from '@/lib/content';
import PageLayout from '@/components/layouts/PageLayout';
import PageTitle from '@/components/ui/PageTitle';
import ContentList from '@/components/ui/ContentList';
import Link from 'next/link';

export default function WarnerBackgroundPage() {
  // Get background content
  const backgroundContent = getWarnerContentByPattern('background');

  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'Warner North', href: '/warner', active: false },
    { label: 'Background', href: '/warner/background', active: true }
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <PageTitle
        title="Professional Background"
        description="Dr. Warner North's biography, education, and professional credentials."
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

      {/* Background content */}
      <ContentList 
        items={backgroundContent}
        baseUrl="/background"
        emptyMessage="No background content available at this time."
      />
    </PageLayout>
  );
}
