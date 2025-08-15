/**
 * UnifiedPortfolioPage - Reusable portfolio page component
 * Consolidates portfolio and warner-portfolio pages
 */

import React from 'react';
import PageTitle from '@/components/ui/PageTitle';
import ProfessionalLists from '@/components/ui/ProfessionalLists';
import { ContentCard, ContentItem } from '@/components/ui/ContentCard';
import { FilterableCollection } from '@/components/ui/FilterableCollection';
import fs from 'fs';
import path from 'path';

type PortfolioType = 'comprehensive' | 'specialized';

interface PortfolioConfig {
  title: string;
  description: string;
  dataPath: string;
  showLists: boolean;
  showFilterable: boolean;
}

const portfolioConfigs: Record<PortfolioType, PortfolioConfig> = {
  comprehensive: {
    title: 'Professional Portfolio',
    description: 'Comprehensive display of professional work, expertise, and achievements',
    dataPath: 'src/data/warner-portfolio-specialized.json',
    showLists: true,
    showFilterable: false
  },
  specialized: {
    title: 'Professional Portfolio - Specialized View',
    description: 'Specialized portfolio view with filterable collections and advanced organization',
    dataPath: 'src/data/warner-portfolio-specialized.json',
    showLists: false,
    showFilterable: true
  }
};

interface UnifiedPortfolioPageProps {
  portfolioType: PortfolioType;
}

// Data loading functions
async function getPortfolioData(dataPath: string, portfolioType: PortfolioType) {
  try {
    const fullPath = path.join(process.cwd(), dataPath);
    const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    
    if (portfolioType === 'comprehensive') {
      return {
        portfolio: data.portfolio_sections || [],
        biography: data.portfolio_sections?.[0]?.content || {},
        lists: data.lists || {},
        metadata: data.metadata || {}
      };
    } else {
      // Specialized format conversion
      const convertToContentItem = (item: any): ContentItem => ({
        metadata: {
          id: item.metadata?.id || item.id || `item-${Math.random()}`,
          type: item.metadata?.type || 'professional',
          category: item.metadata?.category || 'general',
          subcategory: item.metadata?.subcategory,
          status: item.metadata?.status || 'active'
        },
        content: {
          title: item.metadata?.title || item.title || 'Untitled',
          summary: item.metadata?.description || item.content?.summary,
          url: item.metadata?.url
        },
        publication: {
          date: item.metadata?.date,
          publisher: item.metadata?.organization
        }
      });

      return {
        metadata: data.metadata,
        collections: {
          projects: (data.projects || []).map(convertToContentItem),
          publications: (data.publications || []).map(convertToContentItem),
          affiliations: (data.affiliations || []).map(convertToContentItem),
          expertise: (data.expertise || []).map(convertToContentItem),
          documents: (data.documents || []).map(convertToContentItem)
        }
      };
    }
  } catch (error) {
    console.error('Error loading portfolio data:', error);
    return null;
  }
}

export default async function UnifiedPortfolioPage({ portfolioType }: UnifiedPortfolioPageProps) {
  const config = portfolioConfigs[portfolioType];
  const data = await getPortfolioData(config.dataPath, portfolioType);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <PageTitle 
            title="Portfolio Unavailable"
            description="Unable to load portfolio data. Please try again later."
            size="medium"
            align="center"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <PageTitle
            title={config.title}
            description={config.description}
            align="center"
            size="large"
          />
        </div>

        {/* Comprehensive Portfolio View */}
        {portfolioType === 'comprehensive' && config.showLists && (
          <>
            {/* Biography Section */}
            {data.biography && (
              <div className="mb-12">
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Biography</h2>
                  {data.biography.overview && (
                    <p className="text-lg text-gray-700 mb-6">{data.biography.overview}</p>
                  )}
                  {data.biography.highlights && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {data.biography.highlights.map((highlight: any, index: number) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4">
                          <h3 className="font-semibold text-gray-900">{highlight.title}</h3>
                          <p className="text-gray-600">{highlight.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Professional Lists */}
            {data.lists && (
              <div className="mb-12">
                <ProfessionalLists lists={data.lists} />
              </div>
            )}

            {/* Portfolio Sections */}
            {data.portfolio && data.portfolio.length > 0 && (
              <div className="space-y-8">
                {data.portfolio.map((section: any, index: number) => (
                  <div key={index} className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">{section.title}</h2>
                    {section.items && section.items.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {section.items.map((item: any, itemIndex: number) => (
                          <ContentCard key={itemIndex} item={item} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Specialized Portfolio View */}
        {portfolioType === 'specialized' && config.showFilterable && (
          <div className="space-y-12">
            {/* Metadata Overview */}
            {data.metadata && data.collections && (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Portfolio Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  {Object.entries(data.collections).map(([key, items]) => (
                    <div key={key} className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {(items as ContentItem[]).length}
                      </div>
                      <div className="text-gray-600 capitalize">{key}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filterable Collections */}
            {data.collections && Object.entries(data.collections).map(([collectionName, items]) => (
              <div key={collectionName} className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 capitalize">
                  {collectionName}
                </h2>
                <FilterableCollection 
                  items={items as ContentItem[]}
                  title={collectionName}
                />
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-gray-500">
            Professional portfolio showcasing expertise in decision analysis, risk assessment, and environmental policy.
          </p>
        </div>
      </div>
    </div>
  );
}
