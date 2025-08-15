import PageTitle from '@/components/ui/PageTitle';
import Link from 'next/link';

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageTitle
          title="Professional Portfolio"
          description="Professional portfolio information and achievements."
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

        <div className="text-center py-12">
          <p className="text-gray-600">Portfolio functionality has been simplified.</p>
          <p className="text-gray-500 mt-2">Use the search functionality to find specific content.</p>
        </div>
      </div>
    </div>
  );
}
