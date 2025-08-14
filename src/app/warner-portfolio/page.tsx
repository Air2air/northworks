/**
 * Professional Portfolio Component - for Warner North content
 * Uses the same ContentCard/FilterableCollection architecture as classical music content
 */

import React from 'react';
import { FilterableCollection } from '@/components/ui/FilterableCollection';
import { ContentItem } from '@/components/ui/ContentCard';
import fs from 'fs';
import path from 'path';

// Professional portfolio data loader
async function getWarnerPortfolioData(): Promise<{
  metadata: any,
  collections: {
    projects: ContentItem[],
    publications: ContentItem[],
    affiliations: ContentItem[],
    expertise: ContentItem[],
    documents: ContentItem[]
  }
}> {
  try {
    const dataPath = path.join(process.cwd(), 'src/data/warner-portfolio.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Convert to ContentItem format for compatibility
    const convertToContentItem = (item: any): ContentItem => ({
      metadata: item.metadata,
      content: item.content,
      subject: {
        people: [{
          name: "D. Warner North",
          role: item.metadata.type,
          description: item.content.summary
        }]
      },
      publication: item.publication,
      media: item.media,
      tags: item.tags || []
    });
    
    return {
      metadata: data.metadata,
      collections: {
        projects: data.collections.projects.map(convertToContentItem),
        publications: data.collections.publications.map(convertToContentItem),
        affiliations: data.collections.affiliations.map(convertToContentItem),
        expertise: data.collections.expertise.map(convertToContentItem),
        documents: data.collections.documents.map(convertToContentItem)
      }
    };
  } catch (error) {
    console.error('Error loading Warner portfolio data:', error);
    return {
      metadata: {},
      collections: {
        projects: [],
        publications: [],
        affiliations: [],
        expertise: [],
        documents: []
      }
    };
  }
}

export default async function WarnerPortfolioPage() {
  const portfolio = await getWarnerPortfolioData();
  
  // Combine all content for unified search/filtering
  const allContent = [
    ...portfolio.collections.projects,
    ...portfolio.collections.publications,
    ...portfolio.collections.affiliations,
    ...portfolio.collections.expertise,
    ...portfolio.collections.documents
  ];
  
  // Calculate statistics
  const stats = {
    total: allContent.length,
    projects: portfolio.collections.projects.length,
    publications: portfolio.collections.publications.length,
    affiliations: portfolio.collections.affiliations.length,
    expertise: portfolio.collections.expertise.length,
    documents: portfolio.collections.documents.length,
    uniqueTags: [...new Set(allContent.flatMap(item => item.tags || []))].length
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-start gap-6 mb-6">
          <img 
            src="/images/warner-north-6-06.jpg" 
            alt="D. Warner North"
            className="w-24 h-32 object-cover rounded-lg shadow-md"
          />
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              D. Warner North
            </h1>
            <p className="text-xl text-blue-600 font-medium mb-3">
              Principal Scientist, NorthWorks
            </p>
            <p className="text-lg text-gray-600 max-w-4xl">
              Over fifty years of applications in decision analysis and risk analysis 
              for electric utilities, petroleum and chemical industries, and government agencies 
              with responsibility for energy and environmental protection.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Portfolio Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Total Items</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {stats.projects}
            </div>
            <div className="text-sm text-gray-600">Projects</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {stats.publications}
            </div>
            <div className="text-sm text-gray-600">Publications</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {stats.expertise}
            </div>
            <div className="text-sm text-gray-600">Expertise Areas</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {stats.affiliations}
            </div>
            <div className="text-sm text-gray-600">Affiliations</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-indigo-600 mb-1">
              {stats.uniqueTags}
            </div>
            <div className="text-sm text-gray-600">Subject Areas</div>
          </div>
        </div>
      </div>

      {/* Key Highlights */}
      <div className="mb-8 grid md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Academic Excellence</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Stanford University (Consulting Professor)</li>
            <li>• Ph.D. Operations Research (Stanford)</li>
            <li>• B.S. Physics (Yale University)</li>
            <li>• 50+ years research experience</li>
          </ul>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 mb-3">Government Service</h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• EPA Science Advisory Board (1978-present)</li>
            <li>• Nuclear Waste Technical Review Board</li>
            <li>• National Research Council</li>
            <li>• Presidential appointments</li>
          </ul>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-900 mb-3">Professional Recognition</h3>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• Society for Risk Analysis (Past President)</li>
            <li>• Frank P. Ramsey Medal (1997)</li>
            <li>• Outstanding Risk Practitioner Award (1999)</li>
            <li>• International recognition</li>
          </ul>
        </div>
      </div>

      {/* Main Content Collection */}
      <FilterableCollection
        items={allContent}
        title="Professional Portfolio"
        enableSearch={true}
        enableCategoryFilter={true}
        enableTypeFilter={true}
        enableDateSort={true}
        defaultView="list"
        pageSize={10}
      />

      {/* Expertise Areas */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Core Expertise Areas</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Analysis & Assessment</h3>
            <div className="flex flex-wrap gap-2">
              {['Decision Analysis', 'Risk Analysis', 'Risk Assessment', 'Uncertainty Analysis', 'Probabilistic Assessment'].map((expertise, index) => (
                <span 
                  key={index}
                  className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                >
                  {expertise}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Sector Experience</h3>
            <div className="flex flex-wrap gap-2">
              {['Environmental Protection', 'Nuclear Waste', 'Energy Policy', 'Government Consulting', 'Electric Utilities'].map((sector, index) => (
                <span 
                  key={index}
                  className="inline-block px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full"
                >
                  {sector}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Component Reusability Notice */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">
          ✅ Reusable Component Architecture
        </h3>
        <p className="text-sm text-blue-700">
          This professional portfolio page uses the same ContentCard and FilterableCollection 
          components as the classical music interviews, demonstrating true cross-subject-area 
          reusability. The structured JSON data enables consistent search, filtering, and display 
          across completely different content domains.
        </p>
      </div>
    </div>
  );
}
