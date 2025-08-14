/**
 * Unified Search Page - Search across all content types
 * Classical music interviews, articles, and professional portfolio
 */

import React from 'react';
import { ContentItem } from '@/components/ui/ContentCard';
import { getInterviews, getArticles, getWarnerLists } from '@/lib/content';
import { ContentCard } from '@/components/ui/ContentCard';
import SearchInterface from '@/components/SearchInterface';
import fs from 'fs';
import path from 'path';

// Data loaders for all content types
async function getAllContentData(): Promise<{
  interviews: ContentItem[];
  articles: ContentItem[];
  warnerPortfolio: ContentItem[];
  warnerLists: any;
}> {
  try {
    // Load improved interviews
    const interviewsPath = path.join(process.cwd(), 'src/data/interviews-specialized.json');
    const interviewsData = JSON.parse(fs.readFileSync(interviewsPath, 'utf8'));
    
    // Load improved articles
    const articlesPath = path.join(process.cwd(), 'src/data/articles-specialized.json');
    const articlesData = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
    
    // Load Warner portfolio (quality version)
    const warnerPath = path.join(process.cwd(), 'src/data/warner-portfolio-specialized.json');
    const warnerData = JSON.parse(fs.readFileSync(warnerPath, 'utf8'));
    
    // Load Warner lists (for specialized list components)
    const warnerListsPath = path.join(process.cwd(), 'src/data/warner-portfolio-specialized.json');
    const warnerListsData = JSON.parse(fs.readFileSync(warnerListsPath, 'utf8'));
    
    // Convert Warner portfolio data to ContentItem format
    const convertWarnerToContentItem = (item: any, category: string): ContentItem => ({
      metadata: {
        id: item.id || Math.random().toString(),
        type: 'professional_document',
        category: 'professional',
        subcategory: category,
        status: 'published'
      },
      content: {
        title: item.title || extractTitle(item.description),
        summary: item.description || item.text || '',
        url: item.url
      },
      subject: {
        people: [{
          name: "D. Warner North",
          role: category,
          description: item.description || item.text
        }]
      },
      publication: {
        date: item.year ? `${item.year}-01-01` : undefined,
        publisher: item.organization || "NorthWorks"
      },
      media: {},
      tags: item.keywords || []
    });
    
    // Helper function to extract title from description
    function extractTitle(description: string): string {
      if (!description) return 'Professional Item';
      // Take first 50 characters as title, ending at word boundary
      const truncated = description.substring(0, 50);
      const lastSpace = truncated.lastIndexOf(' ');
      return lastSpace > 20 ? truncated.substring(0, lastSpace) + '...' : truncated;
    }
    
    const warnerPortfolio = [
      ...warnerData.portfolio.projects.map((item: any) => convertWarnerToContentItem(item, 'project')),
      ...warnerData.portfolio.publications.map((item: any) => convertWarnerToContentItem(item, 'publication')),
      ...warnerData.portfolio.positions.map((item: any) => convertWarnerToContentItem(item, 'position')),
      ...warnerData.portfolio.affiliations.map((item: any) => convertWarnerToContentItem(item, 'affiliation'))
    ];
    
    return {
      interviews: interviewsData.interviews || [],
      articles: articlesData.articles || [],
      warnerPortfolio,
      warnerLists: warnerListsData.lists || {}
    };
  } catch (error) {
    console.error('Error loading content data:', error);
    return {
      interviews: [],
      articles: [],
      warnerPortfolio: [],
      warnerLists: {}
    };
  }
}

export default async function UnifiedSearchPage() {
  const { interviews, articles, warnerPortfolio, warnerLists } = await getAllContentData();
  
  // Combine all content for unified search
  const allContent = [
    ...interviews.map(item => ({ ...item, domain: 'Classical Music' })),
    ...articles.map(item => ({ ...item, domain: 'Articles & Reviews' })),
    ...warnerPortfolio.map(item => ({ ...item, domain: 'Professional Portfolio' }))
  ];
  
  return <SearchInterface allContent={allContent} warnerLists={warnerLists} />;
}
