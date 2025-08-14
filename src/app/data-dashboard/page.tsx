import Link from 'next/link';
import { getStatsSummary, loadDataIndex, DataIndex } from '@/lib/jsonData';
import PageTitle from '@/components/ui/PageTitle';

interface DataDashboardProps {
  stats: ReturnType<typeof getStatsSummary>;
  dataIndex: DataIndex;
}

export default async function DataDashboard() {
  const stats = getStatsSummary();
  const dataIndex = loadDataIndex();
  if (!stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PageTitle title="Data Dashboard" description="Error loading data statistics" />
        <div className="text-center py-12">
          <p className="text-red-600">Failed to load data statistics. Please check that JSON data files exist.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatType = (type: string) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle 
        title="JSON Data Conversion Dashboard"
        description="Overview of the successful conversion from markdown to structured JSON data"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Entries</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalEntries}</p>
          <p className="text-sm text-gray-500 mt-1">Across all collections</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Interviews</h3>
          <p className="text-3xl font-bold text-green-600">{stats.interviews.total}</p>
          <p className="text-sm text-gray-500 mt-1">
            {stats.interviews.withThumbnails} with images
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Articles</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.articles.total}</p>
          <p className="text-sm text-gray-500 mt-1">
            {stats.articles.uniqueTypes} different types
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Data</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.profile.publications}</p>
          <p className="text-sm text-gray-500 mt-1">Publications tracked</p>
        </div>
      </div>

      {/* Conversion Status */}
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Conversion Status</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(dataIndex.collections).map(([key, collection]) => (
              <div key={key} className="flex items-center space-x-4">
                <div className={`w-4 h-4 rounded-full ${
                  collection.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <div>
                  <h3 className="font-medium text-gray-900 capitalize">{key}</h3>
                  <p className="text-sm text-gray-500">
                    {collection.count} entries • {collection.file}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            <p>
              <strong>Extraction Duration:</strong> {dataIndex.metadata.extractionDuration} • 
              <strong> Last Updated:</strong> {formatDate(dataIndex.metadata.created)}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Browse Converted Data</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/interviews" 
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div>
                <h3 className="font-medium text-gray-900">Dynamic Interview Grid</h3>
                <p className="text-sm text-gray-500">Browse {stats.interviews.total} interviews with search and filtering</p>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            
            <Link 
              href="/articles" 
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div>
                <h3 className="font-medium text-gray-900">Dynamic Article List</h3>
                <p className="text-sm text-gray-500">Explore {stats.articles.total} articles with advanced filtering</p>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Data Insights */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Data Insights</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Interview Insights */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Interview Collection</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• {stats.interviews.uniqueRoles} unique musical roles represented</li>
                <li>• {Math.round((stats.interviews.withThumbnails / stats.interviews.total) * 100)}% have thumbnail images</li>
                <li>• Covers classical musicians, conductors, and composers</li>
                <li>• Sources include ANG Newspapers and Bay Area News Group</li>
              </ul>
            </div>
            
            {/* Article Insights */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Article Collection</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• {stats.articles.uniqueTypes} article types: reviews, features, premieres</li>
                {stats.articles.dateRange && (
                  <li>• Date range: {stats.articles.dateRange.earliest} to {stats.articles.dateRange.latest}</li>
                )}
                <li>• Covers opera, symphony, and contemporary classical music</li>
                <li>• Published in multiple prestigious publications</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">✅ Conversion Benefits</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Searchable:</strong> Full-text search across all content</li>
              <li>• <strong>Filterable:</strong> Filter by role, type, publisher, year</li>
              <li>• <strong>Structured:</strong> Consistent metadata for better organization</li>
              <li>• <strong>Scalable:</strong> Easy to add new content and features</li>
              <li>• <strong>API-Ready:</strong> JSON structure enables future API development</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
