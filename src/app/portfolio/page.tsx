/**
 * Warner North Portfolio Page
 * Comprehensive display of professional work, expertise, and achievements
 */

import React from 'react';
import ProfessionalLists from '@/components/ui/ProfessionalLists';
import { ContentCard, ContentItem } from '@/components/ui/ContentCard';
import fs from 'fs';
import path from 'path';

// Data loaders
async function getPortfolioData() {
  try {
    // Load Warner portfolio (quality version)
    const warnerPath = path.join(process.cwd(), 'src/data/warner-portfolio-specialized.json');
    const warnerData = JSON.parse(fs.readFileSync(warnerPath, 'utf8'));
    
    // Load Warner lists (for specialized list components)
    const warnerListsPath = path.join(process.cwd(), 'src/data/warner-portfolio-specialized.json');
    const warnerListsData = JSON.parse(fs.readFileSync(warnerListsPath, 'utf8'));
    
    return {
      portfolio: warnerData.portfolio,
      biography: warnerData.portfolio.biography,
      lists: warnerListsData.lists || {},
      metadata: warnerData.metadata || {}
    };
  } catch (error) {
    console.error('Error loading portfolio data:', error);
    return {
      portfolio: { projects: [], publications: [], positions: [], affiliations: [], expertise: [], education: [] },
      biography: {},
      lists: {},
      metadata: {}
    };
  }
}

export default async function PortfolioPage() {
  const { portfolio, biography, lists, metadata } = await getPortfolioData();
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          D. Warner North
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Professional Portfolio & Expertise
        </p>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed">
            {biography.overview?.text || 'Distinguished professional with extensive experience in risk analysis, decision analysis, environmental protection, and management science.'}
          </p>
          {biography.currentPosition && (
            <div className="mt-4 p-4 bg-white rounded-lg">
              <h3 className="font-semibold text-gray-900">Current Position</h3>
              <p className="text-gray-700">
                {biography.currentPosition.title} at {biography.currentPosition.organization}, {biography.currentPosition.location}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Portfolio Statistics */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Portfolio Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {portfolio.projects?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Projects</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {portfolio.publications?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Publications</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {portfolio.positions?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Positions</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {portfolio.affiliations?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Affiliations</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {biography.expertise?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Expertise Areas</div>
          </div>
        </div>
      </div>

      {/* Key Expertise Areas */}
      {biography.expertise && biography.expertise.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Core Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {biography.expertise.map((item: any, index: number) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 capitalize">
                  {item.area}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {item.description}
                </p>
                <div className="text-xs text-gray-500">
                  Context: {item.context}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Lists */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Professional Details</h2>
        <ProfessionalLists 
          lists={lists} 
          showSummary={true} 
          expandedByDefault={false}
        />
      </div>

      {/* Major Projects */}
      {portfolio.projects && portfolio.projects.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Major Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolio.projects.slice(0, 6).map((project: any, index: number) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {project.description.substring(0, 60)}...
                </h3>
                <p className="text-gray-600 mb-4">
                  {project.description}
                </p>
                
                <div className="text-sm text-gray-500 mb-3">
                  Domain: {project.domain} • Type: {project.type}
                </div>
                
                {project.keywords && project.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.keywords.map((tag: string, tagIndex: number) => (
                      <span key={tagIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {portfolio.projects.length > 6 && (
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Showing 6 of {portfolio.projects.length} projects
              </p>
            </div>
          )}
        </div>
      )}

      {/* Publications */}
      {portfolio.publications && portfolio.publications.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Key Publications</h2>
          <div className="space-y-4">
            {portfolio.publications.slice(0, 8).map((pub: any, index: number) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {pub.title}
                </h3>
                {pub.context && (
                  <p className="text-gray-600 mb-3">
                    {pub.context}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                  {pub.year && (
                    <span>Year: {pub.year}</span>
                  )}
                  <span>Source: {pub.source}</span>
                  <span>Type: {pub.type}</span>
                </div>
                
                {pub.keywords && pub.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {pub.keywords.map((tag: string, tagIndex: number) => (
                      <span key={tagIndex} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {portfolio.publications.length > 8 && (
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Showing 8 of {portfolio.publications.length} publications
              </p>
            </div>
          )}
        </div>
      )}

      {/* Professional Positions */}
      {portfolio.positions && portfolio.positions.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Professional Positions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.positions.slice(0, 9).map((position: any, index: number) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {position.organization || 'Professional Position'}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {position.description}
                </p>
                
                <div className="text-xs text-gray-500 mb-3">
                  Type: {position.type}
                  {position.year && ` • Year: ${position.year}`}
                </div>
              </div>
            ))}
          </div>
          {portfolio.positions.length > 9 && (
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Showing 9 of {portfolio.positions.length} positions
              </p>
            </div>
          )}
        </div>
      )}

      {/* Affiliations */}
      {portfolio.affiliations && portfolio.affiliations.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Professional Affiliations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.affiliations.slice(0, 9).map((affil: any, index: number) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {affil.organization || 'Professional Organization'}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {affil.description}
                </p>
                
                <div className="text-xs text-gray-500">
                  Type: {affil.type}
                  {affil.year && ` • Year: ${affil.year}`}
                </div>
              </div>
            ))}
          </div>
          {portfolio.affiliations.length > 9 && (
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Showing 9 of {portfolio.affiliations.length} affiliations
              </p>
            </div>
          )}
        </div>
      )}

      {/* Metadata */}
      {metadata && Object.keys(metadata).length > 0 && (
        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Metadata</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Portfolio Type:</span>
              <div className="text-gray-600">{metadata.type || 'Professional Portfolio'}</div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Category:</span>
              <div className="text-gray-600">{metadata.category || 'Professional'}</div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Extraction Version:</span>
              <div className="text-gray-600">{metadata.extractionVersion || 'Quality Focused'}</div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <div className="text-gray-600">{metadata.status || 'Published'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
