/**
 * Northworks Home Page
 * Showcase of cross-domain content architecture and unified search capabilities
 */

import React from 'react';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';

// Data loader for overview statistics
async function getOverviewStats() {
  try {
    // Load all data sources for statistics
    const interviewsPath = path.join(process.cwd(), 'src/data/interviews-specialized.json');
    const articlesPath = path.join(process.cwd(), 'src/data/articles-specialized.json');
    const warnerPortfolioPath = path.join(process.cwd(), 'src/data/warner-portfolio-specialized.json');
    const warnerListsPath = path.join(process.cwd(), 'src/data/warner-portfolio-specialized.json');
    
    const interviews = JSON.parse(fs.readFileSync(interviewsPath, 'utf8'));
    const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
    const portfolio = JSON.parse(fs.readFileSync(warnerPortfolioPath, 'utf8'));
    const lists = JSON.parse(fs.readFileSync(warnerListsPath, 'utf8'));
    
    return {
      interviews: interviews.interviews?.length || 0,
      articles: articles.articles?.length || 0,
      portfolioItems: Object.values(portfolio.collections || {}).reduce((total: number, items: any) => total + (items?.length || 0), 0),
      listItems: Object.values(lists.lists || {}).reduce((total: number, items: any) => total + (items?.length || 0), 0),
      totalContent: 0
    };
  } catch (error) {
    console.error('Error loading overview stats:', error);
    return {
      interviews: 0,
      articles: 0,
      portfolioItems: 0,
      listItems: 0,
      totalContent: 0
    };
  }
}

export default async function Home() {
  const stats = await getOverviewStats();
  stats.totalContent = stats.interviews + stats.articles + stats.portfolioItems + stats.listItems;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Northworks
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
            Demonstrating <span className="font-semibold text-purple-600">true cross-domain architecture</span> with 
            unified search across classical music content and professional portfolio data
          </p>
          
          {/* Key Value Proposition */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-purple-100 mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🎯 Architectural Innovation
            </h2>
            <p className="text-gray-700 text-lg">
              Single ContentCard and FilterableCollection components seamlessly handle both artistic interviews 
              and technical professional data, proving true schema consistency and component reusability 
              across completely different subject domains.
            </p>
          </div>

          {/* Statistics Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.totalContent}</div>
              <div className="text-sm text-gray-600">Total Items</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.interviews}</div>
              <div className="text-sm text-gray-600">Interviews</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.portfolioItems}</div>
              <div className="text-sm text-gray-600">Portfolio</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <div className="text-3xl font-bold text-orange-600 mb-2">{stats.listItems}</div>
              <div className="text-sm text-gray-600">Structured Lists</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/search"
              className="px-8 py-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
            >
              🔍 Try Unified Search
            </Link>
            <Link 
              href="/interviews"
              className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg border border-gray-200"
            >
              🎼 Browse Classical Music
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Explore Our Content Domains
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Classical Music Interviews */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎼</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Classical Music Interviews</h3>
            <p className="text-gray-600 mb-4">
              Comprehensive collection of {stats.interviews} interviews with renowned classical musicians, 
              conductors, and composers. Rich metadata and structured content.
            </p>
            <div className="space-y-2 mb-6">
              <div className="text-sm text-gray-500">• Artist profiles and biographies</div>
              <div className="text-sm text-gray-500">• Performance reviews and insights</div>
              <div className="text-sm text-gray-500">• Publication details and contexts</div>
            </div>
            <Link 
              href="/interviews"
              className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium"
            >
              Explore Interviews →
            </Link>
          </div>

          {/* Articles & Reviews */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📰</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Articles & Reviews</h3>
            <p className="text-gray-600 mb-4">
              In-depth articles and reviews covering performances, recordings, and musical analysis. 
              Enhanced with improved extraction algorithms.
            </p>
            <div className="space-y-2 mb-6">
              <div className="text-sm text-gray-500">• Performance reviews</div>
              <div className="text-sm text-gray-500">• Critical analysis</div>
              <div className="text-sm text-gray-500">• Cultural commentary</div>
            </div>
            <Link 
              href="/articles"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              Read Articles →
            </Link>
          </div>

          {/* Professional Portfolio */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">💼</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Professional Portfolio</h3>
            <p className="text-gray-600 mb-4">
              D. Warner North's comprehensive professional portfolio showcasing expertise in 
              risk analysis, decision science, and environmental protection.
            </p>
            <div className="space-y-2 mb-6">
              <div className="text-sm text-gray-500">• Project portfolios</div>
              <div className="text-sm text-gray-500">• Publications & reports</div>
              <div className="text-sm text-gray-500">• Professional affiliations</div>
            </div>
            <Link 
              href="/portfolio"
              className="inline-flex items-center text-green-600 hover:text-green-800 font-medium"
            >
              View Portfolio →
            </Link>
          </div>
        </div>
      </section>

      {/* Technical Innovation Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            🚀 Technical Innovation
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Cross-Domain Architecture</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Same ContentCard component handles classical music and professional content</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Unified schema enables consistent data structure across domains</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>FilterableCollection provides universal search and filtering</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Specialized list components for structured professional data</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Enhanced Data Processing</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3">⚡</span>
                  <span>Advanced markdown parsing with YAML frontmatter support</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3">⚡</span>
                  <span>Enhanced list extraction with context preservation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3">⚡</span>
                  <span>Temporal data analysis and keyword extraction</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3">⚡</span>
                  <span>Cross-reference validation and metadata enrichment</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link 
              href="/search"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
            >
              Experience Unified Search →
            </Link>
          </div>
        </div>
      </section>

      {/* Data Quality Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            📊 Data Quality & Validation
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Comprehensive evaluation and iterative improvement of data extraction quality 
            across different content types and subject domains.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2">Classical Content</h3>
              <p className="text-sm text-green-700">96% → 64% generic roles, 62% → 91% article quality</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Cross-Domain Validation</h3>
              <p className="text-sm text-blue-700">Same components work across artistic and professional content</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-2">Enhanced Lists</h3>
              <p className="text-sm text-purple-700">23 structured items with detailed categorization</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
