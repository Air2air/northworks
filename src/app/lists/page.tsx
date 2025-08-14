/**
 * Professional Lists Page
 * Comprehensive display of all structured professional lists
 */

import React from 'react';
import dynamic from 'next/dynamic';
import fs from 'fs';
import path from 'path';
import { 
  FaRocket, 
  FaBook, 
  FaBuilding, 
  FaBriefcase, 
  FaBullseye, 
  FaTrophy, 
  FaGraduationCap, 
  FaClipboardList 
} from 'react-icons/fa';

// Dynamic import for ProfessionalLists with loading state
const ProfessionalLists = dynamic(() => import('@/components/ui/ProfessionalLists'), {
  loading: () => (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4 w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded mb-8 w-3/4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-32 rounded"></div>
          ))}
        </div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-40 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  )
});

// Data loader
async function getListsData() {
  try {
    // Load Warner lists
    const warnerListsPath = path.join(process.cwd(), 'src/data/warner-portfolio-specialized.json');
    const warnerListsData = JSON.parse(fs.readFileSync(warnerListsPath, 'utf8'));
    
    return {
      lists: warnerListsData.lists || {},
      metadata: warnerListsData.metadata || {},
      summary: warnerListsData.summary || {}
    };
  } catch (error) {
    console.error('Error loading lists data:', error);
    return {
      lists: {},
      metadata: {},
      summary: {}
    };
  }
}

// Helper function to get category icon
const getCategoryIcon = (category: string) => {
  const iconProps = { className: "w-6 h-6 text-blue-600" };
  switch (category) {
    case 'projects': return <FaRocket {...iconProps} />;
    case 'publications': return <FaBook {...iconProps} />;
    case 'organizations': return <FaBuilding {...iconProps} />;
    case 'positions': return <FaBriefcase {...iconProps} />;
    case 'expertise': return <FaBullseye {...iconProps} />;
    case 'awards': return <FaTrophy {...iconProps} />;
    case 'education': return <FaGraduationCap {...iconProps} />;
    default: return <FaClipboardList {...iconProps} />;
  }
};

export default async function ProfessionalListsPage() {
  const { lists, metadata, summary } = await getListsData();
  
  const totalItems = Object.values(lists).reduce((total: number, items: any) => total + (items?.length || 0), 0);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Professional Lists & Structured Data
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Comprehensive overview of structured professional information extracted from Warner North's portfolio
        </p>
        
        {/* Overview Stats */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{totalItems}</div>
              <div className="text-sm text-gray-600">Total Items</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{Object.keys(lists).length}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {metadata.timeRange ? `${metadata.timeRange.end - metadata.timeRange.start + 1}` : 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Year Span</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {metadata.keyOrganizations ? Object.keys(metadata.keyOrganizations).length : 0}
              </div>
              <div className="text-sm text-gray-600">Organizations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      {metadata && Object.keys(metadata).length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Key Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Time Range */}
            {metadata.timeRange && (
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  📅 Time Period
                </h3>
                <p className="text-gray-600 mb-2">
                  Professional activity spanning <strong>{metadata.timeRange.end - metadata.timeRange.start + 1} years</strong>
                </p>
                <p className="text-sm text-gray-500">
                  From {metadata.timeRange.start} to {metadata.timeRange.end}
                </p>
              </div>
            )}

            {/* Key Organizations */}
            {metadata.keyOrganizations && (
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  🏢 Top Organizations
                </h3>
                <div className="space-y-2">
                  {Object.entries(metadata.keyOrganizations)
                    .sort(([,a], [,b]) => (b as number) - (a as number))
                    .slice(0, 3)
                    .map(([org, count]) => (
                      <div key={org} className="flex justify-between items-center">
                        <span className="text-gray-700">{org}</span>
                        <span className="text-sm font-medium text-blue-600">{String(count)} mentions</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}

            {/* Expertise Areas */}
            {metadata.expertiseAreas && (
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  🎯 Core Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {metadata.expertiseAreas.slice(0, 4).map((area: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      {area}
                    </span>
                  ))}
                  {metadata.expertiseAreas.length > 4 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{metadata.expertiseAreas.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Professional Lists */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Structured Professional Data</h2>
        <ProfessionalLists 
          lists={lists} 
          showSummary={true} 
          expandedByDefault={false}
          maxItemsPreview={5}
        />
      </div>

      {/* Category Details */}
      {Object.keys(lists).length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Category Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(lists).map(([category, items]) => {
              const itemsArray = Array.isArray(items) ? items : [];
              return (
                <div key={category} className="bg-white p-6 rounded-lg shadow-md border">
                  <div className="flex items-center gap-3 mb-4">
                    {getCategoryIcon(category)}
                    <h3 className="text-lg font-semibold text-gray-900 capitalize">
                      {category}
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Items:</span>
                      <span className="font-medium text-gray-900">{itemsArray.length}</span>
                    </div>
                    
                    {/* Sample items */}
                    {itemsArray.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-500 block mb-2">Sample entries:</span>
                        <div className="space-y-1">
                          {itemsArray.slice(0, 2).map((item: any, index: number) => (
                            <div key={index} className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
                              {item.text?.substring(0, 80)}...
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Categories with context */}
                    {itemsArray.some((item: any) => item.context) && (
                      <div className="text-xs text-blue-600">
                        ✓ Includes context information
                      </div>
                    )}
                    
                    {itemsArray.some((item: any) => item.metadata?.year) && (
                      <div className="text-xs text-green-600">
                        ✓ Contains temporal data
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Data Quality Information */}
      <div className="mt-12 p-6 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📊 Data Extraction & Quality
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Extraction Process</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Enhanced list detection algorithms</li>
              <li>• Context preservation and metadata extraction</li>
              <li>• Temporal data and keyword analysis</li>
              <li>• Cross-reference validation</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Data Characteristics</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Structured professional information</li>
              <li>• Temporal range: {metadata.timeRange?.start || 'N/A'} - {metadata.timeRange?.end || 'N/A'}</li>
              <li>• Multi-format source processing (MD, HTM)</li>
              <li>• Comprehensive metadata preservation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
