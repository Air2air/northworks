import fs from 'fs';
import path from 'path';

// Type definitions for our JSON data structures
export interface Interview {
  metadata: {
    id: string;
    type: string;
    category: string;
    subcategory: string;
    status: string;
  };
  content: {
    title: string;
    summary: string;
    url: string;
  };
  subject: {
    people: Array<{
      name: string;
      role: string;
    }>;
  };
  publication: {
    date: string | null;
    publisher: string | null;
    publication: string;
  };
  media: {
    images: Array<{
      url: string;
      type: string;
      alt: string;
    }>;
  };
  tags: string[];
  legacy: {
    originalIndex: number;
    rawContent: string;
  };
}

export interface InterviewsData {
  metadata: {
    id: string;
    type: string;
    category: string;
    subcategory: string;
    status: string;
    featured: boolean;
  };
  content: {
    title: string;
    summary: string;
    body: string;
  };
  publication: {
    created: string;
    updated: string;
  };
  legacy: {
    originalFile: string;
    totalEntries: number;
    thumbnailImages: number;
  };
  interviews: Interview[];
}

export interface Article {
  metadata: {
    id: string;
    type: string;
    category: string;
    subcategory: string;
    status: string;
  };
  content: {
    title: string;
    headline?: string;
    summary: string;
    url: string;
  };
  publication: {
    date: string | null;
    publisher: string | null;
    publication: string;
    section?: string | null;
  };
  tags: string[];
  legacy: {
    originalIndex: number;
    rawContent: string;
  };
}

export interface ArticlesData {
  metadata: {
    id: string;
    type: string;
    category: string;
    subcategory: string;
    status: string;
    featured: boolean;
  };
  content: {
    title: string;
    summary: string;
    body: string;
  };
  publication: {
    created: string;
    updated: string;
  };
  legacy: {
    originalFile: string;
    totalEntries: number;
  };
  articles: Article[];
}

export interface ProfileData {
  metadata: {
    id: string;
    type: string;
    category: string;
    subcategory: string;
    status: string;
    featured: boolean;
  };
  content: {
    title: string;
    subtitle: string;
    summary: string;
    body: string;
  };
  subject: {
    people: Array<{
      name: string;
      role: string;
      nationality: string;
    }>;
  };
  professional: {
    currentPosition: {
      title: string;
      organization: string;
      location: string;
      startDate: string | null;
    };
    previousPositions: Array<{
      title: string;
      organization: string;
      department: string;
      endDate: string;
    }>;
    education: Array<{
      degree: string;
      field: string;
      institution: string;
    }>;
    specializations: string[];
    clients: string[];
  };
  awards: Array<{
    name: string;
    organization: string;
    year: string;
    description: string;
  }>;
  publications: Array<{
    title: string;
    year?: string;
    type: string;
    organization?: string;
    journal?: string;
    volume?: string;
  }>;
  boardMemberships: Array<{
    organization: string;
    role: string;
    period?: string;
    description: string;
    focus?: string;
  }>;
  currentActivities: Array<{
    title: string;
    organization?: string;
    description: string;
    type: string;
  }>;
  media: {
    images: Array<{
      url: string;
      width: number;
      height: number;
      type: string;
      alt: string;
    }>;
  };
  tags: string[];
  legacy: {
    originalFile: string;
    images: number;
  };
}

export interface DataIndex {
  metadata: {
    created: string;
    extractionDuration: string;
    totalEntries: number;
  };
  collections: {
    interviews: {
      file: string;
      count: number;
      status: string;
    };
    articles: {
      file: string;
      count: number;
      status: string;
    };
    profile: {
      file: string;
      count: number;
      status: string;
    };
  };
}

/**
 * Get the path to the data directory
 */
function getDataPath(): string {
  return path.join(process.cwd(), 'src', 'data');
}

/**
 * Load and parse JSON data file
 */
function loadJsonData<T>(filename: string): T {
  const filePath = path.join(getDataPath(), filename);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`Data file not found: ${filename}`);
  }
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent) as T;
  } catch (error) {
    throw new Error(`Failed to parse JSON from ${filename}: ${error}`);
  }
}

/**
 * Load interviews data
 */
export function loadInterviews(): InterviewsData {
  return loadJsonData<InterviewsData>('interviews-specialized.json');
}

/**
 * Load articles data
 */
export function loadArticles(): ArticlesData {
  return loadJsonData<ArticlesData>('articles-specialized.json');
}

/**
 * Load profile data
 */
export function loadProfile(): ProfileData {
  return loadJsonData<ProfileData>('reviews-specialized.json');
}

/**
 * Load data index
 */
export function loadDataIndex(): DataIndex {
  return loadJsonData<DataIndex>('data-manifest.json');
}

/**
 * Get a specific interview by ID
 */
export function getInterviewById(id: string): Interview | null {
  const data = loadInterviews();
  return data.interviews.find(interview => interview.metadata.id === id) || null;
}

/**
 * Get a specific article by ID
 */
export function getArticleById(id: string): Article | null {
  const data = loadArticles();
  return data.articles.find(article => article.metadata.id === id) || null;
}

/**
 * Search interviews by query
 */
export function searchInterviews(query: string, limit: number = 10): Interview[] {
  const data = loadInterviews();
  const searchQuery = query.toLowerCase();
  
  return data.interviews
    .filter(interview => {
      const searchableText = [
        interview.content.title,
        interview.subject.people[0]?.name || '',
        interview.subject.people[0]?.role || '',
        ...interview.tags
      ].join(' ').toLowerCase();
      
      return searchableText.includes(searchQuery);
    })
    .slice(0, limit);
}

/**
 * Search articles by query
 */
export function searchArticles(query: string, limit: number = 10): Article[] {
  const data = loadArticles();
  const searchQuery = query.toLowerCase();
  
  return data.articles
    .filter(article => {
      const searchableText = [
        article.content.title,
        article.content.headline || '',
        article.content.summary,
        ...article.tags
      ].join(' ').toLowerCase();
      
      return searchableText.includes(searchQuery);
    })
    .slice(0, limit);
}

/**
 * Get recent interviews (by publication date)
 */
export function getRecentInterviews(limit: number = 5): Interview[] {
  const data = loadInterviews();
  
  return data.interviews
    .filter(interview => interview.publication.date)
    .sort((a, b) => {
      const dateA = a.publication.date || '1970-01-01';
      const dateB = b.publication.date || '1970-01-01';
      return dateB.localeCompare(dateA);
    })
    .slice(0, limit);
}

/**
 * Get recent articles (by publication date)
 */
export function getRecentArticles(limit: number = 5): Article[] {
  const data = loadArticles();
  
  return data.articles
    .filter(article => article.publication.date)
    .sort((a, b) => {
      const dateA = a.publication.date || '1970-01-01';
      const dateB = b.publication.date || '1970-01-01';
      return dateB.localeCompare(dateA);
    })
    .slice(0, limit);
}

/**
 * Get interviews by role
 */
export function getInterviewsByRole(role: string): Interview[] {
  const data = loadInterviews();
  
  return data.interviews.filter(interview => 
    interview.subject.people[0]?.role.toLowerCase().includes(role.toLowerCase())
  );
}

/**
 * Get articles by type
 */
export function getArticlesByType(type: string): Article[] {
  const data = loadArticles();
  
  return data.articles.filter(article => 
    article.metadata.subcategory === type
  );
}

/**
 * Get all unique roles from interviews
 */
export function getInterviewRoles(): string[] {
  const data = loadInterviews();
  const roles = new Set<string>();
  
  data.interviews.forEach(interview => {
    if (interview.subject.people[0]?.role) {
      roles.add(interview.subject.people[0].role);
    }
  });
  
  return Array.from(roles).sort();
}

/**
 * Get all unique article types
 */
export function getArticleTypes(): string[] {
  const data = loadArticles();
  const types = new Set<string>();
  
  data.articles.forEach(article => {
    if (article.metadata.subcategory) {
      types.add(article.metadata.subcategory);
    }
  });
  
  return Array.from(types).sort();
}

/**
 * Get statistics summary
 */
export function getStatsSummary() {
  try {
    const index = loadDataIndex();
    const interviewsData = loadInterviews();
    const articlesData = loadArticles();
    const profileData = loadProfile();
    
    return {
      totalEntries: index.metadata.totalEntries,
      interviews: {
        total: interviewsData.interviews.length,
        withThumbnails: interviewsData.interviews.filter(i => i.media.images.length > 0).length,
        uniqueRoles: getInterviewRoles().length
      },
      articles: {
        total: articlesData.articles.length,
        uniqueTypes: getArticleTypes().length,
        dateRange: getArticleDateRange(articlesData.articles)
      },
      profile: {
        awards: profileData.awards.length,
        publications: profileData.publications.length,
        activities: profileData.currentActivities.length
      },
      lastUpdated: index.metadata.created
    };
  } catch (error) {
    console.error('Error getting stats summary:', error);
    return null;
  }
}

/**
 * Helper function to get date range for articles
 */
function getArticleDateRange(articles: Article[]) {
  const dates = articles
    .map(a => a.publication.date)
    .filter(date => date)
    .sort();
  
  if (dates.length === 0) return null;
  
  return {
    earliest: dates[0],
    latest: dates[dates.length - 1]
  };
}
